import { View, Text, Button } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View>
      <Text>Carte SafeWalk</Text>
      <Button title="Créer un danger" onPress={() => navigation.navigate("CreateReport")} />
    </View>
  );
}
