import { useAuth } from "../contexts/AuthContext";
import { AuthData, UserInfo } from "../types";
import api from "./api"


const FetchUserInfo = async (token: string): Promise<AuthData> => {
  try {
    const resp = await api.get("/users/me", { params: { token } })
    const info: UserInfo = resp.data.user_info
    return { token, info }
  } catch (err) {
    console.error(err)
    throw new Error("获取用户信息失败")
  }
}

export const DoAuth = async (isRegister: boolean, username: string, password: string): Promise<AuthData> => {
  const url = isRegister ? '/users/register' : '/users/login';
  try {
    const resp = await api.post(url, { username, password });
    const token = resp.data.token;
    const authData = await FetchUserInfo(token);
    return authData;
  } catch (error) {
    console.error(error);
    throw new Error(isRegister ? "注册失败" : "登录失败");
  }
};

export const Logout = () => {
  const authCtx = useAuth()
  authCtx.logout()
}
