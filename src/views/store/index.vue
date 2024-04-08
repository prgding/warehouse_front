<template>
  <!-- 仓库列表 -->
  <div>
    <el-form class="searchForm" inline>
      <el-form-item>
        <el-input v-model="params.storeName" clearable placeholder="仓库名称" style="width: 120px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="params.storeAddress" clearable placeholder="仓库地址" style="width: 120px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="params.concat" clearable placeholder="联系人" style="width: 120px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="params.phone" clearable placeholder="电话" style="width: 120px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getStorePageList">
          <el-icon>
            <Search/>
          </el-icon>
          &nbsp;查&nbsp;&nbsp;询
        </el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" @click="openStoreAdd()">
        <el-icon>
          <Plus/>
        </el-icon>
        &nbsp;添加仓库
      </el-button>
    </div>
  </div>

  <!-- 表格 -->
  <el-table :data="storePageList" border size="large" stripe style="width: 100%; margin-top: 10px;" table-layout="auto">
    <el-table-column type="index" width="50"/>
    <el-table-column label="仓库ID" prop="storeId" sortable/>
    <el-table-column label="仓库名称" prop="storeName" sortable/>
    <el-table-column label="仓库编码" prop="storeNum" sortable/>
    <el-table-column label="仓库地址" prop="storeAddress" sortable/>
    <el-table-column label="联系人" prop="concat" sortable/>
    <el-table-column label="电话" prop="phone" sortable/>
    <el-table-column label="操作">
      <template #default="props">
        <el-button :icon="Edit" circle title="修改仓库" type="primary" @click="openStoreUpdate(props.row)"/>
        <el-button :icon="Delete" circle title="删除仓库" type="danger" @click="deleteStore(props.row.storeId)"/>
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
  <store-add ref="storeAddRef" @ok="getStorePageList"></store-add>

  <!-- 修改仓库对话框 -->
  <store-update ref="storeUpdateRef" @ok="getStorePageList"></store-update>

</template>

<script setup>
import {reactive, ref} from 'vue';
import {get, put, del, tip, export2excel, WAREHOUSE_CONTEXT_PATH} from "@/common";
import {useRouter} from "vue-router";
import {Search, Edit, Check, Message, Star, Delete, Plus} from '@element-plus/icons-vue'

const router = useRouter(); // 获取路由器

// 分页模糊查询数据
const params = reactive({
  storeName: '',
  storeAddress: '',
  concat: '',
  phone: '',
  pageSize: 5,
  pageNum: 1,
  totalNum: 0
})

// 表格数据
const storePageList = ref();

// 获取分页模糊查询结果
const getStorePageList = () => {
  get("/store/store-page-list", params).then(result => {
    storePageList.value = result.data.resultList;
    params.totalNum = result.data.totalNum;
  });
}
getStorePageList();


// 跳向添加仓库
import storeAdd from "./store-add.vue";

const storeAddRef = ref();
const openStoreAdd = () => {
  storeAddRef.value.open();
};


// 跳向修改仓库
import storeUpdate from "./store-update.vue";

const storeUpdateRef = ref();
const openStoreUpdate = (store) => {
  storeUpdateRef.value.open(store);
};


// 删除仓库
const deleteStore = (storeId) => {
  del(`/store/store-delete/${storeId}`, null, {title: "提示", message: "您确定删除该仓库吗？"}).then(result => {
    tip.success(result.message);
    // 重新查询
    getStorePageList();
  });
}

// 修改每页显示条数
const changeSize = (size) => {
  params.pageSize = size;
  // 重新查询
  getStorePageList();
}
// 修改当前页码
const changeCurrent = (num) => {
  params.pageNum = num;
  // 重新查询
  getStorePageList();
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