<template>
  <!-- 添加商品对话框 -->
  <el-dialog v-model="visible" destroy-on-close title="添加商品" width="50%" @close="close">
    <el-form ref="commodityAddRef" :model="commodityAdd" :rules="rules" label-position="right" label-width="100px">
      <el-form-item label="商品图片：" prop="imgs">
        <el-upload
            :action="WAREHOUSE_CONTEXT_PATH + '/product/img-upload'"
            :before-upload="beforeAvatarUpload"
            :on-change="handleAvatarChange"
            :show-file-list="false"
            class="avatar-uploader"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar"/>
          <el-icon v-else class="avatar-uploader-icon">
            <Plus/>
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-row>
        <el-form-item label="名称：" prop="productName">
          <el-input v-model="commodityAdd.productName"/>
        </el-form-item>
        <el-form-item label="编号：" prop="productCode">
          <el-input v-model="commodityAdd.productCode"/>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="种类：" prop="typeId">
          <el-popover placement="bottom-start" trigger="click" width="12%">
            <template #reference>
              <el-input v-model="commodityAdd.typeName" placeholder="选择类型" readonly/>
            </template>
            <el-tree :data="categorys" :node-key="typeId" :props="defaultProps" @node-click="handleNodeClick"/>
          </el-popover>
        </el-form-item>
        <el-form-item label="单位：" prop="unitId">
          <el-select style="width: 168px" v-model="commodityAdd.unitId" clearable placeholder="请选择单位">
            <el-option v-for="unit of units" :key="unit.unitId" :label="unit.unitName" :value="unit.unitId"></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="品牌：" prop="brandId">
          <el-select style="width: 168px" v-model="commodityAdd.brandId" clearable placeholder="请选择品牌">
            <el-option v-for="brand of brands" :key="brand.brandId" :label="brand.brandName" :value="brand.brandId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="仓库：" prop="warehouseId">
          <el-select style="width: 168px" v-model="commodityAdd.warehouseId" clearable placeholder="请选择仓库">
            <el-option v-for="warehouse of warehouses" :key="warehouse.warehouseId" :label="warehouse.warehouseName" :value="warehouse.warehouseId"></el-option>
          </el-select>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="进价：" prop="inPrice">
          <el-input v-model="commodityAdd.inPrice"/>
        </el-form-item>
        <el-form-item label="售价：" prop="salePrice">
          <el-input v-model="commodityAdd.salePrice" style="width: 80%;"/>
          &nbsp;元
        </el-form-item>
      </el-row>
      <el-form-item label="详细介绍：" prop="introduce" style="width: 88%;">
        <el-input v-model="commodityAdd.introduce" rows="2" type="textarea"/>
      </el-form-item>
      <el-row>
        <el-date-picker
            style="margin-left: 50px; padding-left: 50px"
            v-model="commodityAdd.productionDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="生产日期："
        />

        <el-date-picker
            style="margin-left: 50px; padding-left: 50px"
            v-model="commodityAdd.bestBeforeDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="保质期："
        />
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="addCommodity">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref, reactive} from 'vue'
import {post, tip, WAREHOUSE_CONTEXT_PATH} from "@/common"
import {Plus} from '@element-plus/icons-vue'

// 该页面的可见性
const visible = ref(false);
// 图片回显路径
const imageUrl = ref('');

// 添加文件时的回显
const handleAvatarChange = (uploadFile) => {
  const reader = new FileReader();
  // 从上传组件中获取数据
  const image = uploadFile.raw;
  reader.readAsDataURL(image);
  // 读取文件的回调函数
  reader.onload = () => {
    // 将转化的url赋值给文件
    imageUrl.value = reader.result;
    commodityAdd.imgs = image.name;
  };
}

// 上传之前做简单验证
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpg'
      && rawFile.type !== 'image/jpeg'
      && rawFile.type !== 'image/png'
      && rawFile.type !== 'image/gif'
      && rawFile.type !== 'image/svg'
      && rawFile.type !== 'image/webp'
  ) {
    tip.error('只能上传图片格式!');
    return false
  } else if (rawFile.size / 1024 / 1024 > 5) {
    tip.error('上传文件不能大于5MB!');
    return false
  }
  return true;
}

// 添加商品对象
const commodityAdd = reactive({
  imgs: '',
  productName: '',
  warehouseId: '',
  brandId: '',
  productCode: '',
  productStock: 0,
  typeId: '',
  typeName: '',
  unitId: '',
  introduce: '',
  inPrice: 0,
  salePrice: 0,
  productionDate: '',
  bestBeforeDate: ''
});

// 表单验证规则
const rules = reactive({
  productName: [
    {required: true, message: '请输入商品名称', trigger: 'blur'}
  ],
  warehouseId: [
    {required: true, message: '请选择仓库', trigger: 'blur'}
  ],
  brandId: [
    {required: true, message: '请选择品牌', trigger: 'blur'}
  ],
  productCode: [
    {required: true, message: '请输入商品编号', trigger: 'blur'}
  ],
  unitId: [
    {required: true, message: '请选择单位', trigger: 'blur'}
  ],
})

// 关闭
const close = () => {
  for (let prop in commodityAdd) {
    commodityAdd[prop] = '';
  }

  visible.value = false;
}

// 所有仓库
const warehouses = ref();
// 所有品牌
const brands = ref();
// 所有分类
const categorys = ref();
// 所有单位
const units = ref();

// 树形结构数据对应实体类属性
const defaultProps = {
  children: 'childProductCategory',
  label: 'typeName',
}

// 点击二级分类，显示到输入框
const handleNodeClick = (type) => {
  if (type && type.parentId !== 0) {
    // 选择二级分类
    commodityAdd.typeId = type.typeId;
    commodityAdd.typeName = type.typeName;
  }
}

// 该对话框打开，进行数据初始化
const open = (warehouseList, brandList, categoryTree, unitList) => {
  visible.value = true;
  warehouses.value = warehouseList.value;
  brands.value = brandList.value;
  categorys.value = categoryTree.value;
  units.value = unitList.value;
};


const commodityAddRef = ref();
// 定义
const emit = defineEmits(["ok"]);
// 添加商品提交
const addCommodity = () => {
  commodityAddRef.value.validate(valid => {
    if (valid) {
      post('/product/product-add', commodityAdd).then(result => {
        emit('ok');
        tip.success(result.message);
        visible.value = false; // 关闭对话框
      });
    }
  });
}

defineExpose({open});
</script>

<style scoped>
.avatar-uploader, .avatar-uploader .avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>