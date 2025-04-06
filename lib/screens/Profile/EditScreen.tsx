import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSharedValue, withSpring } from "react-native-reanimated";
import { globalStyles } from "../../styles/globalStyles";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AnimatedBackground from "./AnimatedBackground";
import { useAuth } from "../../contexts/AuthContext";
import Avatar from "../../components/Avatar";
import { DefaultImages, formatNickname } from "../../utils/common";
import { COLORS, FONT_SIZES } from "../../constants/common";
import { TEXTS } from "../../constants/texts";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const BASIC_INFO_AVATAR_SIZE = 96

interface EditItemProps {
  label: string;
  value: string;
  placeholder?: string;
  onPress: () => void
}

const EditItem: React.FC<EditItemProps> = ({
  label,
  value,
  placeholder,
  onPress,
}) =>
  <TouchableOpacity
    onPress={onPress}
    style={styles.editItemButton}>
    <Text style={styles.editItemLabel}>{label}</Text>
    <Text style={value ? styles.editItemValue : styles.editItemPlaceholder}>{value || placeholder}</Text>
  </TouchableOpacity>

export const EditScreen = () => {
  const authCtx = useAuth()
  if (!authCtx.authData) {
    throw Error('not logged on!')
  }

  const userInfo = authCtx.authData.info
  const navigation = useNavigation<NativeStackNavigationProp<any>>()
  const dragY = useSharedValue(0);              // PanGesture接受到的Y轴平移值, range: [-∞, +∞]
  const pan = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        dragY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 0) {
        dragY.value = withSpring(0);
      }
    })
    .activeOffsetY(15)

  return (
    <GestureDetector gesture={pan}>
      <View style={globalStyles.simpleContainer}>
        <AnimatedBackground
          source={userInfo.background_img_url || DefaultImages.background}
          dragY={dragY}
        />
        <View style={styles.container}>
          <Avatar
            source={userInfo.avatar_url || DefaultImages.avatar}
            size={BASIC_INFO_AVATAR_SIZE}
            style={{ marginTop: -BASIC_INFO_AVATAR_SIZE / 2, alignSelf: 'center' }}
          />

          <View style={{ padding: 10 }}>
            <EditItem
              label="名字"
              value={userInfo.nickname}
              placeholder={formatNickname(userInfo.nickname, userInfo.username)}
              onPress={() => {
                navigation.push('Nickname')
              }}
            />
            <EditItem
              label="简介"
              value={userInfo.intro}
              placeholder={TEXTS.PROFILE_DEFAULT_DESC}
              onPress={() => {
                navigation.push('Introduction')
              }}
            />
            <EditItem
              label="性别"
              value=""
              placeholder='男'
              onPress={() => { }}
            />
            <EditItem
              label="地区"
              value=""
              placeholder='填写地区'
              onPress={() => { }}
            />
            <EditItem
              label="账号"
              value={userInfo.id.toString()}
              onPress={() => { }}
            />
          </View>
        </View>
      </View >
    </GestureDetector >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    top: -15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  editItemButton: {
    flexDirection: 'row',
    marginHorizontal: 5,
    marginVertical: 10
  },
  editItemLabel: {
    fontSize: FONT_SIZES.MEDIUM,
    marginRight: 45,
    color: 'grey',
  },
  editItemValue: {
    flex: 1,
    fontSize: FONT_SIZES.MEDIUM,
    color: '#000',
  },
  editItemPlaceholder: {
    fontSize: FONT_SIZES.BIG,
    color: COLORS.DISABLE
  }
})