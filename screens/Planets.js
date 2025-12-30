import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Button,
  TextInput,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
} from "react-native";
import Animated, { SlideInDown } from "react-native-reanimated";
import Swipeable from "./Swipeable";
import LazyImage from "./LazyImage";
import NetInfo from "@react-native-community/netinfo";

const screenWidth = Dimensions.get("window").width;
const imageHeight = screenWidth * 0.55;

{
  /* Planets page component */
}
export default function Planets({ navigation }) {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState("");
  const [animateKey, setAnimateKey] = useState(0);
  const [isConnected, setIsConnected] = useState(true);

  {
    /* Fetch planets */
  }
  const fetchPlanets = async () => {
    try {
      const response = await fetch("https://www.swapi.tech/api/planets/");
      const json = await response.json();
      setData(json.results);
      setFilteredData(json.results);
    } catch (error) {
      console.error(error);
    }
  };

  {
    /* Refresh */
  }
  const refreshItems = async () => {
    setIsRefreshing(true);
    await fetchPlanets();
    setIsRefreshing(false);
  };

  {
    /* Detect connection */
  }
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  {
    /* Fetchplanets */
  }
  useEffect(() => {
    fetchPlanets();
  }, []);

  useEffect(() => {
    setAnimateKey((prev) => prev + 1);
  }, [filteredData]);

  {
    /* Handle Search */
  }
  const handleSearch = (text) => {
    setSearchText(text);
    if (text === "") {
      setFilteredData(data);
    } else {
      const results = data.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(results);
    }
  };

  {
    /* Handle Swipe */
  }
  const handleSwipe = (url) => {
    navigation.navigate("PlanetDetail", { url });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar barStyle="light-content" />

      {!isConnected ? (
        <View style={styles.offlineContainer}>
          <Text style={styles.offlineText}>
            No internet connection. Please try again.
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
        >
          {/* header image */}
          <LazyImage
            source={require("../assets/starwarsgallaxy.jpeg")}
            style={[styles.headerImage, { height: imageHeight }]}
          />
          {/* search input */}
          <TextInput
            style={styles.input}
            placeholder="Enter search term"
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={handleSearch}
          />
          <Button
            title="Submit"
            onPress={() => handleSearch(searchText)}
            color="red"
          />
          {/* list of planets */}
          {filteredData.map((item) => (
            <Animated.View
              key={`${item.url}-${animateKey}`}
              entering={SlideInDown}
            >
              <Swipeable
                name={item.name}
                textStyle={{ color: "red" }}
                onSwipe={() => handleSwipe(item.url)}
              />
            </Animated.View>
          ))}
          {/* search modal */}
          <Modal visible={modalVisible} transparent animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalBox}>
                <Text style={styles.modalText}>
                  {selectedPlanet || searchText}
                </Text>
                <Button title="Close" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </Modal>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

{
  /* Styles */
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  headerImage: {
    width: "100%",
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#222",
    color: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: "100%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  offlineContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  offlineText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
