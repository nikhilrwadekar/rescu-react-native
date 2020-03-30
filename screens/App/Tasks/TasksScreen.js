import React, { Component } from "react";

// React Native
import {
  View,
  StyleSheet,
  Dimensions,
  Alert,
  RefreshControl,
  AsyncStorage
} from "react-native";

// Third Party Components/Libraries
import axios from "axios"; // Axios
import { TabView, SceneMap } from "react-native-tab-view";
import { ScrollView } from "react-native-gesture-handler";

// Import Sockets
import { clientSocket } from "../../../web-sockets";
import { API_URL } from "../../../API";

// Custom Outreach Components
import AssignedTaskCardComponent from "../../../components/AssignedTaskCardComponent";

// Left Tab: Upcoming
class UpcomingTasksComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userDetails: {},
      assignedTasks: []
    };
  }

  async componentDidMount() {
    // Get User Data
    if ((await AsyncStorage.getItem("loginType")) === "email") {
      const userDetails = await AsyncStorage.getItem("userDetails");
      this.setState({ userDetails: JSON.parse(userDetails) });
    }

    // Listen to changes in Relief Centers
    clientSocket.on("reliefCenterDataChange", async data => {
      // Get the latest tasks
      this.getTasks();
    });

    this.getTasks();
  }

  getTasks = async () => {
    const tasks = await axios.get(
      `${API_URL}/user/${this.state.userDetails.email}/tasks`
    );
    this.setState({ assignedTasks: tasks.data });
  };

  // Handle Opt Out
  handleOptOut = async taskID => {
    axios
      .post(`${API_URL}/user/${this.state.userDetails.email}/optout/${taskID}`)
      .then(res => {
        // If successfully opted out from DB..
        if (res.status == 200) {
          const { assignedTasks } = this.state;

          // Filter it out from the state as well..
          const updatedReliefCenterTasks = assignedTasks.filter(
            task => task.job_id != taskID
          );

          // And the upate the state
          this.setState({ assignedTasks: updatedReliefCenterTasks });
        }
      });
  };

  // Handle Refresh
  handleRefresh = () => {
    this.getTasks();
  };

  render() {
    const { assignedTasks } = this.state;
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={this.handleRefresh} />
        }
        style={[styles.scene, { backgroundColor: "#fff" }]}
      >
        {assignedTasks &&
          assignedTasks.map((taskCard, taskIndex) => {
            const {
              _id,
              name,
              location,
              job_type,
              job_id,
              job_date,
              job_start_time,
              job_end_time
            } = taskCard;

            return (
              <AssignedTaskCardComponent
                time={`${job_start_time} - ${job_end_time}`}
                newKey={job_id}
                buttonText="Opt Out"
                date={new Date(job_date).toDateString()}
                jobType={job_type}
                location={location}
                onPressOptOut={() => {
                  Alert.alert(
                    "Opt Out?",
                    "You're about to opt out",
                    [
                      {
                        text: "Yes, please.",
                        onPress: () => this.handleOptOut(job_id)
                      },
                      {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                      }
                    ],
                    { cancelable: false }
                  );
                }}
              />
            );
          })}
      </ScrollView>
    );
  }
}

// Right Tab: History
const HistoryComponent = () => (
  <View
    style={[styles.scene, { backgroundColor: "#f7f7f7", paddingTop: 20 }]}
  />
);

const initialLayout = { width: Dimensions.get("window").width };
const renderScene = SceneMap({
  first: UpcomingTasksComponent,
  second: HistoryComponent
});

export default class TasksScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      routes: [
        { key: "first", title: "Upcoming Tasks" },
        { key: "second", title: "History" }
      ]
    };
  }

  async componentDidMount() {
    axios
      .get(`${API_URL}/user/${this.state.userDetails.email}/tasks`)
      .then(res => {
        this.setState({ assignedTasks: res.data });
      })
      .catch(err => console.log(err));
  }

  render() {
    const { index, routes } = this.state;
    return (
      <TabView
        navigationState={{ index, routes }}
        indicatorStyle={{ backgroundColor: "white", color: "red" }}
        style={{ backgroundColor: "pink" }}
        renderLabel={({ route, focused, color }) => (
          <Text style={{ color, margin: 8 }}>{route.title}</Text>
        )}
        renderScene={renderScene}
        onIndexChange={index => {
          this.setState({ index });
        }}
        initialLayout={initialLayout}
      />
    );
  }
}

TasksScreen.navigationOptions = {
  title: "Assigned Tasks"
};

const styles = StyleSheet.create({
  scene: {
    flex: 1
  }
});
