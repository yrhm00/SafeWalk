import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Switch,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { globalStyles, spacing, typography, colors } from "../../styles";

import SafeWalkHeader from "../../components/layout/SafeWalkHeader";
import Card from "../../components/ui/Card";
import TextField from "../../components/ui/TextField";
import SelectField from "../../components/ui/SelectField";
import UploadBox from "../../components/ui/UploadBox";
import PrimaryButton from "../../components/ui/PrimaryButton";

import { useSelector } from "react-redux";
import * as Location from "expo-location";
import api from "../../services/api";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

export default function CreateReportScreen() {
  const navigation = useNavigation();
  const token = useSelector((state) => state.auth.token);

  const [reportTypes, setReportTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);

  const [description, setDescription] = useState("");
  const [emergency, setEmergency] = useState(false);
  const [location, setLocation] = useState(null);
  const [photo, setPhoto] = useState(null);

  //permission localisation
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

  //permission galerie et appareil photo

  useEffect(() => {
    (async () => {
      // Galerie
      const mediaPermission =
        await ImagePicker.getMediaLibraryPermissionsAsync();

      if (!mediaPermission.granted) {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      }

      // Caméra
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

  // degré d'importance manque dans les reponse api
  const getSeverityByLabel = (label) => {
    const t = label?.toLowerCase() || "";

    // LOW : Problèmes d'infrastructure mineurs
    if (
      t.includes("sidewalk") ||
      t.includes("trottoir") ||
      t.includes("lighting") ||
      t.includes("lampadaire")
    ) {
      return "low";
    }

    // MEDIUM : Dangers environnementaux
    if (
      t.includes("flooded") ||
      t.includes("inondée") ||
      t.includes("icy") ||
      t.includes("gelée")
    ) {
      return "medium";
    }

    // HIGH : Sécurité des personnes
    if (t.includes("suspicious") || t.includes("suspecte")) {
      return "high";
    }

    return "medium"; // Sécurité : ne jamais renvoyer undefined
  };

  const handleSubmit = async () => {
    if (!selectedType?.id) {
      alert("Invalid report type");
      return;
    }

    if (!description || !location) {
      alert("Please fill all required fields");
      return;
    }

    // 🔥 conversion base64 attendue par l’API
    let imageBase64 = null;
    if (photo?.base64) {
      imageBase64 = `data:image/jpeg;base64,${photo.base64}`;
    }

    try {
      const calculatedSeverity = emergency
        ? "high"
        : getSeverityByLabel(selectedType.label);

      const payload = {
        title: selectedType.label,
        description,
        latitude: location.latitude,
        longitude: location.longitude,
        image_url: imageBase64,
        type_id: selectedType.id,
        severity: calculatedSeverity, // Utilisation de la variable calculée
      };

      console.log("📤 REPORT PAYLOAD:", payload);

      await api.post("/api/v1/reports", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("Report submitted successfully!");

      // reset
      setSelectedType(null);
      setDescription("");
      setEmergency(false);
      setPhoto(null);

      navigation.goBack();
    } catch (e) {
      console.log("❌ CREATE REPORT ERROR:", e.response?.data || e.message);
      alert("Error while submitting report");
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
          {/* Report Type */}
          <Card>
            <Text style={typography.h3}>⚠️ Report Type</Text>
            <View style={{ marginTop: spacing.sm }}>
              <SelectField
                value={selectedType}
                placeholder="Select incident type"
                options={reportTypes}
                onSelect={setSelectedType}
              />
            </View>
          </Card>

          {/* Description */}
          <Card>
            <Text style={typography.h3}>📝 Description</Text>
            <View style={{ marginTop: spacing.sm }}>
              <TextField
                value={description}
                onChangeText={setDescription}
                placeholder="Please describe the incident in detail..."
              />
              <Text
                style={[
                  typography.small,
                  { alignSelf: "flex-end", marginTop: spacing.xs },
                ]}
              >
                {description.length}/500
              </Text>
            </View>
          </Card>

          {/* Upload */}
          <Card>
            <Text style={typography.h3}>📷 Upload Photo (Optional)</Text>
            <View style={{ marginTop: spacing.sm }}>
              <UploadBox onPress={pickImage} photo={photo} />
            </View>
          </Card>

          {/* Location */}
          <Card>
            <Text style={typography.h3}>📍 Current Location</Text>
            <View style={{ marginTop: spacing.sm }}>
              {location ? (
                <>
                  <Text style={typography.body}>Current position</Text>
                  <Text style={typography.small}>
                    Lat: {location.latitude.toFixed(5)}, Lng:{" "}
                    {location.longitude.toFixed(5)}
                  </Text>
                </>
              ) : (
                <Text style={typography.small}>Fetching location...</Text>
              )}
            </View>
          </Card>

          {/* Emergency */}
          <Card>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
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

          {/* Submit */}
          <PrimaryButton title="Submit Report" onPress={handleSubmit} />

          <Text
            style={[
              typography.small,
              { textAlign: "center", marginTop: spacing.sm },
            ]}
          >
            Your report will be reviewed within 24 hours
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
