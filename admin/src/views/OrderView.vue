<template>
  <div class="container">
    <el-table :data="tableData" border style="width: 100%" stripe>
      <el-table-column prop="name" label="分类"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="money" label="赏金"></el-table-column>
      <el-table-column prop="time" label="时间"></el-table-column>
      <el-table-column prop="info" label="订单信息" width="150">
        <el-button
          type="text"
          slot-scope="scope"
          @click="showOrderDetail(scope)"
          >查看订单信息</el-button
        >
      </el-table-column>
      <el-table-column prop="starNum" label="评分"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <a @click="UpdateOrder(scope)" >编辑</a> |
          <el-popconfirm title="确定删除吗？" @confirm="deleteOrder(scope)">
            <a slot="reference">删除</a>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="count"
    >
    </el-pagination>

    <!-- 详细信息 -->
    <el-dialog title="订单信息" :visible.sync="dialogTableVisible">
      <div class="orderInfo">
        <div
          v-for="(item, index) in orderDetail"
          :key="index"
          class="key-value"
        >
          <div class="key">{{ item.key }}</div>
          <div class="value">{{ item.value }}</div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogTableVisible = false"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { formatOrderInfo } from "../utils";
import UpdateOrder from "./UpdateOrder.vue";
export default {
  data() {
    return {
      tableData: [],
      dialogTableVisible: false,
      orderDetail: {},
      page: 1,
      pageSize: 10,
      count: 0,
    };
  },
  created() {
    this.getOrder();
  },
  methods: {
    handleSizeChange(size) {
      this.pageSize = size;
      this.getOrder();
      // console.log(`每页 ${size} 条`);
    },
    handleCurrentChange(page) {
      this.page = page;
      this.getOrder();
      // console.log(`当前页: ${page}`);
    },
    async getOrder() {
      const { page, pageSize } = this;
      const {
        data: { data, count },
      } = await this.$http.get("http://localhost:3000/getAllOrder", {
        params: { page, pageSize },
      });
      // console.log(data);
      this.count = count;
      this.tableData = data;
    },
    showOrderDetail(item) {
      // console.log(item);
      const { row } = item;
      this.dialogTableVisible = true;
      // 调用工具函数格式化订单信息
      this.orderDetail = formatOrderInfo(row);
    },
    async deleteOrder({ row: { _id } }) {
      const { data } = await this.$http.get(
        "http://localhost:3000/deleteOrder",
        {
          params: {
            _id,
          },
        }
      );
      if (data === "success") {
        this.$message.success("删除成功！");
        // 刷新页面
        this.getOrder();
      } else {
        this.$message.error("删除失败！");
      }
    },
    UpdateOrder({ row: info }) {
      this.$router.push({
        name: "UpdateOrder",
        params: {
          info: JSON.stringify(info),
        },
      });
    },
  },
};
</script>

<style style="less" scoped>
.container {
  padding: 20px 30px 80px 20px;
  background-color: #fff;

  a {
    color: #409eff;
  }
}

.orderInfo {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  .key-value {
    display: flex;
    align-items: center;
    margin-bottom: 15px;

    .key {
      font-weight: bold;
      font-size: 16px;
    }

    .value {
      margin-left: 10px;
      margin-top: 4px;
    }
  }
}

/* 分页器 */
.el-pagination {
  float: right;
  margin-top: 30px;
}
</style>
