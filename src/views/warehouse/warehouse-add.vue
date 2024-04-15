<template>
  <!-- 添加仓库对话框 -->
  <el-dialog v-model="visible" destroy-on-close title="添加仓库" width="400px" @close="close">
    <el-form ref="warehouseAddRef" :model="warehouseAdd" :rules="rules" label-position="top">
      <el-form-item label="名称：" prop="warehouseName">
        <el-input v-model="warehouseAdd.warehouseName"/>
      </el-form-item>
      <el-form-item label="编号：" prop="warehouseCode">
        <el-input v-model="warehouseAdd.warehouseCode"/>
      </el-form-item>
      <el-form-item label="地址：" prop="warehouseAddress">
        <el-input v-model="warehouseAdd.warehouseAddress"/>
      </el-form-item>
      <el-form-item label="容量：" prop="capacity">
        <el-input v-model="warehouseAdd.capacity"/>
      </el-form-item>
      <el-form-item label="联系人：" prop="contact">
        <el-input v-model="warehouseAdd.contact"/>
      </el-form-item>
      <el-form-item label="电话：" prop="phone">
        <el-input v-model="warehouseAdd.phone"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="addWarehouse">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref, reactive} from 'vue'
import {get, post, tip, WAREHOUSE_CONTEXT_PATH} from "@/common"
import {Plus} from '@element-plus/icons-vue'

// 该页面的可见性
const visible = ref(false);

// 添加仓库对象
const warehouseAdd = reactive({
  warehouseName: '',
  warehouseCode: '',
  warehouseAddress: '',
  capacity: '',
  contact: '',
  phone: '',
});

// 验证仓库编号的唯一性
const validatewarehouseCode = async (rule, warehouseCode, callback) => {
  if (warehouseCode === '') return callback(new Error('请输入仓库编号！'));
  const res = await get(`/warehouse/warehouse-num-check?warehouseCode=${warehouseCode}`);
  if (!res.data) return callback(new Error('仓库编号已存在！'));
  return true;
}

// 表单验证规则
const rules = reactive({
  warehouseName: [
    {required: true, message: '请输入仓库名称', trigger: 'blur'}
  ],
  warehouseCode: [
    {required: true, message: '请输入仓库名称', trigger: 'blur'},
    {validator: validatewarehouseCode, trigger: 'blur'}
  ],
  warehouseAddress: [
    {required: true, message: '请输入仓库地址', trigger: 'blur'}
  ],
  capacity: [
    {required: true, message: '请输入仓库容量', trigger: 'blur'}
  ],
  contact: [
    {required: true, message: '请输入联系人', trigger: 'blur'}
  ],
  phone: [
    {required: true, message: '请输入电话', trigger: 'blur'}
  ]
})

// 关闭
const close = () => {
  for (let prop in warehouseAdd) {
    warehouseAdd[prop] = '';
  }

  visible.value = false;
}

// 该对话框打开，进行数据初始化
const open = () => {
  visible.value = true;
};

const warehouseAddRef = ref();
// 定义
const emit = defineEmits(["ok"]);
// 添加商品提交
const addWarehouse = () => {
  warehouseAddRef.value.validate(valid => {
    if (valid) {
      post('/warehouse/warehouse-add', warehouseAdd).then(result => {
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