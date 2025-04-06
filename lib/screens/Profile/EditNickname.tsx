import { Text, View, TextInput, Pressable, StyleSheet } from "react-native"
import { COLORS, FONT_SIZES } from "../../constants/common";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { formatNickname } from "../../utils/common";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { UpdateNickname } from "../../services/ProfileService";

const EditNickname = () => {
  const authCtx = useAuth()
  const userData = authCtx.authData

  if (!userData) {
    throw new Error('not logged in!')
  }

  const [value, setValue] = useState(formatNickname(userData.info.nickname, userData.info.username))
  const navigation = useNavigation()

  async function doUpdate() {
    if (!userData) {
      throw new Error('has logged out!')
    }

    const ok = await UpdateNickname(userData.token, value)
    if (ok) {
      Toast.show({
        type: 'success',
        text1: '修改成功',
      });
      userData.info.nickname = value
      authCtx.login(userData)
      navigation.goBack()
    } else {
      Toast.show({
        type: 'error',
        text1: '修改失败',
      });
    }
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          disabled={value === userData.info.nickname}
          onPress={doUpdate}>
          <Text style={{ color: value === userData.info.nickname ? COLORS.DISABLE : COLORS.MAJOR }}>提交</Text>
        </Pressable>
      ),
    });
  }, [navigation, value, userData]);


  return (
    <View style={{ flex: 1, padding: 15, backgroundColor: '#fff' }}>
      <Text
        style={{
          fontSize: FONT_SIZES.SMALL,
          fontWeight: 'bold'
        }}>
        我的名字
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={value}
          textContentType='nickname'
          textAlignVertical='top'
          onChangeText={setValue}
        />

        {
          value.length > 0 && (
            <Pressable onPress={() => setValue('')}>
              <Text style={styles.clearText}>✖</Text>
            </Pressable>
          )
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.DISABLE,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  textInput: {
    flex: 1,
    fontSize: FONT_SIZES.SMALL,
  },
  clearText: {
    fontSize: FONT_SIZES.SMALL,
    color: '#999',
    marginLeft: 'auto'
  },
})

export default EditNickname;