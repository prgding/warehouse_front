<template>
  <!-- 添加品牌对话框 -->
  <el-dialog v-model="visible" destroy-on-close title="添加品牌" width="400px" @close="close">
    <el-form ref="unitAddRef" :model="unitAdd" :rules="rules" label-position="top">
      <el-form-item label="单位名称：" prop="unitName">
        <el-input v-model="unitAdd.unitName"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="addUnit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref, reactive} from 'vue'
import {get, post, tip} from "@/common"

// 该页面的可见性
const visible = ref(false);

// 添加品牌对象
const unitAdd = reactive({
  unitName: '',
  unitInitial: '',
  unitDesc: '',
});

// 验证品牌编号的唯一性
const validateUnitNum = async (rule, unitNum, callback) => {
  if (unitNum === '') return callback(new Error('请输入品牌编号！'));
  const res = await get(`/unit/unit-num-check?unitNum=${unitNum}`);
  if (!res.data) return callback(new Error('品牌编号已存在！'));
  return true;
}

// 表单验证规则
const rules = reactive({
  unitName: [
    {required: true, message: '请输入品牌名称', trigger: 'blur'}
  ],
  unitId: [
    {validator: validateUnitNum, trigger: 'blur'}
  ]
})

// 关闭
const close = () => {
  for (let prop in unitAdd) {
    unitAdd[prop] = '';
  }

  visible.value = false;
}

// 该对话框打开，进行数据初始化
const open = () => {
  visible.value = true;
};

const unitAddRef = ref();
// 定义
const emit = defineEmits(["ok"]);
// 添加商品提交
const addUnit = () => {
  unitAddRef.value.validate(valid => {
    if (valid) {
      post('/unit/unit-add', unitAdd).then(result => {
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