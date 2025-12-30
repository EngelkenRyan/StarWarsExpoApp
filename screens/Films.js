import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  Button,
  Dimensions,
  Modal,
  StyleSheet,
  StatusBar,
} from "react-native";
import Swipeable from "./Swipeable";
import Animated, { SlideInDown } from "react-native-reanimated";
import LazyImage from "./LazyImage";
import useNetworkStatus from "./NetworkConnect";

{
  /* Image sizing */
}
const screenWidth = Dimensions.get("window").width;
const imageHeight = screenWidth * 0.55;

{
  /* Films page component */
}
export default function Films() {
  const isConnected = useNetworkStatus();

  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState("");
  const [animateKey, setAnimateKey] = useState(0);

  {
    /* Fetch films */
  }
  const fetchFilms = async () => {
    try {
      const response = await fetch("https://www.swapi.tech/api/films", {
        headers: { Accept: "application/json" },
      });
      const json = await response.json();
      setData(json.result);
    } catch (error) {
      console.error(error);
    }
  };

  {
    /* Call fetchFilms if connected */
  }
  useEffect(() => {
    if (isConnected) {
      fetchFilms();
    }
  }, [isConnected]);

  {
    /* Animation */
  }
  useEffect(() => {
    setAnimateKey((prev) => prev + 1);
  }, [data]);

  const filteredData = data.filter((item) => {
    const title = item?.properties?.title || "";
    return title.toLowerCase().includes(searchText.toLowerCase());
  });

  {
    /* Handle Search */
  }
  const handleSearch = () => {
    setModalVisible(true);
  };

  {
    /* Handle Swipe */
  }
  const handleSwipe = (title) => {
    setSelectedFilm(title);
    setModalVisible(true);
  };

  {
    /* Render films */
  }
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
        <ScrollView style={styles.container}>
          {/* Image */}
          <LazyImage
            source={require("../assets/starwarsfilms.jpg")}
            style={[styles.headerImage, { width: "100%", height: imageHeight }]}
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

          {/* Search button */}
          <Button title="Submit" onPress={handleSearch} color="red" />

          {/* Films list */}
          {filteredData.map((item) => {
            const title = item?.properties?.title;
            if (!title) return null;

            return (
              <Animated.View
                key={`${item.uid}-${animateKey}`}
                entering={SlideInDown}
              >
                <Swipeable
                  name={title}
                  textStyle={{ color: "red" }}
                  onSwipe={() => handleSwipe(title)}
                />
              </Animated.View>
            );
          })}

          {/* Film and search modal */}
          <Modal visible={modalVisible} transparent animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalBox}>
                <Text style={styles.modalText}>
                  {selectedFilm || searchText}
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
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerImage: { marginBottom: 20, resizeMode: "cover", borderRadius: 10 },
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
  modalText: { fontSize: 18, marginBottom: 20, textAlign: "center" },
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
