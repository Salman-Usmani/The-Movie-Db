import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import {
  CommonActions,
  createNavigationContainerRef,
} from '@react-navigation/native';
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import Config from 'react-native-config';

export const navigationRef = createNavigationContainerRef();

const UseAccessToken = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) {
    const parseUserToken = JSON.parse(token);
    return parseUserToken || null;
  } else {
    return null;
  }
};

async function navigate() {
  await AsyncStorage.clear();
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{name: 'SignIn'}],
      }),
    );
  }
}
const dataServer = axios.create({
  baseURL: process.env.BASE_URL;,
  timeout: 100000,
  maxBodyLength: Infinity,
  maxContentLength: Infinity,
  headers: {
    'Content-Type': 'application/json',
  },
});

dataServer.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const state = await NetInfo.fetch();
    const accessToken = await UseAccessToken();

    if (!state.isConnected) {
      throw new Error('No internet connection');
    }

    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

dataServer.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    console.log('error.response', error.message);
    if (error.response?.status === 401) {
      navigate();
    }
    return Promise.reject(error);
  },
);

export {dataServer};