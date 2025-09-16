<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="caseCategory"
             :rules="rules"
             ref="caseCategoryFrom"
             label-width="150px">
      <el-form-item label="分类名称：" prop="name">
        <el-input v-model="caseCategory.name" placeholder="请输入案例分类名称"></el-input>
      </el-form-item>
      <el-form-item label="描述：">
        <el-input 
          type="textarea" 
          :autosize="{minRows: 3, maxRows: 6}" 
          v-model="caseCategory.description" 
          placeholder="请输入案例分类描述">
        </el-input>
      </el-form-item>
      <el-form-item label="排序：" prop="sort">
        <el-input-number v-model="caseCategory.sort" :min="0" :max="1000" placeholder="排序值"></el-input-number>
      </el-form-item>
      <el-form-item label="是否显示：">
        <el-radio-group v-model="caseCategory.showStatus">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('caseCategoryFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('caseCategoryFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  import {createCaseCategory, getCaseCategory, updateCaseCategory} from '@/api/caseCategory'

  const defaultCaseCategory = {
    name: '',
    description: '',
    sort: 0,
    showStatus: 1
  };

  export default {
    name: 'CaseCategoryDetail',
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        caseCategory: Object.assign({}, defaultCaseCategory),
        rules: {
          name: [
            {required: true, message: '请输入分类名称', trigger: 'blur'},
            {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}
          ],
          sort: [
            {required: true, message: '请输入排序值', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      if (this.isEdit) {
        this.getCategory();
      }
    },
    methods: {
      getCategory() {
        let id = this.$route.query.id;
        getCaseCategory(id).then(response => {
          this.caseCategory = response.data;
        });
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
                this.updateCategory();
              } else {
                this.createCategory();
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
      createCategory() {
        createCaseCategory(this.caseCategory).then(response => {
          this.$refs.caseCategoryFrom.resetFields();
          this.caseCategory = Object.assign({}, defaultCaseCategory);
          this.$message({
            message: '提交成功',
            type: 'success',
            duration: 1000
          });
        });
      },
      updateCategory() {
        let id = this.$route.query.id;
        updateCaseCategory(id, this.caseCategory).then(response => {
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
        this.caseCategory = Object.assign({}, defaultCaseCategory);
      }
    }
  }
</script>

<style scoped>

</style>