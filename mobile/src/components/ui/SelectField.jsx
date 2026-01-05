import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { spacing, colors, typography } from "../../styles";
import { Ionicons } from "@expo/vector-icons";

export default function SelectField({
  value,
  placeholder = "Select an option",
  options = [],
  onSelect,
}) {
  const [open, setOpen] = useState(false);

  const handleSelect = (item) => {
    onSelect(item);
    setOpen(false);
  };

  return (
    <View>
      {/* Champ principal */}
      <TouchableOpacity
        onPress={() => setOpen((prev) => !prev)}
        activeOpacity={0.8}
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          backgroundColor: colors.white,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={[
            typography.body,
            { color: value ? colors.textPrimary : colors.textMuted },
          ]}
        >
          {value ? value.label : placeholder}
        </Text>

        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={20}
          color={colors.textMuted}
        />
      </TouchableOpacity>

      {/* Liste déroulante */}
      {open && (
        <View
          style={{
            marginTop: spacing.xs,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 12,
            backgroundColor: colors.white,
            overflow: "hidden",
          }}
        >
          {options.length > 0 ? (
            options.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleSelect(item)}
                style={{
                  paddingVertical: spacing.sm,
                  paddingHorizontal: spacing.md,
                  borderBottomWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Text style={typography.body}>{item.label}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={[typography.caption, { padding: spacing.sm }]}>
              No options available
            </Text>
          )}
        </View>
      )}
    </View>
  );
}
