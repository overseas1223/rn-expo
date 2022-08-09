import React, { Component } from "react";
import { useCallback } from "react";
import {
  Platform,
  StyleSheet,
  View,
  Text,
  Linking,
  TextInput,
  ImageBackground,
  Image,
  SafeAreaView,
  Dimensions,
  Animated,
  Keyboard,
  UIManager,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Icon, Input } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-easy-toast";
import { getSetting, setSetting } from "../../../storage/settingsStorage";

const GLOBALS = require("../globals");
const { State: TextInputState } = TextInput;

class login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
      shift: new Animated.Value(0),
      clientecodigo: "",
    };
  }

  gotoMain = () => {
    this.props.navigation.navigate("Store");
  };

  async componentDidMount() {
    this.keyboardDidShowSub = Keyboard.addListener(
      "keyboardDidShow",
      this.handleKeyboardDidShow
    );
    this.keyboardDidHideSub = Keyboard.addListener(
      "keyboardDidHide",
      this.handleKeyboardDidHide
    );
    var accessToken = await getSetting(GLOBALS.consts.SETTING_TOKEN);
    console.log(accessToken);
    if (accessToken) this.props.navigation.navigate("Store");
  }

  componentWillUnmount() {
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();
  }

  handleKeyboardDidShow = (event) => {
    const { height: windowHeight } = Dimensions.get("window");
    const keyboardHeight = event.endCoordinates.height;
    const currentlyFocusedField = TextInputState.currentlyFocusedField();
    UIManager.measure(
      currentlyFocusedField,
      (originX, originY, width, height, pageX, pageY) => {
        const fieldHeight = height;
        const fieldTop = pageY;
        const gap =
          windowHeight - keyboardHeight - (fieldTop + fieldHeight) - 80;
        if (gap >= 0) {
          return;
        }
      }
    );
  };

  handleKeyboardDidHide = () => {};

  onLogin = () => {
    if (!this.state.usuario || this.state.usuario === "") {
      this.refs.toast.show("Invalid email");
      return;
    }

    if (!this.state.password || this.state.password === "") {
      this.refs.toast.show("Invalid password");
      return;
    }

    this.setState({
      spinner: true,
    });

    var self = this;
    fetch(GLOBALS.api.login, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=${GLOBALS.auth.grant_type}&client_id=${GLOBALS.auth.client_id}&client_secret=${GLOBALS.auth.cleint_secret}&username=${this.state.usuario}&password=${this.state.password}&scope=${GLOBALS.auth.scope}`,
    })
      .then((response) => response.text())
      .then((resp) => {
        var responseJson = JSON.parse(resp);
        var accessToken = responseJson.access_token;

        setTimeout(async function () {
          self.setState({
            spinner: false,
          });
        }, 300);

        if (accessToken) {
          setTimeout(async function () {
            //setSetting(GLOBALS.consts.CLIENTE_CODIGO, this.state.clientecodigo);
            await setSetting(GLOBALS.consts.SETTING_TOKEN, accessToken);
            // await setSetting(GLOBALS.consts.EXPIRATION_TIME, )

            var token = await getSetting(GLOBALS.consts.SETTING_TOKEN);
            console.log(token);
          }, 0);
          this.refs.toast.show("Login success", 1000, () => {
            self.gotoMain();
          });
        } else {
          this.refs.toast.show("ERROR!!!");
        }
      })
      .catch((error) => {
        setTimeout(async function () {
          self.setState({
            spinner: false,
          });
        }, 1000);
        console.log(error);
        self.refs.toast.show(error);
      });
  };

  render() {
    return (
      <ImageBackground
        source={require("../../../src/assets/images/login.jpg")}
        resizeMode="cover"
        style={{ width: wp("100%"), height: Dimensions.height, flex: 1 }}
      >
        {/* <StatusBar translucent backgroundColor="transparent" /> */}
        {/* <LinearGradient
                start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                colors={['rgba(26, 31, 51, 0.4)', 'rgba(11, 15, 28, 0.5)']}
                style={styles.gradient}
            /> */}

        <SafeAreaView style={{ flex: 1, alignItems: "center" }}>
          <KeyboardAwareScrollView
            contentContainerStyle={{
              width: wp("100.0%"),
              height: hp("100%"),
              alignItems: "center",
            }}
          >
            <Text
              style={[
                styles.title,
                {
                  marginTop: 250,
                  fontFamily: "TheNautigal-Bold",
                  opacity: 0.6,
                },
              ]}
            >
              {" "}
              {"MYSTOK"}{" "}
            </Text>
            <View style={styles.inputView}>
              <Icon name="user" type="font-awesome" size={25} color="#555" />
              <Input
                editable={true}
                placeholder={"Usuario"}
                placeholderTextColor={"rgba(50, 50, 50, 0.5)"}
                keyboardType={"default"}
                secureTextEntry={false}
                blurOnSubmit={false}
                autoCapitalize="none"
                value={this.state.usuario}
                onSubmitEditing={() => {
                  this.passwordInput.focus();
                }}
                onChangeText={(text) => this.setState({ usuario: text })}
                inputContainerStyle={styles.inputContainerStyle}
                inputStyle={{ color: "#FFF" }}
              />
            </View>
            <View style={styles.inputView}>
              <Icon name="lock" type="font-awesome" size={25} color="#555" />
              <Input
                ref={(input) => (this.passwordInput = input)}
                editable={true}
                placeholder={"Password"}
                placeholderTextColor={"rgba(50, 50, 50, 0.5)"}
                keyboardType={"default"}
                secureTextEntry={true}
                blurOnSubmit={false}
                value={this.state.password}
                onChangeText={(text) => this.setState({ password: text })}
                inputContainerStyle={styles.inputContainerStyle}
                inputStyle={{ color: "#FFF" }}
              />
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.onLogin()}
            >
              <Text style={{ color: "#FFF", fontSize: 20, fontWeight: "bold" }}>
                Login
              </Text>
            </TouchableOpacity>
            <OpenURLButton url={GLOBALS.api.signup}>SignUp</OpenURLButton>

            {/* <Text style={{ position: 'absolute', width: wp('100.0%'), textAlign: 'center', bottom: 20 }}>Todos los derechos reservado</Text> */}
            <Toast
              ref="toast"
              style={{ marginTop: 100, backgroundColor: "#EEEEEE" }}
              textStyle={{ color: "#000" }}
              positionValue={200}
              fadeInDuration={750}
              fadeOutDuration={1000}
              opacity={0.8}
            />
          </KeyboardAwareScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }
}

const OpenURLButton = ({ url, children }) => {
  const handlePress = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Text style={{ color: "#FFF", fontSize: 20, fontWeight: "bold" }}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    position: "absolute",
    width: wp("100.0%"),
    height: hp("100.0%"),
    alignItems: "center",
  },
  title: {
    marginTop: 50,
    // fontFamily: "Roboto-Regular",
    fontSize: 40,
    fontWeight: "bold",
    color: "black",
  },
  inputView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    width: Platform.isPad == true ? wp("60.0%") : wp("80%"),
    height: 50,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#888888",
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowOffset: { height: 1, width: 1 },
    shadowRadius: 2,
    elevation: 10,
    // backgroundColor: '#EEEEEE',
  },
  inputContainerStyle: {
    marginTop: 25,
    borderBottomWidth: 0,
    borderBottomColor: "#000",
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    paddingLeft: 20,
    paddingRight: 20,
    width: Platform.isPad == true ? wp("60.0%") : wp("80%"),
    height: 50,
    borderRadius: 10,
    backgroundColor: "rgba(52, 52, 52, 0.8)",
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowOffset: { height: 1, width: 1 },
    shadowRadius: 2,
    elevation: 5,
  },
});

export default login;
