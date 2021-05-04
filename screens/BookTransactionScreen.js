import React from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ToastAndroid,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import * as Permissions from "expo-permissions";
import firebase from "firebase";
import db from "../config";
export default class TransactionScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      scanned: false,
      buttonState: "normal",
      hasCameraPermission: "",
      scannedData: "",
      scannedStudentId: "",
      scannedBookId: "",
      transactionMessage: "",
    };
  }
  getCameraPermissions = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status == "granted",
    });
  };
  handleBarCodeScanned = async (type, data) => {
    this.setState({
      scanned: true,
      scannedData: data,
      buttonState: "normal",
    });
  };
  initiateBookIssue = async () => {
    db.collection("transactions").add({
      studentId: this.state.scannedStudentId,
      bookId: this.state.scannedBookId,
      transactionType: "issue",
      date: firebase.firestore.Timestamp.now().toDate(),
    });
    db.collection("books").doc(this.state.scannedBookId).update({
      availability: false,
    });
    db.collection("students")
      .doc(this.state.scaanedStudentId)
      .update({
        booksNumber: firebase.firestore.FieldValue.increment(1),
      });
    this.setState({
      scannedBookId: "",
      scannedStudentId: "",
    });
    // ToastAndroid.show("Book Issued 🎉🎊", ToastAndroid.SHORT);
  };
  initiateBookReturn = async () => {
    db.collection("transactions").add({
      studentId: this.state.scannedStudentId,
      bookId: this.state.scannedBookId,
      transactionType: "return",
      date: firebase.firestore.Timestamp.now().toDate(),
    });
    db.collection("books").doc(this.state.scannedBookId).update({
      availability: true,
    });
    db.collection("students")
      .doc(this.state.scannedStudentId)
      .update({
        booksNumber: firebase.firestore.FieldValue.decrement(1),
      });
    this.setState({
      scannedBookId: "",
      scannedStudentId: "",
    });
    // ToastAndroid.show("Book Returned 🎉🎊", ToastAndroid.SHORT);
  };
  checkBookEligibility = async () => {
    console.log("85:", this.state.scannedBookId);
    const bookRef = await db
      .collection("books")
      .where("bookId", "==", this.state.scannedBookId)
      .get();
    var transactionType = null;
    if (bookRef.docs.length == 0) {
      transactionType = false;
    } else {
      bookRef.docs.map((doc) => {
        var book = doc.data();
        console.log("94 book:", book);
        if (book.availability) transactionType = "issue";
        else transactionType = "return";
      });
    }
    console.log("transactionType:", transactionType);
    return transactionType;
  };
  checkStudentEligibilityForBookIssue = async () => {
    const studentRef = await db
      .collection("students")
      .where("studentId", "==", this.state.scannedStudentId)
      .get();
    var isStudentEligible = "";
    if (!studentRef.docs.length) {
      this.setState({
        scannedBookId: "",
        scannedStudentId: "",
      });
      isStudentEligible = false;
      // ToastAndroid.show("Student ID does not exist 🤖🔥.", ToastAndroid.SHORT);
    } else {
      studentRef.docs.map((doc) => {
        var student = doc.data();
        if (student.booksNumber < 2) isStudentEligible = true;
        else {
          isStudentEligible = false;
          // ToastAndroid.show("Student already has availed the limited number of books 👨‍🎓👩‍🎓.",ToastAndroid.SHORT  );
          this.setState({
            scannedBookId: "",
            scannedStudentId: "",
          });
        }
      });
    }
    return isStudentEligible;
  };
  checkStudentEligibilityForBookReturn = async () => {
    const transactionRef = await db
      .collection("transactions")
      .where("bookId", "==", this.state.scannedBookId)
      .get();
    var isStudentEligible = "";
    transactionRef.docs.map((doc) => {
      var lastBookTransaction = doc.data();
      if (lastBookTransaction.studentId == this.state.scannedStudentId)
        isStudentEligible = true;
      else {
        // ToastAndroid.show(
        //   "Student already has not availed the particular book. 📚",
        //   ToastAndroid.SHORT
        // );
        this.setState({
          scannedBookId: "",
          scannedStudentId: "",
        });
      }
    });
    return isStudentEligible;
  };
  handleTransaction = async () => {
    var transactionType = await this.checkBookEligibility();
    if (!transactionType) {
      alert("Book does not exist in library ⁉️");
      this.setState({
        scannedBookId: "",
        scannedStudentId: "",
      });
    } else if (transactionType == "issue") {
      var isStudentEligible = await this.checkStudentEligibilityForBookIssue();
      if (isStudentEligible) {
        this.initiateBookIssue();
        // ToastAndroid.show("Book Issue ✨", ToastAndroid.SHORT);
      }
    } else {
      var isStudentEligible = await this.checkStudentEligibilityForBookReturn();
      if (isStudentEligible) {
        this.initiateBookReturn();
        // ToastAndroid.show("Book Return ✨", ToastAndroid.SHORT);
      }
    }
  };
  render() {
    const hasCameraPermissions = this.state.hasCameraPermission;
    const scanned = this.state.scanned;
    const buttonState = this.state.buttonState;
    if (buttonState == "clicked" && hasCameraPermissions)
      return (
        <View style={styles.screen}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          <Text style={styles.text}>
            {hasCameraPermissions == true
              ? this.state.scannedData
              : "requestCameraPermissions"}
          </Text>
          <TouchableOpacity
            onPress={this.getCameraPermissions}
            style={styles.button}
          >
            <Text style={styles.text}>Scan QR Code</Text>
          </TouchableOpacity>
        </View>
      );
    else
      return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <View>
            <Image
              source={require("../assets/book.png")}
              style={{ width: 200, height: 200 }}
            />
            <Text style={{ textAlign: "center", fontSize: 30 }}>Willy</Text>
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputBox}
              placeholder="Book Id"
              onChangeText={(text) => this.setState({ scannedBookId: text })}
              value={this.state.scannedBookId}
            />
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => {
                this.getCameraPermissions("BookId");
              }}
            >
              <Text style={styles.buttonText}>Scan</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputBox}
              placeholder="Student ID"
              onChangeText={(text) => this.setState({ scannedStudentId: text })}
              value={this.state.scannedStudentId}
            />
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => {
                this.getCameraPermissions("StudentId");
              }}
            >
              <Text style={styles.buttonText}>Scan</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              var transactionMessage = this.handleTransaction();
              this.setState({
                scannedBookId: "",
                scannedStudentId: "",
              });
            }}
          >
            <Text
              style={{
                color: "#f5f5f5",
                textAlign: "center",
              }}
            >
              Submit
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    background: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  displayText: {
    fontSize: 15,
    textDecorationLine: "underline",
  },
  buttonText: {
    color: "#f5f5f5",
    fontSize: 15,
    textAlign: "center",
    marginTop: 10,
  },
  inputView: {
    backgroundColor: "#050510",
    flexDirection: "row",
    margin: 20,
    borderRadius: 6,
  },
  inputBox: {
    padding: "1rem",
    backgroundColor: "#050510",
    borderRadius: 6,
    width: 200,
    height: 40,
    borderWidth: 1.5,
    borderRightWidth: 0,
    fontSize: 20,
    color: "#f5f5f5",
  },
  scanButton: {
    borderRadius: 6,
    backgroundColor: "#050510",
    width: 50,
    borderWidth: 1.5,
    borderLeftWidth: 0,
  },
  button: {
    borderRadius: 6,
    padding: ".8rem",
    backgroundColor: "#050510",
  },
});
