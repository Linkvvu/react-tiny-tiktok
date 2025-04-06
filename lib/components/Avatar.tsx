import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  ImageSourcePropType,
  ViewStyle,
  ImageStyle,
  TextStyle,
} from 'react-native';
import { COLORS } from '../constants/common';

interface AvatarProps {
  source?: ImageSourcePropType; // 图片资源（本地或网络）
  size?: number; // 头像尺寸（默认 48）
  shape?: 'circle' | 'square'; // 形状（圆形或方形）
  placeholderText?: string; // 无图片时的占位文本
  onPress?: () => void; // 点击事件
  style?: ViewStyle; // 自定义容器样式
  imageStyle?: ImageStyle; // 自定义图片样式
  textStyle?: TextStyle; // 自定义占位文本样式
  backgroundColor?: string; // 占位背景颜色
  borderColor?: string; // 边框颜色
}

const Avatar: React.FC<AvatarProps> = ({
  source,
  size = 48,
  shape = 'circle',
  placeholderText,
  onPress,
  style,
  imageStyle,
  textStyle,
  backgroundColor = COLORS.DISABLE,
  borderColor = '#fff',
}) => {

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: shape === 'circle' ? size / 2 : 8,
    backgroundColor,
    borderWidth: 2,
    borderColor,
    ...style,
  };

  // 图片或占位符内容
  const renderContent = () => {
    if (source) {
      return (
        <Image
          source={source}
          style={[styles.image, imageStyle]}
          resizeMode="cover"
        />
      );
    }
    return (
      <Text
        style={[
          styles.placeholderText,
          { fontSize: size * 0.4 },
          textStyle,
        ]}
      >
        {placeholderText || '?'}
      </Text>
    );
  };

  if (onPress) {
    return (
      <TouchableOpacity style={[styles.container, containerStyle]} onPress={onPress} activeOpacity={0.7}>
        {renderContent()}
      </TouchableOpacity>
    );
  }

  // 否则直接返回 View
  return <View style={[styles.container, containerStyle]}>{renderContent()}</View>;
};

// 基础样式
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', // 确保图片不超出边界
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderText: {
    color: '#757575',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Avatar;