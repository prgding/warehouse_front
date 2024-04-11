<template>
  <!-- 出库列表-->
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
        <el-select v-model="params.isOut" clearable placeholder="出库状态" style="width: 120px;">
          <el-option :value="0" label="未出库"></el-option>
          <el-option :value="1" label="已出库"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getOutWarehousePageList">
          <el-icon>
            <Search/>
          </el-icon>
          &nbsp;查&nbsp;&nbsp;询
        </el-button>
      </el-form-item>
    </el-form>

  </div>

  <!-- 表格 -->
  <el-table :data="outWarehousePageList" border size="large" stripe style="width: 100%;margin-top: 10px;" table-layout="auto">
    <el-table-column label="出库单ID" prop="outsId" sortable/>
    <el-table-column label="仓库名称" prop="warehouseName" sortable/>
    <el-table-column label="商品名称" prop="productName" sortable/>
    <el-table-column label="出库数量" prop="outNum" sortable/>
    <el-table-column label="出库状态" sortable>
      <template #default="props">
        <span :class="{red:props.row.isOut==='0', green: props.row.isOut==='1'}">{{ props.row.isOut === '0' ? "未出库" : "已出库" }}</span>
      </template>
    </el-table-column>
    <el-table-column label="创建人" prop="userCode" sortable/>
    <el-table-column label="创建时间" prop="createTime" sortable/>
    <el-table-column label="操作">
      <template #default="props">
        <el-button v-if="props.row.isOut==='0'" :key="props.row.outsId" title="确定出库" type="primary" @click="confirmOutWarehouse(props.row)">确定出库
        </el-button>
        <el-button :icon="Delete" circle title="删除" type="danger" @click="deleteOutWarehouse(props.row.outsId)"/>
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
import {del, get, put, tip} from "@/common";
import {useRoute} from 'vue-router'
import {Delete, Search} from '@element-plus/icons-vue'

const route = useRoute(); // 获取路由信息

// 分页模糊查询数据
const params = reactive({
  warehouseId: undefined,
  productName: '',
  startTime: '',
  endTime: '',
  isOut: '',
  pageSize: 5,
  pageNum: 1,
  totalNum: 0
})

// 表格数据
const outWarehousePageList = ref();

// 获取分页模糊查询结果
const getOutWarehousePageList = () => {
  // 如果从添加出库单跳过来，会传参warehouseId
  if (route.query.warehouseId) {
    params.warehouseId = parseInt(route.query.warehouseId);
  }
  // 后台获取查询结果
  get("/out-warehouse/page-list", params).then(result => {
    outWarehousePageList.value = result.data.resultList;
    params.totalNum = result.data.totalNum;
  });
}
getOutWarehousePageList();

// 所有仓库
const warehouseList = ref();
// 获取所有仓库
const getWarehouseList = () => {
  get("/out-warehouse/list").then(result => {
    warehouseList.value = result.data;
  });
}
getWarehouseList();

// 确定入库
const confirmOutWarehouse = outWarehouse => {
  put('/out-warehouse/confirm', outWarehouse).then(res => {
    tip.success(res.message);
    getOutWarehousePageList();
  });
}

// 删除品牌
const deleteOutWarehouse = (outsId) => {
  del(`/out-warehouse/delete/${outsId}`, null, {title: "提示", message: "您确定删除该品牌吗？"}).then(result => {
    tip.success(result.message);
    // 重新查询
    getOutWarehousePageList();
  });
}


// 修改每页显示条数
const changeSize = (size) => {
  params.pageSize = size;
  // 重新查询
  getOutWarehousePageList();
}
// 修改当前页码
const changeCurrent = (num) => {
  params.pageNum = num;
  // 重新查询
  getOutWarehousePageList();
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