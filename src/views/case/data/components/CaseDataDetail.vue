<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="caseData"
             :rules="rules"
             ref="caseDataFrom"
             label-width="150px">
      <el-form-item label="案例标题：" prop="title">
        <el-input v-model="caseData.title" placeholder="请输入案例标题"></el-input>
      </el-form-item>
      <el-form-item label="案例分类：" prop="categoryId">
        <el-select
          v-model="caseData.categoryId"
          placeholder="请选择案例分类"
          class="input-width">
          <el-option
            v-for="category in categoryOptions"
            :key="category.id"
            :label="category.name"
            :value="category.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="案例内容：" prop="content">
        <tinymce :height="400" v-model="caseData.content"></tinymce>
      </el-form-item>
      <el-form-item label="视频封面：" prop="image">
        <el-upload
          class="image-uploader"
          action="#"
          :show-file-list="false"
          :before-upload="beforeImageUpload"
          :auto-upload="false"
          accept="image/*"
          :on-change="onImageChange">
          <img v-if="caseData.imagePreviewUrl" :src="caseData.imagePreviewUrl" class="image-preview">
          <i v-else class="el-icon-plus image-uploader-icon"></i>
        </el-upload>
        <div v-if="caseData.imageFile" class="file-info">
          <span class="file-name">{{ caseData.imageFile.name }}</span>
          <el-button type="text" @click="removeImageFile" class="remove-btn">删除</el-button>
        </div>
        <div class="input-tip">图片格式：jpg/png/gif，最大3MB</div>
      </el-form-item>
      <el-form-item label="视频文件：" prop="video">
        <el-upload
          class="video-uploader"
          action="#"
          :show-file-list="false"
          :before-upload="beforeVideoUpload"
          :auto-upload="false"
          accept="video/*"
          :on-change="onVideoChange">
          <el-button size="small" type="primary">选择视频</el-button>
        </el-upload>
        <div v-if="caseData.videoFile" class="file-info">
          <span class="file-name">{{ caseData.videoFile.name }}</span>
          <el-button type="text" @click="removeVideoFile" class="remove-btn">删除</el-button>
        </div>
        <div v-if="caseData.videoPreviewUrl" class="video-preview">
          <video :src="caseData.videoPreviewUrl" controls width="300" height="200"></video>
        </div>
        <div class="input-tip">视频格式：mp4/avi/mov/mkv/wmv，最大500MB</div>
      </el-form-item>
      <el-form-item label="标签：">
        <el-tag
          v-for="tag in caseData.tagList"
          :key="tag"
          closable
          @close="handleCloseTag(tag)">
          {{tag}}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm">
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新标签</el-button>
      </el-form-item>
      <el-form-item label="状态：">
        <el-radio-group v-model="caseData.status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="显示状态：">
        <el-radio-group v-model="caseData.showStatus">
          <el-radio :label="1">显示</el-radio>
          <el-radio :label="0">隐藏</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('caseDataFrom')" :loading="caseData.submitting">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('caseDataFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  import {createCaseData, getCaseData, updateCaseData} from '@/api/caseData'
  import {fetchAllList} from '@/api/caseCategory'
  import Tinymce from '@/components/Tinymce'

  const defaultCaseData = {
    title: '',
    categoryId: null,
    content: '',
    image: '',
    video: '',
    tagList: [],
    status: 1,
    showStatus: 1,
    // 新增的辅助字段
    imageFile: null,
    videoFile: null,
    imagePreviewUrl: '',
    videoPreviewUrl: '',
    submitting: false
  };

  export default {
    name: 'CaseDataDetail',
    components: {
      Tinymce
    },
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        caseData: Object.assign({}, defaultCaseData),
        categoryOptions: [],
        inputVisible: false,
        inputValue: '',
        rules: {
          title: [
            {required: true, message: '请输入案例标题', trigger: 'blur'},
            {min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur'}
          ],
          categoryId: [
            {required: true, message: '请选择案例分类', trigger: 'change'}
          ],
          content: [
            {required: true, message: '请输入案例内容', trigger: 'blur'}
          ],
          image: [
            {required: true, message: '请上传视频封面', trigger: 'blur'}
          ],
          video: [
            {required: true, message: '请上传视频文件', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      this.getCategoryList();
      if (this.isEdit) {
        this.getCaseData();
      }
    },
    methods: {
      getCategoryList() {
        fetchAllList().then(response => {
          this.categoryOptions = response.data;
        });
      },
      getCaseData() {
        let id = this.$route.query.id;
        getCaseData(id).then(response => {
          this.caseData = Object.assign({}, defaultCaseData, response.data);
          // 处理标签数据
          if (this.caseData.tagList && this.caseData.tagList.length === 0) {
            this.caseData.tagList = [];
          }
          // 设置预览URL（编辑模式下显示现有文件）
          if (this.caseData.image) {
            this.caseData.imagePreviewUrl = this.buildFileUrl(this.caseData.image);
          }
          if (this.caseData.video) {
            this.caseData.videoPreviewUrl = this.buildFileUrl(this.caseData.video);
          }
        });
      },
      handleCloseTag(tag) {
        this.caseData.tagList.splice(this.caseData.tagList.indexOf(tag), 1);
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue && this.caseData.tagList.indexOf(inputValue) === -1) {
          this.caseData.tagList.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      onImageChange(file, fileList) {
        console.log('onImageChange called:', file, fileList);
        if (file && file.raw) {
          this.handleImageFile(file.raw);
        }
      },
      beforeImageUpload(file) {
        console.log('beforeImageUpload called with file:', file);
        this.handleImageFile(file);
        return false; // 阻止自动上传
      },
      handleImageFile(file) {
        const isValidFormat = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type);
        const isLt20M = file.size / 1024 / 1024 < 20;

        if (!isValidFormat) {
          this.$message.error('图片格式只支持 JPG、PNG、GIF');
          return;
        }
        if (!isLt20M) {
          this.$message.error('图片大小不能超过 20MB');
          return;
        }

        // 本地暂存文件 - 使用Vue.set确保响应式
        this.$set(this.caseData, 'imageFile', file);
        this.$set(this.caseData, 'image', file.name); // 用于验证

        // 创建预览URL
        const reader = new FileReader();
        reader.onload = (e) => {
          this.$set(this.caseData, 'imagePreviewUrl', e.target.result);
          console.log('Image preview URL set:', e.target.result);
        };
        reader.readAsDataURL(file);
      },
      onVideoChange(file, fileList) {
        console.log('onVideoChange called:', file, fileList);
        if (file && file.raw) {
          this.handleVideoFile(file.raw);
        }
      },
      beforeVideoUpload(file) {
        console.log('beforeVideoUpload called with file:', file);
        this.handleVideoFile(file);
        return false; // 阻止自动上传
      },
      handleVideoFile(file) {
        // 扩展视频格式支持，包括文件扩展名检查
        const validVideoTypes = [
          'video/mp4', 'video/avi', 'video/mov', 'video/quicktime',
          'video/x-msvideo', 'video/x-matroska', 'video/x-ms-wmv',
          'video/webm', 'video/ogg', 'video/3gpp'
        ];
        const fileName = file.name.toLowerCase();
        const validExtensions = ['.mp4', '.avi', '.mov', '.mkv', '.wmv', '.webm', '.ogg', '.3gp'];

        const hasValidType = validVideoTypes.includes(file.type);
        const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
        const isValidFormat = hasValidType || hasValidExtension;
        const isLt500M = file.size / 1024 / 1024 < 500;

        console.log('Video file type:', file.type);
        console.log('Video file name:', fileName);
        console.log('Video file size (MB):', file.size / 1024 / 1024);
        console.log('Has valid type:', hasValidType);
        console.log('Has valid extension:', hasValidExtension);

        if (!isValidFormat) {
          this.$message.error('视频格式只支持 MP4、AVI、MOV、MKV、WMV、WEBM等格式');
          return;
        }
        if (!isLt500M) {
          this.$message.error('视频大小不能超过 500MB');
          return;
        }

        // 本地暂存文件 - 使用Vue.set确保响应式
        this.$set(this.caseData, 'videoFile', file);
        this.$set(this.caseData, 'video', file.name); // 用于验证

        // 创建预览URL
        const url = URL.createObjectURL(file);
        this.$set(this.caseData, 'videoPreviewUrl', url);
        console.log('Video preview URL set:', url);
      },
      removeImageFile() {
        this.$set(this.caseData, 'imageFile', null);
        this.$set(this.caseData, 'image', '');
        this.$set(this.caseData, 'imagePreviewUrl', '');
        console.log('Image file removed');
      },
      removeVideoFile() {
        if (this.caseData.videoPreviewUrl) {
          URL.revokeObjectURL(this.caseData.videoPreviewUrl);
        }
        this.$set(this.caseData, 'videoFile', null);
        this.$set(this.caseData, 'video', '');
        this.$set(this.caseData, 'videoPreviewUrl', '');
        console.log('Video file removed');
      },
      buildFileUrl(objectName) {
        // 后端返回的已经是完整URL，直接返回即可
        return objectName || '';
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (this.isEdit) {
                this.updateCaseData();
              } else {
                this.createCaseData();
              }
            });
          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration: 1000
            });
            return false;
          }
        });
      },
      createCaseData() {
        this.caseData.submitting = true;

        // 构建FormData
        const formData = new FormData();
        formData.append('categoryId', this.caseData.categoryId);
        formData.append('title', this.caseData.title);
        formData.append('content', this.caseData.content);
        formData.append('status', this.caseData.status);
        formData.append('showStatus', this.caseData.showStatus);

        // 处理标签
        if (this.caseData.tagList && this.caseData.tagList.length > 0) {
          formData.append('tags', this.caseData.tagList.join(','));
        }

        // 添加文件
        if (this.caseData.imageFile) {
          formData.append('imageFile', this.caseData.imageFile);
        }
        if (this.caseData.videoFile) {
          formData.append('videoFile', this.caseData.videoFile);
        }

        createCaseData(formData).then(response => {
          this.caseData.submitting = false;
          this.$refs.caseDataFrom.resetFields();
          this.caseData = Object.assign({}, defaultCaseData);
          this.$message({
            message: '提交成功',
            type: 'success',
            duration: 1000
          });
        }).catch(error => {
          this.caseData.submitting = false;
          this.$message({
            message: '提交失败: ' + (error.message || '未知错误'),
            type: 'error',
            duration: 3000
          });
        });
      },
      updateCaseData() {
        let id = this.$route.query.id;
        this.caseData.submitting = true;

        // 构建FormData
        const formData = new FormData();
        formData.append('categoryId', this.caseData.categoryId);
        formData.append('title', this.caseData.title);
        formData.append('content', this.caseData.content);
        formData.append('status', this.caseData.status);
        formData.append('showStatus', this.caseData.showStatus);

        // 处理标签
        if (this.caseData.tagList && this.caseData.tagList.length > 0) {
          formData.append('tags', this.caseData.tagList.join(','));
        }

        // 只添加修改的文件
        if (this.caseData.imageFile) {
          formData.append('imageFile', this.caseData.imageFile);
        }
        if (this.caseData.videoFile) {
          formData.append('videoFile', this.caseData.videoFile);
        }

        updateCaseData(id, formData).then(response => {
          this.caseData.submitting = false;
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
          this.$router.back();
        }).catch(error => {
          this.caseData.submitting = false;
          this.$message({
            message: '修改失败: ' + (error.message || '未知错误'),
            type: 'error',
            duration: 3000
          });
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.caseData = Object.assign({}, defaultCaseData);
      }
    }
  }
</script>

<style scoped>
  .input-width {
    width: 100%;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .input-tip {
    color: #909399;
    font-size: 12px;
    margin-top: 5px;
  }

  .image-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .image-uploader:hover {
    border-color: #409EFF;
  }

  .image-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 148px;
    height: 148px;
    line-height: 148px;
    text-align: center;
  }

  .image-preview {
    width: 148px;
    height: 148px;
    display: block;
  }

  .video-uploader {
    margin-bottom: 10px;
  }

  .file-info {
    margin-top: 10px;
    padding: 8px 12px;
    background-color: #f5f7fa;
    border-radius: 4px;
    border: 1px solid #e4e7ed;
  }

  .file-name {
    color: #606266;
    font-size: 14px;
  }

  .remove-btn {
    margin-left: 10px;
    color: #f56c6c;
  }

  .video-preview {
    margin-top: 10px;
  }

  .video-preview video {
    max-width: 100%;
  }
</style>