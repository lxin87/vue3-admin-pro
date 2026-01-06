// 1. 引入 dayjs (Element Plus 内部已经自带了 dayjs，不用额外安装，直接引)
import dayjs from 'dayjs'

/**
 * 格式化时间
 * @param time 原始时间字符串
 * @param pattern 格式 (默认为 YYYY-MM-DD HH:mm:ss)
 */
export const formatTime = (time: string | Date | undefined, pattern = 'YYYY-MM-DD HH:mm:ss') => {
  if (!time) return '-'
  return dayjs(time).format(pattern)
}