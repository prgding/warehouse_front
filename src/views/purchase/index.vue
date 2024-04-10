<template>
  <!-- 采购列表 -->
  <div>
    <el-form class="searchForm" inline>
      <el-form-item>
        <el-select v-model="params.storeId" clearable placeholder="仓库" style="width: 120px;">
          <el-option v-for="store of storeList" :key="store.storeId" :label="store.storeName" :value="store.storeId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间:">
        <el-input v-model="params.startTime" clearable style="width: 120px;" type="date"></el-input>
      </el-form-item>
      <el-form-item label="结束时间:">
        <el-input v-model="params.endTime" clearable style="width: 120px;" type="date"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="params.productName" clearable placeholder="商品名称" style="width: 120px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="params.buyUser" clearable placeholder="采购人" style="width: 120px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="params.isCreated" clearable placeholder="入库单状态" style="width: 130px;">
          <el-option :value="0" label="未生成"></el-option>
          <el-option :value="1" label="已生成"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getPurchasePageList">
          <el-icon>
            <Search/>
          </el-icon>
          &nbsp;查&nbsp;&nbsp;询
        </el-button>
      </el-form-item>
    </el-form>
  </div>

  <!-- 表格 -->
  <el-table :data="purchasePageList" border size="large" stripe style="width: 100%;margin-top: 10px;" table-layout="auto">
    <el-table-column type="index" width="50"/>
    <el-table-column label="仓库名" prop="storeName" sortable/>
    <el-table-column label="商品名" prop="productName" sortable/>
    <el-table-column label="预计采购数量" prop="buyNum" sortable/>
    <el-table-column label="实际采购数量" prop="factBuyNum" sortable/>
    <el-table-column label="采购人" prop="buyUser" sortable/>
    <el-table-column label="采购时间" prop="buyTime" sortable/>
    <el-table-column label="采购人电话" prop="phone" sortable/>
    <el-table-column label="入库单状态" sortable>
      <template #default="props">
        <span :class="{red:props.row.isCreated==='0', green: props.row.isCreated==='1'}">{{ props.row.isCreated === '0' ? "未生成" : "已生成" }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="props">
        <el-button v-if="!props.row.factBuyNum || props.row.factBuyNum===0" :icon="Edit" circle title="修改采购单" type="primary" @click="openPurchaseUpdate(props.row)"/>
        <el-button v-if="!props.row.factBuyNum || props.row.factBuyNum===0" :icon="Delete" circle title="删除采购单" type="danger" @click="deletePurchase(props.row.buyId)"/>
        <el-button v-if="props.row.isCreated==='0' && props.row.factBuyNum>0" type="primary" @click="instore(props.row)">生成入库单</el-button>
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

  <!-- 修改采购单对话框 -->
  <purchase-update ref="purchaseUpdateRef" @ok="getPurchasePageList"></purchase-update>

</template>

<script setup>
import {reactive, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router'
import {del, get, post, tip} from "@/common";
import {Delete, Edit, Search} from '@element-plus/icons-vue'
// 跳向修改采购单
import PurchaseUpdate from "./purchase-update.vue";

const route = useRoute(); // 获取路由信息

// 分页模糊查询数据
const params = reactive({
  storeId: undefined,
  startTime: '',
  endTime: '',
  productName: '',
  buyUser: '',
  isCreated: '',
  pageSize: 5,
  pageNum: 1,
  totalNum: 0
})

// 表格数据
const purchasePageList = ref();

// 获取分页模糊查询结果
const getPurchasePageList = () => {
  // 如果从添加采购单跳过来，会传参storeId
  if (route.query.storeId) {
    params.storeId = parseInt(route.query.storeId);
  }
  // 后台获取查询结果
  get("/purchase/purchase-page-list", params).then(result => {
    purchasePageList.value = result.data.resultList;
    params.totalNum = result.data.totalNum;
  });
}
getPurchasePageList();

// 所有仓库
const storeList = ref();
// 获取所有仓库
const getStoreList = () => {
  get("/purchase/store-list").then(result => {
    storeList.value = result.data;
  });
}
getStoreList();

const purchaseUpdateRef = ref();
const openPurchaseUpdate = (purchase) => {
  purchaseUpdateRef.value.open(purchase);
};

// 删除采购单
const deletePurchase = (buyId) => {
  del(`/purchase/purchase-delete/${buyId}`, null, {title: "提示", message: "您确定删除该采购单吗？"}).then(result => {
    tip.success(result.message);
    getPurchasePageList();
  });
}

const router = useRouter(); // 获取路由器
// 生成入库单
const instore = (purchase) => {
  post('/purchase/in-warehouse-record-add', purchase).then(result => {
    tip.success(result.message);
    getPurchasePageList();
    // 入库成功，跳转到入库单列表页
    // router.push({path: '/instore/index', query: {'storeId': purchase.storeId}});
  });
}

// 修改每页显示条数
const changeSize = (size) => {
  params.pageSize = size;
  // 重新查询
  getPurchasePageList();
}
// 修改当前页码
const changeCurrent = (num) => {
  params.pageNum = num;
  // 重新查询
  getPurchasePageList();
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