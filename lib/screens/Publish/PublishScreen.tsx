import { useRef, useState } from "react"
import { Pressable, StyleSheet, Image, TextInput, Text, View, VirtualizedList } from "react-native"
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { COLORS, FONT_SIZES, ICON_SIZES } from "../../constants/common";
import { globalStyles } from "../../styles/globalStyles";
import { launchImageLibrary } from 'react-native-image-picker';
import { FFmpegKit, ReturnCode } from 'ffmpeg-kit-react-native';
import Toast from "react-native-toast-message";
import assert from "assert";
import Button from "../../components/Button";
import { DoPublish } from "../../services/PublishService";
import { TEXTS } from "../../constants/texts";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";

export const PublishScreen = () => {
  const navigation = useNavigation()
  const authCtx = useAuth()
  const [title, setTitle] = useState('')
  const videoUriRef = useRef('')
  const [thumbnailUri, setThumbnailUri] = useState('')
  const [loading, setLoading] = useState(false)

  const pickVideoHandler = async () => {
    const result = await launchImageLibrary({
      mediaType: 'video',
      videoQuality: 'high',
    });

    if (result.didCancel) {
      console.log('User cancelled video picker');
      return
    } else if (result.errorCode) {
      console.error('Error picking video:', result.errorMessage);
      Toast.show({
        type: 'error',
        text1: TEXTS.ERROR_PICK_VIDEO,
      });
      return
    }
    assert(result.assets)
    const uri = result.assets[0].uri
    assert(uri)

    videoUriRef.current = uri
    extractThumbnail(uri)
  }

  async function doPublish() {
    if (!authCtx.authData) {
      // todo: remove
      console.error('must publish after login')
      throw new Error('must publish after login')
    }

    setLoading(true)
    const ok = await DoPublish(videoUriRef.current, thumbnailUri, title, authCtx.authData.token)
    if (!ok) {
      Toast.show({
        type: 'error',
        text1: TEXTS.ERROR_NETWORK,
      });
    } else {
      Toast.show({
        type: 'success',
        text1: TEXTS.SUCCESS_PUBLISH,
      });
      navigation.goBack()
    }
    setLoading(false)
  }

  const extractThumbnail = async (videoUri: string) => {
    const outputUri = `${videoUri}_thumbnail.jpg`;
    const command = `-i ${videoUri} -ss 00:00:01 -vframes 1 ${outputUri}`;

    await FFmpegKit.execute(command).then(async (session) => {
      const returnCode = await session.getReturnCode();
      if (ReturnCode.isSuccess(returnCode)) {
        setThumbnailUri(outputUri)
        return
      } else if (ReturnCode.isCancel(returnCode)) {
        // fixme: handle this case
        return
      }
      const outputLogs = await session.getLogs();
      console.error(outputLogs)
      Toast.show({
        type: 'error',
        text1: '选取视频失败',
      });
    })
  };

  const ThumbnailView = () => (
    <View style={styles.thumbnailContainer}>
      <Image source={{ uri: thumbnailUri }} style={styles.thumbnail} />
      <View style={styles.hintContainer}>
        <Text style={styles.hintText}>点击选择视频</Text>
      </View>
    </View>
  )

  return (
    <View style={[globalStyles.simpleContainer, { backgroundColor: 'white' }]}>
      <View style={styles.container}>
        <View style={styles.mainContainer} >
          <TextInput
            style={styles.inputContainer}
            placeholder="添加作品标题..."
            textAlignVertical='top'
            onChangeText={setTitle}
          />
          <Pressable style={styles.pickButContainer} onPress={pickVideoHandler}>
            {
              thumbnailUri ? <ThumbnailView /> :
                <FontAwesome6
                  name="video"
                  size={ICON_SIZES.LARGE}
                  iconStyle='solid'
                  color='#fff'
                  style={styles.pickButIcon}
                />
            }
          </Pressable>
        </View>

        <View style={styles.pubBtnContainer}>
          <Button
            title="发布"
            disabled={!thumbnailUri}
            loading={loading}
            onPress={doPublish}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  mainContainer: {
    flexDirection: 'row',
    height: '25%',
    width: '100%',
  },
  inputContainer: {
    flex: 2,
    marginRight: 10,
    backgroundColor: COLORS.LIGHT_GREY
  },
  pickButContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.LIGHT_GREY
  },
  pickButIcon: {
    backgroundColor: COLORS.MAJOR,
    padding: 12,
    borderRadius: 50
  },
  thumbnailContainer: {
    height: '100%',
    width: '100%'
  },
  thumbnail: {
    flex: 1,
    resizeMode: 'stretch',
  },
  hintContainer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    width: '100%'
  },
  hintText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.LIGHT_GREY
  },
  pubBtnContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 1,
  }
})