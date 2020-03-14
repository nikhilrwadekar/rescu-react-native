import React from "react";
import { Text, View, Button, StyleSheet } from "react-native";

// Test Comment
const AssignedTaskCardComponent = ({
  jobType,
  date,
  location,
  time,
  buttonText,
  onPressOptOut,
  newKey
}) => (
  <View key={newKey} style={styles.header}>
    <Text>{jobType}</Text>
    <Text>{date}</Text>
    <Text>{location}</Text>
    <Text>{time}</Text>

    <View style={styles.editButton}>
      <Button title={buttonText} onPress={onPressOptOut} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  header: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#d6d7da"
  },
  editButton: {
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#d6d7da"
  }
});
export default AssignedTaskCardComponent;
