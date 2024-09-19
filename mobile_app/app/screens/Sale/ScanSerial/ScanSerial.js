import React, { useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { RNCamera } from "react-native-camera";

import { COLORS } from "../../../constants/theme";
import NavigationService from "../../../services/NavigationService";
import StorageUtil from "../../../utils/StorageUtil";
import styles from "./scan.style";
import { useLanguage } from "../../../utils/language/LanguageProvider";
import { useTheme } from "../../../theme/ThemeContext";

export default function ScanSerial() {
  const { theme } = useTheme();
  const { translate } = useLanguage();
  const [ barcodes, setBarcodes ] = useState([]);
  const [ scannedData, setScannedData ] = useState(null);
  const [ serial, setSerial ] = useState('');
  const cameraRef = useRef(null);

  const gradientColors = [theme.gradientStart, COLORS.white];

  const barcodeRecognized = ({ barcodes }) => {
    setBarcodes(barcodes);
    if (barcodes.length > 0) {
      barcodes.map((item) => {
        setSerial(item.data);
        StorageUtil.storeSerialNumber(item.data);
        StorageUtil.storeSerialStored("YES");
      })
    }
  }

  const handleCapture = () => {
    NavigationService.navigate('Sell');
  }

  const onBarcodeRead = (e) => {
    if (e.type === 'QR_CODE' && scannedData !== e.data) {
      // setBarcodes([...barcodes, e.data]);
      setScannedData(e.data);
    }
  }

  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true};
      const data = await this.camera.takePictureAsync(options);
    }
  }

  return (
    <LinearGradient colors={gradientColors} style={{flex: 1}}>
    <View style={styles.container}>
      <Text style={styles.text}>{translate('scanQRCode')}</Text>
      <RNCamera
        ref={cameraRef}
        style={{
          aspectRatio: 0.6,
          flex: 0.6
        }}
        type={RNCamera.Constants.Type.back}
        // onBarCodeRead={onBarcodeRead}
        onGoogleVisionBarcodesDetected={barcodeRecognized}
        androidCameraPermissionOptions={{
          title: translate('cameraPermission'),
          message: translate('cameraPermissionMessage'),
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel'
        }}
        androidRecordAudioPermissionOptions={{
          title: 'Permission to use audio recording',
          message: 'We need your permission to use your audio',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel'
        }}
        captureAudio={false}
      >
      </RNCamera>
      <View style={{alignItems: "center", flex: 0.2, marginTop: 20}}>
        {serial ? (
          <Text style={styles.serialText}>{translate('serial')}: {serial}</Text>
          ) : (
            <Text style={styles.serialText}>{translate('scanningSerial')}...</Text>
          )
        }
      </View>
      {serial &&
        <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
          <Text style={styles.captureButtonText}>Select</Text>
        </TouchableOpacity>
      }
    </View>
    </LinearGradient>
  );
}