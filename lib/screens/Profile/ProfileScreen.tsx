import React, { useEffect, useRef, useState } from "react";
import { Dimensions, Image, LayoutChangeEvent, Platform, StyleSheet, Text, View, TouchableOpacity, Pressable } from "react-native";
import { Gesture, GestureDetector, ScrollView } from "react-native-gesture-handler";
import Animated, { interpolate, SharedValue, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { UserInfo, VideoInfo } from "../../types";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { DefaultImages, formatNickname, formatNumber } from "../../utils/common";
import { useAuth } from "../../contexts/AuthContext";
import { FetchPublished } from "../../services/ProfileService";
import Toast from "react-native-toast-message";
import { TEXTS } from "../../constants/texts";
import { COLORS, FONT_SIZES } from "../../constants/common";
import Avatar from "../../components/Avatar";
import Button from "../../components/Button";
import { globalStyles } from "../../styles/globalStyles";
import AnimatedBackground from "./AnimatedBackground";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const { width, height } = Dimensions.get('window');
const TOP_HEADER_HEIGHT = Platform.OS === 'ios' ? 90 : 70;
const BASIC_INFO_AVATAR_CONTAINER_LEFT_OFFSET = 20
const BASIC_INFO_AVATAR_SIZE = 96

interface ContentGridProps {
  userInfo: UserInfo
}

const ContentGrid: React.FC<ContentGridProps> = ({ userInfo }) => {
  const authCtx = useAuth()
  const [videoList, setVideoList] = useState<VideoInfo[]>([])

  useFocusEffect(React.useCallback(() => {
    let isActive = true;

    const fetchVideos = async () => {
      const token = authCtx.authData ? authCtx.authData.token : ''
      const videos = await FetchPublished(userInfo.id, token)
      console.log('pub list: ', videos)
      if (!videos) {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: TEXTS.ERROR_NETWORK,
        })
        return
      }

      if (isActive) {
        setVideoList((prev) => videos)
      }
    }

    fetchVideos()
    return () => {
      isActive = false;
    }
  }, [authCtx, userInfo]))


  return (
    <View style={styles.contentGrid}>
      {
        videoList.map((v) => (
          <View key={v.id} style={styles.gridItem}>
            <Image style={styles.gridImg} source={{ uri: v.cover_url ? v.cover_url : 'https://cn.bing.com/th?id=OHR.MtFujiSunrise_ZH-CN0567499176_1920x1080.jpg&w=720' }} />
          </View>
        ))
      }
    </View>
  );
};

interface StatisticItemProps {
  label: string
  value: string
}

const StatisticItem: React.FC<StatisticItemProps> = ({ label, value }) => {
  return (
    <Pressable style={styles.statItem}>
      <Text style={styles.statValue}>
        {value}
      </Text>
      <Text></Text>
      <Text style={styles.statLabel}>
        {label}
      </Text>
    </Pressable>
  );
};

interface StatisticContainerProps {
  followed: number
  fans: number
  intro: string
  isSelf: boolean
}

const StatisticContainer: React.FC<StatisticContainerProps> = ({ followed, fans, intro, isSelf }) => {
  const navigation = useNavigation().getParent<NativeStackNavigationProp<any>>()

  function toEditScreen() {
    navigation.push('EditProfile')
  }

  return (
    <View style={{ marginLeft: 5 }}>
      <View style={styles.statsContainer}>
        <StatisticItem label="关注" value={formatNumber(followed)} />
        <StatisticItem label="粉丝" value={formatNumber(fans)} />
        {
          isSelf && <Button
            title="编辑主页"
            style={{ backgroundColor: COLORS.LIGHT_GREY, marginLeft: 'auto', borderRadius: 5 }}
            textStyle={{ fontSize: FONT_SIZES.SMALL, color: '#000', fontWeight: 'bold' }}
            onPress={toEditScreen}
          />
        }
      </View>
      <Pressable>
        {
          intro || isSelf ? (
            <Text
              onPress={isSelf ? toEditScreen : undefined}
              style={!intro && isSelf ? { color: COLORS.DISABLE } : undefined}
            >
              {intro || TEXTS.PROFILE_DEFAULT_DESC}
            </Text>
          ) : null
        }
      </Pressable>
    </View>
  );
};


interface BasicInfoContainerProps {
  userInfo: UserInfo
  dragY: SharedValue<number>
}

const BasicInfoContainer: React.FC<BasicInfoContainerProps> = ({ userInfo, dragY }) => {
  return (
    <React.Fragment>
      <AnimatedBackground
        dragY={dragY}
        source={userInfo.background_img_url || DefaultImages.background}
      />

      <View style={styles.basicInfoContainer}>
        <Avatar
          size={BASIC_INFO_AVATAR_SIZE}
          style={{ marginRight: 20 }}
          source={userInfo.avatar_url ? { uri: userInfo.avatar_url } : DefaultImages.avatar}
          onPress={() => { }}
        />
        <Text style={{ fontSize: FONT_SIZES.BIG, color: '#fff' }}>
          {formatNickname(userInfo.nickname, userInfo.username)}
        </Text>
      </View>
    </React.Fragment>
  );
};

const GridTabBar = () => {
  return (
    <View style={{ flexDirection: 'row' }}>
      <View style={{ flex: 1, paddingBottom: 10, borderBottomWidth: 2 }}>
        <TouchableOpacity style={styles.tabItem} onPress={() => { console.error('press') }}>
          <Text style={styles.tabText}>作品</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, paddingBottom: 10 }}>
        <TouchableOpacity style={styles.tabItem}>
          <Text style={styles.tabText}>喜欢</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

interface StickyHeaderProps {
  userInfo: UserInfo
  scrollY: SharedValue<number>
  tabDelimiterY: SharedValue<number>
}

const StickyHeader: React.FC<StickyHeaderProps> = ({ userInfo, scrollY, tabDelimiterY }) => {
  const navHeaderOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value,
      [0, tabDelimiterY.value / 2 + (tabDelimiterY.value / 3), tabDelimiterY.value],
      [0, 0.2, 1]),
  }));

  const tabHeaderTransform = useAnimatedStyle(() => ({
    transform: [{ translateY: scrollY.value < tabDelimiterY.value ? -height : 0 }],
  }));

  return (
    <View style={styles.stickyHeaderContainer}>
      <Animated.View style={[styles.topHeader, navHeaderOpacity]}>
        <Text style={{ color: 'black', fontWeight: 'bold' }}>{formatNickname(userInfo.nickname, userInfo.username)}</Text>
      </Animated.View>
      <Animated.View style={[tabHeaderTransform]}>
        <GridTabBar />
      </Animated.View>
    </View>
  );
};

interface ScrollContainerProps {
  userInfo: UserInfo
  scrollY: SharedValue<number>
  dragY: SharedValue<number>
  tabDelimiterY: SharedValue<number>
  panRef: any
}

const FollowButton = () => {
  return (
    <View style={{ flexDirection: 'row', marginTop: 10 }}>
      <Button
        title='+ 关注'
        onPress={() => { }}
        style={{ flex: 9, marginRight: 10 }}
      />
      <Button
        title='···'
        onPress={() => { }}
        style={{ flex: 1, backgroundColor: COLORS.LIGHT_GREY, paddingHorizontal: 3 }}
        textStyle={{ color: '#000' }}
      />
    </View>
  )
}

const ScrollContainer: React.FC<ScrollContainerProps> = ({ userInfo, scrollY, dragY, panRef, tabDelimiterY }) => {
  const authCtx = useAuth()

  const isSelf = authCtx.authData?.info.id === userInfo.id
  const onScrollHandler = (event: any) => {
    scrollY.value = event.nativeEvent.contentOffset.y;
  };

  const setGridTabDelimiterY = (event: LayoutChangeEvent) => {
    const { layout } = event.nativeEvent;
    tabDelimiterY.value = layout.y + layout.height - TOP_HEADER_HEIGHT;
  }

  return (
    <ScrollView
      style={styles.ScrollContainer}
      showsVerticalScrollIndicator={false}
      simultaneousHandlers={panRef}
      onScroll={onScrollHandler}
    >
      {/* 头像、背景等基本信息 */}
      <BasicInfoContainer userInfo={userInfo} dragY={dragY} />

      {/* 统计信息、关注按钮 */}
      <View style={styles.statInfoContainer} onLayout={setGridTabDelimiterY}>
        <StatisticContainer
          fans={userInfo.follower_count}
          followed={userInfo.followed_count}
          intro={userInfo.intro}
          isSelf={isSelf}
        />

        {!isSelf && <FollowButton />}
      </View>

      {/* 内容视频的标签栏 */}
      <GridTabBar />

      {/* 内容网格 */}
      <ContentGrid userInfo={userInfo} />
    </ScrollView>
  );
};

interface ProfileScreenProps {
  userInfo?: UserInfo;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ userInfo }) => {
  const { authData } = useAuth()
  if (!userInfo) {
    if (!authData) {
      throw new Error("ERROR: not logged in but into profileScreen");
    }
    userInfo = authData.info
    console.log('current userinfo: ', userInfo)
  }

  const PanRef = useRef(undefined);
  const dragY = useSharedValue(0);              // PanGesture接受到的Y轴平移值, range: [-∞, +∞]
  const scrollY = useSharedValue(0);            // ScrollView的Y轴平移值, range: [0, +height]
  const tabDelimiterY = useSharedValue(height); // scrollView中的gridTab的Y边界值

  // controls background animated image 
  const pan = Gesture.Pan()
    .onUpdate((event) => {
      if (scrollY.value === 0 && event.translationY > 0) {
        dragY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (scrollY.value === 0 && event.translationY > 0) {
        dragY.value = withSpring(0);
      }
    })
    .activeOffsetY(15)
    .withRef(PanRef);

  return (
    <View style={globalStyles.simpleContainer}>
      <StickyHeader
        userInfo={userInfo}
        scrollY={scrollY}
        tabDelimiterY={tabDelimiterY}
      />

      <GestureDetector gesture={pan}>
        <ScrollContainer
          userInfo={userInfo}
          scrollY={scrollY}
          dragY={dragY}
          panRef={PanRef}
          tabDelimiterY={tabDelimiterY}
        />
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  ScrollContainer: {
    flex: 1,
    backgroundColor: '#fff'
  },
  basicInfoContainer: {
    left: BASIC_INFO_AVATAR_CONTAINER_LEFT_OFFSET,
    marginTop: -BASIC_INFO_AVATAR_SIZE - 30,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  statInfoContainer: {
    marginTop: 20,
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 5,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  statLabel: {
    color: 'grey',
    fontSize: FONT_SIZES.SMALL,
  },
  statValue: {
    color: '#000',
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: 'bold',
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  contentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  gridItem: {
    width: width / 3 - 3,
    margin: 1,
    aspectRatio: 0.8,
  },
  gridImg: {
    flex: 1,
    resizeMode: 'cover',
  },
  stickyHeaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  topHeader: {
    height: TOP_HEADER_HEIGHT,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});