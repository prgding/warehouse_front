<template>
  <!-- 调货列表-->
  <div>
    <el-form class="searchForm" inline>
      <el-form-item label="选择仓库：">
        <el-select v-model="params.storeId" clearable style="width: 120px;" @change="getProductPageList">
          <el-option v-for="store of storeList" :key="store.storeId" :label="store.storeName" :value="store.storeId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="params.productName" clearable placeholder="商品名称" style="width: 120px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-autocomplete
            v-model="params.brandName"
            :fetch-suggestions="brandSearch"
            clearable
            placeholder="品牌"
            style="width: 120px;"
            value-key="brandName"
        />
      </el-form-item>
      <el-form-item>
        <el-input v-model="params.typeName" clearable placeholder="类型" style="width: 120px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="params.supplyName" clearable placeholder="供应商" style="width: 120px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="params.placeName" clearable placeholder="产地" style="width: 120px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getProductPageList">
          <el-icon>
            <svg class="icon" height="200" p-id="3057" t="1646977561352" version="1.1" viewBox="0 0 1024 1024" width="200" xmlns="http://www.w3.org/2000/svg">
              <path d="M986.304 871.424L747.328 630.4c-2.816-2.752-5.888-4.928-8.768-7.232 40.32-62.464 63.936-136.832 63.936-216.96 0-220.16-176.96-398.592-395.392-398.592C188.8 7.616 11.712 186.048 11.712 406.208s177.088 398.592 395.392 398.592a391.232 391.232 0 0 0 215.36-64.576c2.24 3.072 4.352 6.08 7.04 8.832l239.04 241.024a82.688 82.688 0 0 0 117.76 0 84.48 84.48 0 0 0 0-118.656m-579.2-192.512c-149.12 0-270.528-122.368-270.528-272.704 0-150.4 121.344-272.768 270.528-272.768 149.12 0 270.528 122.432 270.528 272.768 0 150.4-121.408 272.704-270.528 272.704" p-id="3058"></path>
            </svg>
          </el-icon>
          &nbsp;查&nbsp;&nbsp;询
        </el-button>
      </el-form-item>
    </el-form>
  </div>

  <!-- 表格 -->
  <el-table :data="productPageList" border size="large" stripe style="width: 100%; margin-top: 10px;" table-layout="auto">
    <el-table-column label="商品ID" prop="productId" sortable/>
    <el-table-column label="仓库名称" prop="storeName" sortable/>
    <el-table-column label="商品名称" prop="productName" sortable/>
    <el-table-column label="商品编号" prop="productNum" sortable/>
    <el-table-column label="品牌" prop="brandName" sortable/>
    <el-table-column label="类型" prop="typeName" sortable/>
    <el-table-column label="供应商" prop="supplyName" sortable/>
    <el-table-column label="产地" prop="placeName" sortable/>
    <el-table-column label="库存" prop="productInvent" sortable/>
    <el-table-column label="进价" prop="inPrice" sortable/>
    <el-table-column label="单位" prop="unitName" sortable/>
    <el-table-column label="操作">
      <template #default="props">
        <el-button type="primary" @click="transferCommodity(props.row)">调货</el-button>
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

  <!-- 添加调货单对话框 -->
  <trans-add ref="transAddRef" @ok="toTransshipment"></trans-add>

</template>

<script setup>
import {reactive, ref} from 'vue';
import {get, put, del, tip, export2excel, WAREHOUSE_CONTEXT_PATH} from "@/common";
import {useRoute, useRouter} from "vue-router";
import {Search, Edit, Check, Message, Star, Delete} from '@element-plus/icons-vue'

// 分页模糊查询数据
const params = reactive({
  storeId: 1,
  productName: '',
  brandName: '',
  typeName: '',
  supplyName: '',
  placeName: '',
  pageSize: 5,
  pageNum: 1,
  totalNum: 0
})

// 表格数据
const productPageList = ref();

// 获取分页模糊查询结果
const getProductPageList = () => {
  get("/transshipment/product-page-list", params).then(result => {
    productPageList.value = result.data.resultList;
    // 查询所有商品，库存为0的不显示
    productPageList.value = productPageList.value.reduce((pre, cur) => {
      if (cur.productInvent && cur.productInvent > 0) pre.push(cur);
      return pre;
    }, []);
    params.totalNum = result.data.totalNum;
  });
}
getProductPageList();

// 所有仓库
const storeList = ref();
// 获取所有仓库
const getStoreList = () => {
  get("/transshipment/store-list").then(result => {
    storeList.value = result.data;
  });
}
getStoreList();

// 所有品牌
const brandList = ref();
// 获取所有品牌
const getBrandList = () => {
  get("/transshipment/brand-list").then(result => {
    brandList.value = result.data;
  });
}
getBrandList();
// 品牌模糊查询框的联想输入
const brandSearch = (queryString, callback) => {
  const results = queryString
      ? brandList.value.filter(createFilter(queryString))
      : brandList.value
  // 回调方法，返回联想的数据
  callback(results);
}
const createFilter = (queryString) => {
  return (brand) => {
    return brand.brandName.indexOf(queryString) != -1;
  }
}

// 获取路由信息
const route = useRoute();
import TransAdd from "./transfer-add.vue";

const transAddRef = ref();
// 点击调货
const transferCommodity = commodity => {
  // 目标仓库
  const targetStoreId = route.query.storeId;
  // 源仓库
  const sourceStoreId = commodity.storeId;
  // 源商品id
  const sourceProductId = commodity.productId;
  if (sourceStoreId == targetStoreId) {
    tip.error("源仓库不能和目标仓库相同！");
  } else {
    // 弹出调货单对话框
    transAddRef.value.open(commodity, targetStoreId);
  }
}

// 获取路由器
const router = useRouter();
// 跳向调货单列表页面
const toTransshipment = () => {
  router.push("/transshipment/index");
}

// 修改每页显示条数
const changeSize = (size) => {
  params.pageSize = size;
  // 重新查询
  getProductPageList();
}
// 修改当前页码
const changeCurrent = (num) => {
  params.pageNum = num;
  // 重新查询
  getProductPageList();
}
</script>

<style scoped>
.searchForm {
  margin-top: 20px;
  display: flex;
}
</style>