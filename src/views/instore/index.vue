<template>
  <!-- 入库列表-->
  <div>
    <el-form class="searchForm" inline>
      <el-form-item>
        <el-select v-model="params.storeId" clearable placeholder="仓库" style="width: 120px;">
          <el-option v-for="store of storeList" :key="store.storeId" :label="store.storeName" :value="store.storeId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="params.productName" clearable placeholder="商品名称" style="width: 120px;"></el-input>
      </el-form-item>
      <el-form-item label="开始时间:">
        <el-input v-model="params.startTime" clearable style="width: 120px;" type="date"></el-input>
      </el-form-item>
      <el-form-item label="结束时间:">
        <el-input v-model="params.endTime" clearable style="width: 120px;" type="date"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getInstorePageList">
          <el-icon>
            <Search/>
          </el-icon>
          &nbsp;查&nbsp;&nbsp;询
        </el-button>
      </el-form-item>
    </el-form>
  </div>

  <!-- 表格 -->
  <el-table :data="instorePageList" border size="large" stripe style="width: 100%;margin-top: 10px;" table-layout="auto">
    <el-table-column label="入库单ID" prop="insId" sortable/>
    <el-table-column label="仓库名称" prop="storeName" sortable/>
    <el-table-column label="商品名称" prop="productName" sortable/>
    <el-table-column label="入库数量" prop="inNum" sortable/>
    <el-table-column label="入库价格" prop="inPrice" sortable/>
    <el-table-column label="入库状态" sortable>
      <template #default="props">
        <span :class="{red:props.row.isIn===0, green: props.row.isIn===1}">{{ props.row.isIn === 0 ? "未入库" : "已入库" }}</span>
      </template>
    </el-table-column>
    <el-table-column label="创建人" prop="userCode" sortable/>
    <el-table-column label="创建时间" prop="createTime" sortable/>
    <el-table-column label="操作">
      <template #default="props">
        <el-button v-if="props.row.isIn===0" :key="props.row.insId" title="确定入库" type="primary" @click="confirmInstore(props.row)">确定入库</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <el-pagination
      v-model:currentPage="params.pageNum"
      v-model:page-size="params.pageSize"
      :page-sizes="[5, 10, 15, 20, 25, 30]"
      :total="params.totalNum"
      background
      layout="total, sizes, prev, pager, next, jumper"
      style="margin-top: 20px;"
      @size-change="changeSize"
      @current-change="changeCurrent"
  />

</template>

<script setup>
import {reactive, ref} from 'vue';
import {get, put, tip, export2excel} from "@/common";
import {useRoute} from 'vue-router'
import {Search, Edit, Check, Message, Star, Delete} from '@element-plus/icons-vue'

const route = useRoute(); // 获取路由信息

// 分页模糊查询数据
const params = reactive({
  storeId: undefined,
  productName: '',
  startTime: '',
  endTime: '',
  pageSize: 5,
  pageNum: 1,
  totalNum: 0
})

// 表格数据
const instorePageList = ref();

// 获取分页模糊查询结果
const getInstorePageList = () => {
  // 如果从添加入库单跳过来，会传参storeId
  if (route.query.storeId) {
    params.storeId = parseInt(route.query.storeId);
  }
  // 后台获取查询结果
  get("/instore/instore-page-list", params).then(result => {
    instorePageList.value = result.data.resultList;
    params.totalNum = result.data.totalNum;
  });
}
getInstorePageList();

// 所有仓库
const storeList = ref();
// 获取所有仓库
const getStoreList = () => {
  get("/instore/store-list").then(result => {
    storeList.value = result.data;
  });
}
getStoreList();

// 确定入库
const confirmInstore = (instore) => {
  put('/instore/instore-confirm', instore).then(res => {
    tip.success(res.message);
    getInstorePageList();
  });
}

// 修改每页显示条数
const changeSize = (size) => {
  params.pageSize = size;
  // 重新查询
  getInstorePageList();
}
// 修改当前页码
const changeCurrent = (num) => {
  params.pageNum = num;
  // 重新查询
  getInstorePageList();
}
</script>

<style scoped>
.searchForm {
  margin-top: 20px;
  display: flex;
}

.red {
  color: red;
}

.green {
  color: green;
}
</style>