import React from 'react-native';
import { useEffect, useState } from 'react';
import { CameraView, Camera , CameraType, useCameraPermissions} from "expo-camera";


import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View , Button, TouchableOpacity, Image} from 'react-native';
import { Linking } from 'react-native';

import qrcodicon from './assets/code-icon-png.png';
export default function App() {
  const [facing, setFacing] = useState('back');
  const [hasPermission, setHasPermission] = useState(null);
 
  const [permissaoCamera, setPermissaoCamera] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const salvarQRCode = ({type, data})=>{
    fetch('https://8589-2804-7518-498a-5b00-1dc-8d73-5bee-757a.ngrok-free.app/api/qrcode', {
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
    return <View/>;
  

  }
  if (!permissaoCamera.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={setPermissaoCamera} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const handleBarCodeScanned = ({type, data}) =>{
    setScanned(true);
    salvarQRCode({type, data});
    alert(`QRCode do tipo ${type} e com a informação "${data}" foi salva no banco!`);
    if(Linking.canOpenURL(data)){
      Linking.openURL(data)
    }

    
  };

  if (hasPermission === null) {
      return <Text>Esperando a permissão de camera!</Text>
  }

  if (hasPermission === false) {
      return <Text>A permissão à camera foi negada!</Text>
  }

  return (
    <View style={styles.container}>
      <CameraView style={scanned ? styles.cameraDesabilitada: styles.camera} onBarcodeScanned={scanned ? undefined : handleBarCodeScanned} facing={facing}>
        <View style={styles.contTitulo}>
          <Text style={styles.txtTitulo}>Aponte a camera no QRCode</Text>
        </View>
        <View style={styles.viewImgIcon}>
          <Image source={qrcodicon} style={styles.imgQrcodeIcon}></Image>
          
        </View>
        < View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Mudar Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      {scanned && <Button title={'Clique para escanear de novo'} onPress={()=> setScanned(false)}></Button>}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display:'flex',
    width:'100%',
    height:'100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera:{
    display:'flex',
    width:'100%',
    height:'100%',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: 'transparent',
  },
  cameraDesabilitada:{
    display:'none',
  },
  contTitulo:{
    display:'flex',
    width:'100%',
    height:'auto',
    justifyContent:'center',
    alignItems:'center',
    marginBottom:20,
  },
  txtTitulo:{
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    textAlign:'center'
  },
  viewImgIcon:{
    
    width:'100%',
    height:'auto',
    marginBottom:40,
    justifyContent:'center',
    alignItems:'center',
  },
  imgQrcodeIcon:{
    width:350,
    height:350,
    resizeMode:'contain',
  },
  buttonContainer: {
    display:'flex',
    width:'100%',
    height:'auto',
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'center',

    
  },
  button: {
    display:'flex',
    padding:20,
    backgroundColor:'blue',
    alignSelf: 'flex-end',
    alignItems: 'center',
    borderRadius:10,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign:'center'
  },
});
