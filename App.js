import React from "react";
import { Image } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import TransactionScreen from "./screens/BookTransactionScreen";
import SearchScreen from "./screens/SearchScreen";
import AuthScreen from "./screens/LoginScreen";
import LoginScreen from "./screens/LoginScreen";
export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}

const TabNavigator = createBottomTabNavigator(
  {
    Transaction: { screen: TransactionScreen },
    Search: { screen: SearchScreen },
    Auth: { screen: AuthScreen },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: () => {
        const routeName = navigation.state.routeName;
        if (routeName == "Transaction") {
          return (
            <Image
              source={require("./assets/book.png")}
              style={{ width: 32, height: 32 }}
            />
          );
        } else if (routeName == "Search") {
          return (
            <Image
              source={require("./assets/search.png")}
              style={{ width: 32, height: 32 }}
            />
          );
        }
      },
    }),
  }
);
const SwitchNavigator = createSwitchNavigator({
  LoginScreen: {
    screen: AuthScreen,
  },
  TabNavigator: {
    screen: TabNavigator,
  },
});
const AppContainer = createAppContainer(SwitchNavigator);
