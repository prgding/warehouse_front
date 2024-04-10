<template>
  <!-- 表格 -->
  <el-table :data="unitPageList" border size="large" stripe style="width: 100%; margin-top: 10px;" table-layout="auto">
    <el-table-column type="index" width="50"/>
    <el-table-column label="单位ID" prop="unitId" sortable/>
    <el-table-column label="单位名称" prop="unitName" sortable/>
    <el-table-column label="单位首字母" prop="unitInitial" sortable/>
    <el-table-column label="单位描述" prop="unitDesc" sortable/>
    <el-table-column label="操作">
      <template #default="props">
        <el-button :icon="Edit" circle title="修改单位" type="primary" @click="openUnitUpdate(props.row)"/>
        <el-button :icon="Delete" circle title="删除单位" type="danger" @click="deleteUnit(props.row.unitId)"/>
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

  <!-- 添加单位对话框 -->
  <unit-add ref="unitAddRef" @ok="getUnitPageList"></unit-add>

  <!-- 修改单位对话框 -->
  <unit-update ref="unitUpdateRef" @ok="getUnitPageList"></unit-update>

</template>

<script setup>
import {reactive, ref} from 'vue';
import {get, put, del, tip, export2excel, WAREHOUSE_CONTEXT_PATH} from "@/common";
import {useRouter} from "vue-router";
import {Search, Edit, Check, Message, Star, Delete, Plus} from '@element-plus/icons-vue'

const router = useRouter(); // 获取路由器

// 分页模糊查询数据
const params = reactive({
  unitId: '',
  unitName: '',
  unitInitial: '',
  unitDesc: '',
  pageSize: 5,
  pageNum: 1,
  totalNum: 0
})

// 表格数据
const unitPageList = ref();

// 获取分页模糊查询结果
const getUnitPageList = () => {
  get("/unit/unit-page-list", params).then(result => {
    unitPageList.value = result.data.resultList;
    params.totalNum = result.data.totalNum;
  });
}
getUnitPageList();


// 跳向添加单位
import unitAdd from "./unit-add.vue";

const unitAddRef = ref();
const openUnitAdd = () => {
  unitAddRef.value.open();
};


// 跳向修改单位
import unitUpdate from "./unit-update.vue";

const unitUpdateRef = ref();
const openUnitUpdate = (unit) => {
  unitUpdateRef.value.open(unit);
};


// 删除单位
const deleteUnit = (unitId) => {
  del(`/unit/unit-delete/${unitId}`, null, {title: "提示", message: "您确定删除该单位吗？"}).then(result => {
    tip.success(result.message);
    // 重新查询
    getUnitPageList();
  });
}

// 修改每页显示条数
const changeSize = (size) => {
  params.pageSize = size;
  // 重新查询
  getUnitPageList();
}
// 修改当前页码
const changeCurrent = (num) => {
  params.pageNum = num;
  // 重新查询
  getUnitPageList();
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