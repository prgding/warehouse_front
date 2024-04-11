<template>
  <!-- 添加入库单对话框 -->
  <el-dialog v-model="visible" destroy-on-close title="添加入库单" width="400px" @close="close">
    <el-form ref="inWarehouseAddForm" :model="inWarehouseAdd" :rules="rules" label-position="right" label-width="120px">
      <el-form-item label="商品：" prop="productName">
        <span>{{ inWarehouseAdd.productName }}</span>
      </el-form-item>
      <el-form-item label="仓库：" prop="warehouseName">
        <span>{{ inWarehouseAdd.warehouseName }}</span>
      </el-form-item>
      <el-form-item label="当前库存：" prop="productStock">
        <el-input v-model="inWarehouseAdd.productStock" disabled/>
      </el-form-item>
      <el-form-item label="采购数量：" prop="inNum">
        <el-input v-model="inWarehouseAdd.inNum"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="addInWarehouse">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {reactive, ref} from 'vue'
import {post, tip} from "@/common"

// 该页面的可见性
const visible = ref(false);

// 添加入库单对象
const inWarehouseAdd = reactive({
  productId: '',
  productName: '',
  warehouseId: '',
  warehouseName: '',
  productStock: '',
  inNum: '',
});

// 入库数量不能大于库存
const validateInNum = (rule, inNum, callback) => {
  if (inNum === '') return callback(new Error('请输入入库数量！'));
  // 库存
  if (parseInt(inNum) <= 0) return callback(new Error('入库数量必须大于0！'));
  return true;
}

// 表单验证规则
const rules = reactive({
  inNum: [
    {required: true, message: '请输入采购数量', trigger: 'blur'},
    {validator: validateInNum, trigger: 'blur'}
  ],
  buyUser: [
    {required: true, message: '请输入采购人', trigger: 'blur'}
  ]
})

// 关闭
const close = () => {
  inWarehouseAdd.inNum = '';
  visible.value = false;
}

// 该对话框打开，进行数据初始化
const open = (commodity) => {
  visible.value = true;
  for (let prop in commodity) {
    inWarehouseAdd[prop] = commodity[prop];
  }
};

const inWarehouseAddForm = ref();
// 定义
const emit = defineEmits(["ok"]);
// 入库单提交
const addInWarehouse = () => {
  inWarehouseAddForm.value.validate((valid) => {
    if (valid) {
      post('/in-warehouse/add', inWarehouseAdd).then(result => {
        emit('ok', inWarehouseAdd.warehouseId);
        tip.success(result.message);
      });
      visible.value = false; // 关闭对话框
    }
  });
}

defineExpose({open});
</script>

<style>


</style>