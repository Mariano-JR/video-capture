import React, { useEffect, useState, useRef } from 'react';
import { Text } from 'react-native';

import { Camera, CameraRecordingOptions } from "expo-camera"
import { shareAsync } from "expo-sharing"
import * as MediaLibrary from "expo-media-library"

import { CameraView } from './src/components/CameraView'
import { VideoPlayer } from './src/components/VideoPlay'

export default function App() {
  const cameraRef = useRef<Camera>(null)
  const [ isRecording, setIsRecording ] = useState(false)
  const [ video, setVideo ] = useState<any>()

  const [ hasCameraPermission, setHasCameraPermission ] = useState(false)
  const [ hasMicrophonePermission, setHasMicrophonePermission ] = useState(false)
  const [ hasMediaLibraryPermission, setHasMediaLibraryPermission ] = useState(false)

  useEffect(() => {
    (async() => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync()
      setHasCameraPermission(cameraPermission.status === 'granted')

      const microphonePermission = await Camera.requestMicrophonePermissionsAsync()
      setHasMicrophonePermission(microphonePermission.status === 'granted')

      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync()
      setHasMediaLibraryPermission(mediaLibraryPermission.status === 'granted')
    })()
  }, [])

  if(hasCameraPermission === false || hasMicrophonePermission === false) {
    return <Text>Não tem permissão de Camera ou Audio</Text>
  }

  if(hasMediaLibraryPermission === false) {
    return <Text>Não tem acesso a biblioteca</Text>
  }

  const recordVideo = () => {
    setIsRecording(true)

    const options: CameraRecordingOptions = {
      quality: '1080p',
      maxDuration: 60,
      mute: false
    }

    if(cameraRef && cameraRef.current) {
      cameraRef.current.recordAsync(options)
        .then((recordedVideo: any) => {
          setVideo(recordedVideo)
          setIsRecording(false)
        })
    }
  }

  const stopRecording = () => {
    setIsRecording(false)

    if(cameraRef && cameraRef.current) {
      cameraRef.current.stopRecording()
    }
  }

  if(video) {
    const shareVideo = () => {
      shareAsync(video.uri)
        .then(() => {
          setVideo(undefined)
        })
    }

    const saveVideo = () => {
      MediaLibrary.saveToLibraryAsync(video.uri)
        .then(() => {
          setVideo(undefined)
        })
    }

    const discartVideo = () => setVideo(undefined)

    return (
          <VideoPlayer
            video={video}
            onShare={shareVideo}
            onSave={saveVideo}
            onDiscart={discartVideo}
          />
    )
  }

  return (
    <CameraView
      cameraRef={cameraRef}
      isRecording={isRecording}
      onRecord={recordVideo}
      onStopRecording={stopRecording}
    />
  );
}
