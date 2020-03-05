import React, { Component } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import ProfileHeader from "../../../components/ProfileHeader";
import ProfileOption from "../../../components/AssignedVolunteerings";
const profilePicture = require("../../../assets/images/young-lady.jpg");
export default class ProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  // Assigned Volunteerings
  handleAssignedVolunteeringsPress = () => {
    this.props.navigation.navigate("Tasks");
  };

  //Edit Preferences
  handleEditPreferencesPress = () => {
    this.props.navigation.navigate("EditPreferences");
  };

  //Donate
  handleDonatePress = () => {
    this.props.navigation.navigate("DisasterList");
  };

  //Terms & Conditions
  handleTermsAndConditionsPress = () => {
    this.props.navigation.navigate("Terms");
  };
  render() {
    const { navigation } = this.props;
    return (
      <View>
        <ProfileHeader
          buttonText="Edit Profile"
          imageUrl={profilePicture}
          onPressEditProfile={this.handleEditProfile}
          key="1"
          fName="Someone Here"
        />

        <ProfileOption
          buttonText="Assigned Volunteerings"
          onOptionPressed={this.handleAssignedVolunteeringsPress}
        />
        <ProfileOption
          buttonText="Edit Preferences"
          onOptionPressed={this.handleEditPreferencesPress}
        />
        <ProfileOption
          buttonText="Donate"
          onOptionPressed={this.handleDonatePress}
        />
        <ProfileOption
          buttonText="Terms & Conditions"
          onOptionPressed={this.handleTermsAndConditionsPress}
        />

        {/* Logout */}
        <Button
          title="Logout"
          onPress={() => {
            navigation.navigate("SignIn");
          }}
        />
      </View>
    );
  }
}

ProfileScreen.navigationOptions = {
  title: "Your Profile"
};

const styles = StyleSheet.create({});
