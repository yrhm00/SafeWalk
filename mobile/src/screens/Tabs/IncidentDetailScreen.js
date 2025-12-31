import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    Animated,
    Easing
} from 'react-native';
import { responsiveHeight, responsiveFontSize } from 'react-native-responsive-dimensions';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { API_URL } from '../../config';

export default function IncidentDetailScreen({ route, navigation }) {
    const { incident } = route.params;
    const { token } = useSelector(state => state.auth);

    // États locaux pour gérer les données (Pas de Redux ici)
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [voteCounts, setVoteCounts] = useState({ up: 0, down: 0 });
    const [userVote, setUserVote] = useState(null);

    // Animations Refs
    const fadeAnim = useRef(new Animated.Value(0)).current; // Opacity 0 -> 1
    const slideAnim = useRef(new Animated.Value(50)).current; // TranslateY 50 -> 0

    useEffect(() => {
        // Init Data via AXIOS
        fetchComments();
        fetchVoteAndCounts();

        // Animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
                easing: Easing.out(Easing.ease)
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                friction: 8,
                tension: 40,
                useNativeDriver: true
            })
        ]).start();
    }, []);

    const fetchVoteAndCounts = async () => {
        try {
            if (token) {
                try {
                    const response = await axios.get(`${API_URL}/votes/report/${incident.id}/me`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data && response.data.value !== undefined) setUserVote(response.data.value);
                } catch (e) {
                    // Ignore 404
                }
            }
            const countResponse = await axios.get(`${API_URL}/votes/report/${incident.id}`);
            if (countResponse.data && countResponse.data.summary) {
                setVoteCounts({
                    up: parseInt(countResponse.data.summary.upvotes) || 0,
                    down: parseInt(countResponse.data.summary.downvotes) || 0
                });
            }
        } catch (e) {
            console.log("Error loading votes", e);
        }
    };

    const handleVote = async (value) => {
        try {
            if (!token) {
                Alert.alert("Login required", "You must be logged in to vote.");
                return;
            }

            const isRemoving = userVote === value;

            // Optimistic UI Update
            setUserVote(isRemoving ? null : value);
            setVoteCounts(prev => ({
                up: prev.up + (value === true ? (isRemoving ? -1 : 1) : (userVote === true ? -1 : 0)),
                down: prev.down + (value === false ? (isRemoving ? -1 : 1) : (userVote === false ? -1 : 0))
            }));

            if (isRemoving) {
                await axios.delete(`${API_URL}/votes`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                    data: { report_id: incident.id, value }
                });
            } else {
                await axios.post(`${API_URL}/votes`,
                    { report_id: incident.id, value },
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
            }
        } catch (e) {
            Alert.alert("Error", "Network error during voting.");
        }
    };

    const fetchComments = async () => {
        try {
            const response = await axios.get(`${API_URL}/comments/report/${incident.id}`);
            if (Array.isArray(response.data)) setComments(response.data);
        } catch (e) { console.log("Error loading comments", e); }
    };

    const handlePostComment = async () => {
        if (!newComment.trim()) return;
        try {
            if (!token) { Alert.alert("Login required", "You must be logged in to comment."); return; }

            await axios.post(`${API_URL}/comments`,
                { content: newComment, report_id: incident.id },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            setNewComment('');
            fetchComments();
        } catch (e) {
            Alert.alert("Error", "Could not post comment");
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
            {/* Header Image */}
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

            {/* ANIMATED CONTENT PART */}
            <Animated.View style={[
                styles.content,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                }
            ]}>
                <View style={styles.headerRow}>
                    <View style={[styles.badge, { backgroundColor: getBadgeColor(typeLabel) }]}>
                        <Text style={styles.badgeText}>{typeLabel}</Text>
                    </View>
                    <Text style={styles.date}>{dateLabel}</Text>
                </View>

                <Text style={styles.title}>Incident Report</Text>

                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>{incident.description}</Text>

                {/* Votes */}
                <View style={styles.voteContainer}>
                    <TouchableOpacity
                        style={[styles.voteButton, userVote === true && styles.voteButtonActiveUp]}
                        onPress={() => handleVote(true)}
                    >
                        <Ionicons name="thumbs-up" size={20} color={userVote === true ? "#FFF" : "#444"} />
                        <Text style={[styles.voteText, userVote === true && styles.voteTextActive]}>{voteCounts.up}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.voteButton, userVote === false && styles.voteButtonActiveDown]}
                        onPress={() => handleVote(false)}
                    >
                        <Ionicons name="thumbs-down" size={20} color={userVote === false ? "#FFF" : "#444"} />
                        <Text style={[styles.voteText, userVote === false && styles.voteTextActive]}>{voteCounts.down}</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Status</Text>
                <Text style={styles.status}>{incident.status || 'Pending'}</Text>

                {incident.user_name && (
                    <>
                        <Text style={styles.sectionTitle}>Reported By</Text>
                        <Text style={styles.reporter}>{incident.user_name}</Text>
                    </>
                )}

                {/* Comments */}
                <Text style={styles.sectionTitle}>Comments</Text>
                {comments.length === 0 ? (
                    <Text style={styles.noCommentsText}>No comments yet.</Text>
                ) : (
                    comments.map((comment, index) => (
                        <View key={comment.id || index} style={styles.commentItem}>
                            <Text style={styles.commentUser}>{comment.username || 'User'}</Text>
                            <Text style={styles.commentContent}>{comment.content}</Text>
                            <Text style={styles.commentDate}>{comment.created_at ? new Date(comment.created_at).toLocaleDateString() : ''}</Text>
                        </View>
                    ))
                )}

                {/* Input Comment */}
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
            </Animated.View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    imageContainer: {
        width: '100%', height: responsiveHeight(35), backgroundColor: '#f0f0f0',
        justifyContent: 'center', alignItems: 'center', position: 'relative'
    },
    image: { width: '100%', height: '100%', resizeMode: 'cover' },
    placeholderImage: { alignItems: 'center' },
    placeholderText: { color: '#888', marginTop: 10 },
    backButton: {
        position: 'absolute', top: 40, left: 20,
        backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 20, zIndex: 10
    },
    content: { padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -20, backgroundColor: 'white' }, // Slight overlap effect
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    badgeText: { color: '#fff', fontWeight: 'bold' },
    date: { color: '#666', fontSize: 13 },
    title: { fontSize: responsiveFontSize(3), fontWeight: 'bold', marginBottom: 20, color: '#333' },
    sectionTitle: { fontSize: 16, fontWeight: '600', color: '#666', marginBottom: 5, marginTop: 15 },
    description: { fontSize: 16, color: '#333', lineHeight: 24 },
    status: { fontSize: 16, color: '#333', textTransform: 'capitalize' },
    reporter: { fontSize: 16, color: '#333' },
    noCommentsText: { color: '#999', fontStyle: 'italic', marginTop: 10 },
    commentItem: { backgroundColor: '#F9F9F9', padding: 10, borderRadius: 8, marginTop: 10 },
    commentUser: { fontWeight: 'bold', fontSize: 14, color: '#333' },
    commentContent: { fontSize: 14, color: '#555', marginTop: 2 },
    commentDate: { fontSize: 10, color: '#999', marginTop: 5, textAlign: 'right' },
    inputContainer: { flexDirection: 'row', marginTop: 20, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 15 },
    input: { flex: 1, borderWidth: 1, borderColor: '#DDD', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8, backgroundColor: '#FFF', marginRight: 10 },
    sendButton: { padding: 5 },
    voteContainer: { flexDirection: 'row', marginTop: 15, gap: 10 },
    voteButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEE', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
    voteButtonActiveUp: { backgroundColor: '#4CAF50' },
    voteButtonActiveDown: { backgroundColor: '#F44336' },
    voteText: { marginLeft: 6, fontWeight: 'bold', color: '#444' },
    voteTextActive: { color: '#FFF' }
});
