<template>
  <!-- 商品列表 -->
  <div>
    <el-form class="searchForm">
      <el-form-item>
        <el-select v-model="params.warehouseId" clearable placeholder="仓库" style="width: 120px;">
          <el-option v-for="warehouse of warehouseList" :key="warehouse.warehouseId" :label="warehouse.warehouseName" :value="warehouse.warehouseId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="margin-left: 10px;">
        <el-input v-model="params.productName" clearable placeholder="商品名称" style="width: 120px;"></el-input>
      </el-form-item>
      <el-form-item style="margin-left: 10px;">
        <el-autocomplete
            v-model="params.brandName"
            :fetch-suggestions="brandSearch"
            clearable
            placeholder="品牌"
            style="width: 120px;"
            value-key="brandName"
        />
      </el-form-item>
      <el-form-item style="margin-left: 10px;">
        <el-input v-model="params.typeName" clearable placeholder="类型" style="width: 120px;"></el-input>
      </el-form-item>
      <el-form-item style="margin-left: 10px;">
        <el-select v-model="params.isOverDate" clearable placeholder="已/未过期" style="width: 120px;">
          <el-option :value="0" label="未过期"></el-option>
          <el-option :value="1" label="已过期"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="margin-left: 10px;">
        <el-button type="primary" @click="getCommodityPageList">
          <el-icon>
            <Search/>
          </el-icon>
          &nbsp;查&nbsp;&nbsp;询
        </el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" @click="openCommodityAdd()">
        <el-icon>
         <Plus/>
        </el-icon>
        &nbsp;添加商品
      </el-button>

      <el-select placeholder="批量操作" style="width: 110px;margin-left: 12px; position: relative; top: 2px;">
        <el-option @click="deleteCommodityList" value="1">
          <span>
            <el-icon><delete/></el-icon>
          </span>
          <span style="padding-left: 6px; position: relative; top: -2px;">删除</span>
        </el-option>
      </el-select>
    </div>
  </div>

  <!-- 表格 -->
  <el-table ref="multipleTableRef" :data="commodityPageList" border size="large" stripe style="width: 100%; margin-top: 10px;" table-layout="auto" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55"/>
    <el-table-column label="商品图片">
      <template #default="props">
        <el-image :src="WAREHOUSE_CONTEXT_PATH + props.row.imgs" fit="fill" style="width: 60px; height: 60px"/>
      </template>
    </el-table-column>
    <el-table-column label="商品名称" prop="productName" sortable/>
    <el-table-column label="品牌" prop="brandName" sortable/>
    <el-table-column label="类型" prop="typeName" sortable/>
    <el-table-column label="仓库" prop="warehouseName" sortable/>
    <el-table-column label="库存" prop="productStock" sortable/>
    <el-table-column label="售价" prop="salePrice" sortable/>
    <el-table-column label="单位" prop="unitName" sortable/>
    <el-table-column label="生产日期" prop="productionDate" sortable/>
    <el-table-column label="保质期" prop="bestBeforeDate" sortable/>
    <el-table-column fixed="right" label="操作" width="240">
      <template #default="props">
        <el-link id="el-link" type="primary" @click.prevent="openCommodityUpdate(props.row)">修改</el-link>
        <el-link id="el-link" type="primary" @click.prevent="deleteCommodity(props.row.productId)">删除</el-link>
        <el-link id="el-link" type="primary" @click.prevent="openInWarehouseAdd(props.row)">采购</el-link>
        <el-link id="el-link" type="primary" @click.prevent="openOutWarehouseAdd(props.row)">出库</el-link>
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

  <!-- 添加商品对话框 -->
  <commodity-add ref="commodityAddRef" @ok="getCommodityPageList"></commodity-add>

  <!-- 修改商品对话框 -->
  <commodity-update ref="commodityUpdateRef" @ok="getCommodityPageList"></commodity-update>

  <!-- 添加出库单对话框 -->
  <out-warehouse-add ref="outWarehouseAddRef" @ok="toOutWarehouseList"></out-warehouse-add>
  <in-warehouse-add ref="inWarehouseAddRef" @ok="toInWarehouseList"></in-warehouse-add>

</template>

<script setup>
import {reactive, ref} from 'vue';
import {get, del, tip, WAREHOUSE_CONTEXT_PATH} from "@/common";
import {useRouter} from "vue-router";
import {Search, Delete, Plus} from '@element-plus/icons-vue'

const router = useRouter(); // 获取路由器

// 分页模糊查询数据
const params = reactive({
  warehouseId: undefined,
  productName: '',
  brandName: '',
  typeName: '',
  isOverDate: '',
  pageSize: 5,
  pageNum: 1,
  totalNum: 0
})

// 表格数据
const commodityPageList = ref();

// 获取分页模糊查询结果
const getCommodityPageList = () => {
  get("/product/product-page-list", params).then(result => {
    commodityPageList.value = result.data.resultList;
    params.totalNum = result.data.totalNum;
  });
}
getCommodityPageList();

// 所有仓库
const warehouseList = ref();
// 获取所有仓库
const getWarehouseList = () => {
  get("/product/warehouse-list").then(result => {
    warehouseList.value = result.data;
  });
}
getWarehouseList();

// 所有品牌
const brandList = ref();
// 获取所有品牌
const getBrandList = () => {
  get("/product/brand-list").then(result => {
    brandList.value = result.data;
  });
}
getBrandList();

// 所有分类-分层结构
const categoryTree = ref();
// 获取所有分类
const getCategoryTree = () => {
  get("/product/category-tree").then(result => {
    categoryTree.value = result.data;
  });
}
getCategoryTree();



// 所有单位
const unitList = ref();
// 获取所有单位
const getUnitList = () => {
  get("/product/unit-list").then(result => {
    unitList.value = result.data;
  });
}
getUnitList();

// 复选框的操作
const multipleTableRef = ref();
const multipleSelection = ref([]);

const handleSelectionChange = (val) => {
  multipleSelection.value = val;
}

// 跳向添加商品
import CommodityAdd from "./commodity-add.vue";

const commodityAddRef = ref();
const openCommodityAdd = () => {
  commodityAddRef.value.open(warehouseList, brandList, categoryTree, unitList);
};


// 跳向修改商品
import CommodityUpdate from "./commodity-update.vue";

const commodityUpdateRef = ref();
const openCommodityUpdate = (commodity) => {
  commodityUpdateRef.value.open(commodity, warehouseList, brandList, categoryTree, unitList);
};

// 跳向添加出库单
import OutWarehouseAdd from "../../out-warehouse/out-warehouse-add.vue";

const outWarehouseAddRef = ref();
const openOutWarehouseAdd = (commodity) => {
  outWarehouseAddRef.value.open(commodity);
};

import InWarehouseAdd from "../../in-warehouse/in-warehouse-add.vue";
const inWarehouseAddRef = ref();
const openInWarehouseAdd = (commodity) => {
  inWarehouseAddRef.value.open(commodity);
};

// 跳转到出库单列表页面
const toOutWarehouseList = (warehouseId) => {
  // 通过路由导航到出库单列表页面
  router.push({path: "/out-warehouse/index", query: {"warehouseId": warehouseId}});
}

const toInWarehouseList = (warehouseId) => {
  // 通过路由导航到入库单列表页面
  router.push({path: "/in-warehouse/index", query: {"warehouseId": warehouseId}});
}

// 删除单个商品
const deleteCommodity = (productId) => {
  del(`/product/product-delete/${productId}`, null, {title: "提示", message: "您确定删除该商品吗？"}).then(result => {
    tip.success(result.message);
    // 重新查询
    getCommodityPageList();
  });
}

// 批量删除
const deleteCommodityList = () => {
  if (multipleSelection.value.length) {
    // 取出所有选中的id
    const productIds = multipleSelection.value.reduce((prev, cur) => {
      prev.push(cur.productId);
      return prev;
    }, []);

    del(`/product/product-list-delete`, productIds, {title: "提示", message: "您确定删除选中商品吗？"}).then(result => {
      tip.success(result.message);
      // 重新查询
      getCommodityPageList();
    });
  } else {
    tip.error("请选择需要删除的行！");
  }
}

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
    return brand.brandName.indexOf(queryString) !== -1;
  }
}

// 修改每页显示条数
const changeSize = (size) => {
  params.pageSize = size;
  // 重新查询
  getCommodityPageList();
}
// 修改当前页码
const changeCurrent = (num) => {
  params.pageNum = num;
  // 重新查询
  getCommodityPageList();
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