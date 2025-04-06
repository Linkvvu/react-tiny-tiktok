export type AuthData = {
  token: string
  info: UserInfo
}

export interface UserInfo {
  id: number;
  nickname: string;
  username: string;
  avatar_url: string;
  background_img_url: string;
  intro: string
  followed_count: number;
  follower_count: number;
  is_followed: boolean;
}

export interface VideoInfo {
  id: number
  author: UserInfo
  title: string
  play_url: string
  cover_url: string
  comment_count: number
  like_count: number
  is_like: boolean
  publish_at: string
}

export interface CommentInfo {
  id: number,
  commenter: UserInfo,
  content: string,
  create_at: number
}