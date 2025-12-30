import React from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function Swipeable({ name, onSwipe, textStyle }) {
  function onScroll(e) {
    if (e.nativeEvent.contentOffset.x >= 200) {
      onSwipe();
    }
  }

  const scrollProps = {
    horizontal: true,
    pagingEnabled: true,
    showsHorizontalScrollIndicator: false,
    scrollEventThrottle: 10,
    onScroll,
  };

  return (
    <View style={styles.swipeContainer}>
      <ScrollView {...scrollProps}>
        <TouchableOpacity>
          <View style={styles.swipeItem}>
            <Text style={[styles.swipeItemText, textStyle]}>{name}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.swipeBlank} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  swipeContainer: {
    width: 200,
    height: 50,
    marginVertical: 5,
    alignSelf: "center",
  },
  swipeItem: {
    width: 200,
    height: 50,
    backgroundColor: "azure",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "slategrey",
  },
  swipeItemText: {
    textAlign: "center",
    color: "slategrey",
    fontSize: 16,
  },
  swipeBlank: {
    width: 200,
    height: 50,
  },
});
