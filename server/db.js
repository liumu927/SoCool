const mongoose = require("mongoose");

//连接mongodb数据库
mongoose
  .connect("mongodb://127.0.0.1:27017/socool")
  .then(() => {
    console.log("数据库连接成功！");
  })
  .catch((err) => {
    console.log("数据库连接失败！", err);
  });

// 创建【申请接单】者的表
const OrderReceiveSchema = new mongoose.Schema({
  openid: {
    type: String,
  },
  name: {
    type: String,
  },
  userID: {
    type: String,
  },
  userIDImg: {
    type: String,
  },
  userInfo: {
    type: Object,
  },
  state: {
    type: String,
  },
  time: {
    type: String,
  },
  // 接单数量
  OrderNumber: {
    type: Number,
    default: 0,
  },
  examinePerson: {
    type: String,
    default: "",
  },
});

// 创建九大板块的表
const OrderSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  time: {
    type: String,
  },
  money: {
    type: Number,
  },
  state: {
    type: String,
  },
  address: {
    type: String,
  },
  info: {
    type: Object,
  },
  userInfo: {
    type: Object,
  },
  phone: {
    type: String,
  },
  receivePerson: {
    type: String,
    default: "",
  },
  // 评论列表 数组
  commentList: {
    type: Array,
    default: [],
  },
  // 单条评论
  comment: {
    type: String,
    default: "",
  },
  // 评分
  starNum: {
    type: Number,
    default: 0,
  },
});

// 创建登录页面表
const AdminSchema = new mongoose.Schema({
  openid: {
    type: String,
  },
  nickName: {
    type: String,
  },
  role: {
    type: String,
  },
  time: {
    type: String,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
});

const OrderReceive = mongoose.model("OrderReceive", OrderReceiveSchema);
const Order = mongoose.model("Order", OrderSchema);
const Admin = mongoose.model("Admin", AdminSchema);

// Admin.create({
//   openid: "oHOjj4rj3H_dKTyzhc3y8kLVZkOI",
//   nickName: "云归",
//   role: "超级管理员",
//   time: new Date(),
//   username: "admin",
//   password: "123456",
// });

module.exports = {
  OrderReceive,
  Order,
  Admin,
};
