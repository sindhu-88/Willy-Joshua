import * as firebase from "firebase";
import * as React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Alert,
  TextInput,
} from "react-native";
import icon from "../assets/book.png";

export default class LoginScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
    };
  }
  login = async (email, password) => {
    if ((email, password)) {
      const response = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((response) => {
          if (response) this.props.naviagation.navigate("Transaction");
        })
        .catch((err) => {
          switch (err.code) {
            case "auth/user not found":
              alert("Oh, hello. You don't exist.");
              break;
            case "auth/invalid email id":
              alert("Oh, you forgot your email and password, nice.");
              break;
          }
        });
    } else alert("Please fill in all fields.");
  };
  render() {
    return (
      <KeyboardAvoidingView style={styles.screen}>
        <View>
          <Image src={icon} style={{ width: 200, height: 200 }} />
          <Text style={{ textAlign: "center", fontSize: 30 }}>Willy</Text>
        </View>
        <View>
          <TextInput
            style={styles.box}
            placeholder="abc@example.com"
            keyboardType="email-address"
            onChangeText={(text) => {
              this.setState({
                email: text,
              });
            }}
          ></TextInput>
          <TextInput
            style={styles.box}
            placeholder="Enter Password"
            secureTextEntry={true}
            onChangeText={(text) => {
              this.setState({
                password: text,
              });
            }}
          ></TextInput>
        </View>
        <View>
          <TouchableOpacity
            styles={{
              height: 30,
              width: 90,
              borderWidth: 1,
              marginTop: 20,
              paddingTop: 5,
              borderRadius: 7,
            }}
            onPress={this.login(this.state.email, this.state.password)}
          >
            <Text styles={{ textAlign: "center" }}>Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    alignItems: "center",
    marginTop: 20,
  },
  box: {
    width: 300,
    height: 40,
    borderWidth: 1.5,
    fontSize: 20,
    paddingLeft: 10,
  },
});
