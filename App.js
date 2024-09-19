import React from 'react-native';
import { useEffect, useState } from 'react';
import { CameraView, Camera , CameraType, useCameraPermissions} from "expo-camera";


import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View , Button} from 'react-native';
import { Linking } from 'react-native';


export default function App() {

  const [hasPermission, setHasPermission] = useState(null);
  const [facing, setFacing] =useState('back');
  const [permissaoCamera, setPermissaoCamera] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const salvarQRCode = ({type, data})=>{
    fetch('https://b7dc-2804-7518-49a8-9e00-4c25-8cac-1a66-26b7.ngrok-free.app/api/qrcode', {
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

  
  //Função para a permissão da camera
  if (!permissaoCamera) {
    return (
    <View>
      <Text>O Acesso a camera foi negada</Text>
    </View>
  )

  }
  if (!permissaoCamera.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={setPermissaoCamera} title="grant permission" />
      </View>
    )
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

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
          
        }}
       facing={facing}>
      
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
