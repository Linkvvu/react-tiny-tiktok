import { Dimensions, ScrollView, StatusBar, StyleSheet, Text, View, ViewToken } from "react-native";
import { UserInfo, VideoInfo } from "../../types";
import PagerView from "react-native-pager-view";
import { useCallback, useEffect, useRef, useState } from "react";
import VideoItem from "./VideoItem";
import { ProfileScreen } from "../Profile/ProfileScreen";
import { useAuth } from "../../contexts/AuthContext";
import { FetchVideoList } from "../../services/VideoService";
import Toast from "react-native-toast-message";
import { globalStyles } from "../../styles/globalStyles";
import { TEXTS } from "../../constants/texts";
import assert from "assert";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { GenericAbortSignal } from "axios";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { LoadingIndicator } from "../../components/LoadingIndicator";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const VideoPlayer = () => {
  const authCtx = useAuth()
  const pagerViewRef = useRef(null);
  const vidLatestTime = useRef('')
  const [curVidIdx, setCurVidIdx] = useState(0)
  const [videoList, setVideoList] = useState<VideoInfo[]>([])
  const [curAuthor, setCurAuthor] = useState<UserInfo | null>(null)
  const [isProfilePage, setIsProfilePage] = useState(false)
  const fetchingNewVideos = useRef(false);

  const onRefresh = useCallback(() => {
    console.log('onRefresh')
  }, []);

  useEffect(() => {
    const abortController = new AbortController()
    HandleLoginEvent(abortController.signal)
    return () => {
      abortController.abort()
    }
  }, [authCtx.authData])

  const tabBarHeight = useBottomTabBarHeight();
  const availableHeight = SCREEN_HEIGHT - tabBarHeight - (StatusBar.currentHeight || 0);

  async function fetchVideos(signal?: GenericAbortSignal) {
    const fetchFunc = async function () {
      const token = authCtx.authData ? authCtx.authData.token : "";
      fetchingNewVideos.current = true
      const videos = await FetchVideoList(vidLatestTime.current, token, signal)
      if (!videos) {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: TEXTS.ERROR_NETWORK,
        })
        return
      }
      console.log('feed videos: ', videos)
      const latestVid = videos.at(-1)
      if (latestVid) {
        console.log("latestVid##: ", latestVid.publish_at)
        vidLatestTime.current = latestVid.publish_at
      }

      // update video-list and update-counter 
      setVideoList((prev) => prev.concat(videos))
    }

    fetchingNewVideos.current = true
    await fetchFunc()
    fetchingNewVideos.current = false
  }

  function HandleLoginEvent(signal: GenericAbortSignal) {
    console.log("do RefreshVideos")
    vidLatestTime.current = ''
    setVideoList((prev) => [])
    fetchVideos(signal)
  }

  function topPageSelectHandler(event: any) {
    const index = event.nativeEvent.position;
    if (index == 0) {
      setIsProfilePage(false)
    } else {
      setIsProfilePage(true)
    }
  }

  // function videoPageSelectHandler(event: any) {
  //   const index = event.nativeEvent.position;
  //   console.log("selected: ", index)
  //   setCurVidIdx(index)

  //   if (videoList.length === 0) {
  //     return
  //   }

  //   const video = videoList.at(index);
  //   assert(video, `Invalid index for video list, index ${index}`)
  //   setCurAuthor(video.author)
  // }

  const onViewableItemsChanged = useCallback(({ viewableItems, changed }: {
    viewableItems: ViewToken[]
    changed: ViewToken[]
  }) => {
    console.log('onViewableItemsChanged: ', viewableItems, ' ', changed,)
    if (viewableItems.length > 0 && videoList.length > 0) {
      // 获取第一个可见项的索引
      const newIndex = viewableItems[0].index || 0;
      setCurVidIdx(newIndex);
      console.log('当前播放索引:', newIndex);
      const video = videoList.at(newIndex);
      assert(video, `Invalid index for video list, index ${newIndex}`)
      setCurAuthor(video.author)
    }
  }, [videoList, setCurAuthor]);


  const handleEndReached = () => {
    if (!fetchingNewVideos.current) {
      fetchVideos()
    }
  }

  const viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 100,
    waitForInteraction: true
  };

  return (
    <View style={globalStyles.simpleContainer}>
      <PagerView
        ref={pagerViewRef}
        initialPage={0}
        orientation='horizontal'
        overScrollMode='never'
        style={globalStyles.simpleContainer}
        onPageSelected={topPageSelectHandler}
        scrollEnabled={curAuthor !== null}
      >
        <FlatList
          style={globalStyles.simpleContainer}
          data={videoList}
          snapToInterval={availableHeight}
          snapToAlignment="start"
          decelerationRate='normal'
          disableIntervalMomentum={true}
          pagingEnabled={true}
          directionalLockEnabled={true}
          keyExtractor={(item) => item.id.toString()}

          windowSize={5} // 保持3屏缓冲
          initialNumToRender={3} // 首屏渲染数量
          maxToRenderPerBatch={2} // 每批渲染数量
          updateCellsBatchingPeriod={100} // 渲染间隔
          removeClippedSubviews={true} // 裁剪不可见视图
          renderItem={({ item, index }: { item: VideoInfo, index: number }) =>
            <View style={[styles.itemContainer, { height: availableHeight }]}>
              <VideoItem
                key={item.id}
                item={item}
                isPlaying={index === curVidIdx && !isProfilePage}
                pagerViewRef={pagerViewRef}
              />
            </View>
          }
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.1}

        />

        {
          curAuthor ?
            <ProfileScreen key={curAuthor.id} userInfo={curAuthor} />
            : <></>
        }
      </PagerView>
    </View >
  )
}

const styles = StyleSheet.create({
  itemContainer: {
    width: '100%',
    backgroundColor: '#000'
  },
})

export default VideoPlayer;