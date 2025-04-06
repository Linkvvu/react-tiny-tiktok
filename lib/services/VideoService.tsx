import { GenericAbortSignal } from "axios"
import { CommentInfo, VideoInfo } from "../types"
import api from "./api"

export const FetchVideoList = async (latestTime: string, token: string, signal?: GenericAbortSignal) => {
  try {
    const resp = await api.get("/videos/feed", {
      params: {
        latest_time: latestTime,
        token
      },
      signal
    })
    return resp.data.video_list as VideoInfo[]
  } catch (err) {
    console.error(err)
    return null
  }
}

export const FetchComments = async (vid: number, token: string): Promise<CommentInfo[] | null> => {
  try {
    const resp = await api.get(`/videos/${vid}/comments?token=${token}`)
    return resp.data.comment_list as CommentInfo[]
  } catch (err) {
    console.error(err)
    return null
  }
}

export const DoComment = async (vid: number, parentId: number, content: string, token: string) => {
  try {
    const resp = await api.post(`/videos/${vid}/comment/${parentId}?token=${token}`, {
      content: content
    })
    return resp.data.comment as CommentInfo
  } catch (err) {
    console.error(err)
    return null
  }
}

export const LikeActionHandler = async (vid: number, cancel: boolean, token: string) => {
  // todo: use global navigator ref
  // if (!authCtx.authData) {
  //   handleNotLogin()
  //   return null
  // }

  try {
    if (cancel) {
      const resp = await api.delete(`/videos/${vid}/like?token=${token}`)
    } else {
      const resp = await api.post(`/videos/${vid}/like?token=${token}`)
      console.log(resp.data)
    }
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}