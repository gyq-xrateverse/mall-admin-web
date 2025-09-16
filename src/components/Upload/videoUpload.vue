<template>
  <div class="video-upload-container">
    <el-upload
      class="video-uploader"
      :action="uploadUrl"
      :headers="headers"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-progress="handleProgress"
      :show-file-list="false"
      accept=".mp4,.avi,.mov,.wmv,.flv,.webm,.mkv,.3gp"
      drag>
      <div v-if="!videoUrl" class="upload-placeholder">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将视频文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip">支持mp4/avi/mov等格式，文件大小不超过500MB</div>
      </div>
      <div v-else class="video-preview">
        <video :src="videoUrl" controls width="300" height="200" preload="metadata">
          您的浏览器不支持视频播放
        </video>
        <div class="video-info">
          <span class="video-name">{{ videoName }}</span>
          <el-button @click.stop="handleRemove" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
        </div>
      </div>
    </el-upload>

    <!-- 上传进度 -->
    <div v-if="uploadProgress > 0 && uploadProgress < 100" class="upload-progress">
      <el-progress :percentage="uploadProgress" :show-text="true"></el-progress>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { extractObjectName, buildUrl } from '@/utils/minioUtil'

export default {
  name: 'VideoUpload',
  props: {
    value: {
      type: String,
      default: ''
    },
    useOss: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      videoUrl: this.value,
      videoName: '',
      uploadProgress: 0,
      uploading: false
    }
  },
  computed: {
    uploadUrl() {
      return this.useOss ? '/admin/oss/upload' : '/admin/minio/upload'
    },
    headers() {
      return {
        'Authorization': 'Bearer ' + getToken()
      }
    }
  },
  watch: {
    value(newVal) {
      if (newVal) {
        // 如果是完整URL（从后端获取的数据），用于显示
        if (newVal.startsWith('http://') || newVal.startsWith('https://')) {
          this.videoUrl = newVal
        } else {
          // 如果是objectName，构建完整URL用于显示
          this.videoUrl = buildUrl(newVal)
        }
        // 从URL中提取文件名
        const urlParts = this.videoUrl.split('/')
        this.videoName = urlParts[urlParts.length - 1]
      } else {
        this.videoUrl = ''
        this.videoName = ''
      }
    }
  },
  methods: {
    beforeUpload(file) {
      // 文件类型验证
      const isVideo = this.isVideoFile(file.type, file.name)
      if (!isVideo) {
        this.$message.error('只能上传视频文件！')
        return false
      }

      // 文件大小验证 (500MB)
      const isLt500M = file.size / 1024 / 1024 < 500
      if (!isLt500M) {
        this.$message.error('上传视频大小不能超过 500MB!')
        return false
      }

      this.uploading = true
      this.uploadProgress = 0
      return true
    },

    isVideoFile(mimeType, fileName) {
      const videoTypes = [
        'video/mp4',
        'video/avi',
        'video/quicktime', // .mov
        'video/x-msvideo', // .avi
        'video/x-ms-wmv', // .wmv
        'video/x-flv', // .flv
        'video/webm',
        'video/x-matroska' // .mkv
      ]

      const videoExtensions = [
        '.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv', '.3gp'
      ]

      // 检查MIME类型
      if (videoTypes.includes(mimeType)) {
        return true
      }

      // 检查文件扩展名
      const extension = fileName.toLowerCase().substr(fileName.lastIndexOf('.'))
      return videoExtensions.includes(extension)
    },

    handleSuccess(response, file) {
      this.uploading = false
      this.uploadProgress = 100

      if (response.code === 200) {
        // 使用完整URL用于预览显示
        this.videoUrl = response.data.url
        this.videoName = response.data.name || file.name
        // 发送objectName给父组件保存到数据库
        this.$emit('input', response.data.objectName || response.data.url)
        this.$emit('success', response.data)
        this.$message.success('视频上传成功!')
      } else {
        this.$message.error(response.message || '上传失败!')
      }

      // 延迟清除进度条
      setTimeout(() => {
        this.uploadProgress = 0
      }, 1000)
    },

    handleError(error, file) {
      this.uploading = false
      this.uploadProgress = 0
      console.error('Upload error:', error)
      this.$message.error('上传失败: ' + (error.message || '网络错误'))
    },

    handleProgress(event, file) {
      this.uploadProgress = Math.round(event.percent)
    },

    handleRemove() {
      this.$confirm('确定要删除这个视频吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.videoUrl = ''
        this.videoName = ''
        this.uploadProgress = 0
        this.$emit('input', '')
        this.$emit('remove')
        this.$message.success('删除成功!')
      }).catch(() => {
        // 用户取消删除
      })
    }
  }
}
</script>

<style scoped>
.video-upload-container {
  width: 100%;
}

.video-uploader {
  width: 100%;
}

.upload-placeholder {
  padding: 40px 0;
  text-align: center;
  color: #999;
}

.upload-placeholder .el-icon-upload {
  font-size: 67px;
  color: #C0C4CC;
  margin-bottom: 16px;
}

.upload-placeholder .el-upload__text {
  color: #606266;
  font-size: 14px;
  margin-bottom: 8px;
}

.upload-placeholder .el-upload__tip {
  color: #909399;
  font-size: 12px;
}

.video-preview {
  text-align: center;
  position: relative;
}

.video-preview video {
  border-radius: 6px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}

.video-info {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
}

.video-name {
  font-size: 14px;
  color: #606266;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.upload-progress {
  margin-top: 15px;
  padding: 0 10px;
}

/* 拖拽样式 */
.video-uploader :deep(.el-upload-dragger) {
  width: 100%;
  height: auto;
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.2s ease;
}

.video-uploader :deep(.el-upload-dragger:hover) {
  border-color: #409EFF;
}

.video-uploader :deep(.el-upload-dragger.is-dragover) {
  border-color: #409EFF;
  background-color: rgba(64, 158, 255, 0.06);
}
</style>