import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import { styles } from './styles';
import { CameraViewProps } from './props'
import { Camera } from 'expo-camera';

export function CameraView({ cameraRef, isRecording, onRecord, onStopRecording }: CameraViewProps) {
  return (
    <Camera
        style={styles.container}
        ref={cameraRef}
    >
        <View
            style={styles.buttonContainer}
        >
            <TouchableOpacity
                style={styles.buttonRecord}
                onPress={ isRecording ? onStopRecording : onRecord }
            >
                <Text
                    style={styles.buttonText}
                >
                    { isRecording ? "Stop Recording" : "Start Record" }
                </Text>
            </TouchableOpacity>
        </View>
    </Camera>
  );
}