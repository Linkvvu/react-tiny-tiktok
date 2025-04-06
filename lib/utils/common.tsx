export function formatNumber(num: number, placeholder: string = '0', suffix: string = ''): string {
  let result = ''
  if (num === 0) {
    result = placeholder + suffix
  } else if (num >= 10000) {
    result = (num / 10000).toFixed(1) + '万' + suffix
  } else {
    result = num.toString() + suffix
  }
  return result
}

export const DefaultImages = {
  avatar: require('../assets/images/default_avatar.jpg'),
  background: require('../assets/images/default_background.jpg')
}

export function formatNickname(nickname: string, username: string): string {
  return nickname ? nickname : `用户 ${username}`
}

export function getAvatarOrDefault(url: string): string {
  return url ? url : 'https://img.ixintu.com/download/jpg/20200807/d0c358d183132ba04ff9c09706145567_512_512.jpg!ys';
}

export function getBgImgOrDefault(url: string): string {
  return url ? url : 'https://cdn.pixabay.com/photo/2022/06/20/14/20/space-7273891_1280.jpg'
}

export function formatTimestampSec(timestamp: number) {
  const now = Date.now();
  const diff = now - (timestamp * 1000); // 时间差，单位：毫秒

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;

  if (diff < minute) {
    return `刚刚`;
  } else if (diff < hour) {
    // 小于一小时
    const minutes = Math.floor(diff / minute);
    return `${minutes}分钟前`;
  } else if (diff < day) {
    // 小于一天
    const hours = Math.floor(diff / hour);
    return `${hours}小时前`;
  } else if (diff < week) {
    // 小于一周
    const days = Math.floor(diff / day);
    if (days === 1) {
      // 如果是昨天
      const date = new Date(timestamp);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `昨天 ${hours}:${minutes}`;
    } else {
      // 显示天数
      return `${days}天前`;
    }
  } else {
    // 大于一周
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
