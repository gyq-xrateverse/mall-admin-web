<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button
        class="btn-add"
        @click="handleAddCaseData()"
        size="mini">
        添加案例
      </el-button>
    </el-card>
    <el-card class="filter-container" shadow="never">
      <div>
        <el-form :inline="true" :model="listQuery" size="small">
          <el-form-item label="案例标题：">
            <el-input
              v-model="listQuery.title"
              class="input-width"
              placeholder="案例标题"
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="分类：">
            <el-select
              v-model="listQuery.categoryId"
              placeholder="全部分类"
              clearable
              class="input-width">
              <el-option
                v-for="category in categoryOptions"
                :key="category.id"
                :label="category.name"
                :value="category.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select
              v-model="listQuery.status"
              placeholder="全部状态"
              clearable
              class="input-width">
              <el-option label="启用" :value="1"></el-option>
              <el-option label="禁用" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="显示状态：">
            <el-select
              v-model="listQuery.showStatus"
              placeholder="全部"
              clearable
              class="input-width">
              <el-option label="显示" :value="1"></el-option>
              <el-option label="隐藏" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearchList()">查询</el-button>
            <el-button @click="handleResetSearch()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="table-container">
      <el-table ref="dataTable"
                style="width: 100%"
                :data="list"
                v-loading="listLoading" 
                border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="80" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="案例标题" width="200" align="center">
          <template slot-scope="scope">
            <el-link type="primary" @click="handleViewDetail(scope.row)">
              {{scope.row.title}}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="预览" width="120" align="center">
          <template slot-scope="scope">
            <div class="preview-container">
              <el-image
                v-if="scope.row.image"
                style="width: 60px; height: 40px"
                :src="buildFileUrl(scope.row.image)"
                :preview-src-list="[buildFileUrl(scope.row.image)]"
                fit="cover"
                :lazy="true">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
              <div v-if="scope.row.video" class="video-icon" @click="handlePlayVideo(scope.row)">
                <i class="el-icon-video-play"></i>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="分类" width="120" align="center">
          <template slot-scope="scope">{{scope.row.categoryName}}</template>
        </el-table-column>
        <el-table-column label="浏览数" width="80" align="center">
          <template slot-scope="scope">{{scope.row.viewCount}}</template>
        </el-table-column>
        <el-table-column label="点赞数" width="80" align="center">
          <template slot-scope="scope">{{scope.row.likeCount}}</template>
        </el-table-column>
        <el-table-column label="热度" width="80" align="center">
          <template slot-scope="scope">{{scope.row.hotScore}}</template>
        </el-table-column>
        <el-table-column label="状态" width="80" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleStatusChange(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.status">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="显示" width="80" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleShowStatusChange(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.showStatus">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="160" align="center">
          <template slot-scope="scope">{{scope.row.createTime | formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select size="small" v-model="operateType" placeholder="批量操作">
        <el-option label="删除" value="delete"></el-option>
        <el-option label="设为显示" value="showStatusTrue"></el-option>
        <el-option label="设为隐藏" value="showStatusFalse"></el-option>
        <el-option label="设为启用" value="statusTrue"></el-option>
        <el-option label="设为禁用" value="statusFalse"></el-option>
      </el-select>
      <el-button
        style="margin-left: 20px"
        class="search-button"
        @click="handleBatchOperate()"
        type="primary"
        size="small">
        确定
      </el-button>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[10,15,20]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {fetchList, deleteCaseData, deleteBatch, updateStatus, updateShowStatus} from '@/api/caseData'
  import {fetchAllList} from '@/api/caseCategory'
  import {formatDate} from '@/utils/date';

  export default {
    name: "caseDataList",
    data() {
      return {
        operateType: null,
        list: null,
        total: null,
        listLoading: true,
        categoryOptions: [],
        listQuery: {
          pageNum: 1,
          pageSize: 10,
          title: null,
          categoryId: null,
          status: null,
          showStatus: null,
          sortField: 'create_time',
          sortOrder: 'desc'
        }
      }
    },
    created() {
      this.getCategoryList();
      this.getList();
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
      getCategoryList() {
        fetchAllList().then(response => {
          this.categoryOptions = response.data;
        });
      },
      buildFileUrl(objectName) {
        if (!objectName) {
          return '';
        }

        // 如果已经是完整URL，直接返回
        if (objectName.startsWith('http://') || objectName.startsWith('https://')) {
          return objectName;
        }

        // 使用环境变量构建URL
        const baseUrl = process.env.VUE_APP_FILE_BASE_URL;
        if (!baseUrl) {
          console.warn('VUE_APP_FILE_BASE_URL 环境变量未配置，使用默认地址');
          return 'http://localhost:9090/mall/' + objectName;
        }

        return baseUrl + '/' + objectName;
      },
      handlePlayVideo(row) {
        // 跳转到详情页面播放视频
        this.handleViewDetail(row);
      },
      handleResetSearch() {
        this.listQuery = {
          pageNum: 1,
          pageSize: 10,
          title: null,
          categoryId: null,
          status: null,
          showStatus: null,
          sortField: 'create_time',
          sortOrder: 'desc'
        };
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      handleAddCaseData() {
        this.$router.push('/case/addData');
      },
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      handleStatusChange(index, row) {
        let data = new URLSearchParams();
        let ids = [];
        ids.push(row.id);
        data.append('ids', ids);
        data.append('status', row.status);
        updateStatus(data).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        });
      },
      handleShowStatusChange(index, row) {
        let data = new URLSearchParams();
        let ids = [];
        ids.push(row.id);
        data.append('ids', ids);
        data.append('showStatus', row.showStatus);
        updateShowStatus(data).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        });
      },
      handleViewDetail(row) {
        this.$router.push({path: '/case/dataDetail', query: {id: row.id}});
      },
      handleUpdate(index, row) {
        this.$router.push({path: '/case/updateData', query: {id: row.id}});
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该案例?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCaseData(row.id).then(response => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
            this.getList();
          });
        });
      },
      handleBatchOperate() {
        if (this.operateType === null) {
          this.$message({
            message: '请选择操作类型',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        let ids = [];
        for (let i = 0; i < this.list.length; i++) {
          if (this.$refs.dataTable.selection.indexOf(this.list[i]) !== -1) {
            ids.push(this.list[i].id);
          }
        }
        if (ids.length < 1) {
          this.$message({
            message: '请选择要操作的案例',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        
        let params = new URLSearchParams();
        params.append("ids", ids);
        
        if (this.operateType === "delete") {
          deleteBatch(params).then(response => {
            this.getList();
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
          });
        } else if (this.operateType === "showStatusTrue") {
          params.append("showStatus", 1);
          updateShowStatus(params).then(response => {
            this.getList();
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1000
            });
          });
        } else if (this.operateType === "showStatusFalse") {
          params.append("showStatus", 0);
          updateShowStatus(params).then(response => {
            this.getList();
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1000
            });
          });
        } else if (this.operateType === "statusTrue") {
          params.append("status", 1);
          updateStatus(params).then(response => {
            this.getList();
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1000
            });
          });
        } else if (this.operateType === "statusFalse") {
          params.append("status", 0);
          updateStatus(params).then(response => {
            this.getList();
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1000
            });
          });
        }
      }
    }
  }
</script>

<style scoped>
  .input-width {
    width: 203px;
  }

  .preview-container {
    position: relative;
    display: inline-block;
  }

  .video-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.6);
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: white;
    font-size: 12px;
  }

  .video-icon:hover {
    background: rgba(0, 0, 0, 0.8);
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
</style>