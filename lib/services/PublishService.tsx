import api from "./api"
import axios from "axios";

export const DoPublish = async (videoUri: string, thumbnailUri: string, title: string, token: string) => {
  try {
    const form = new FormData()
    form.append('video', {
      uri: videoUri,
      type: 'video/mp4',
      name: 'video.mp4'
    })
    form.append('thumbnail', {
      uri: thumbnailUri,
      type: 'video/mp4',
      name: 'thumbnail.jpg'
    })
    form.append('title', title)

    const resp = await api.post(`/videos?token=${token}`, form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 30000
    })
    return true
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("Axios error message:", err);
    } else {
      console.error(err)
    }
    return false
  }
}