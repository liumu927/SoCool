<template>
  <div>
    <el-container>
      <el-header>
        <!-- header -->
        <div class="headerConfig">
          <p>Hello: {{ adminInfo.nickName }}</p>
          <el-button @click="outLogin">退出</el-button>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <!-- aside -->
          <el-col :span="24">
            <h5>SoCool后台管理</h5>
            <el-menu default-active="Order" class="el-menu-vertical-demo" @select="selectMenu">
              <el-menu-item index="Order">
                <i class="el-icon-s-data"></i>
                <span slot="title">订单管理</span>
              </el-menu-item>
              <el-menu-item index="Admin">
                <i class="el-icon-menu"></i>
                <span slot="title">管理员</span>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-aside>
        <el-main>
          <!-- main -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    outLogin() {
      localStorage.removeItem("adminInfo");
      this.$router.push({
        name: 'Login'
      })
      this.$message.success("退出成功！")
    },
    selectMenu(key) {
      this.$router.push({
        name: key
      })
    },
  },
  computed: {
    adminInfo() {
      return JSON.parse(localStorage.getItem("adminInfo"));
    }
  }
}
</script>

<style scoped>
.el-header {
  background-color: #95bcee;
  color: #333;
  text-align: center;
}

.el-header .headerConfig {
  display: flex;
  justify-content: flex-end;
  padding-right: 30px;
  align-content: center;
}

.headerConfig .el-button {
  height: 40px;
  margin-left: 40px;
  margin-top: 8px;
}

.headerConfig p {
  margin-top: 18px;
}

.el-container {
  height: 100vh;
}

.el-aside {
  color: #333;
  text-align: center;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
}
</style>