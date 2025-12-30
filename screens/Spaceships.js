import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  Button,
  Modal,
  StyleSheet,
  Dimensions,
} from "react-native";
import Animated, { SlideInDown } from "react-native-reanimated";
import Swipeable from "./Swipeable";
import LazyImage from "./LazyImage";
import useNetworkStatus from "./NetworkConnect";

const screenWidth = Dimensions.get("window").width;
const imageWidth = screenWidth;
const imageHeight = screenWidth * 0.55;

{
  /* Spaceships page component */
}
export default function Spaceships() {
  const isConnected = useNetworkStatus();

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedShip, setSelectedShip] = useState("");
  const [animateKey, setAnimateKey] = useState(0);

  {
    /* Fetch starships */
  }
  const fetchShips = async () => {
    try {
      const response = await fetch("https://www.swapi.tech/api/starships/");
      const json = await response.json();
      setData(json.results);
      setFilteredData(json.results);
    } catch (error) {
      console.error(error);
    }
  };

  {
    /* Call fetchShips if online */
  }
  useEffect(() => {
    if (isConnected) {
      fetchShips();
    }
  }, [isConnected]);

  useEffect(() => {
    setAnimateKey((prev) => prev + 1);
  }, [filteredData]);

  useEffect(() => {
    if (searchText === "") {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchText, data]);

  {
    /* Handle Search */
  }
  const handleSearch = () => {
    setModalVisible(true);
  };

  {
    /* Handle Swipe */
  }
  const handleSwipe = (name) => {
    setSelectedShip(name);
    setModalVisible(true);
  };

  {
    /* Render starships */
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      {!isConnected ? (
        <View style={styles.offlineContainer}>
          <Text style={styles.offlineText}>
            No internet connection. Please try again.
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            ...styles.container,
            flexGrow: 1,
            paddingBottom: 100,
          }}
        >
          {/* Image */}
          <LazyImage
            source={require("../assets/Death-Star-I-copy_36ad2500.jpeg")}
            style={{
              width: imageWidth,
              height: imageHeight,
              borderRadius: 12,
              alignSelf: "center",
              marginTop: 10,
              marginBottom: 20,
            }}
            resizeMode="cover"
          />
          {/* Search */}
          <TextInput
            style={styles.input}
            placeholder="Enter search term"
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
          />
          <Button title="Submit" onPress={handleSearch} color="red" />
          {/* Spaceship list */}
          {filteredData.map((item) => (
            <Animated.View
              key={`${item.url}-${animateKey}`}
              entering={SlideInDown}
            >
              <Swipeable
                name={item.name}
                textStyle={{ color: "red" }}
                onSwipe={() => handleSwipe(item.name)}
              />
            </Animated.View>
          ))}
          {/* Spaceship modal */}
          <Modal visible={modalVisible} transparent animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalBox}>
                <Text style={styles.modalText}>
                  {selectedShip || searchText}
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
    backgroundColor: "#000",
  },
  offlineText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
