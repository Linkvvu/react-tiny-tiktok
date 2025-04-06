import { StyleSheet, Text, TextInput, View, Pressable } from "react-native"
import React, { useState } from "react"
import { LoadingIndicator } from "../../components/LoadingIndicator"
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs"
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import Toast from "react-native-toast-message"
import { DoAuth } from "../../services/AuthService"
import { useAuth } from "../../contexts/AuthContext";
import { globalStyles } from "../../styles/globalStyles";
import Button from "../../components/Button";
import { FONT_SIZES, FONTS, ICON_SIZES } from "../../constants/common";
// import bcrypt from 'bcryptjs';

export const AuthScreen: React.FC<{ navigation: BottomTabNavigationProp<any> }> = ({ navigation }) => {
  const authCtx = useAuth()
  const [isOperating, setOperating] = useState(false)
  const [account, setAccount] = useState('');
  const [passwd, setPasswd] = useState('');
  const [isRegister, switchToRegister] = useState(false);

  const HandleAuth = async () => {
    setOperating(true);
    // const hashedPwd = bcrypt.hashSync(passwd, bcrypt.genSaltSync())
    try {
      const authData = await DoAuth(isRegister, account, passwd);
      authCtx.login(authData);
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: isRegister ? '注册失败' : '登录失败',
      });
    } finally {
      setOperating(false);
    }
  };

  return (
    <View style={globalStyles.simpleContainer}>

      <CloseButton
        onPress={() => {
          navigation.goBack()
        }}
      />

      <View style={styles.container}>
        <Text style={styles.baseText}>
          <Text style={styles.titleText}>
            {isRegister ? '注册您的新账号' : '登录发现更多精彩'}
            {'\n'}
            {'\n'}
          </Text>
          <Text style={styles.tipText}>
            请遵循本应用用户协议和隐私政策以及运营商服务协议，运营商户将对你提供的信息进行验证
            {'\n'}
          </Text>
        </Text>

        <TextInput
          style={styles.inputContainer}
          placeholder="账号"
          onChangeText={setAccount}
        />

        <TextInput
          style={styles.inputContainer}
          placeholder="密码"
          secureTextEntry={true}
          onChangeText={setPasswd}
        />

        <Button
          onPress={HandleAuth}
          title={isRegister ? '注册' : '登录'}
          style={{ marginTop: 30 }} />

        <Pressable
          style={styles.registryButton}
          onPress={() => { switchToRegister(!isRegister) }}
        >
          <Text style={styles.tipText}>{isRegister ? '点击此处登录' : '点击此处注册'}</Text>
        </Pressable>
      </View>

      {
        isOperating && <LoadingIndicator
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }} />
      }
    </View>
  )
}

const CloseButton: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  return (
    <Pressable
      style={styles.closeButton}
      onPress={onPress}
    >
      <FontAwesome6
        name='xmark'
        size={ICON_SIZES.LARGE}
        iconStyle='solid'
      ></FontAwesome6>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: '20%',
    padding: 30,
  },
  baseText: {
    fontFamily: FONTS.REGULAR,
  },
  titleText: {
    fontSize: FONT_SIZES.LARGE,
    fontWeight: 'bold',
  },
  inputContainer: {
    height: 45,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 15,
    marginVertical: 5,
  },
  tipText: {
    fontSize: FONT_SIZES.MEDIUM,
    color: 'gray',
  },
  closeButton: {
    alignSelf: 'flex-start',
    left: 25,
    top: 30
  },
  registryButton: {
    alignSelf: 'flex-start',
  }
})