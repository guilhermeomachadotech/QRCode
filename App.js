import React from 'react-native';
import { useEffect, useState } from 'react';
import { CameraView, Camera } from "expo-camera";


import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View , Button} from 'react-native';
import { Linking } from 'react-native';

export default function App() {

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);


  const salvarQRCode = ({type, data})=>{
    fetch('https://f64f-2804-7518-49a8-9e00-c984-8d5e-8760-20fc.ngrok-free.app/api/qrcode', {
      method: 'post',
      headers:{
        'Accept' : 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        typeQrCode: type,
        descQrCode: data
      })
    })
  }
  useEffect(()=>{
    const getBarCodeScannerPermissions = async()=>{
      const {status} = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({type, data}) =>{
    setScanned(true);
    salvarQRCode({type, data});
    alert(`QRCode do tipo ${type} e com a informação "${data}" foi salva no banco!`);
    
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
