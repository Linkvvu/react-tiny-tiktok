import { StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { DefaultImages, formatNickname, formatNumber } from '../../utils/common';
import { VideoInfo } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LikeActionHandler } from "../../services/VideoService";
import Toast from "react-native-toast-message";
import Video from "react-native-video";
import { globalStyles } from "../../styles/globalStyles";
import { LoadingIndicator } from "../../components/LoadingIndicator";
import { TEXTS } from "../../constants/texts";
import Avatar from "../../components/Avatar";
import CommentModal from "./CommentModal";


interface VideoItemProps {
  item: VideoInfo
  isPlaying: boolean
  pagerViewRef: React.MutableRefObject<any>
}

const VideoItem: React.FC<VideoItemProps> = ({ item, isPlaying, pagerViewRef }) => {
  const focused = useIsFocused()  // 判断当前页面是否在视图内
  const [manuallyPaused, setManuallyPaused] = useState(false)
  const [isLoadingVideo, setIsLoadingVideo] = useState(true)

  // 只在视频加载时设置 isLoadingVideo
  const onLoadedHandler = useCallback(() => {
    setIsLoadingVideo(false)
  }, [])

  // 处理暂停的操作，避免重复创建函数
  const handlePauseToggle = useCallback(() => {
    setManuallyPaused(prevState => !prevState)
  }, [])

  // 用 useMemo 缓存标题和作者信息
  const formattedNickname = useMemo(() => {
    return formatNickname(item.author.nickname, item.author.username)
  }, [item.author.nickname, item.author.username])

  return (
    <TouchableWithoutFeedback onPress={handlePauseToggle}>
      <View style={globalStyles.simpleContainer}>
        <Video
          source={isPlaying ? { uri: item.play_url } : undefined}
          style={{ width: '100%', height: '100%' }}
          resizeMode="contain"
          repeat={true}
          paused={!isPlaying || manuallyPaused || !focused}
          onLoad={onLoadedHandler}  // 仅在视频加载时更新
          poster={item.cover_url}
        />

        {/* 右侧控件（头像 + 按钮） */}
        <VideoSidebar videoInfo={item} pagerViewRef={pagerViewRef} />

        {/* 视频标题 */}
        <VideoBottomInfo authorName={formattedNickname} title={item.title} />

        {/* 加载标识符 */}
        {isLoadingVideo && <LoadingIndicator />}
        {/* 播放标识符 */}
        {manuallyPaused && <PauseIndicator />}
      </View>
    </TouchableWithoutFeedback>
  )
}

const PauseIndicator = () => {
  return (
    <View style={styles.pauseIndicator}>
      <FontAwesome6
        name="play"
        color='rgba(200, 200, 200, 0.3)'
        size={60}
        iconStyle='solid'
      />
    </View>
  )
}

type SidebarProps = {
  videoInfo: VideoInfo
  pagerViewRef: React.MutableRefObject<any>
}

const VideoSidebar: React.FC<SidebarProps> = ({ videoInfo, pagerViewRef }) => {
  const authCtx = useAuth()
  const navigation = useNavigation()
  const [isLiked, setIsLiked] = useState(videoInfo.is_like)
  const [likeCount, setLikeCount] = useState(videoInfo.like_count)
  const [commentCount, setCommentCount] = useState(videoInfo.comment_count)
  const [commentsVisible, setCommentsVisible] = useState(false)

  // go to the ProfileScreen
  function avatarClickHandler() {
    if (pagerViewRef.current) {
      pagerViewRef.current.setPage(1);
    }
  }

  function notLoginHandler() {
    navigation?.getParent<NativeStackNavigationProp<any>>().push("Auth")
  }

  function showCommentCard() {
    setCommentsVisible(true)
  }

  function closeCommentCard() {
    setCommentsVisible(false)
  }

  function incrCommentCount() {
    setCommentCount((prev) => prev + 1)
  }

  async function likeActHandler() {
    if (!authCtx.authData) {
      notLoginHandler()
      return
    }

    const ok = await LikeActionHandler(videoInfo.id, isLiked, authCtx.authData.token)
    if (!ok) {
      Toast.show({
        type: 'error',
        position: 'bottom',

        text1: TEXTS.ERROR_NETWORK
      })
      return
    }

    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
  }

  return (
    <View style={styles.sidebarContainer}>
      <Avatar
        size={50}
        onPress={avatarClickHandler}
        source={videoInfo.author.avatar_url ? { uri: videoInfo.author.avatar_url } : DefaultImages.avatar}
        style={{ marginBottom: 10 }}
      />

      <TouchableOpacity onPress={likeActHandler} style={styles.button}>
        <FontAwesome6 name="heart" iconStyle='solid' size={33} color={isLiked ? 'tomato' : 'white'} />
        <NumberText num={likeCount} placeholder="喜欢" />
      </TouchableOpacity>
      <TouchableOpacity onPress={showCommentCard} style={styles.button}>
        <FontAwesome6 style={{ marginBottom: 1 }} name="comment-dots" iconStyle='solid' size={33} color='white' />
        <NumberText num={commentCount} placeholder="评论" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <FontAwesome6 style={{ marginBottom: 3 }} name="star" size={33} color='white' iconStyle='solid' />
        <NumberText num={1020} placeholder="收藏" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <FontAwesome6 style={{ marginBottom: 1 }} name="share" size={33} color='white' iconStyle='solid' />
        <NumberText num={8926} placeholder="分享" />
      </TouchableOpacity>

      <CommentModal
        vid={videoInfo.id}
        commentCnt={commentCount}
        visible={commentsVisible}
        onClose={closeCommentCard}
        incrCommentCount={incrCommentCount}
      />
    </View>
  );
}

const VideoBottomInfo = ({ authorName, title }: { authorName: string, title: string }) => {
  return (
    <View style={styles.bottomContainer}>
      <Text style={styles.authorNameText}>@{authorName}</Text>
      <Text
        style={styles.titleText}
        numberOfLines={2}
      >{title}</Text>
    </View>
  )
}

const NumberText = ({ num, placeholder }: { num: number, placeholder: string }) => {
  return (
    <View>
      <Text style={styles.numberText}>
        {
          formatNumber(num, placeholder)
        }
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  sidebarContainer: {
    position: 'absolute',
    top: '50%',
    right: 5,
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    marginVertical: 5,
    padding: 3,
    alignItems: 'center'
  },
  numberText: {
    color: 'white',
    fontFamily: 'sans-serif-thin',
    fontSize: 12,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 10,
    marginLeft: 10,
    flexDirection: "column",
    justifyContent: 'flex-start',
  },
  authorNameText: {
    alignSelf: 'flex-start',
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    paddingBottom: 5,
  },
  titleText: {
    alignSelf: 'flex-start',
    fontSize: 12,
    color: 'white',
    width: 290,
  },
  pauseIndicator: {
    ...globalStyles.indicatorContainer,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    pointerEvents: 'none'
  },
})

export default memo(VideoItem)