import React from 'react-native';
import { useEffect, useState } from 'react';
import { CameraView, Camera } from "expo-camera";


import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View , Button} from 'react-native';
import { Linking } from 'react-native';

export default function App() {

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(()=>{
    const getBarCodeScannerPermissions = async()=>{
      const {status} = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({type, data}) =>{
    setScanned(true);
    Linking.canOpenURL(data).then(supported => {
   if (supported) {
      return Linking.openURL(data);
   } else {
      return Linking.openURL(data);
   }
});
    
  };

  if (hasPermission === null) {
      return <Text>Esperando a permissão de camera!</Text>
  }

  if (hasPermission === false) {
      return <Text>A permissão à camera foi negada!</Text>
  }

  return (
    <View style={styles.container}>
      <CameraView 
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
          
        }}>
      
      </CameraView>
      {scanned && <Button title={'Clique para escanear de novo'} onPress={()=> setScanned(false)}></Button>}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
