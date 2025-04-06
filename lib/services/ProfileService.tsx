import { VideoInfo } from "../types"
import api from "./api"

export const FetchPublished = async (userId: number, token: string) => {
  try {
    const resp = await api.get(`/users/${userId}/videos?token=${token}`)
    return resp.data.video_list as VideoInfo[]
  } catch (err) {
    console.error(err)
    return null
  }
}

export const FetchLiked = async (userId: number, token: string) => {
  try {
    const resp = await api.get(`/users/${userId}/likes${token}`)
    return resp.data.video_list as VideoInfo[]
  } catch (err) {
    console.error(err)
    return []
  }
}

export const UpdateNickname = async (token: string, value: string) => {
  try {
    const resp = await api.put(`/users/profile/nickname?token=${token}`, {
      data: value
    })
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export const UpdateIntro = async (token: string, value: string) => {
  try {
    const resp = await api.put(`/users/profile/intro?token=${token}`, {
      data: value
    })
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}