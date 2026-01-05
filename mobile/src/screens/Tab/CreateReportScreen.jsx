import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Switch,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles, spacing, typography, colors } from "../../styles";

import SafeWalkHeader from "../../components/layout/SafeWalkHeader";
import Card from "../../components/ui/Card";
import TextField from "../../components/ui/TextField";
import UploadBox from "../../components/ui/UploadBox";
import PrimaryButton from "../../components/ui/PrimaryButton";

import { useSelector, useDispatch } from "react-redux";
import { addReport } from "../../store/reportSlice";
import * as Location from "expo-location";
import api from "../../services/api";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

export default function CreateReportScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const [reportTypes, setReportTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // État pour la Modal

  const [description, setDescription] = useState("");
  const [emergency, setEmergency] = useState(false);
  const [location, setLocation] = useState(null);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const pos = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const mediaPermission =
        await ImagePicker.getMediaLibraryPermissionsAsync();
      if (!mediaPermission.granted) {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      }
      const cameraPermission = await ImagePicker.getCameraPermissionsAsync();
      if (!cameraPermission.granted) {
        await ImagePicker.requestCameraPermissionsAsync();
      }
    })();
  }, []);

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.3,
      base64: true,
    });
    if (!result.canceled && result.assets?.length > 0) {
      setPhoto(result.assets[0]);
    }
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.3,
      base64: true,
    });
    if (!result.canceled && result.assets?.length > 0) {
      setPhoto(result.assets[0]);
    }
  };

  const pickImage = () => {
    Alert.alert("Add Photo", "Choose a source", [
      { text: "Camera", onPress: takePhoto },
      { text: "Gallery", onPress: pickFromGallery },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const loadReportTypes = async () => {
    try {
      const res = await api.get("/api/v1/report-types");
      setReportTypes(res.data);
    } catch (err) {
      console.log(
        "❌ Error loading report types",
        err.response?.data || err.message
      );
    }
  };

  useEffect(() => {
    loadReportTypes();
  }, []);

  const getSeverityByLabel = (label) => {
    const t = label?.toLowerCase() || "";
    if (
      t.includes("sidewalk") ||
      t.includes("trottoir") ||
      t.includes("lighting") ||
      t.includes("lampadaire")
    ) {
      return "low";
    }
    if (
      t.includes("flooded") ||
      t.includes("inondée") ||
      t.includes("icy") ||
      t.includes("gelée")
    ) {
      return "medium";
    }
    if (t.includes("suspicious") || t.includes("suspecte")) {
      return "high";
    }
    return "medium";
  };

  const handleSubmit = async () => {
    if (!selectedType?.id || !description || !location) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const calculatedSeverity = emergency
        ? "high"
        : getSeverityByLabel(selectedType.label);

      // Vérification de la présence de la base64
      const imageBase64 = photo?.base64
        ? `data:image/jpeg;base64,${photo.base64}`
        : null;

      const payload = {
        title: selectedType.label,
        description,
        latitude: location.latitude,
        longitude: location.longitude,
        image_url: imageBase64,
        type_id: selectedType.id,
        severity: calculatedSeverity,
      };

      console.log("Envoi du rapport...", payload); // Debug

      const res = await api.post("/api/v1/reports", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      dispatch(addReport(res.data));
      alert("Report submitted successfully!");
      setSelectedType(null);
      setDescription("");
      setEmergency(false);
      setPhoto(null);
      navigation.goBack();
    } catch (e) {
      // Affiche l'erreur précise dans la console pour vous aider
      console.error("Détails de l'erreur API:", e.response?.data || e.message);
      alert(
        "Error while submitting report: " +
          (e.response?.data?.message || "Server error")
      );
    }
  };

  return (
    <View style={globalStyles.screen}>
      <SafeWalkHeader title="Report Incident" showBack />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: spacing.xl }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Report Type avec Trigger Modal */}
          <Card>
            <Text style={typography.h3}>⚠️ Report Type</Text>
            <TouchableOpacity
              style={styles.modalTrigger}
              onPress={() => setIsModalVisible(true)}
            >
              <Text
                style={
                  selectedType ? typography.body : { color: colors.textMuted }
                }
              >
                {selectedType ? selectedType.label : "Select incident type"}
              </Text>
              <Ionicons
                name="chevron-down"
                size={20}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          </Card>

          <Card>
            <Text style={typography.h3}>📝 Description</Text>
            <View style={{ marginTop: spacing.sm }}>
              <TextField
                value={description}
                onChangeText={setDescription}
                placeholder="Please describe the incident in detail..."
              />
            </View>
          </Card>

          <Card>
            <Text style={typography.h3}>📷 Upload Photo (Optional)</Text>
            <View style={{ marginTop: spacing.sm }}>
              <UploadBox onPress={pickImage} photo={photo} />
            </View>
          </Card>

          <Card>
            <Text style={typography.h3}>📍 Current Location</Text>
            <View style={{ marginTop: spacing.sm }}>
              {location ? (
                <Text style={typography.small}>
                  Lat: {location.latitude.toFixed(5)}, Lng:{" "}
                  {location.longitude.toFixed(5)}
                </Text>
              ) : (
                <Text style={typography.small}>Fetching location...</Text>
              )}
            </View>
          </Card>

          <Card>
            <View style={styles.emergencyRow}>
              <View>
                <Text style={typography.h3}>🚨 Emergency Report</Text>
                <Text style={typography.caption}>
                  Requires immediate attention
                </Text>
              </View>
              <Switch
                value={emergency}
                onValueChange={setEmergency}
                trackColor={{ true: colors.danger }}
              />
            </View>
          </Card>

          <PrimaryButton title="Submit Report" onPress={handleSubmit} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* MODAL DE SÉLECTION */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={typography.h2}>Incident Type</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={28} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={reportTypes}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.typeItem,
                    selectedType?.id === item.id && styles.selectedItem,
                  ]}
                  onPress={() => {
                    setSelectedType(item);
                    setIsModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      typography.body,
                      selectedType?.id === item.id && {
                        color: colors.primary,
                        fontWeight: "700",
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                  {selectedType?.id === item.id && (
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalTrigger: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.sm,
  },
  emergencyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  typeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectedItem: {
    backgroundColor: colors.primary + "10",
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
  },
});
