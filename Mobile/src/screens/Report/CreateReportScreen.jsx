import { useState } from "react";
import { View, Text, ScrollView, Switch, KeyboardAvoidingView, Platform } from "react-native";
import { globalStyles, spacing, typography, colors } from "../../styles";

import SafeWalkHeader from "../../components/layout/SafeWalkHeader";
import Card from "../../components/ui/Card";
import TextField from "../../components/ui/TextField";
import SelectField from "../../components/ui/SelectField";
import UploadBox from "../../components/ui/UploadBox";
import PrimaryButton from "../../components/ui/PrimaryButton";

export default function CreateReportScreen() {
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [emergency, setEmergency] = useState(false);

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
                value={type}
                placeholder="Select incident type"
                onPress={() => {}}
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
              <UploadBox onPress={() => {}} />
            </View>
          </Card>

          {/* Location */}
          <Card>
            <Text style={typography.h3}>📍 Current Location</Text>
            <View style={{ marginTop: spacing.sm }}>
              <Text style={typography.body}>123 Main Street, Downtown</Text>
              <Text style={typography.small}>Lat: 40.7128, Lng: -74.0060</Text>
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
          <PrimaryButton title="Submit Report" onPress={() => {}} />

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
