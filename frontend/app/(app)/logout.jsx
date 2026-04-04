import { View, Text } from "react-native";

export default function Logout() {
  // This screen never actually shows - the drawer intercepts the tap
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Logging out...</Text>
    </View>
  );
}
