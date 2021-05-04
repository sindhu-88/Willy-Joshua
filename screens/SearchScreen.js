import React from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import db from "../config";
export default class Searchscreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allTrasactions: [],
      lastVisibleTrasactions: null,
      search: "",
    };
  }
  componentDidMount = async () => {
    const query = await db.collection("transaction").get();
    query.docs.map((doc) => {
      this.setState({
        allTrasactions: [...this.state.allTrasactions, doc.data()],
      });
    });
  };
  fetchMoreTransactions = async () => {
    var text = this.state.search.toUpperCase();
    var enteredText = text.split("");
    if (enteredText[0].toUpperCase() == "B") {
      const query = await db
        .collection("transactions")
        .where("bookId", "==", text)
        .startAfter(this.state.lastVisibleTransaction)
        .limit(10)
        .get();
      query.docs.map((doc) => {
        this.setState({
          allTransactions: [...this.state.allTransactions, doc.data()],
          lastVisibleTransaction: doc,
        });
      });
    } else if (enteredText[0].toUpperCase() == "S") {
      const query = await db
        .collection("trasactions")
        .startAfter(this.state.lastVisibleTrasactions)
        .limit(10)
        .get();
      query.docs.map((doc) => {
        this.setState({
          allTrasactions: [...this.state.allTrasactions, doc.data()],
          lastVisibleTrasactions: doc,
        });
      });
    }
  };
  searchTransaction = async (text) => {
    var text = this.state.text.toUpperCase();
    var enteredText = text.split("");
    if (enteredText[0].toUpperCase() == "B") {
      const query = await db
        .collection("transactions")
        .where("bookId", "==", text)
        .startAfter(this.state.lastVisibleTransaction)
        .limit(10)
        .get();
      query.docs.map((doc) => {
        this.setState({
          allTransactions: [...this.state.allTransactions, doc.data()],
          lastVisibleTransaction: doc,
        });
      });
    } else if (enteredText[0].toUpperCase() == "S") {
      const query = await db
        .collection("transactions")
        .where("bookId", "==", text)
        .startAfter(this.state.lastVisibleTransaction)
        .limit(10)
        .get();
      query.docs.map((doc) => {
        this.setState({
          allTransactions: [...this.state.allTransactions, doc.data()],
          lastVisibleTransaction: doc,
        });
      });
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.searchBar}>
          <TextInput
            placeholder="Enter Book ID or student ID"
            style={styles.bar}
            onChangeText={(text) => {
              this.setState({
                search: text,
              });
            }}
          ></TextInput>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => {
              this.searchTransactions(this.state.search);
            }}
          >
            <Text>Search</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          style={{ padding: "1rem", backgroundColor: "yellow" }}
          data={this.state.allTrasactions}
          renderItem={({ item }) => (
            <View
              style={{
                margin: ".5rem",
                borderColor: "black",
                borderBottomWidth: 2,
                borderRadius: "6px",
                padding: ".5rem",
                backgroundColor: "aqua",
              }}
            >
              <Text>Book : {item.bookId}</Text>
              <Text>Student : {item.studentId}</Text>
              <Text>Issue / Return : {item.type}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={this.fetchMoreTransactions}
          onEndReachedThreshold={0.5}
        ></FlatList>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 20 },
  searchBar: {
    flexDirection: "row",
    height: 40,
    width: "auto",
    borderWidth: 0.5,
    alignItems: "center",
    // backgroundColor: "",
  },
  bar: { borderWidth: 2, height: 30, width: 300, paddingLeft: 10 },
  searchButton: {
    borderWidth: 1,
    height: 30,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "green",
  },
});
