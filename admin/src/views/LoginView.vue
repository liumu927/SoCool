<template>
  <div class="container">
    <div class="body">
      <h1>SoCool 后台管理系统</h1>
      <!-- 表单 -->
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="账号">
          <el-input v-model="form.username"></el-input>
        </el-form-item>

        <el-form-item label="密码">
          <el-input v-model="form.password" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    // 登录
    async onSubmit() {
      const { data } = await this.$http.post(
        "http://localhost:3000/adminLogin",
        this.form
      );
      if (data) {
        this.$message.success("登录成功 ! ");
        localStorage.setItem("adminInfo", JSON.stringify(data));
        this.$router.push({
          name: "Home",
        });
      } else {
        this.$message.error("账号或密码错误！");
        this.form.username = "";
        this.form.password = "";
      }
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  height: 100vh;
  width: 100vw;
  background: no-repeat url("../assets/bg.jpg") 0 0 / cover;
  .body {
    background-color: rgba(255, 255, 255, 0.8);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 20px;
    padding: 30px 50px;
    :deep(.el-form-item__label) {
      text-align: center;
    }
    :deep(.el-button) {
      margin: 25px 0 0 35px;
    }
  }
}
</style>
