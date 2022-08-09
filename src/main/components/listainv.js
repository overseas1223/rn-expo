import React, { Component } from "react";
import {
  Platform,
  Text,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  Container,
  Header,
  Body,
  Right,
  Left,
  Title,
  Toast,
  Button,
  View,
} from "native-base";
import { Icon } from "react-native-elements";
import * as Sharing from "expo-sharing";
import Spinner from "react-native-loading-spinner-overlay";
import { getSetting, setSetting } from "../../../storage/settingsStorage";
import { Root } from "native-base";
import * as FileSystem from "expo-file-system";
import Modal from "react-native-modal";
import { Linking } from 'react-native';
const GLOBALS = require("../globals");

class Listinv extends Component {
  state = {
    spinner: false, // variable para informar si se esta cargando
    isMultiple: false, // saber si es seleccion multiple
    isModalVisible: false, // para saber la ventana modal esta desplegada
    joyacodigo: "",
    joyanombre: "",
    joyaprecio: "",
    joyagemas: "",
    joyaFoto: "",
    joyaVideo: "",
    clientecodigo: "",
  };

  constructor(props) {
    super(props);
    this.offset = 0;
  }

  /// cuando el componente se ejecuta
  async componentDidMount() {
    this.setState({
      // variables de estado
      spinner: true,
      categories: [],
      selcategories: [],
      viewableItems: [],
      selNumber: 0,
      isVisible: false,
      mobile_no: '593884712317',
      msg: '',
    });
    this.fetchCategories(); // recuperamos los registros
  }

  incrementar = () => {
    this.setState({
      viewableItems: this.state.categories.slice(
        this.offset * 15,
        (this.offset + 1) * 15 - 1
      ),
    });
    this.offset = this.offset + 1;
    console.log(this.state.viewableItems);
  };

  recortar = () => {
    this.offset = this.offset - 2;
    this.setState({
      viewableItems: this.state.categories.slice(
        this.offset * 15,
        (this.offset + 1) * 15 - 1
      ),
    });
    console.log(this.state.viewableItems);
  };
  sendOnWhatsApp=() => {
    console.log('WhatsApp');
    let msg = 'Cod:' + this.state.joyacodigo + '  Pvp:' + this.state.joyaprecio + '  Nombre:' + this.state.joyanombre;
    
      if(msg){
        let url = 'whatsapp://send?text=' + msg;
        Linking.openURL(url).then((data) => {
          console.log('WhatsApp Opened');
        }).catch(() => {
          alert('Make sure Whatsapp installed on your device');
        });
      }else{
        alert('Please insert message to send');
      }

  }
  async getitem() {
    this.setState({
      clientecodigo: await getSetting(GLOBALS.consts.CLIENTE_CODIGO),
    });
  }

  fetchCategories = async function () {
    var self = this;
    //console.log('param',this.props.navigation.state.params)
    await this.getitem();
    
    var accessToken = await getSetting(GLOBALS.consts.SETTING_TOKEN);
    console.log("inventory", accessToken);
    fetch(GLOBALS.api.wsInventario_url, {
      //recuperamos con el api rest
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": accessToken,
      },
      body: JSON.stringify({
        tipojoyacodigo: this.props.navigation.state.params.param_tipojoya, // son los parametros
        Metalcodigo: this.props.navigation.state.params.param_metal,
        Gemacodigo: this.props.navigation.state.params.param_gema,
        Joyacodigo: this.props.navigation.state.params.param_codigo,
        D_joyaprecio: this.props.navigation.state.params.param_preciod,
        H_joyaprecio: this.props.navigation.state.params.param_precioh,
        Invexi: this.props.navigation.state.params.param_stockmatriz
          ? "S"
          : "N",
        Invcon: this.props.navigation.state.params.param_inv2
        ? "S"
        : "N",
        //"tipojoyacodigo":''  // son los parametros
      }),
    })
      .then((response) => response.text())
      .then((responseJson) => {
        setTimeout(async function () {
          self.setState({
            spinner: false,
          });
        }, 300);
        const responseRes = JSON.parse(responseJson);
        console.log(responseRes.inventario);
        if (responseRes.inventario) {
          if(responseRes.inventario.length) {
            self.setState({ categories: responseRes.inventario }); // ponemos en el inventario de las variables de estado el json
            this.incrementar();
          }  else {
            Toast.show({
              text: "no_categories_info",
              buttonText: "Close",
            });
          }
        } else {
          Toast.show({
            text: "Token Expired",
            buttonText: "Close",
          });
          setSetting(GLOBALS.consts.SETTING_TOKEN, null).then(() => {
            this.props.navigation.navigate('Inicio'); 
          }).catch((err) => {
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

  onSelectCategory = (codigo, nombre, url) => {
    var ext = url.slice(-3);
    FileSystem.downloadAsync(
      url,
      FileSystem.documentDirectory + codigo + "." + ext
    )
      .then(({ uri }) => {
        Sharing.shareAsync(uri, { dialog: "nombre" });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  openModal = (data) => {
    // abrimos la ventana modal
    if (!this.state.isMultiple) {
      console.log("data", data);
      this.setState({
        isModalVisible: true,
        joyacodigo: data.Codigo,
        joyanombre: data.Nombre,
        joyaFoto: data.Foto,
        joyaVideo: data.Video,
        joyaprecio: data.Precio,
      });
      console.log("state", this.state.joyaFoto);
    } else {
      this.selectItem(data);
    }
  };

  toggleModal = () => {
    this.setState({
      isModalVisible: !this.state.isModalVisible,
    });
  };

  closeModal = () => {
    this.setState({
      isModalVisible: false,
    });
  };

  selectItem = (data) => {
    // si seleccionamos un item

    this.setState({ isMultiple: true });
    data.isSelect = !data.isSelect; // si no estaba seleccionado ponemos en true
    data.selectedClass = data.isSelect ? styles.selected : styles.list;
    const index = this.state.categories.findIndex(
      // lo buscamos en el arreglo
      (item) => data.Codigo === item.Codigo
    );

    this.state.categories[index] = data; // le actualizamos
    this.setState({
      categories: this.state.categories, // actualizamos el estado
    });
    this.setState({
      selcategories: this.state.categories.filter(
        (item) => item.isSelect == true
      ), // actualizamos el vector de los seleccionados
      selNumber: this.state.categories.filter((item) => item.isSelect == true)
        .length, // es  un contador para saber cuantos estan seleccionados
    });
    // console.log(this.state.categories)
  };

  _renderOneCategory = ({ item }) => (
    // es el estilo para cada registr
    <TouchableOpacity
      style={[styles.list, item.selectedClass]}
      onPress={() => this.openModal(item)}
      onLongPress={() => this.selectItem(item)}
    >
      <Text style={styles.joya}>
        {item.Precio} {item.Gemas}
      </Text>
      <Image
        source={{ uri: item.Foto }}
        style={{ height: 100, width: 100, flex: 1, borderRadius: 1 }}
      />
    </TouchableOpacity>
  );

  async shareSelected() {
    console.log("selected", this.state.selcategories);
    var ext = "";
    var listFotos = this.state.selcategories.map(async (categorie) => {
      ext = categorie.Foto.slice(-3);
      await FileSystem.downloadAsync(
        categorie.Foto,
        FileSystem.documentDirectory + categorie.Codigo + "." + ext
      )
        .then(({ uri }) => {
          console.log(uri);
          var archivo = FileSystem.readAsStringAsync(uri);
          return archivo;
          // return
        })
        .catch((error) => {
          console.error(error);
        });
    });
    console.log("selected", listFotos);
  }

  renderCategories = () => (
    // estilo para la flat list
    <FlatList
      contentContainerStyle={{ backgroundColor: "#FFF", alignItems: "center" }}
      numColumns={Platform.isPad == true ? 3 : 2}
      data={this.state.viewableItems}
      renderItem={({ item, index }) => {
        return (
          <TouchableOpacity
            style={styles.itemStyle}
            onPress={() => this.openModal(item)}
            onLongPress={() => this.selectItem(item)}
          >
            <Image
              source={{ uri: item.Foto }}
              style={{ height: 120, width: "90%"}}
              resizeMode="cover"
            />
            <Text style={{ fontSize: 18 }}>{item.Precio}</Text>
            <Text style={{ fontSize: 12 }}>{item.Gemas}</Text>
          </TouchableOpacity>
        );
      }}
    />
    // <FlatList data={this.state.viewableItems}
    //   renderItem={({ item }) => this._renderOneCategory({ item })} numColumns={2} refreshing={true}
    //   keyExtractor={item => item.Codigo}
    //   ListFooterComponent={this.renderFooter.bind(this)}
    // >
    // </FlatList>
  );

  renderFooter() {
    return (
      //Footer View with Load More button
      <View
        style={{
          width: wp("100%"),
          height: 50,
          flexDirection: "row",
          justifyContent: "space-between",
          paddingLeft: 20,
          paddingRight: 20,
        }}
      >
        <TouchableOpacity style={styles.button} onPress={this.recortar}>
          <Text style={{ color: "#000", fontSize: 18 }}>Anterior</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={this.incrementar}>
          <Text style={{ color: "#000", fontSize: 18 }}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const seleccionadas = this.state.selNumber;
    //console.log('param',this.props.navigation.state.params.param_tipojoya)
    return (
      <Root>
        <Container>
          <StatusBar translucent backgroundColor="transparent" />
          <Header
            style={{
              backgroundColor: "#fff",
              height: 100,
              justifyContent: "flex-end",
            }}
            noShadow
          >
            <Left style={{ flex: 1 }}>
              <Icon
                name="md-arrow-back"
                type="ionicon"
                size={25}
                onPress={() => this.props.navigation.goBack()}
              />
            </Left>
            <Body style={{ flex: 8, alignItems: "center" }}>
              <Title style={{ color: "#000" }}>INVENTARIO</Title>
            </Body>
            <Right style={{ flex: 1 }}>
              <Icon name="search" />
            </Right>
          </Header>
          <Spinner
            visible={this.state.spinner}
            textContent={""}
            textStyle={styles.spinnerTextStyle}
          />
          {this.renderFooter()}
          {this.renderCategories()}
          <View style={styles.numberBox}>
            <Text style={styles.number}>{seleccionadas}</Text>
          </View>
          <TouchableOpacity style={styles.icon}>
            <View>
              <Icon
                raised
                name="share"
                type="font-awesome"
                color="#e3e3e3"
                size={30}
                onPress={() => this.shareSelected()}
                containerStyle={{ backgroundColor: "#FA7B5F" }}
              />
            </View>
          </TouchableOpacity>
          <Modal
            animationIn="slideInUp"
            animationOut="slideOutDown"
            onBackdropPress={() => this.closeModal()}
            onSwipeComplete={() => this.closeModal()}
            swipeDirection="right"
            isVisible={this.state.isModalVisible}
            style={Platform.isPad == true ? {
              marginLeft: wp("20.0%"),
              justifyContent: "flex-start",
              backgroundColor: "white",
              borderRadius: 20,
              maxWidth: wp("60.0%"),
              top: 200,
              maxHeight: hp("50.0%")} : {
              justifyContent: "flex-start",
              backgroundColor: "white",
              borderRadius: 20,
              maxWidth: wp("90.0%"),
              top: 50,
              maxHeight: hp("70.0%")
            }}
          >
            <View style={styles.dialogHeader}>
              <Text style={{ color: "#FFF", fontSize: 20, fontWeight: "bold" }}>
                {"Detail"}
              </Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  width: "90%",
                  padding: 20,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 20 }}>{this.state.joyacodigo}</Text>
                <Text
                  style={{ color: "#FF0000", fontSize: 20, fontWeight: "bold" }}
                >
                  {this.state.joyaprecio}
                </Text>
              </View>
              <Image
                source={{ uri: this.state.joyaFoto }}
                style={{ marginTop: 10, height: 250, width: 250 }}
              />
              <View
                style={{
                  flexDirection: "row",
                  width: Platform.isPad == true ? wp("50.0%") : wp("90.0%"),
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text>Foto</Text>
                  <Icon
                    color="#f50"
                    raised
                    name="share"
                    onPress={() =>
                      this.onSelectCategory(
                        this.state.joyacodigo,
                        this.state.joyanombre,
                        this.state.joyaFoto
                      )
                    }
                  ></Icon>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text>Video</Text>
                  <Icon
                    color="#f50"
                    raised
                    name="share"
                    onPress={() =>
                      this.onSelectCategory(
                        this.state.joyacodigo,
                        this.state.joyanombre,
                        this.state.joyaVideo
                      )
                    }
                  ></Icon>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text>ws</Text>
                  <Icon  color='#f50' raised name='whatsapp' onPress={() => this.sendOnWhatsApp()}></Icon>
                </View>
              </View>
            </View>
          </Modal>
        </Container>
      </Root>
    );
  }
}
// estilos

const styles = StyleSheet.create({
  viewStyles: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f2e724",
  },
  textStyles: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
  },
  joya: {
    fontSize: 11,
    color: "red",
    justifyContent: "flex-start",
  },
  selected: { backgroundColor: "#FA7B5F" },
  list: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#192338",
    zIndex: -1,
  },
  numberBox: {
    position: "absolute",
    bottom: 75,
    width: 30,
    height: 30,
    borderRadius: 15,
    left: 330,
    zIndex: 3,
    backgroundColor: "#e3e3e3",
    justifyContent: "center",
    alignItems: "center",
  },
  number: { fontSize: 14, color: "#000" },
  icon: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    left: 290,
    zIndex: 1,
  },
  footer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  loadMoreBtn: {
    padding: 5,
    backgroundColor: "#800000",
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "black",
    fontSize: 15,
    textAlign: "center",
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // paddingLeft: 20,
    // paddingRight: 20,
    width: wp("40%"),
    height: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#AD7A32",
    // shadowColor: '#FFF',
    // shadowOpacity: 0.8,
    // shadowOffset: { height: 1, width: 1 },
    // shadowRadius: 1,
    // elevation: 1,
  },
  itemStyle: {
    justifyContent: "center",
    alignItems: "center",
    width: Platform.isPad == true ? wp("30.0%") : wp("46%"),
    margin: wp("2%"),
    height: 200,
    backgroundColor: "#FFF",
    borderColor: "#000",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowOffset: { height: 1, width: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  dialog: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: wp("100.0%"),
    height: hp("100.0%"),
    backgroundColor: "#000000BF",
  },
  dialogMain: {
    alignItems: "center",
    width: "80%",
    backgroundColor: "#FFF",
    zIndex: 1000,
    borderRadius: 20,
  },
  dialogHeader: {
    marginTop: 0,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 50,
    backgroundColor: "#AD7A32",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.9,
    shadowOffset: { height: 2, width: 1 },
    shadowRadius: 5,
    elevation: 10,
  },
});

export default Listinv;
