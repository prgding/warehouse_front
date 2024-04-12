<template>
  <!-- 入库列表-->
  <div>
    <el-form class="searchForm" inline>
      <el-form-item>
        <el-select v-model="params.warehouseId" clearable placeholder="仓库" style="width: 120px;">
          <el-option v-for="warehouse of warehouseList" :key="warehouse.warehouseId" :label="warehouse.warehouseName" :value="warehouse.warehouseId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="params.productName" clearable placeholder="商品名称" style="width: 120px;"></el-input>
      </el-form-item>
      <el-date-picker
          style="padding-right: 30px"
          v-model="params.startTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="开始时间："
      />

      <el-date-picker
          style="padding-right: 30px;"
          v-model="params.endTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="结束时间："
      />
      <el-form-item>
        <el-button type="primary" @click="getInWarehousePageList">
          <el-icon>
            <Search/>
          </el-icon>
          &nbsp;查&nbsp;&nbsp;询
        </el-button>
      </el-form-item>
    </el-form>
  </div>

  <!-- 表格 -->
  <el-table :data="inWarehousePageList" border size="large" stripe style="width: 100%;margin-top: 10px;" table-layout="auto">
    <el-table-column label="入库单ID" prop="insId" sortable/>
    <el-table-column label="仓库名称" prop="warehouseName" sortable/>
    <el-table-column label="商品名称" prop="productName" sortable/>
    <el-table-column label="入库数量" prop="inNum" sortable/>
    <el-table-column label="入库状态" sortable>
      <template #default="props">
        <span :class="{red:props.row.isIn===0, green: props.row.isIn===1}">{{ props.row.isIn === 0 ? "未入库" : "已入库" }}</span>
      </template>
    </el-table-column>
    <el-table-column label="创建人" prop="userCode" sortable/>
    <el-table-column label="创建时间" prop="createTime" sortable/>
    <el-table-column label="操作">
      <template #default="props">
        <el-button v-if="props.row.isIn===0" :key="props.row.insId" title="确定入库" type="primary" @click="confirmInWarehouse(props.row)">确定入库</el-button>
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
  warehouseId: undefined,
  productName: '',
  startTime: undefined,
  endTime: undefined,
  pageSize: 5,
  pageNum: 1,
  totalNum: 0
})

// 表格数据
const inWarehousePageList = ref();

// 获取分页模糊查询结果
const getInWarehousePageList = () => {
  // 如果从添加入库单跳过来，会传参warehouseId
  if (route.query.warehouseId) {
    params.warehouseId = parseInt(route.query.warehouseId);
  }
  // 后台获取查询结果
  get("/in-warehouse/page-list", params).then(result => {
    inWarehousePageList.value = result.data.resultList;
    params.totalNum = result.data.totalNum;
  });
}
getInWarehousePageList();

// 所有仓库
const warehouseList = ref();
// 获取所有仓库
const getWarehouseList = () => {
  get("/in-warehouse/warehouse-list").then(result => {
    warehouseList.value = result.data;
  });
}
getWarehouseList();

// 确定入库
const confirmInWarehouse = (inWarehouse) => {
  put('/in-warehouse/confirm', inWarehouse).then(res => {
    tip.success(res.message);
    getInWarehousePageList();
  });
}

// 修改每页显示条数
const changeSize = (size) => {
  params.pageSize = size;
  // 重新查询
  getInWarehousePageList();
}
// 修改当前页码
const changeCurrent = (num) => {
  params.pageNum = num;
  // 重新查询
  getInWarehousePageList();
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