import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Linking,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import api from "../../services/api";
import { getErrorMessage } from "../../services/errors";
import { addReport } from "../../store/reportSlice";
import SafeWalkHeader from "../../components/layout/SafeWalkHeader";
import Card from "../../components/ui/Card";
import TextField from "../../components/ui/TextField";
import UploadBox from "../../components/ui/UploadBox";
import PrimaryButton from "../../components/ui/PrimaryButton";
import FilterBar from "../../components/danger/FilterBar";
import { globalStyles, spacing, typography, colors } from "../../styles";

const DESCRIPTION_MIN_LENGTH = 10;

const SEVERITY_OPTIONS = [
  { key: "low", label: "Low" },
  { key: "medium", label: "Medium" },
  { key: "high", label: "High" },
];

function SectionTitle({ icon, title }) {
  return (
    <View style={styles.sectionTitle}>
      <Ionicons name={icon} size={18} color={colors.primary} />
      <Text style={[typography.h3, styles.sectionTitleText]}>{title}</Text>
    </View>
  );
}

export default function CreateReportScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [reportTypes, setReportTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("medium");
  const [location, setLocation] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadReportTypes = async () => {
    try {
      const response = await api.get("/report-types");
      setReportTypes(response.data.data);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  const loadLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Location access is required to report an incident.");
        return;
      }

      const position = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    } catch (locationError) {
      setError("Could not get your current location.");
    }
  };

  useEffect(() => {
    loadReportTypes();
    loadLocation();
  }, []);

  const showPermissionAlert = (message) => {
    Alert.alert("Permission required", message, [
      { text: "Cancel", style: "cancel" },
      { text: "Open settings", onPress: () => Linking.openSettings() },
    ]);
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      showPermissionAlert(
        "SafeWalk needs camera access to take a photo of the incident."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.5,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0]);
    }
  };

  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showPermissionAlert(
        "SafeWalk needs photo library access to attach an image."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.5,
    });
    if (!result.canceled) {
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

  const validateForm = () => {
    if (!selectedType) {
      return "Please select an incident type.";
    }
    if (description.trim().length < DESCRIPTION_MIN_LENGTH) {
      return `Description must be at least ${DESCRIPTION_MIN_LENGTH} characters long.`;
    }
    if (!location) {
      return "Your location is not available yet.";
    }
    return "";
  };

  const resetForm = () => {
    setSelectedType(null);
    setDescription("");
    setSeverity("medium");
    setPhoto(null);
  };

  const uploadPhoto = async () => {
    const formData = new FormData();
    formData.append("image", {
      uri: photo.uri,
      name: photo.fileName || "report.jpg",
      type: photo.mimeType || "image/jpeg",
    });

    const response = await api.post("/uploads", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.url;
  };

  const handleSubmit = async () => {
    if (submitting) {
      return;
    }

    const validationError = validateForm();
    if (validationError !== "") {
      setError(validationError);
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      let imageUrl = null;
      if (photo) {
        imageUrl = await uploadPhoto();
      }

      const response = await api.post("/reports", {
        type_id: selectedType.id,
        title: selectedType.label,
        description: description.trim(),
        latitude: location.latitude,
        longitude: location.longitude,
        image_url: imageUrl,
        severity,
      });

      dispatch(addReport(response.data));
      resetForm();
      navigation.goBack();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  const renderTypeItem = ({ item }) => {
    const isSelected = selectedType?.id === item.id;

    return (
      <TouchableOpacity
        style={[styles.typeItem, isSelected && styles.selectedItem]}
        onPress={() => {
          setSelectedType(item);
          setIsModalVisible(false);
        }}
      >
        <Text style={[typography.body, isSelected && styles.selectedItemText]}>
          {item.label}
        </Text>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={globalStyles.screen}>
      <SafeWalkHeader title="Report Incident" showBack />

      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <Card>
            <SectionTitle icon="warning-outline" title="Report Type" />
            <TouchableOpacity
              style={styles.modalTrigger}
              onPress={() => setIsModalVisible(true)}
            >
              <Text style={selectedType ? typography.body : styles.placeholder}>
                {selectedType ? selectedType.label : "Select incident type"}
              </Text>
              <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </Card>

          <Card>
            <SectionTitle icon="document-text-outline" title="Description" />
            <View style={styles.sectionBody}>
              <TextField
                value={description}
                onChangeText={setDescription}
                placeholder="Please describe the incident in detail..."
                multiline
              />
            </View>
          </Card>

          <Card>
            <SectionTitle icon="alert-circle-outline" title="Severity" />
            <View style={styles.sectionBody}>
              <FilterBar
                options={SEVERITY_OPTIONS}
                active={severity}
                onChange={setSeverity}
              />
            </View>
          </Card>

          <Card>
            <SectionTitle icon="camera-outline" title="Photo (optional)" />
            <View style={styles.sectionBody}>
              <UploadBox
                onPress={pickImage}
                onRemove={() => setPhoto(null)}
                photo={photo}
              />
            </View>
          </Card>

          <Card>
            <SectionTitle icon="location-outline" title="Current Location" />
            <View style={styles.sectionBody}>
              <Text style={typography.small}>
                {location
                  ? `Lat: ${location.latitude.toFixed(5)}, Lng: ${location.longitude.toFixed(5)}`
                  : "Fetching location..."}
              </Text>
            </View>
          </Card>

          {error !== "" && <Text style={styles.errorText}>{error}</Text>}

          <PrimaryButton
            title={submitting ? "Submitting..." : "Submit Report"}
            onPress={handleSubmit}
            disabled={submitting}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent
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
              keyExtractor={(item) => String(item.id)}
              renderItem={renderTypeItem}
              ListEmptyComponent={
                <Text style={typography.small}>No incident type available.</Text>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  keyboard: { flex: 1 },
  scrollContent: { paddingBottom: spacing.xl },
  sectionTitle: { flexDirection: "row", alignItems: "center" },
  sectionTitleText: { marginLeft: spacing.sm },
  sectionBody: { marginTop: spacing.sm },
  placeholder: { color: colors.textMuted },
  errorText: {
    color: colors.danger,
    textAlign: "center",
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
  },
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
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
  },
  selectedItemText: { color: colors.primary, fontWeight: "700" },
});
