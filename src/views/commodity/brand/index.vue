<template>
  <!-- 品牌列表 -->
  <div>
    <el-form class="searchForm" inline>
      <el-form-item>
        <el-input v-model="params.brandName" clearable placeholder="品牌名称" style="width: 120px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="params.brandInitial" clearable placeholder="品牌首字母" style="width: 120px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="params.brandDesc" clearable placeholder="品牌描述" style="width: 120px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getBrandPageList">
          <el-icon>
            <Search/>
          </el-icon>
          &nbsp;查&nbsp;&nbsp;询
        </el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" @click="openBrandAdd()">
        <el-icon>
          <Plus/>
        </el-icon>
        &nbsp;添加品牌
      </el-button>
    </div>
  </div>

  <!-- 表格 -->
  <el-table :data="brandPageList" border size="large" stripe style="width: 100%; margin-top: 10px;" table-layout="auto">
    <el-table-column type="index" width="50"/>
    <el-table-column label="品牌ID" prop="brandId" sortable/>
    <el-table-column label="品牌名称" prop="brandName" sortable/>
    <el-table-column label="品牌首字母" prop="brandInitial" sortable/>
    <el-table-column label="品牌描述" prop="brandDesc" sortable/>
    <el-table-column label="操作">
      <template #default="props">
        <el-button :icon="Edit" circle title="修改品牌" type="primary" @click="openBrandUpdate(props.row)"/>
        <el-button :icon="Delete" circle title="删除品牌" type="danger" @click="deleteBrand(props.row.brandId)"/>
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

  <!-- 添加品牌对话框 -->
  <brand-add ref="brandAddRef" @ok="getBrandPageList"></brand-add>

  <!-- 修改品牌对话框 -->
  <brand-update ref="brandUpdateRef" @ok="getBrandPageList"></brand-update>

</template>

<script setup>
import {reactive, ref} from 'vue';
import {get, put, del, tip, export2excel, WAREHOUSE_CONTEXT_PATH} from "@/common";
import {useRouter} from "vue-router";
import {Search, Edit, Check, Message, Star, Delete, Plus} from '@element-plus/icons-vue'

const router = useRouter(); // 获取路由器

// 分页模糊查询数据
const params = reactive({
  brandId: '',
  brandName: '',
  brandInitial: '',
  brandDesc: '',
  pageSize: 5,
  pageNum: 1,
  totalNum: 0
})

// 表格数据
const brandPageList = ref();

// 获取分页模糊查询结果
const getBrandPageList = () => {
  get("/brand/brand-page-list", params).then(result => {
    brandPageList.value = result.data.resultList;
    params.totalNum = result.data.totalNum;
  });
}
getBrandPageList();


// 跳向添加品牌
import brandAdd from "./brand-add.vue";

const brandAddRef = ref();
const openBrandAdd = () => {
  brandAddRef.value.open();
};


// 跳向修改品牌
import brandUpdate from "./brand-update.vue";

const brandUpdateRef = ref();
const openBrandUpdate = (brand) => {
  brandUpdateRef.value.open(brand);
};


// 删除品牌
const deleteBrand = (brandId) => {
  del(`/brand/brand-delete/${brandId}`, null, {title: "提示", message: "您确定删除该品牌吗？"}).then(result => {
    tip.success(result.message);
    // 重新查询
    getBrandPageList();
  });
}

// 修改每页显示条数
const changeSize = (size) => {
  params.pageSize = size;
  // 重新查询
  getBrandPageList();
}
// 修改当前页码
const changeCurrent = (num) => {
  params.pageNum = num;
  // 重新查询
  getBrandPageList();
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