<template>
  <!-- 出库列表-->
  <div>
    <el-form class="searchForm" inline>
      <el-form-item>
        <el-select v-model="params.storeId" placeholder="仓库" clearable style="width: 120px;">
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
        <el-select v-model="params.isOut" clearable placeholder="出库状态" style="width: 120px;">
          <el-option :value="0" label="未出库"></el-option>
          <el-option :value="1" label="已出库"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getOutstorePageList">
          <el-icon>
            <Search/>
          </el-icon>
          &nbsp;查&nbsp;&nbsp;询
        </el-button>
      </el-form-item>
    </el-form>

  </div>

  <!-- 表格 -->
  <el-table :data="outstorePageList" border size="large" stripe style="width: 100%;margin-top: 10px;" table-layout="auto">
    <el-table-column label="出库单ID" prop="outsId" sortable/>
    <el-table-column label="仓库名称" prop="storeName" sortable/>
    <el-table-column label="商品名称" prop="productName" sortable/>
    <el-table-column label="出库数量" prop="outNum" sortable/>
    <el-table-column label="出库状态" sortable>
      <template #default="props">
        <span :class="{red:props.row.isOut==0, green: props.row.isOut==1}">{{ props.row.isOut == 0 ? "未出库" : "已出库" }}</span>
      </template>
    </el-table-column>
    <el-table-column label="创建人" prop="userCode" sortable/>
    <el-table-column label="创建时间" prop="createTime" sortable/>
    <el-table-column label="操作">
      <template #default="props">
        <el-button v-if="props.row.isOut==0" :key="props.row.outsId" title="确定出库" type="primary" @click="confirmOutstore(props.row)">确定出库</el-button>
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
  isOut: '',
  pageSize: 5,
  pageNum: 1,
  totalNum: 0
})

// 表格数据
const outstorePageList = ref();

// 获取分页模糊查询结果
const getOutstorePageList = () => {
  // 如果从添加出库单跳过来，会传参storeId
  if (route.query.storeId) {
    params.storeId = parseInt(route.query.storeId);
  }
  // 后台获取查询结果
  get("/outstore/outstore-page-list", params).then(result => {
    outstorePageList.value = result.data.resultList;
    params.totalNum = result.data.totalNum;
  });
}
getOutstorePageList();

// 所有仓库
const storeList = ref();
// 获取所有仓库
const getStoreList = () => {
  get("/outstore/store-list").then(result => {
    storeList.value = result.data;
  });
}
getStoreList();

// 确定入库
const confirmOutstore = outstore => {
  put('/outstore/outstore-confirm', outstore).then(res => {
    tip.success(res.message);
    getOutstorePageList();
  });
}


// 修改每页显示条数
const changeSize = (size) => {
  params.pageSize = size;
  // 重新查询
  getOutstorePageList();
}
// 修改当前页码
const changeCurrent = (num) => {
  params.pageNum = num;
  // 重新查询
  getOutstorePageList();
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