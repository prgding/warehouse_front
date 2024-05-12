<template>
  <!-- <h2>用户列表</h2>
  <el-divider></el-divider> -->
  <div>
    <el-form class="searchForm">
      <el-form-item label="用户名:">
        <el-input v-model="params.userCode" clearable placeholder="用户名" style="width: 120px;"></el-input>
      </el-form-item>
      <el-form-item label="用户状态:" style="margin-left: 30px;">
        <el-select v-model="params.isEnabled" clearable placeholder="用户状态" style="width: 120px;">
          <el-option label="启用" value="1"></el-option>
          <el-option label="禁用" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="margin-left: 30px;">
        <el-button style="margin-left: 10px;" type="primary" @click="getUserList">
          <el-icon>
            <Search/>
          </el-icon>
          &nbsp;查&nbsp;&nbsp;询
        </el-button>
      </el-form-item>
    </el-form>

    <div>
      <el-button type="primary" @click="openUserAdd()">
        <el-icon>
          <Plus/>
        </el-icon>
        &nbsp;添加用户
      </el-button>

      <el-select placeholder="批量操作" style="width: 110px;margin-left: 12px; position: relative; top: 2px;">
        <el-option value="1" @click="enableUserList">
          <span>
            <el-icon><Check/></el-icon>
          </span>
          <span style="padding-left: 6px; position: relative; top: -2px;">启用</span>
        </el-option>

        <el-option value="2" @click="disableUserList">
          <span style="float: left;">
            <el-icon><Close/></el-icon>
          </span>
          <span style="padding-left: 6px; position: relative; top: -2px;">禁用</span>
        </el-option>

        <el-option value="3" @click="deleteUserList">
          <span style="float: left;">
            <el-icon><delete/></el-icon>
          </span>
          <span style="padding-left: 6px; position: relative; top: -2px;">删除</span>
        </el-option>
      </el-select>

    </div>
  </div>
  <!-- 表格 -->
  <el-table ref="multipleTableRef" :data="userList" border size="large" stripe style="width: 100%; margin-top: 10px;" table-layout="auto" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55"/>
    <el-table-column label="用户ID" prop="userId" sortable/>
    <el-table-column label="用户账户" prop="userCode" sortable/>
    <el-table-column label="昵称" prop="userName" sortable/>
    <el-table-column label="用户状态" sortable>
      <template #default="props">
        <span :class="{red:props.row.isEnabled===0}">{{ props.row.isEnabled === 0 ? "禁用" : "启用" }}</span>
      </template>
    </el-table-column>

    <el-table-column label="用户身份" sortable>
      <template #default="props">
        <span>{{ props.row.isAdmin === "1" ? "管理员" : "普通用户" }}</span>
      </template>
    </el-table-column>

    <el-table-column label="创建时间" prop="createTime" sortable/>
    <el-table-column label="操作">
      <template #default="props">
        <el-button :icon="Edit" circle title="修改用户" type="primary" @click="openUserUpdate(props.row)"/>
        <el-button :icon="Delete" circle title="删除用户" type="danger" @click="deleteUser(props.row.userId)"/>
        <el-button type="warning" @click="updateState(props.row)">{{ props.row.isEnabled === 1 ? "禁用" : "启用" }}</el-button>
        <el-button v-if="props.row.isEnabled===1" type="primary" @click="resetPwd(props.row.userId)">重置密码</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <el-pagination
      v-model:currentPage="params.pageNum"
      v-model:page-size="params.pageSize"
      :page-sizes="[5, 10, 15, 20, 25, 30]"
      :total="params.totalNum"
      background
      layout="total, sizes, prev, pager, next, jumper"
      style="margin-top: 20px;"
      @size-change="changeSize"
      @current-change="changeCurrent"
  />

  <!-- 添加用户对话框 -->
  <user-add ref="userAddRef" @ok="getUserList"></user-add>

  <!-- 修改用户对话框 -->
  <user-update ref="userUpdateRef" @ok="getUserList"></user-update>

  <!-- 分配角色对话框 -->
  <assign-role ref="assignRoleRef"></assign-role>
</template>

<script setup>
import {reactive, ref} from 'vue';
import {useRouter} from 'vue-router'
import {del, export2excel, get, put, tip} from "@/common";
import {Check, Close, Delete, Edit, Plus, Search} from '@element-plus/icons-vue'
// 添加用户
import UserAdd from "./user-add.vue";
// 修改用户
import UserUpdate from "./user-update.vue";
// 分配角色
import AssignRole from "./assign-role.vue";

const router = useRouter(); // 获取路由器

// 分页模糊查询数据
const params = reactive({
  userCode: '',
  userType: '',
  isEnabled: '',
  pageSize: 5,
  pageNum: 1,
  totalNum: 0
})

// 表格数据
const userList = ref();

// 获取查询结果
const getUserList = () => {
  get("/user/user-list", params).then(result => {
    userList.value = result.data.resultList;
    params.totalNum = result.data.totalNum;
  });
}
getUserList();

// 复选框的操作
const multipleTableRef = ref();
const multipleSelection = ref([]);
const toggleSelection = (rows) => {
  if (rows) {
    rows.forEach((row) => {
      multipleTableRef.value.toggleRowSelection(row, undefined)
    })
  } else {
    multipleTableRef.value.clearSelection()
  }
}
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
}

// 删除用户提交
const deleteUser = (userId) => {
  del(`/user/deleteUser/${userId}`, null, {title: "提示", message: "您确定删除该用户吗？"}).then(result => {
    tip.success(result.message);
    // 重新查询
    getUserList();
  });
}

// 批量删除
const deleteUserList = () => {
  if (multipleSelection.value.length) {
    // 取出所有选中的id
    const userIds = multipleSelection.value.reduce((prev, cur) => {
      prev.push(cur.userId);
      return prev;
    }, []);

    del('/user/deleteUserList', userIds, {title: "提示", message: "您确定删除选中用户吗？"}).then(result => {
      tip.success(result.message);
      // 重新查询
      getUserList();
    });
  } else {
    tip.error("请选择需要删除的行！");
  }
}

const enableUserList = () => {
  if (multipleSelection.value.length) {
    // 取出所有选中的id
    const userIds = multipleSelection.value.reduce((prev, cur) => {
      prev.push(cur.userId);
      return prev;
    }, []);

    put('/user/enableUserList', userIds).then(result => {
      tip.success(result.message);
      // 重新查询
      getUserList();
    });
  } else {
    tip.error("请选择需要启用的行！");
  }
}

const disableUserList = () => {
  if (multipleSelection.value.length) {
    // 取出所有选中的id
    const userIds = multipleSelection.value.reduce((prev, cur) => {
      prev.push(cur.userId);
      return prev;
    }, []);

    put('/user/disableUserList', userIds).then(result => {
      tip.success(result.message);
      // 重新查询
      getUserList();
    });
  } else {
    tip.error("请选择需要禁用的行！");
  }
}

// 修改用户状态
const updateState = (user) => {
  user.isEnabled = user.isEnabled === 0 ? 1 : 0;
  put('/user/updateState', user).then(result => {
    // 重新查询
    getUserList();
  });
}

// 重置密码
const resetPwd = (userId) => {
  put(`/user/updatePwd/${userId}`).then(result => {
    tip.success(result.message);
    // 重新查询
    getUserList();
  });
}

const userAddRef = ref();
const openUserAdd = () => {
  userAddRef.value.open();
};

const userUpdateRef = ref();
const openUserUpdate = (row) => {
  userUpdateRef.value.open(row);
};

const assignRoleRef = ref();
const openAssignRole = (row) => {
  assignRoleRef.value.open(row, roleList);
};

// 点击修改权限
const openUpdateAuth = (user) => {
  // 通过路由导航到修改权限页面
  // path不可以和params搭档，否则params会失效
  // router.push({ name: 'authUpdate', params: {"userId": user.userId } });
  router.push({path: '/user/auth-update', query: {"userId": user.userId}});
};

// 修改每页显示条数
const changeSize = (size) => {
  params.pageSize = size;
  // 重新查询
  getUserList();
}
// 修改当前页码
const changeCurrent = (num) => {
  params.pageNum = num;
  // 重新查询
  getUserList();
}

</script>
<style scoped>
.searchForm {
  display: flex;
}

.red {
  color: red;
}
</style>