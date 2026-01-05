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
import { updateUser } from "../../store/authSlice"; // Import crucial
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
        avatar: photo ? `data:image/jpeg;base64,${photo.base64}` : user.avatar,
      };

      const response = await api.patch("/api/v1/users/me", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Met à jour le store Redux pour que ProfileScreen change aussi
      // pas de pdp dans la bd on enregistre en local
      const localUpdate = {
      ...response.data,
      avatar: photo ? photo.uri : user.avatar,
    };

    dispatch(updateUser(localUpdate)); 
      
      Alert.alert("Success", "Profile updated successfully!");
      navigation.goBack(); // Retour automatique après succès
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
            <Image
              source={{ uri: photo?.uri || user?.avatar || "https://i.pravatar.cc/150?img=47" }}
              style={styles.avatar}
            />
            <View style={styles.cameraIcon}><Ionicons name="camera" size={20} color="white" /></View>
          </TouchableOpacity>
        </View>

        <Card>
          <Text style={typography.h3}>Full Name</Text>
          <TextField value={name} onChangeText={setName} placeholder="Your name" />
          <Text style={[typography.h3, { marginTop: spacing.md }]}>Username</Text>
          <TextField value={username} onChangeText={setUsername} placeholder="Username" />
        </Card>

        <View style={{ marginTop: spacing.xl }}>
          <PrimaryButton title={loading ? "Saving..." : "Save Changes"} onPress={handleSave} disabled={loading} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarSection: { alignItems: "center", marginVertical: spacing.xl },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: colors.primary },
  cameraIcon: { position: "absolute", bottom: 0, right: 0, backgroundColor: colors.primary, borderRadius: 20, padding: 8, borderWidth: 3, borderColor: colors.white },
});