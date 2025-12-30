import React, { useState } from "react";
import { View, Image, StyleSheet } from "react-native";

const placeholder = require("../assets/snack-icon.png");

export default function LazyImage({ source, style }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <View style={style}>
      {!loaded && <Image source={placeholder} style={style} />}
      <Image source={source} style={style} onLoad={() => setLoaded(true)} />
    </View>
  );
}
