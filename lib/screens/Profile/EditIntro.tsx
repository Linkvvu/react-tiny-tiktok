import { Text, View, TextInput, Pressable, StyleSheet } from "react-native"
import { COLORS, FONT_SIZES } from "../../constants/common";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { UpdateIntro } from "../../services/ProfileService";
import Toast from "react-native-toast-message";

const EditIntro = () => {
  const authCtx = useAuth()
  const userData = authCtx.authData
  if (!userData) {
    throw new Error('not logged in!')
  }
  if (!authCtx) {
    throw new Error('not logged in!')
  }

  const [value, setValue] = useState(userData.info.intro || '')
  const navigation = useNavigation()

  async function doUpdate() {
    if (!userData) {
      throw new Error('has logged out!')
    }

    const ok = await UpdateIntro(userData.token, value)
    if (ok) {
      Toast.show({
        type: 'success',
        text1: '修改成功',
      });
      userData.info.intro = value
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
          disabled={value == userData.info.intro}
          onPress={doUpdate}
        >
          <Text style={{ color: value == userData.info.intro ? COLORS.DISABLE : COLORS.MAJOR }}>提交</Text>
        </Pressable>
      ),
    });
  }, [navigation, value, userData]);


  return (
    <View style={{ flex: 1, padding: 15, backgroundColor: '#fff' }}>
      <TextInput
        style={styles.textInput}
        textAlignVertical='top'
        value={value}
        onChangeText={setValue}
        multiline={true}
        placeholder='介绍喜好、个性'
      />
    </View>
  )
}

const styles = StyleSheet.create({
  textInput: {
    fontSize: FONT_SIZES.SMALL,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.DISABLE,
    height: '30%',
  },
})

export default EditIntro;