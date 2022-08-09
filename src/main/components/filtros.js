import React, { Component } from 'react';
import {Platform, ImageBackground, StyleSheet, StatusBar, View, Text, SafeAreaView, Image, Alert, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon, Input, CheckBox } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const tipojoya_list = [
  { value: '', label: '--TODOS--' },
  { value: '10', label: 'ANILLO' },
  { value: '12', label: 'COLGANTE' },
  { value: '13', label: 'ARETES' },
  { value: '14', label: 'CADENA' },
  { value: '16', label: 'JUEGO' },
  { value: '17', label: 'PULSERA' },
  { value: '19', label: 'AROS' },
  { value: '22', label: 'ORTOPEDICOS' },
  { value: '27', label: 'COLLAR' },
  { value: '28', label: '3D SOLITARIO' },
  { value: '29', label: '3D AROS' },
  { value: '30', label: '3D PERSONALIZADO' },
];

const metal_list = [
  { value: '', label: '--ORO COLOR--' },
  { value: '9', label: 'ORO AMARILLO' },
  { value: '10', label: 'ORO BLANCO' },
  { value: '11', label: 'ORO ROJO' },
  { value: '15', label: 'PLATINO' },
  { value: '21', label: 'DOS OROS' },
  { value: '22', label: 'TRES OROS' },
];

const gema_list = [
  { value: '', label: '--GEMA--' },
  { value: 'D', label: 'DIAMANTE' },
  { value: 'R', label: 'RUBI' },
  { value: 'E', label: 'ESMERALDA' },
  { value: 'S', label: 'SAFIRO' },
  { value: 'PL', label: 'PERLA' },
];

export default class SectionListBasics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      inv2:false,
      tipojoya: { value: '', label: '--TODOS--' },
      metal: { value: '', label: '--ORO COLOR--' },
      gema: { value: '', label: '--GEMA--' },
      codigo: '',
      preciod: '',
      precioh: '',

    }
  }

  gotoInventario = () => {
    if (this.state.checked && this.state.tipojoya.value == '') {
      Alert.alert('Debe escoger un tipo de joya');
    }
    else {
      
      this.props.navigation.navigate('Inventario', {
        param_tipojoya: this.state.tipojoya.value,
        param_metal: this.state.metal.value,
        param_gema: this.state.gema.value,
        param_codigo: this.state.codigo,
        param_preciod: this.state.preciod,
        param_precioh: this.state.precioh,
        param_stockmatriz: this.state.checked,
        param_inv2: this.state.inv2
        
      })
    }
  }

  onSelectTodos(item) {
    this.setState({ tipojoya: item, todos: false })
  }
  onSelectMetal(item) {
    this.setState({ metal: item, meta: false })
  }
  onSelectGema(item) {
    this.setState({ gema: item, gem: false })
  }

  renderTipojoya() {
    return (
      <View style={styles.dialog}>
        <View style={[styles.dialogMain, { height: 570 }]}>
          <View style={styles.dialogHeader}>
            <Text style={{ color: '#FFF', fontSize: 20, fontWeight: 'bold' }}>{'Tipo de Joya'}</Text>
          </View>
          <View style={{ width: '90%', marginTop: 20 }}>
            {tipojoya_list.map((item, key) => {
              return (
                <TouchableOpacity style={styles.item} onPress={() => this.onSelectTodos(item)}>
                  <Text>{item.label}</Text>
                  <Icon name='check' type='antdesign' size={20} color={item.value == this.state.tipojoya.value ? '#AD7A32' : '#EEE'} />
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      </View>
    )
  }

  renderMetal() {
    return (
      <View style={styles.dialog}>
        <View style={[styles.dialogMain, { height: 370 }]}>
          <View style={styles.dialogHeader}>
            <Text style={{ color: '#FFF', fontSize: 20, fontWeight: 'bold' }}>{'Metal'}</Text>
          </View>
          <View style={{ width: '90%', marginTop: 20 }}>
            {metal_list.map((item, key) => {
              return (
                <TouchableOpacity style={styles.item} onPress={() => this.onSelectMetal(item)}>
                  <Text>{item.label}</Text>
                  <Icon name='check' type='antdesign' size={20} color={item.value == this.state.metal.value ? '#AD7A32' : '#EEE'} />
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      </View>
    )
  }

  renderGema() {
    return (
      <View style={styles.dialog}>
        <View style={[styles.dialogMain, { height: 330 }]}>
          <View style={styles.dialogHeader}>
            <Text style={{ color: '#FFF', fontSize: 20, fontWeight: 'bold' }}>{'Gema'}</Text>
          </View>
          <View style={{ width: '90%', marginTop: 20 }}>
            {gema_list.map((item, key) => {
              return (
                <TouchableOpacity style={styles.item} onPress={() => this.onSelectGema(item)}>
                  <Text>{item.label}</Text>
                  <Icon name='check' type='antdesign' size={20} color={item.value == this.state.gema.value ? '#AD7A32' : '#EEE'} />
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      </View>
    )
  }

  render() {
    return (
      <ImageBackground source={require('../../../src/assets/images/104.jpg')} style={{ flex: 1 }}>
      {/* <StatusBar translucent backgroundColor="transparent" /> */}
      {/* <LinearGradient
        start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
        colors={['rgba(26, 31, 51, 0.4)', 'rgba(11, 15, 28, 0.5)']}
        style={styles.gradient}
      /> */}
        <View style={{ height: 50 }} />
        {this.state.todos ? this.renderTipojoya() :
          this.state.meta ? this.renderMetal() :
            this.state.gem ? this.renderGema() :
              <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
                <KeyboardAwareScrollView contentContainerStyle={{ width: wp('100.0%'), alignItems: 'center' }}>
                
                  <CheckBox
                    containerStyle={Platform.isPad == true ? { with: wp('80%'), marginTop: 50, backgroundColor: 'tranparent' } : { with: wp('80%'), backgroundColor: 'tranparent' }}
                    textStyle={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}
                    checkedColor={'black'}
                    title='Stock Matriz'
                    checked={this.state.checked}
                    onPress={() => this.setState({ checked: !this.state.checked })}
                  />

                  <CheckBox
                    containerStyle={Platform.isPad == true ? { with: wp('80%'), marginTop: 50, backgroundColor: 'tranparent' } : { with: wp('80%'), backgroundColor: 'tranparent' }}
                    textStyle={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}
                    checkedColor={'black'}
                    title='Stock 2'
                    checked={this.state.inv2}
                    onPress={() => this.setState({ inv2: !this.state.inv2 })}
                  />
                  
                  {/* <TouchableOpacity style={styles.inputView}
                    onPress={() => this.setState({ checked: !this.state.checked })}>
                    <Icon name={this.state.checked ? 'checkcircle' : 'checkcircleo'} type='antdesign' size={25} color='#FFF' />
                    <Text style={{ color: '#FFF', fontSize: 20, fontWeight: 'bold' }}>Stock Matriz</Text>
                    <View />
                  </TouchableOpacity> */}
                  <TouchableOpacity style={styles.inputView} onPress={() => { this.setState({ todos: true }) }}>
                    <View />
                    <Text style={{ color: '#FFF', fontSize: 20, fontWeight: 'bold' }}>{this.state.tipojoya.label}</Text>
                    <Icon name='md-arrow-dropdown' type='ionicon' size={25} color='#FFF' />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.inputView} onPress={() => { this.setState({ meta: true }) }}>
                    <View />
                    <Text style={{ color: '#FFF', fontSize: 20, fontWeight: 'bold' }}>{this.state.metal.label}</Text>
                    <Icon name='md-arrow-dropdown' type='ionicon' size={25} color='#FFF' />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.inputView} onPress={() => { this.setState({ gem: true }) }}>
                    <View />
                    <Text style={{ color: '#FFF', fontSize: 20, fontWeight: 'bold' }}>{this.state.gema.label}</Text>
                    <Icon name='md-arrow-dropdown' type='ionicon' size={25} color='#FFF' />
                  </TouchableOpacity>
                  <View style={styles.inputView}>
                    <Input
                      ref={input => (this.codigoInput = input)}
                      editable={true}
                      placeholder={"Codigo"}
                      placeholderTextColor={'rgba(255, 255, 255, 0.5)'}
                      keyboardType={'numeric'}
                      secureTextEntry={false}
                      blurOnSubmit={false}
                      value={this.state.codigo}
                      onSubmitEditing={() => { this.preciodInput.focus() }}
                      onChangeText={(text) => this.setState({ codigo: text })}
                      inputContainerStyle={styles.inputContainerStyle}
                      inputStyle={{ color: '#FFF' }}
                    />
                  </View>
                  <View style={styles.inputView}>
                    <Input
                      ref={input => (this.preciodInput = input)}
                      editable={true}
                      placeholder={"Precio Desde"}
                      placeholderTextColor={'rgba(255, 255, 255, 0.5)'}
                      keyboardType={'numeric'}
                      secureTextEntry={false}
                      blurOnSubmit={false}
                      value={this.state.preciod}
                      onSubmitEditing={() => { this.preciohInput.focus() }}
                      onChangeText={(text) => this.setState({ preciod: text })}
                      inputContainerStyle={styles.inputContainerStyle}
                      inputStyle={{ color: '#FFF' }}
                    />
                  </View>
                  <View style={styles.inputView}>
                    <Input
                      ref={input => (this.preciohInput = input)}
                      editable={true}
                      placeholder={"Precio Hasta"}
                      placeholderTextColor={'rgba(255, 255, 255, 0.5)'}
                      keyboardType={'numeric'}
                      secureTextEntry={false}
                      blurOnSubmit={false}
                      value={this.state.precioh}
                      onChangeText={(text) => this.setState({ precioh: text })}
                      inputContainerStyle={styles.inputContainerStyle}
                      inputStyle={{ color: '#FFF' }}
                    />
                  </View>
                  <TouchableOpacity style={styles.button} onPress={() => this.gotoInventario()} >
                    <Text style={{ color: '#FFF', fontSize: 20, fontWeight: 'bold' }}>Filtrar</Text>
                  </TouchableOpacity>
                  <View style={{ height: 50 }} />
                </KeyboardAwareScrollView>
              </SafeAreaView>}
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    position: 'absolute',
    width: wp('100.0%'),
    height: hp('100.0%'),
    alignItems: 'center'
  },
  inputView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.isPad == true ? 50 : 20,
    paddingLeft: 20,
    paddingRight: 20,
    width: Platform.isPad == true ? wp('60.0%') : wp('80%'),
    height: 50,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#888888',
    // backgroundColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowOffset: { height: 1, width: 1 },
    shadowRadius: 2,
    elevation: 10,
    zIndex: 500
  },
  dialog: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('100.0%'),
    height: hp('100.0%'),
    backgroundColor: '#000000BF'
  },
  dialogMain: {
    alignItems: 'center',
    width: Platform.isPad == true ? '60%' : '80%',
    backgroundColor: '#FFF',
    zIndex: 1000,
    borderRadius: 20
  },
  dialogHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#AD7A32',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.9,
    shadowOffset: { height: 2, width: 1 },
    shadowRadius: 5,
    elevation: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 35,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#AD7A32',
    marginBottom: 5
  },
  inputContainerStyle: {
    marginTop: 25,
    borderBottomWidth: 0,
    borderBottomColor: '#000'
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    paddingLeft: 20,
    paddingRight: 20,
    width: Platform.isPad == true ? wp('60.0%') : wp('80%'),
    height: 50,
    borderRadius: 10,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowOffset: { height: 1, width: 1 },
    shadowRadius: 2,
    elevation: 5,
  },



  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  caja: {
    borderWidth: 1,
    borderColor: 'black',
    paddingLeft: 50,
    marginTop: 20,
    marginLeft: 80,
    marginRight: 80,
    borderRadius: 5,
    color: 'black'
  },
})