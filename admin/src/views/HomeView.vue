<template>
  <el-container>
    <el-header>
      <!-- header -->
      <span>飕酷&nbsp;&nbsp;SoCool</span>
      <div class="headerConfig">
        <p>Hello: {{ adminInfo.nickName }}</p>
        <el-button @click="outLogin">退出</el-button>
      </div>
    </el-header>
    <el-container class="body">
      <el-aside width="200px">
        <!-- aside -->
        <el-col :span="24">
          <p class="title">后台管理</p>
          <el-menu
            default-active="Order"
            class="el-menu-vertical-demo"
            @select="selectMenu"
          >
            <el-menu-item index="Order">
              <i class="el-icon-s-data"></i>
              <span slot="title">订单管理</span>
            </el-menu-item>
            <el-menu-item index="Admin">
              <i class="el-icon-s-custom"></i>
              <span slot="title">管理员</span>
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-aside>
      <el-main>
        <!-- 二级路由路口：main -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    outLogin() {
      // 清空缓存
      localStorage.removeItem("adminInfo");
      this.$router.push({
        name: "Login",
      });
      this.$message.success("退出成功！");
    },
    selectMenu(key) {
      this.$router.push({
        name: key,
      });
    },
  },
  computed: {
    adminInfo() {
      return JSON.parse(localStorage.getItem("adminInfo"));
    },
  },
};
</script>

<style style="less" scoped>
.el-container {
  height: 100vh;

  .el-header {
    background-image: linear-gradient(to right, #1067D1, #dff3ff);
    text-align: center;
    display: flex;
    justify-content: space-between;
    padding-left: 30px;

    span {
      height: 60px;
      display: inline-block;
      color: #ffffff;
      font-size: 30px;
      line-height: 60px;
      font-weight: bolder;
    }

    .headerConfig {
      display: flex;
      justify-content: flex-end;
      align-content: center;
      padding-right: 30px;
      p {
        margin-top: 18px;
      }

      .el-button {
        height: 40px;
        margin-left: 40px;
        margin-top: 8px;
      }
    }
  }

  .el-aside {
    color: #333;
    text-align: center;
    .title {
      margin: 20px 0 20px 0;
      font-size: 20px;
      font-weight: bold;
    }
  }

  .el-main {
    background-color: #e9eef3;
    color: #333;
  }
}
</style>
