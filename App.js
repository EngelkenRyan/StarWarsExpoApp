import React from "react";
import { Platform, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Films from "./screens/Films";
import Planets from "./screens/Planets";
import Spaceships from "./screens/Spaceships";
import PlanetDetail from "./screens/PlanetDetail";

// Navigation
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

// iOS uses Bottom Tabs, Android uses Drawer Navigation
function MainTabs() {
  return Platform.OS === "ios" ? (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "red",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tab.Screen name="Films" component={Films} />
      <Tab.Screen name="Planets" component={Planets} />
      <Tab.Screen name="Spaceships" component={Spaceships} />
    </Tab.Navigator>
  ) : (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        drawerActiveTintColor: "red",
        drawerInactiveTintColor: "gray",
        sceneContainerStyle: { backgroundColor: "#000" },
      }}
    >
      <Drawer.Screen name="Films" component={Films} />
      <Drawer.Screen name="Planets" component={Planets} />
      <Drawer.Screen name="Spaceships" component={Spaceships} />
    </Drawer.Navigator>
  );
}

export default function App() {
  // Phone-like width on web so it doesn't look stretched on desktop
  const webPhoneWidth = 390;

  return (
    <View style={{ flex: 1, backgroundColor: "#000", alignItems: "center" }}>
      <View
        style={{
          flex: 1,
          width: Platform.OS === "web" ? webPhoneWidth : "100%",
          maxWidth: "100%",
        }}
      >
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: true,
              contentStyle: { backgroundColor: "#000" }, // keeps stack screens black
            }}
          >
            {/* Main app tabs/drawer */}
            <Stack.Screen
              name="Main"
              component={MainTabs}
              options={{ headerShown: false }}
            />

            {/* Planet Detail */}
            <Stack.Screen
              name="PlanetDetail"
              component={PlanetDetail}
              options={{ title: "Planet Detail", headerTintColor: "red" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </View>
  );
}
