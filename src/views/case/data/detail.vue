<template>
  <el-card class="form-container" shadow="never">
    <div v-if="caseData" class="case-detail">
      <div class="detail-header">
        <h2>{{caseData.title}}</h2>
        <div class="meta-info">
          <span class="meta-item">分类：{{caseData.categoryName}}</span>
          <span class="meta-item">浏览：{{caseData.viewCount}}</span>
          <span class="meta-item">点赞：{{caseData.likeCount}}</span>
          <span class="meta-item">热度：{{caseData.hotScore}}</span>
          <span class="meta-item">创建时间：{{caseData.createTime | formatDateTime}}</span>
        </div>
      </div>
      
      <div class="detail-content">
        <div class="content-section" v-if="caseData.video">
          <h3>案例视频</h3>
          <div class="video-container">
            <video
              ref="videoPlayer"
              :src="caseData.video"
              :poster="caseData.image"
              controls
              preload="metadata"
              width="100%"
              height="400"
              @loadstart="onVideoLoadStart"
              @loadeddata="onVideoLoaded"
              @error="onVideoError"
              @play="onVideoPlay"
              @pause="onVideoPause">
              您的浏览器不支持视频播放。
            </video>
            <div v-if="videoError" class="video-error">
              <i class="el-icon-warning"></i>
              <span>视频加载失败</span>
            </div>
          </div>
        </div>

        <div class="content-section" v-if="caseData.image">
          <h3>视频封面</h3>
          <img
            style="width: 300px; height: 200px; object-fit: cover; cursor: pointer"
            :src="caseData.image"
            @click="previewImage(caseData.image)"
            @error="handleImageError($event)"
            :alt="caseData.title" />
        </div>
        
        <div class="content-section">
          <h3>案例内容</h3>
          <div v-html="caseData.content" class="rich-content"></div>
        </div>
        
        <div class="content-section" v-if="displayTagList && displayTagList.length > 0">
          <h3>标签</h3>
          <div class="tag-list">
            <el-tag v-for="tag in displayTagList" :key="tag" style="margin-right: 10px;">
              {{tag}}
            </el-tag>
          </div>
        </div>
        
        <div class="content-section">
          <h3>状态信息</h3>
          <div class="status-info">
            <el-tag :type="caseData.status === 1 ? 'success' : 'danger'">
              {{caseData.status === 1 ? '启用' : '禁用'}}
            </el-tag>
            <el-tag :type="caseData.showStatus === 1 ? 'success' : 'info'" style="margin-left: 10px;">
              {{caseData.showStatus === 1 ? '显示' : '隐藏'}}
            </el-tag>
          </div>
        </div>

        <div class="content-section" v-if="relatedCases && relatedCases.length > 0">
          <h3>相关案例</h3>
          <div class="related-cases">
            <div
              v-for="item in relatedCases"
              :key="item.id"
              class="related-case-item"
              @click="viewRelatedCase(item)">
              <img
                style="width: 120px; height: 80px; object-fit: cover"
                :src="item.image"
                @error="handleImageError($event)"
                :alt="item.title" />
              <div class="case-info">
                <h4>{{item.title}}</h4>
                <p class="case-meta">
                  <span>浏览: {{item.viewCount}}</span>
                  <span>点赞: {{item.likeCount}}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="detail-footer">
        <el-button @click="handleEdit">编辑</el-button>
        <el-button @click="goBack">返回</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
  import {getCaseData} from '@/api/caseData'
  import {formatDate} from '@/utils/date';

  export default {
    name: 'CaseDataDetail',
    data() {
      return {
        caseData: null,
        relatedCases: [],
        videoError: false,
        videoLoading: false
      }
    },
    computed: {
      displayTagList() {
        if (!this.caseData || !this.caseData.tagList) return [];
        if (Array.isArray(this.caseData.tagList)) {
          return this.caseData.tagList;
        }
        // 如果是字符串，按逗号分割
        if (typeof this.caseData.tagList === 'string') {
          return this.caseData.tagList.split(',').map(tag => tag.trim()).filter(tag => tag);
        }
        return [];
      }
    },
    created() {
      this.getCaseData();
    },
    filters: {
      formatDateTime(time) {
        if (time == null || time === '') {
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      }
    },
    methods: {
      getCaseData() {
        let id = this.$route.query.id;
        getCaseData(id).then(response => {
          this.caseData = response.data;
          this.getRelatedCases();
        }).catch(error => {
          this.$message.error('获取案例详情失败');
        });
      },
      getRelatedCases() {
        // 模拟获取相关案例，实际应该调用API
        // fetchRelatedCases(this.caseData.categoryId, this.caseData.id)
        this.relatedCases = [];
      },
      onVideoLoadStart() {
        this.videoLoading = true;
        this.videoError = false;
      },
      onVideoLoaded() {
        this.videoLoading = false;
        this.videoError = false;
      },
      onVideoError() {
        this.videoLoading = false;
        this.videoError = true;
        this.$message.error('视频加载失败');
      },
      onVideoPlay() {
        // 可以在这里统计播放数据
        console.log('视频开始播放');
      },
      onVideoPause() {
        console.log('视频暂停');
      },
      viewRelatedCase(caseItem) {
        this.$router.push({path: '/case/dataDetail', query: {id: caseItem.id}});
      },
      handleEdit() {
        this.$router.push({path: '/case/updateData', query: {id: this.caseData.id}});
      },
      goBack() {
        this.$router.back();
      },
      previewImage(imageUrl) {
        // 使用Element UI的Dialog实现图片预览
        this.$alert(`<img src="${imageUrl}" style="max-width: 100%; max-height: 500px;"/>`, '图片预览', {
          dangerouslyUseHTMLString: true,
          showCancelButton: false,
          showConfirmButton: false,
          customClass: 'image-preview-dialog'
        });
      },
      handleImageError(event) {
        // 图片加载失败时显示默认图标
        event.target.style.display = 'none';
        const errorDiv = document.createElement('div');
        errorDiv.className = 'image-slot';
        errorDiv.innerHTML = '<i class="el-icon-picture-outline"></i>';
        errorDiv.style.cssText = event.target.style.width + ' height: ' + event.target.style.height + '; display: flex; justify-content: center; align-items: center; background: #f5f7fa; color: #909399; font-size: 20px;';
        event.target.parentNode.appendChild(errorDiv);
      }
    },
    beforeDestroy() {
      // 清理视频资源
      if (this.$refs.videoPlayer) {
        this.$refs.videoPlayer.pause();
        this.$refs.videoPlayer.src = '';
      }
    }
  }
</script>

<style scoped>
  .case-detail {
    max-width: 1000px;
  }
  
  .detail-header {
    border-bottom: 1px solid #ebeef5;
    padding-bottom: 20px;
    margin-bottom: 30px;
  }
  
  .detail-header h2 {
    color: #303133;
    margin: 0 0 15px 0;
  }
  
  .meta-info {
    color: #909399;
    font-size: 14px;
  }
  
  .meta-item {
    margin-right: 20px;
  }
  
  .content-section {
    margin-bottom: 30px;
  }
  
  .content-section h3 {
    color: #606266;
    margin: 0 0 15px 0;
    font-size: 16px;
    font-weight: 600;
  }
  
  .rich-content {
    line-height: 1.8;
    color: #303133;
  }
  
  .rich-content img {
    max-width: 100%;
    height: auto;
  }
  
  .image-gallery {
    display: flex;
    flex-wrap: wrap;
  }
  
  .tag-list {
    display: flex;
    flex-wrap: wrap;
  }
  
  .status-info {
    display: flex;
    align-items: center;
  }
  
  .detail-footer {
    border-top: 1px solid #ebeef5;
    padding-top: 20px;
    text-align: right;
  }

  .video-container {
    position: relative;
    background: #000;
    border-radius: 8px;
    overflow: hidden;
  }

  .video-container video {
    width: 100%;
    height: auto;
    max-height: 500px;
  }

  .video-error {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #f56c6c;
    text-align: center;
  }

  .video-error i {
    font-size: 48px;
    margin-bottom: 10px;
    display: block;
  }

  .image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: #f5f7fa;
    color: #909399;
    font-size: 20px;
  }

  .related-cases {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
  }

  .related-case-item {
    display: flex;
    width: 300px;
    padding: 10px;
    border: 1px solid #ebeef5;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
  }

  .related-case-item:hover {
    border-color: #409EFF;
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
  }

  .case-info {
    margin-left: 10px;
    flex: 1;
  }

  .case-info h4 {
    margin: 0 0 5px 0;
    font-size: 14px;
    color: #303133;
    line-height: 1.4;
  }

  .case-meta {
    color: #909399;
    font-size: 12px;
    margin: 0;
  }

  .case-meta span {
    margin-right: 10px;
  }
</style>