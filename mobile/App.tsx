import React from 'react';
import { AppLoading } from 'expo';
import {StatusBar} from 'react-native';
import {Roboto_400Regular ,Roboto_500Medium} from '@expo-google-fonts/roboto';
import {Ubuntu_700Bold , useFonts} from '@expo-google-fonts/ubuntu';

import Routes from './src/routes'; //rotas de todas as paginas

export default function App() {
  //fontes para adicinonar na aplicacao direto do google
  const [fontsLoaded] =useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Ubuntu_700Bold
  });

  if(!fontsLoaded){
    return <AppLoading />
  }
  return (
   <>
     <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent/>
      <Routes />
   </> 
   
  );
}


