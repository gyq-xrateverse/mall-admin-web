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
        <single-upload v-model="caseData.image"></single-upload>
        <div class="input-tip">视频的封面图片，用于列表展示</div>
      </el-form-item>
      <el-form-item label="视频文件：" prop="video">
        <video-upload v-model="caseData.video"></video-upload>
        <div class="input-tip">视频文件，支持mp4、avi、mov等格式，文件大小不超过500MB</div>
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
        <el-button type="primary" @click="onSubmit('caseDataFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('caseDataFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  import {createCaseData, getCaseData, updateCaseData} from '@/api/caseData'
  import {fetchAllList} from '@/api/caseCategory'
  import SingleUpload from '@/components/Upload/singleUpload'
  import VideoUpload from '@/components/Upload/videoUpload'
  import Tinymce from '@/components/Tinymce'

  const defaultCaseData = {
    title: '',
    categoryId: null,
    content: '',
    image: '',
    video: '',
    tagList: [],
    status: 1,
    showStatus: 1
  };

  export default {
    name: 'CaseDataDetail',
    components: {
      SingleUpload,
      VideoUpload,
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
            {required: true, message: '请上传视频封面', trigger: 'change'}
          ],
          video: [
            {required: true, message: '请上传视频文件', trigger: 'change'}
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
          this.caseData = response.data;
          // 处理标签数据
          if (this.caseData.tagList && this.caseData.tagList.length === 0) {
            this.caseData.tagList = [];
          }
          // 确保必要字段有默认值
          if (!this.caseData.image) {
            this.caseData.image = '';
          }
          if (!this.caseData.video) {
            this.caseData.video = '';
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
        // 处理标签数据
        let submitData = Object.assign({}, this.caseData);
        if (submitData.tagList && submitData.tagList.length > 0) {
          submitData.tags = submitData.tagList.join(',');
        }
        
        createCaseData(submitData).then(response => {
          this.$refs.caseDataFrom.resetFields();
          this.caseData = Object.assign({}, defaultCaseData);
          this.$message({
            message: '提交成功',
            type: 'success',
            duration: 1000
          });
        });
      },
      updateCaseData() {
        let id = this.$route.query.id;
        // 处理标签数据
        let submitData = Object.assign({}, this.caseData);
        if (submitData.tagList && submitData.tagList.length > 0) {
          submitData.tags = submitData.tagList.join(',');
        }
        
        updateCaseData(id, submitData).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
          this.$router.back();
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
</style>