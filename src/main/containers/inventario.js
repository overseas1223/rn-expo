import React, { Component } from 'react';
import { Alert, View, ActivityIndicator } from 'react-native';
import { Container, Content, List, Text } from 'native-base';
import ListInv from '../components/listainv'

import { getinventario} from '../services/inventario'


class inventario extends Component{
    constructor(props){
        super(props);
        this.state = {
          isloading: true,
          data: null
        }
    }
    
    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
      }
      componentDidCatch(error, info) {
        // You can also log the error to an error reporting service
        logErrorToMyService(error, info);
      }
    
    componentDidMount(){
        getinventario().then(data =>{
            this.setState({
                isloading:false,
                data:data
            });


    }), error => {
        Alert.alert('Error','Algo salio mal');


    }
                 
    }
render(){
  console.log(this.state.data);

    let view = this.state.isLoading ? (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator animating={this.state.isLoading} color="#00f0ff" />
        <Text style={{marginTop: 10}} children="Please Wait.." />
      </View>
    ) : (
      <List
        dataArray={this.state.data}
        renderRow={(item) => {
            return (
              <ListInv  data={item} />
            )
        }} />
    )

    return(
        
        <Container>
            <Content>
              <Text>SISTEMA</Text>
           </Content>

        </Container>
    )


}



}

export default inventario