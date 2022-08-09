import {AsyncStorage} from 'react-native'

const STORAGE_KEY = 'SETTINGS';

const DEFAULT_SETTINGS = {
  name: '',
  locale: 'en'
};

export const loadSettings = async () => {
  try {
    let settings = await AsyncStorage.getItem(STORAGE_KEY);

    if (settings === null) {
      return null;
    }
    else
      return JSON.parse(settings);
  } catch (error) {
    console.log('Error loading settings', error);
  }
}

export const saveSettings = (settings) => {
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}


export const getSetting = async (key) => {
    try {
        let data = {};
        let settings = await AsyncStorage.getItem(STORAGE_KEY);
        
        if (settings !== null) {
            data = JSON.parse(settings);
            return data[key];
        }
        else
          return null;

    } catch (error) {
        console.log('Error loading settings', error);
    }
}

export const setSetting = async (key, value) => {
    try {
        let data = {};
        let settings = await AsyncStorage.getItem(STORAGE_KEY);
        if (settings !== null) {
            data = JSON.parse(settings);
        }

      data[key] = value;
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    } catch (error) {
        console.log('Error loading settings', error);
    }
}