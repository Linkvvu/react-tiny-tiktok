import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { COLORS, FONT_SIZES, FONTS } from '../constants/common';

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, style, disabled && styles.disabledButton]} // 合并默认样式和自定义样式
      onPress={onPress}
      disabled={disabled || loading} // 禁用按钮
      activeOpacity={0.7} // 点击时的透明度
    >
      {loading ? (
        <ActivityIndicator color='#fff' /> // 显示加载指示器
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text> // 显示按钮文本
      )}
    </TouchableOpacity>
  );
};

// 默认样式
const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.MAJOR, // 默认背景颜色
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: COLORS.DISABLE, // 禁用时的背景颜色
  },
  text: {
    fontFamily: FONTS.BOLD,
    color: '#fff', // 默认文本颜色
    fontSize: FONT_SIZES.MEDIUM,
  },
});

export default Button;