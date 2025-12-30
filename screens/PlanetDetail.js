import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";

export default function PlanetDetail({ route }) {
  const { url } = route.params;
  const [planet, setPlanet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlanet() {
      try {
        const response = await fetch(url);
        const json = await response.json();
        setPlanet(json.result.properties);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
    fetchPlanet();
  }, [url]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="red" />
      </View>
    );
  }

  if (!planet) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No planet data available.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{planet.name}</Text>
      <Text style={styles.text}>Climate: {planet.climate}</Text>
      <Text style={styles.text}>Terrain: {planet.terrain}</Text>
      <Text style={styles.text}>Gravity: {planet.gravity}</Text>
      <Text style={styles.text}>Diameter: {planet.diameter}</Text>
      <Text style={styles.text}>Rotation Period: {planet.rotation_period}</Text>
      <Text style={styles.text}>Orbital Period: {planet.orbital_period}</Text>
      <Text style={styles.text}>Surface Water: {planet.surface_water}</Text>
      <Text style={styles.text}>Population: {planet.population}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", color: "red", marginBottom: 10 },
  text: { fontSize: 18, color: "red", marginBottom: 5 },
});
