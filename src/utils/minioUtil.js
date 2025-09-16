/**
 * MinIO URL工具类
 * 用于处理URL和objectName之间的转换
 */

const MINIO_ENDPOINT = process.env.VUE_APP_MINIO_ENDPOINT || 'http://localhost:9000'
const MINIO_BUCKET = process.env.VUE_APP_MINIO_BUCKET || 'mall'

/**
 * 从完整URL中提取objectName
 * @param {string} url 完整URL
 * @returns {string} objectName
 */
export function extractObjectName(url) {
  if (!url || typeof url !== 'string') {
    return ''
  }

  // 如果不是URL格式，直接返回
  if (!url.includes('://')) {
    return url
  }

  // 提取bucket后面的部分作为objectName
  const bucketPath = `/${MINIO_BUCKET}/`
  const bucketIndex = url.indexOf(bucketPath)
  if (bucketIndex !== -1) {
    return url.substring(bucketIndex + bucketPath.length)
  }

  return url
}

/**
 * 根据objectName构建完整URL
 * @param {string} objectName objectName
 * @returns {string} 完整URL
 */
export function buildUrl(objectName) {
  if (!objectName || typeof objectName !== 'string') {
    return ''
  }

  // 如果已经是完整URL，直接返回
  if (objectName.startsWith('http://') || objectName.startsWith('https://')) {
    return objectName
  }

  return `${MINIO_ENDPOINT}/${MINIO_BUCKET}/${objectName}`
}

/**
 * 检查字符串是否为objectName格式（非URL格式）
 * @param {string} str 要检查的字符串
 * @returns {boolean} true如果是objectName格式
 */
export function isObjectName(str) {
  return str && typeof str === 'string' && !str.startsWith('http://') && !str.startsWith('https://')
}