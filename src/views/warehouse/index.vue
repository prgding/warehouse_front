<template>
  <!-- 仓库列表 -->
  <div>
    <el-form class="searchForm" inline>
      <el-form-item>
        <el-input v-model="params.warehouseName" clearable placeholder="仓库名称" style="width: 120px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="params.warehouseAddress" clearable placeholder="仓库地址" style="width: 120px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="params.contact" clearable placeholder="联系人" style="width: 120px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="params.phone" clearable placeholder="电话" style="width: 120px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getWarehousePageList">
          <el-icon>
            <Search/>
          </el-icon>
          &nbsp;查&nbsp;&nbsp;询
        </el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" @click="openWarehouseAdd()">
        <el-icon>
          <Plus/>
        </el-icon>
        &nbsp;添加仓库
      </el-button>
    </div>
  </div>

  <!-- 表格 -->
  <el-table :data="warehousePageList" border size="large" stripe style="width: 100%; margin-top: 10px;" table-layout="auto">
    <el-table-column type="index" width="50"/>
    <el-table-column label="仓库ID" prop="warehouseId" sortable/>
    <el-table-column label="仓库名称" prop="warehouseName" sortable/>
    <el-table-column label="仓库编码" prop="warehouseCode" sortable/>
    <el-table-column label="仓库地址" prop="warehouseAddress" sortable/>
    <el-table-column label="仓库容量" prop="capacity" sortable/>
    <el-table-column label="联系人" prop="contact" sortable/>
    <el-table-column label="电话" prop="phone" sortable/>
    <el-table-column label="操作">
      <template #default="props">
        <el-button :icon="Edit" circle title="修改仓库" type="primary" @click="openWarehouseUpdate(props.row)"/>
        <el-button :icon="Delete" circle title="删除仓库" type="danger" @click="deleteWarehouse(props.row.warehouseId)"/>
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

  <!-- 添加仓库对话框 -->
  <warehouse-add ref="warehouseAddRef" @ok="getWarehousePageList"></warehouse-add>

  <!-- 修改仓库对话框 -->
  <warehouse-update ref="warehouseUpdateRef" @ok="getWarehousePageList"></warehouse-update>

</template>

<script setup>
import {reactive, ref} from 'vue';
import {get, del, tip} from "@/common";
import {useRouter} from "vue-router";
import {Search, Edit, Delete, Plus} from '@element-plus/icons-vue'

const router = useRouter(); // 获取路由器

// 分页模糊查询数据
const params = reactive({
  warehouseName: '',
  warehouseAddress: '',
  contact: '',
  phone: '',
  pageSize: 5,
  pageNum: 1,
  totalNum: 0
})

// 表格数据
const warehousePageList = ref();

// 获取分页模糊查询结果
const getWarehousePageList = () => {
  get("/warehouse/warehouse-page-list", params).then(result => {
    warehousePageList.value = result.data.resultList;
    params.totalNum = result.data.totalNum;
  });
}
getWarehousePageList();


// 跳向添加仓库
import warehouseAdd from "./warehouse-add.vue";

const warehouseAddRef = ref();
const openWarehouseAdd = () => {
  warehouseAddRef.value.open();
};


// 跳向修改仓库
import warehouseUpdate from "./warehouse-update.vue";

const warehouseUpdateRef = ref();
const openWarehouseUpdate = (warehouse) => {
  warehouseUpdateRef.value.open(warehouse);
};


// 删除仓库
const deleteWarehouse = (warehouseId) => {
  del(`/warehouse/warehouse-delete/${warehouseId}`, null, {title: "提示", message: "您确定删除该仓库吗？"}).then(result => {
    tip.success(result.message);
    // 重新查询
    getWarehousePageList();
  });
}

// 修改每页显示条数
const changeSize = (size) => {
  params.pageSize = size;
  // 重新查询
  getWarehousePageList();
}
// 修改当前页码
const changeCurrent = (num) => {
  params.pageNum = num;
  // 重新查询
  getWarehousePageList();
}
</script>

<style scoped>
.searchForm {
  margin-top: 20px;
  display: flex;
}

.el-link {
  margin-right: 8px;
}
</style>