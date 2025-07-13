import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Layout() {
  const theme = useColorScheme();

  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#4CAF50",
          tabBarInactiveTintColor: "gray",
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
          },
          tabBarStyle: {
            backgroundColor: theme === "dark" ? "#121212" : "#ffffff",
            borderTopWidth: 0,
            elevation: 5,
            height: 100, // sedikit lebih tinggi
            paddingBottom: 6,
            paddingTop: 6,
          },
          tabBarItemStyle: {
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 4,
            paddingBottom: 4,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Ionicons name="home-outline" size={22} color={color} style={{ marginBottom: -2 }} />
            ),
          }}
        />
        <Tabs.Screen
          name="absen"
          options={{
            title: "Absen",
            tabBarIcon: ({ color }) => (
              <Ionicons name="calendar-outline" size={22} color={color} style={{ marginBottom: -2 }} />
            ),
          }}
        />
        <Tabs.Screen
          name="input-absen"
          options={{
            title: "Input",
            tabBarIcon: ({ color }) => (
              <Ionicons name="document-text-outline" size={22} color={color} style={{ marginBottom: -2 }} />
            ),
          }}
        />
        <Tabs.Screen
          name="tambah-guru"
          options={{
            title: "Guru",
            tabBarIcon: ({ color }) => (
              <Ionicons name="school-outline" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="daftar-guru"
          options={{
            title: "Guru",
            tabBarIcon: ({ color }) => (
              <Ionicons name="list-outline" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="tambah-user"
          options={{
            title: "User",
            tabBarIcon: ({ color }) => (
              <Ionicons name="people-outline" size={22} color={color} style={{ marginBottom: -2 }} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}
