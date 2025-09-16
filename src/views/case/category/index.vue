<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button
        class="btn-add"
        @click="handleAddCaseCategory()"
        size="mini">
        添加案例分类
      </el-button>
    </el-card>
    <el-card class="filter-container" shadow="never">
      <div>
        <el-form :inline="true" :model="listQuery" size="small">
          <el-form-item label="分类名称：">
            <el-input
              v-model="listQuery.name"
              class="input-width"
              placeholder="分类名称"
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="显示状态：">
            <el-select
              v-model="listQuery.showStatus"
              placeholder="全部"
              clearable
              class="input-width">
              <el-option
                label="显示"
                :value="1">
              </el-option>
              <el-option
                label="隐藏"
                :value="0">
              </el-option>
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
      <el-table ref="categoryTable"
                style="width: 100%"
                :data="list"
                v-loading="listLoading" 
                border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="分类名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="描述" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.description}}</template>
        </el-table-column>
        <el-table-column label="排序" width="100" align="center">
          <template slot-scope="scope">{{scope.row.sort}}</template>
        </el-table-column>
        <el-table-column label="是否显示" width="120" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleShowStatusChange(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.showStatus">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180" align="center">
          <template slot-scope="scope">{{scope.row.createTime | formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select
        size="small"
        v-model="operateType" placeholder="批量操作">
        <el-option
          label="删除"
          value="delete">
        </el-option>
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
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {fetchList, deleteCaseCategory, deleteBatch, updateShowStatus} from '@/api/caseCategory'
  import {formatDate} from '@/utils/date';

  export default {
    name: "caseCategoryList",
    data() {
      return {
        operateType: null,
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          pageNum: 1,
          pageSize: 10,
          name: null,
          showStatus: null,
          sortField: 'createTime',
          sortOrder: 'desc'
        }
      }
    },
    created() {
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
      handleResetSearch() {
        this.listQuery = {
          pageNum: 1,
          pageSize: 10,
          name: null,
          showStatus: null,
          sortField: 'createTime',
          sortOrder: 'desc'
        };
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      handleAddCaseCategory() {
        this.$router.push('/case/addCategory');
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
      handleUpdate(index, row) {
        this.$router.push({path: '/case/updateCategory', query: {id: row.id}});
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该案例分类?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCaseCategory(row.id).then(response => {
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
          if (this.$refs.categoryTable.selection.indexOf(this.list[i]) !== -1) {
            ids.push(this.list[i].id);
          }
        }
        if (ids.length < 1) {
          this.$message({
            message: '请选择要操作的案例分类',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        if (this.operateType === "delete") {
          let params = new URLSearchParams();
          params.append("ids", ids);
          deleteBatch(params).then(response => {
            this.getList();
            this.$message({
              message: '删除成功',
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
</style>