import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../config';

export default function IncidentDetailScreen({ route, navigation }) {
    const { incident } = route.params;
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        try {
            const response = await fetch(`${API_URL}/comments/report/${incident.id}`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setComments(data);
            }
        } catch (e) {
            console.log("Error loading comments", e);
        }
    };

    const handlePostComment = async () => {
        if (!newComment.trim()) return;

        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert("Login required", "You must be logged in to comment.");
                return;
            }

            const payload = {
                content: newComment,
                report_id: incident.id
            };

            const response = await fetch(`${API_URL}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setNewComment('');
                fetchComments(); // Reload comments
            } else {
                Alert.alert("Error", "Could not post comment");
            }
        } catch (e) {
            console.error(e);
            Alert.alert("Error", "Network error");
        }
    };

    const getBadgeColor = (type) => {
        switch (type) {
            case 'Suspicious activity': return '#FF3B30';
            case 'Theft': return '#FF3B30';
            case 'Harassment': return '#FF9500';
            case 'Poor lighting': return '#FFCC00';
            case 'Icy road': return '#00BCD4';
            case 'Flooded area': return '#007AFF';
            case 'Broken sidewalk': return '#8E8E93';
            default: return '#007AFF';
        }
    };

    const typeLabel = incident.type_label || incident.type || "Unknown";
    const dateLabel = incident.created_at ? new Date(incident.created_at).toLocaleString() : incident.date;

    return (
        <ScrollView style={styles.container}>
            {/* Header avec bouton retour absolu pour le style */}
            <View style={styles.imageContainer}>
                {incident.image_url ? (
                    <Image source={{ uri: incident.image_url }} style={styles.image} />
                ) : (
                    <View style={styles.placeholderImage}>
                        <Ionicons name="image-outline" size={64} color="#ccc" />
                        <Text style={styles.placeholderText}>No Photo Available</Text>
                    </View>
                )}
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={styles.headerRow}>
                    <View style={[styles.badge, { backgroundColor: getBadgeColor(typeLabel) }]}>
                        <Text style={styles.badgeText}>{typeLabel}</Text>
                    </View>
                    <Text style={styles.date}>{dateLabel}</Text>
                </View>

                <Text style={styles.title}>Incident Report</Text>

                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>
                    {incident.description}
                </Text>

                <Text style={styles.sectionTitle}>Status</Text>
                <Text style={styles.status}>{incident.status || 'Pending'}</Text>

                {incident.user_name && (
                    <>
                        <Text style={styles.sectionTitle}>Reported By</Text>
                        <Text style={styles.reporter}>{incident.user_name}</Text>
                    </>
                )}

                {/* SECTION COMMENTAIRES */}
                <Text style={styles.sectionTitle}>Comments</Text>
                {comments.length === 0 ? (
                    <Text style={styles.noCommentsText}>No comments yet.</Text>
                ) : (
                    comments.map((comment) => (
                        <View key={comment.id} style={styles.commentItem}>
                            <Text style={styles.commentUser}>{comment.username || 'User'}</Text>
                            <Text style={styles.commentContent}>{comment.content}</Text>
                            <Text style={styles.commentDate}>{new Date(comment.created_at).toLocaleDateString()}</Text>
                        </View>
                    ))
                )}

                {/* INPUT NOVAU COMMENTAIRE */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Add a comment..."
                        value={newComment}
                        onChangeText={setNewComment}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handlePostComment}>
                        <Ionicons name="send" size={24} color="#007AFF" />
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    imageContainer: {
        width: '100%',
        height: 250,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    },
    image: { width: '100%', height: '100%', resizeMode: 'cover' },
    placeholderImage: { alignItems: 'center' },
    placeholderText: { color: '#888', marginTop: 10 },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 8,
        borderRadius: 20,
    },
    content: { padding: 20 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    badgeText: { color: '#fff', fontWeight: 'bold' },
    date: { color: '#666', fontSize: 13 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
    sectionTitle: { fontSize: 16, fontWeight: '600', color: '#666', marginBottom: 5, marginTop: 15 },
    description: { fontSize: 16, color: '#333', lineHeight: 24 },
    status: { fontSize: 16, color: '#333', textTransform: 'capitalize' },
    reporter: { fontSize: 16, color: '#333' },
    noCommentsText: { color: '#999', fontStyle: 'italic', marginTop: 10 },
    commentItem: {
        backgroundColor: '#F9F9F9',
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
    },
    commentUser: { fontWeight: 'bold', fontSize: 14, color: '#333' },
    commentContent: { fontSize: 14, color: '#555', marginTop: 2 },
    commentDate: { fontSize: 10, color: '#999', marginTop: 5, textAlign: 'right' },
    inputContainer: {
        flexDirection: 'row',
        marginTop: 20,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        paddingTop: 15
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        backgroundColor: '#FFF',
        marginRight: 10
    },
    sendButton: {
        padding: 5
    }
});
