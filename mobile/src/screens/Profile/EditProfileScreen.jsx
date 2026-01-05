import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles, colors, spacing, typography } from "../../styles";
import SafeWalkHeader from "../../components/layout/SafeWalkHeader";
import Card from "../../components/ui/Card";
import TextField from "../../components/ui/TextField";
import PrimaryButton from "../../components/ui/PrimaryButton";
import api from "../../services/api";
import { updateUser } from "../../store/authSlice";
import { useNavigation } from "@react-navigation/native";

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  
  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.3,
      base64: true,
    });
    if (!result.canceled) setPhoto(result.assets[0]);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        name,
        username,
        // On n'envoie la base64 que si une nouvelle photo a été prise
        avatar: photo ? `data:image/jpeg;base64,${photo.base64}` : user.avatar,
      };

      const response = await api.patch("/api/v1/users/me", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Mise à jour locale du store Redux pour persister l'image dans la session
      const localUpdate = {
        ...response.data,
        avatar: photo ? photo.uri : user.avatar,
      };

      dispatch(updateUser(localUpdate)); 
      
      Alert.alert("Success", "Profile updated successfully!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.screen}>
      <SafeWalkHeader title="Edit Profile" showBack />
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={pickImage}>
            {/* ✅ Logique d'affichage de la photo en cours ou de l'icône par défaut */}
            {photo?.uri || user?.avatar ? (
              <Image
                source={{ uri: photo?.uri || user?.avatar }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={60} color={colors.white} />
              </View>
            )}
            
            {/* Badge icône caméra */}
            <View style={styles.cameraIcon}>
              <Ionicons name="camera" size={20} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        <Card>
          <Text style={typography.h3}>Full Name</Text>
          <TextField value={name} onChangeText={setName} placeholder="Your name" />
          <Text style={[typography.h3, { marginTop: spacing.md }]}>Username</Text>
          <TextField value={username} onChangeText={setUsername} placeholder="Username" />
        </Card>

        <View style={{ marginTop: spacing.xl }}>
          <PrimaryButton 
            title={loading ? "Saving..." : "Save Changes"} 
            onPress={handleSave} 
            disabled={loading} 
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarSection: { alignItems: "center", marginVertical: spacing.xl },
  // Style pour l'image
  avatar: { 
    width: 120, 
    height: 120, 
    borderRadius: 60, 
    borderWidth: 4, 
    borderColor: colors.primary 
  },
  // ✅ Style pour le cercle de remplacement avec icône
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: colors.primary,
  },
  cameraIcon: { 
    position: "absolute", 
    bottom: 0, 
    right: 0, 
    backgroundColor: colors.primary, 
    borderRadius: 20, 
    padding: 8, 
    borderWidth: 3, 
    borderColor: colors.white 
  },
});