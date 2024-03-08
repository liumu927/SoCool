<template>
  <div class="container">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="订单分类">
        <el-input v-model="form.name" disabled></el-input>
      </el-form-item>
      <el-form-item label="发布时间">
        <el-input v-model="form.time" disabled></el-input>
      </el-form-item>
      <el-form-item label="订单金额">
        <el-input v-model="form.money"></el-input>
      </el-form-item>
      <el-form-item label="订单状态">
        <el-input v-model="form.state"></el-input>
      </el-form-item>
      <el-form-item label="收件地址">
        <el-input v-model="form.address"></el-input>
      </el-form-item>

      <template v-if="form.name === '快递代取'">
        <el-form-item label="快递大小">
          <el-input v-model="form.info.size"></el-input>
        </el-form-item>
        <el-form-item label="快递商家">
          <el-input v-model="form.info.business"></el-input>
        </el-form-item>
        <el-form-item label="取件码">
          <el-input v-model="form.info.expressCode"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.info.remark"></el-input>
        </el-form-item>
        <el-form-item label="期待送达">
          <el-input v-model="form.info.expectTime"></el-input>
        </el-form-item>
        <el-form-item label="性别限制">
          <el-input v-model="form.info.expectGender"></el-input>
        </el-form-item>
        <el-form-item label="快递数量">
          <el-input v-model="form.info.number"></el-input>
        </el-form-item>
      </template>

      <template v-if="form.name === '打印服务'">
        <el-form-item label="页数">
          <el-input v-model="form.info.pageNum"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.info.remark"></el-input>
        </el-form-item>
        <el-form-item label="是否彩印">
          <el-input v-model="form.info.colorPrint"></el-input>
        </el-form-item>
        <el-form-item label="是否双面">
          <el-input v-model="form.info.twoSided"></el-input>
        </el-form-item>
      </template>

      <template v-if="form.name === '校园跑腿'">
        <el-form-item label="帮助内容">
          <el-input v-model="form.info.helpContent"></el-input>
        </el-form-item>
        <el-form-item label="取货地点">
          <el-input v-model="form.info.pickUpAddress"></el-input>
        </el-form-item>
      </template>

      <template v-if="form.name === '快递代寄'">
        <el-form-item label="帮助内容">
          <el-input v-model="form.info.helpContent"></el-input>
        </el-form-item>
        <el-form-item label="快递商家">
          <el-input v-model="form.info.business"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.info.remark"></el-input>
        </el-form-item>
      </template>

      <template v-if="form.name === '租借服务'">
        <el-form-item label="租借物品">
          <el-input v-model="form.info.leaseItem"></el-input>
        </el-form-item>
        <el-form-item label="租借时长">
          <el-input v-model="form.info.leaseTime"></el-input>
        </el-form-item>
        <el-form-item label="预计交货时间">
          <el-input v-model="form.info.deliveryTime"></el-input>
        </el-form-item>
      </template>

      <template v-if="form.name === '游戏陪玩'">
        <el-form-item label="游戏名称">
          <el-input v-model="form.info.gameName"></el-input>
        </el-form-item>
        <el-form-item label="游戏时间or盘数">
          <el-input v-model="form.info.gameTime"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.info.remark"></el-input>
        </el-form-item>
      </template>

      <template v-if="form.name === '帮我送'">
        <el-form-item label="送达地点">
          <el-input v-model="form.info.deliveryInfo"></el-input>
        </el-form-item>
      </template>

      <template v-if="form.name === '结伴服务' || form.name === '其他帮助'">
        <el-form-item label="帮助内容">
          <el-input v-model="form.info.helpContent"></el-input>
        </el-form-item>
      </template>

      <!-- 确定 & 取消 -->
      <el-form-item>
        <el-button type="primary" @click="onSumbit">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {},
    };
  },
  created() {
    // console.log(this.$route);
    // 接收数据
    this.form = JSON.parse(this.$route.params.info);
  },
  methods: {
    async onSumbit() {
      const { data } = await this.$http.post(
        "http://localhost:3000/updateOrder",
        this.form
      );
      if (data === "success") {
        this.cancel();
        this.$message.success("修改成功！");
      } else {
        this.$message.error("修改失败！");
      }
    },
    cancel() {
      this.$router.push({
        name: "Order",
      });
    },
  },
};
</script>

<style scoped>
.container {
  background-color: #fff;
  padding: 20px 10px;
}
</style>
