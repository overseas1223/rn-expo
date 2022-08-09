import React, { Component } from "react";
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { View, Text, StyleSheet, Image, ImageBackground } from "react-native";
import { getSetting, setSetting } from "../../../storage/settingsStorage";
import Spinner from "react-native-loading-spinner-overlay";
import {
  Root,
  Toast,
} from "native-base";
const GLOBALS = require("../globals");

export default class SectionListBasics extends Component {
  state = {
    spinner: false,
    stores: [],
  };

  async componentDidMount() {
    this.setState({
      // variables de estado
      spinner: true,
      stores: [],
    });
    this.fetchStores();
  }

  fetchStores = async function () {
    var self = this;

    var accessToken = await getSetting(GLOBALS.consts.SETTING_TOKEN);
    fetch(GLOBALS.api.wsGetStore_url, {
      //recuperamos con el api rest
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
    })
      .then((response) => response.text())
      .then((responseJson) => {
        setTimeout(async function () {
          self.setState({
            spinner: false,
          });
        }, 300);
        const responseRes = JSON.parse(responseJson);
        if (responseRes.stores) {
          if (responseRes.stores.length) {
            self.setState({ stores: responseRes.stores }); // ponemos en el inventario de las variables de estado el json
            console.log(this.state.stores);
          } else {
            Toast.show({
              text: "no_Stores_info",
              buttonText: "Close",
            });
          }
        } else {
          Toast.show({
            text: "Token Expired",
            buttonText: "Close",
          });
          setSetting(GLOBALS.consts.SETTING_TOKEN, null)
            .then(() => {
              this.props.navigation.navigate("Inicio");
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((error) => {
        console.log(error);
        setTimeout(async function () {
          self.setState({
            spinner: false,
          });
        }, 1000);
        Toast.show({
          text: "unknown_error",
          buttonText: "Close",
        });
      });
  };

  renderStores = () => (
    <FlatList
      style={styles.library_component}
      data={this.state.stores}
      renderItem={({ item, index }) => {
        return (
          <TouchableOpacity
            style={styles.image_touchable}
            onPress={() => this.gotoStore()}
          >
            <ImageBackground
              style={styles.library_background}
              source={{ uri: item.storeUlrImage }}
              borderRadius={10}
              resizeMode="cover"
            >
              <View style={styles.library_shadow}>
                <Text style={styles.item_text}>{item.storeName}</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        );
      }}
    />
  );

  gotoStore = async () => {
    var self = this;

    var accessToken = await getSetting(GLOBALS.consts.SETTING_TOKEN);
    fetch(GLOBALS.api.wsGetStore_url, {
      //recuperamos con el api rest
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
    })
      .then((response) => response.text())
      .then((responseJson) => {
        setTimeout(async function () {
          self.setState({
            spinner: false,
          });
        }, 300);
        const responseRes = JSON.parse(responseJson);
        if (responseRes.stores) {
          if (responseRes.stores.length) {
            this.props.navigation.navigate("Filtro");
          } else {
            Toast.show({
              text: "no_Stores_info",
              buttonText: "Close",
            });
          }
        } else {
          Toast.show({
            text: "Token Expired",
            buttonText: "Close",
          });
          setSetting(GLOBALS.consts.SETTING_TOKEN, null)
            .then(() => {
              this.props.navigation.navigate("Inicio");
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((error) => {
        console.log(error);
        setTimeout(async function () {
          self.setState({
            spinner: false,
          });
        }, 1000);
        Toast.show({
          text: "unknown_error",
          buttonText: "Close",
        });
      });
  };

  render() {
    return (
      <Root>
      <View style={styles.body}>
        <ImageBackground
          source={require("../../../assets/splash.png")}
          style={styles.body_background}
        >
          <View style={styles.body_header}></View>
          <View style={styles.body_content}>
            <ScrollView style={styles.library_component}>
             <Spinner
                visible={this.state.spinner}
                textContent={""}
                textStyle={styles.spinnerTextStyle}
              />
              {this.renderStores()}
            </ScrollView>
          </View>
        </ImageBackground>
      </View>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },

  body_background: {
    flex: 1,
  },

  body_header: {
    flex: 3,
    borderBottomWidth: 1,
    borderBottomColor: "#d2d2d2",
  },

  body_content: {
    flex: 25,
  },

  image_touchable: {
    backgroundColor: "powderblue",
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 5,
  },

  library_component: {
    width: "95%",

    marginLeft: "auto",
    marginRight: "auto",
  },

  library_shadow: {
    height: 103,
    backgroundColor: "rgba(52, 52, 52, 0.6)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },

  library_background: {
    borderRadius: 10,
    flex: 1,
  },

  item_text: {
    textAlign: "center",
    color: "#fafafa",
    fontFamily: "TheNautigal-Bold",
    fontWeight: "bold",
  },
});
