<template>
  <el-container class="home-container">
    <el-aside style="width: 217px;">
      <el-row class="tac">
        <el-col>
          <el-menu
              class="el-menu-vertical-demo"
              :default-active="$route.path"
          >
            <el-menu-item index="/user/index"  v-if="currUser.isAdmin==='1'" @click="router.push('/user/index')">
              <el-icon>
                <User/>
              </el-icon>
              <span>用户管理</span>
            </el-menu-item>
            <el-sub-menu index="2">
              <template #title>
                <el-icon>
                  <Goods/>
                </el-icon>
                <span>商品管理</span>
              </template>
              <el-menu-item index="/commodity/index" @click="router.push('/commodity/index')">商品列表</el-menu-item>
              <el-menu-item index="/commodity/category" @click="router.push('/commodity/category')">商品分类管理</el-menu-item>
              <el-menu-item index="/commodity/brand" @click="router.push('/commodity/brand')">商品品牌管理</el-menu-item>
            </el-sub-menu>

            <el-menu-item index="/in-warehouse/index" @click="router.push('/in-warehouse/index')">
              <el-icon>
                <SoldOut/>
              </el-icon>
              <span>入库单管理</span>
            </el-menu-item>

            <el-menu-item index="/out-warehouse/index" @click="router.push('/out-warehouse/index')">
              <el-icon>
                <Sell/>
              </el-icon>
              <span>出库单管理</span>
            </el-menu-item>

            <el-menu-item index="/warehouse/index" @click="router.push('/warehouse/index')">
              <el-icon>
                <House/>
              </el-icon>
              <span>仓库管理</span>
            </el-menu-item>

            <el-menu-item index="/statistics/index" @click="router.push('/statistics/index')">
              <el-icon>
                <PieChart/>
              </el-icon>
              <span>统计报表</span>
            </el-menu-item>

            <el-sub-menu index="8">
              <template #title>
                <el-icon>
                  <Setting/>
                </el-icon>
                <span>系统设置</span>
              </template>
              <el-menu-item index="/system/unit" @click="router.push('/system/unit')">商品单位管理</el-menu-item>
            </el-sub-menu>

          </el-menu>
        </el-col>
      </el-row>
    </el-aside>
    <el-container class="main-container">
      <el-header>
        <div class="header_left">
          <img height="40" src="/warehouse.png" width="40"/>
          <span style="font-weight: bold;">&nbsp;仓易通 WMS</span>
        </div>
        <div class="header_right">
          <span>当前用户：{{ `${currUser.userCode}【${currUser.userName}】` }}</span>
          <a href="#" @click.prevent="logout">退出</a>
        </div>
      </el-header>
      <el-main>
        <div class="breadcrumb">
          <el-icon>
            <fold/>
          </el-icon>
          <el-breadcrumb style="display: inline-block;margin-left: 10px;">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <template v-if="$route.meta && $route.meta.nav">
              <el-breadcrumb-item v-for="path in $route.meta.nav " :key="path">{{ path }}</el-breadcrumb-item>
            </template>
          </el-breadcrumb>
        </div>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import {inject, ref} from "vue";
import {useRouter} from "vue-router";
import {del, get, removeLocalToken, tip} from "@/common";
import {Fold, Goods, House, PieChart, Sell, Setting, ShoppingCart, SoldOut, User} from '@element-plus/icons-vue'
const router = useRouter(); // 获取路由器

// 获取当前登录用户
const currUser = ref({});
const getCurrentUser = () => {
  get("/curr-user").then(result => {
    currUser.value = result.data;
    if (currUser.value.isAdmin === '1') {
      router.push("/user/index");
    } else {
      router.push("/commodity/index");
    }
  });
}

getCurrentUser();

// 退出
const logout = () => {
  del("/logout").then(result => {
    // 删除本地token
    removeLocalToken();
    // 替换路由
    router.replace("/login");
    tip.success("您已退出系统！");
  });
}

</script>

<style scoped>
.home-container {
  height: 100%;
  display: flex;
}

.main-container {
  display: flex;
  flex-direction: column;
}

.el-header {
  line-height: 60px;

  display: flex;
  justify-content: space-between;
}

.el-header .header_left {
  font-size: 22px;
  font-family: 微软雅黑;
}

.header_left img {
  margin-top: -5px;
  vertical-align: middle;
}

.el-header .header_right {
  padding-right: 20px;
}

.header_right a {
  margin-left: 10px;
}

.el-menu {
  height: 100%;
}

.el-main {
  border-top: 1px solid #CCC;
  border-bottom: 1px solid #CCC;
}

.breadcrumb {
  margin-bottom: 20px;
}

.el-footer {
  text-align: center;
  font-size: 12px;
  height: 40px;
  line-height: 40px;
}
</style>