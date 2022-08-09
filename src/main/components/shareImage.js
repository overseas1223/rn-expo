import RNFetchBlob from "rn-fetch-blob";
import Share from "react-native-share";
import {
  PermissionsAndroid,
  ToastAndroid,
  Alert,
  Platform
} from "react-native";

const _shareImage = async pics => {
  try {
    ToastAndroid.show("Progress will started soon", ToastAndroid.SHORT);
    const checkVersion = Platform.Version > 22;
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "Access Require",
        message:
          "Press Allow Permission to start progress"
      }
    );

    //cannot progress without permission || sdk < 23 bypass
    if (granted !== PermissionsAndroid.RESULTS.GRANTED && checkVersion) {
      Alert.alert("Cancel, permission denied");
      return;
    }
    let Pictures= pics.map(item =>
      RNFetchBlob.config({
        fileCache: true
      })
        .fetch("GET", item.picurl)
        .then(resp => {
          let base64s= RNFetchBlob.fs
            .readFile(resp.data, "base64")
            .then(data => "data:image/jpeg;base64," + data);
          return base64s;
        })
    );
    Promise.all(Pictures).then(completed => {
      const options = {
        title: "Share via",
        urls: completed
      };
      Share.open(options);
    });
  } catch (err) {
    Alert.alert("Error, Permission denied", err);
  }
};
export default _shareImage;