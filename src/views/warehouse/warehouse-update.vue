<template>
  <!-- 修改仓库对话框 -->
  <el-dialog v-model="visible" destroy-on-close title="修改仓库" width="400px" @close="close">
    <el-form ref="warehouseUpdateRef" :model="warehouseUpdate" :rules="rules" label-position="right" label-width="100px">
      <el-form-item label="编号：" prop="warehouseCode">
        <el-input v-model="warehouseUpdate.warehouseCode" disabled/>
      </el-form-item>
      <el-form-item label="名称：" prop="warehouseName">
        <el-input v-model="warehouseUpdate.warehouseName"/>
      </el-form-item>
      <el-form-item label="地址：" prop="warehouseAddress">
        <el-input v-model="warehouseUpdate.warehouseAddress"/>
      </el-form-item>
      <el-form-item label="容量：" prop="warehouseAddress">
        <el-input v-model="warehouseUpdate.capacity"/>
      </el-form-item>
      <el-form-item label="联系人：" prop="contact">
        <el-input v-model="warehouseUpdate.contact"/>
      </el-form-item>
      <el-form-item label="电话：" prop="phone">
        <el-input v-model="warehouseUpdate.phone"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="updateWarehouse">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref, reactive} from 'vue'
import {put, tip} from "@/common"

// 该页面的可见性
const visible = ref(false);


// 修改仓库对象
const warehouseUpdate = reactive({
  warehouseName: '',
  warehouseCode: '',
  warehouseAddress: '',
  capacity: '',
  contact: '',
  phone: '',
});

// 表单验证规则
const rules = reactive({
  warehouseName: [
    {required: true, message: '请输入仓库名称', trigger: 'blur'}
  ]
})

// 关闭
const close = () => {
  visible.value = false;
}

// 该对话框打开，进行数据初始化
const open = (warehouse) => {
  visible.value = true;

  for (let prop in warehouse) {
    warehouseUpdate[prop] = warehouse[prop];
  }
};

const warehouseUpdateRef = ref();
// 定义
const emit = defineEmits(["ok"]);
// 添加仓库提交
const updateWarehouse = () => {
  warehouseUpdateRef.value.validate(valid => {
    if (valid) {
      put('/warehouse/warehouse-update', warehouseUpdate).then(result => {
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

</style>