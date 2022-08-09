module.exports = {
    mytoken: "",
    api: {
  
        login: 'http://isburo.com:8080/WSMYSTOCK/oauth/access_token',
        inventario_url:'https://crm.isburo.com/CRISCOLJavaEnvironment/rest/getInventario',
        wsInventario_url: 'http://isburo.com:8080/WSMYSTOCK/rest/wsGetInventario',
        signup: 'http://isburo.com:8080/WSMYSTOCK/servlet/com.mystock.sec.registeruser',
        wsGetStore_url: 'http://isburo.com:8080/WSMYSTOCK/rest/wsGetStores' 
    },
    consts : {
        CLIENTE_CODIGO: '92',
        SETTING_TOKEN: 'token',
        EXPIRATION_TIME: 'expire_in'
    },
    auth: {
        client_id: '17147d95fbfb4a508665c2b33ac7b618',
        cleint_secret: 'bc04a10c02e14f56bf43ea4333863873',
        grant_type: 'password_credentials',
        scope: 'fullcontrol',
        access_token: ''
    }
};