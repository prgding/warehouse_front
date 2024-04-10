<template>
  <!-- 修改品牌对话框 -->
  <el-dialog v-model="visible" destroy-on-close title="修改品牌" width="400px" @close="close">
    <el-form ref="brandUpdateRef" :model="brandUpdate" :rules="rules" label-position="right" label-width="100px">
      <el-form-item label="品牌ID：" prop="brandId">
        <el-input v-model="brandUpdate.brandId" disabled/>
      </el-form-item>
      <el-form-item label="品牌名称：" prop="brandName">
        <el-input v-model="brandUpdate.brandName"/>
      </el-form-item>
      <el-form-item label="品牌首字母：" prop="brandInitial">
        <el-input v-model="brandUpdate.brandInitial"/>
      </el-form-item>
      <el-form-item label="品牌描述：" prop="brandDesc">
        <el-input v-model="brandUpdate.brandDesc"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="updateBrand">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref, reactive} from 'vue'
import {put, tip, WAREHOUSE_CONTEXT_PATH} from "@/common"

// 该页面的可见性
const visible = ref(false);

// 修改品牌对象
const brandUpdate = reactive({
  brandId: '',
  brandName: '',
  brandInitial: '',
  brandDesc: '',
});

// 表单验证规则
const rules = reactive({
  brandName: [
    {required: true, message: '请输入品牌名称', trigger: 'blur'}
  ]
})

// 关闭
const close = () => {
  visible.value = false;
}

// 该对话框打开，进行数据初始化
const open = (brand) => {
  visible.value = true;

  for (let prop in brand) {
    brandUpdate[prop] = brand[prop];
  }
};

const brandUpdateRef = ref();
// 定义
const emit = defineEmits(["ok"]);
// 添加品牌提交
const updateBrand = () => {
  brandUpdateRef.value.validate(valid => {
    if (valid) {
      put('/brand/brand-update', brandUpdate).then(result => {
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