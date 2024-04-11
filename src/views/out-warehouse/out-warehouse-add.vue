<template>
  <!-- 添加出库单对话框 -->
  <el-dialog v-model="visible" destroy-on-close title="添加出库单" width="400px" @close="close">
    <el-form ref="outWarehouseAddForm" :model="outWarehouseAdd" :rules="rules" label-position="top" label-width="120px">
      <el-form-item label="商品名称：" prop="productName">
        <el-input v-model="outWarehouseAdd.productName" disabled/>
      </el-form-item>
      <el-form-item label="仓库名称：" prop="warehouseName">
        <el-input v-model="outWarehouseAdd.warehouseName" disabled/>
      </el-form-item>
      <el-form-item label="库存：" prop="productStock">
        <el-input v-model="outWarehouseAdd.productStock" disabled/>
      </el-form-item>
      <el-form-item label="出库数量：" prop="outNum">
        <el-input v-model="outWarehouseAdd.outNum"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="addOutWarehouse">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref, reactive} from 'vue'
import {post, tip} from "@/common"

// 该页面的可见性
const visible = ref(false);

// 添加出库单对象
const outWarehouseAdd = reactive({
  productId: '',
  productName: '',
  warehouseId: '',
  warehouseName: '',
  productStock: '',
  outNum: ''
});

// 出库数量不能大于库存
const validateOutNum = (rule, outNum, callback) => {
  if (outNum === '') return callback(new Error('请输入出库数量！'));
  // 库存
  const productStock = parseInt(outWarehouseAdd.productStock);
  if (parseInt(outNum) <= 0) return callback(new Error('出库数量必须大于0！'));
  if (parseInt(outNum) > productStock) return callback(new Error('出库数量不能大于库存！'));
  return true;
}

// 表单验证规则
const rules = reactive({
  outNum: [
    {validator: validateOutNum, trigger: 'blur'}
  ]
})

// 关闭
const close = () => {
  outWarehouseAdd.outNum = '';
  visible.value = false;
}

// 该对话框打开，进行数据初始化
const open = (commodity) => {
  visible.value = true;
  for (let prop in commodity) {
    outWarehouseAdd[prop] = commodity[prop];
  }
};

const outWarehouseAddForm = ref();
// 定义
const emit = defineEmits(["ok"]);
// 出库单提交
const addOutWarehouse = () => {
  outWarehouseAddForm.value.validate((valid) => {
    if (valid) {
      post('/out-warehouse/add', outWarehouseAdd).then(result => {
        emit('ok', outWarehouseAdd.warehouseId);
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