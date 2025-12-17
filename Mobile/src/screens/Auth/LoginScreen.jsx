import { View, Text } from "react-native";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import TextField from "../../components/ui/TextField";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { globalStyles } from "../../styles/globalStyles";

export default function LoginScreen() {

  const { login, user} = useContext(AuthContext);
 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

//log
  useEffect(() => {
  console.log("🔍 user a changé :", user);
  }, [user]);


  return (
    
    <View style={globalStyles.page}>

      <Text style={globalStyles.title}>SafeWalk</Text>
      <Text style={globalStyles.subtitle}>Your safety companion</Text>

      <View style={globalStyles.card}>
        <TextField placeholder="Email" value={email} onChangeText={setEmail} />
        <TextField placeholder="Password" value={password} secure onChangeText={setPassword} />
        
        <PrimaryButton title="Sign In" 
        onPress={() => login({ email }, "fake-jwt")} 
        />
      </View>
    </View>
  );
}
