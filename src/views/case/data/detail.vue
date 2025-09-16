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
        <div class="content-section" v-if="caseData.coverImage">
          <h3>封面图片</h3>
          <el-image 
            style="width: 300px; height: 200px"
            :src="caseData.coverImage"
            :preview-src-list="[caseData.coverImage]"
            fit="cover">
          </el-image>
        </div>
        
        <div class="content-section">
          <h3>案例内容</h3>
          <div v-html="caseData.content" class="rich-content"></div>
        </div>
        
        <div class="content-section" v-if="caseData.imageList && caseData.imageList.length > 0">
          <h3>案例图片</h3>
          <div class="image-gallery">
            <el-image 
              v-for="(image, index) in caseData.imageList"
              :key="index"
              style="width: 150px; height: 100px; margin-right: 10px; margin-bottom: 10px"
              :src="image"
              :preview-src-list="caseData.imageList"
              fit="cover">
            </el-image>
          </div>
        </div>
        
        <div class="content-section" v-if="caseData.tagList && caseData.tagList.length > 0">
          <h3>标签</h3>
          <div class="tag-list">
            <el-tag v-for="tag in caseData.tagList" :key="tag" style="margin-right: 10px;">
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
        caseData: null
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
        });
      },
      handleEdit() {
        this.$router.push({path: '/case/updateData', query: {id: this.caseData.id}});
      },
      goBack() {
        this.$router.back();
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
</style>