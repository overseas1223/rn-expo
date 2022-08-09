import React, { Component } from "react";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { View, Text, StyleSheet, Image, ImageBackground } from "react-native";

export default class SectionListBasics extends Component {
  render() {
    return (
      <View style={styles.body}>
        <View style={styles.body_header}></View>
        <View style={styles.body_content}>
          <Text>12312</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
});
