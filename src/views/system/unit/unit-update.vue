<template>
  <!-- 修改品牌对话框 -->
  <el-dialog v-model="visible" destroy-on-close title="修改品牌" width="400px" @close="close">
    <el-form ref="unitUpdateRef" :model="unitUpdate" :rules="rules" label-position="right" label-width="100px">
      <el-form-item label="单位ID：" prop="unitId">
        <el-input v-model="unitUpdate.unitId" disabled/>
      </el-form-item>
      <el-form-item label="单位名称：" prop="unitName">
        <el-input v-model="unitUpdate.unitName"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="updateUnit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref, reactive} from 'vue'
import {put, tip} from "@/common"

// 该页面的可见性
const visible = ref(false);

// 修改品牌对象
const unitUpdate = reactive({
  unitId: '',
  unitName: '',
  unitInitial: '',
  unitDesc: '',
});

// 表单验证规则
const rules = reactive({
  unitName: [
    {required: true, message: '请输入品牌名称', trigger: 'blur'}
  ]
})

// 关闭
const close = () => {
  visible.value = false;
}

// 该对话框打开，进行数据初始化
const open = (unit) => {
  visible.value = true;

  for (let prop in unit) {
    unitUpdate[prop] = unit[prop];
  }
};

const unitUpdateRef = ref();
// 定义
const emit = defineEmits(["ok"]);
// 添加品牌提交
const updateUnit = () => {
  unitUpdateRef.value.validate(valid => {
    if (valid) {
      put('/unit/unit-update', unitUpdate).then(result => {
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