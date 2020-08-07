import React from "react";
import { StyleSheet, TouchableOpacity, View, Image, Alert } from "react-native";
import { Button, Icon, Text } from "galio-framework";
import { MaterialIcons } from "@expo/vector-icons";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import Header from "../common/header";
import { NavigationActions } from "@react-navigation/native";

//import firebase from 'expo-firebase-app'
//import { firestore } from "react-native-firebase";
import * as firebase from 'firebase';
var firebaseConfig = {
  apiKey: "AIzaSyB1PLFrXX2dk_qBdVO6LjNuwMQVVT3dCw0",
  authDomain: "skincancerdetectionapp.firebaseapp.com",
  databaseURL: "https://skincancerdetectionapp.firebaseio.com",
  projectId: "skincancerdetectionapp",
  storageBucket: "skincancerdetectionapp.appspot.com",
  messagingSenderId: "65296723747",
  appId: "1:65296723747:web:df01476cc58d53f9646696",
};

firebase.initializeApp(firebaseConfig);

export default class HomePatient extends React.Component {
  constructor(props) {
    super();
  }
  state = {
    image: null,
  };

  createTwoButtonAlert = () => {
    Alert.alert(
      "Skin Image",
      "Capture your skin image or upload it from a gallery!",
      [
        {
          text: "Camera",
          onPress: async () => {
            await Permissions.askAsync(Permissions.CAMERA);
            const { cancelled, uri } = await ImagePicker.launchCameraAsync({
              allowsEditing: false,
            });
            this.setState({ image: uri });
          },
          style: "Camera",
        },
        {
          text: "Gallery",
          onPress: async () => {
            let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

            if (permissionResult.granted === false) {
              alert("Permission to access camera roll is required!");
              return;
            }

            let pickerResult = await ImagePicker.launchImageLibraryAsync();
            if (pickerResult.cancelled === true) {
              return;
            } else {
              this.setState({ image: pickerResult.uri });
              this.uploadImage(this.state.image, "test-image")
                .then(() => {
                  Alert.alert("Success");
                })
                .catch((error) => {
                  Alert.alert(error);
                });
            }
          },
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };

  uploadImage = async (uri, imageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    var ref = firebase
      .storage()
      .ref()
      .child("images/" + imageName);
    return ref.put(blob);
  };

  render() {
    return (
      <View>
        <Header drawer={this.props} />
        <View style={styles.container}>
          <Text p style={styles.description}>
            Upload or capture Image for your ubnormal skin ...
          </Text>

          <Image style={styles.image} source={{ uri: this.state.image }} />
        </View>
        <MaterialIcons
          name="photo-camera"
          size={45}
          color="#18dcff"
          style={styles.camera}
          onPress={this.createTwoButtonAlert}
        />
        <MaterialIcons
          name="search"
          size={45}
          color="#18dcff"
          style={styles.predict}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 21,
  },
  row: { flexDirection: "row" },
  image: {
    width: 300,
    height: 300,
    backgroundColor: "#FFF",

    borderWidth: 5,
    borderColor: "#18dcff",
  },

  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
  camera: {
    position: "absolute",
    bottom: -600,
    right: 30,
  },
  predict: {
    position: "absolute",
    bottom: -600,
    left: 30,
  },
  description: {
    fontWeight: "bold",
    justifyContent: "space-between",
    padding: 30,
    fontSize: 25,
  },
});
