<template>
  <!-- 添加用户对话框 -->
  <el-dialog v-model="visible" destroy-on-close title="添加用户" width="25%" @close="close">
    <el-form ref="userAddForm" :model="userAdd" :rules="rules" label-position="top">
      <el-form-item label="用户编码：" prop="userCode">
        <el-input v-model="userAdd.userCode" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="昵称：" prop="userName">
        <el-input v-model="userAdd.userName" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="是否为管理员：" prop="userName">
        <el-switch v-model="userAdd.isAdmin"
                   active-value="1"
                   inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item label="密码：" prop="userPwd">
        <el-input v-model="userAdd.userPwd" autocomplete="off" show-password type="password"/>
      </el-form-item>
      <el-form-item label="确认密码：" prop="confirmPassword">
        <el-input v-model="userAdd.confirmPassword" autocomplete="off" show-password type="password"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="addUser">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {reactive, ref} from 'vue'
import {post, tip} from "@/common";

const visible = ref(false); // 该页面的可见性
// 添加用户对象
const userAdd = reactive({
  userCode: '',
  userName: '',
  userPwd: '',
  userState: "1",
  isAdmin: 0,
  confirmPassword: ''
});

// 关闭
const close = () => {
  userAdd.userCode = '';
  userAdd.userName = '';
  userAdd.userPwd = '';
  userAdd.confirmPassword = '';
  visible.value = false;
}

const rules = reactive({
  userCode: [
    {required: true, message: '请输入用户名', trigger: 'blur'}
  ],
  userPwd: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 6, max: 20, message: '密码为6-20位', trigger: 'blur'}
  ],
  confirmPassword: [
    {required: true, message: '请再次输入密码', trigger: 'blur'},
    {min: 6, max: 20, message: '密码为6-20位', trigger: 'blur'}
  ]
})

// 该对话框打开
const open = () => {
  visible.value = true;
};

const userAddForm = ref();
// 定义
const emit = defineEmits(["ok"]);
// 添加用户提交
const addUser = () => {
  if (userAdd.userPwd !== userAdd.confirmPassword) {
    tip.error("两次密码必须保持一致！");
    return;
  }
  userAddForm.value.validate(valid => {
    if (valid) {
      post('/user/addUser', userAdd).then(result => {
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