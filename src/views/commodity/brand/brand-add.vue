<template>
  <!-- 添加品牌对话框 -->
  <el-dialog v-model="visible" destroy-on-close title="添加品牌" width="400px" @close="close">
    <el-form ref="brandAddRef" :model="brandAdd" :rules="rules" label-position="top">
      <el-form-item label="品牌名称：" prop="brandName">
        <el-input v-model="brandAdd.brandName"/>
      </el-form-item>
      <el-form-item label="品牌首字母：" prop="brandInitial">
        <el-input v-model="brandAdd.brandInitial"/>
      </el-form-item>
      <el-form-item label="品牌描述：" prop="brandDesc">
        <el-input v-model="brandAdd.brandDesc"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="addBrand">确定</el-button>
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

// 添加品牌对象
const brandAdd = reactive({
  brandName: '',
  brandInitial: '',
  brandDesc: '',
});

// 验证品牌编号的唯一性
const validateBrandNum = async (rule, brandNum, callback) => {
  if (brandNum === '') return callback(new Error('请输入品牌编号！'));
  const res = await get(`/brand/brand-num-check?brandNum=${brandNum}`);
  if (!res.data) return callback(new Error('品牌编号已存在！'));
  return true;
}

// 表单验证规则
const rules = reactive({
  brandName: [
    {required: true, message: '请输入品牌名称', trigger: 'blur'}
  ],
  brandId: [
    {validator: validateBrandNum, trigger: 'blur'}
  ]
})

// 关闭
const close = () => {
  for (let prop in brandAdd) {
    brandAdd[prop] = '';
  }

  visible.value = false;
}

// 该对话框打开，进行数据初始化
const open = () => {
  visible.value = true;
};

const brandAddRef = ref();
// 定义
const emit = defineEmits(["ok"]);
// 添加商品提交
const addBrand = () => {
  brandAddRef.value.validate(valid => {
    if (valid) {
      post('/brand/brand-add', brandAdd).then(result => {
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