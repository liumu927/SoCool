// express 框架
const express = require("express");
const { OrderReceive, Order, Admin } = require("./db");
const request = require("request");
const multer = require("multer");
const { response } = require("express");
const path = require("path");
// const { log } = require("console");

// 实例化
const app = express();

// 静态资源是否能被访问
app.use("/file", express.static(path.join(__dirname, "file")));
// express中获取post请求的携带参数设置
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all("*", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

// 配置multer: 图片存储的位置、名字
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "./file/images"));
  },
  filename: (req, file, cb) => {
    let type = file.originalname.replace(/.+\./, ".");
    cb(null, Date.now() + type);
  },
});
const upload = multer({ storage: storage });

// 登录接口
app.get("/login", async (req, res) => {
  const { code } = req.query;
  // 接收到前端发来的请求，请求一个第三方的地址，通过前端传来的 code 换取 openid、unionid、session_key 等信息
  request(
    {
      // 自己的appid,此处用的测试号
      url: `https://api.weixin.qq.com/sns/jscode2session?appid=wxbe3589b6d86c3d09&secret=70f3330c7a6e2ed07447739f48ca3588&js_code=${code}&grant_type=authorization_code`,
    },
    (err, response, data) => {
      // console.log(data);
      res.send(data);
    }
  );
});

// 申请接单: 拿到前端数据并存到数据库
app.post("/addNewReceiver", async (req, res) => {
  try {
    await OrderReceive.create(req.body);
    res.send("success");
  } catch (error) {
    res.send("fail");
  }
});

// 上传文件接口
app.post("/uploadFile", upload.array("file", 10), (req, res) => {
  res.send(req.files);
});

// 获取需要审核的 接单申请
app.get("/getOrderReceive", async (req, res) => {
  try {
    const result = await OrderReceive.find({
      state: "待审核",
    });
    res.send(result);
  } catch (error) {
    res.status(500).send({
      message: "服务器出错啦~",
    });
  }
});

// 审核用户的 接单申请
app.post("/updateOrderReceive", async (req, res) => {
  try {
    const { _id, state, examinePerson } = req.body;
    await OrderReceive.findByIdAndUpdate(_id, {
      state,
      examinePerson,
    });
    res.send("success");
  } catch (error) {
    res.send("fail");
  }
});

// 获取用户当前所有 接单申请
app.get("/findAllReceive", async (req, res) => {
  try {
    const { openid } = req.query;
    const result = await OrderReceive.find({
      openid,
    });
    res.send(result);
  } catch (error) {
    res.status(500).send({
      message: "服务器出错啦~",
    });
  }
});

// 提交订单
app.post("/addOrder", async (req, res) => {
  try {
    await Order.create(req.body);
    res.send("success");
  } catch (error) {
    res.send("fail");
  }
});

// 获取全部订单接口
app.get("/getAllOrder", async (req, res) => {
  const { page, pageSize, names } = req.query;
  if (page) {
    const data = await Order.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    const count = await Order.countDocuments();
    res.send({
      data,
      count,
    });
  } else {
    if (names != "undefined") {
      arr = names.split(",");
      const result = await Order.find({ name: { $in: arr } });
      res.send(result);
    } else {
      const result = await Order.find();
      res.send(result);
    }
  }
});

//获取用户的接单权限
app.get("/getPersonPower", async (req, res) => {
  const { openid } = req.query;
  const result = await OrderReceive.find({
    openid,
    state: "通过",
  });
  res.send(result);
});

//获取【我的订单】信息
app.get("/getMyOrder", async (req, res) => {
  const { openid } = req.query;
  // console.log(openid);
  const result = await Order.find({
    receivePerson: openid,
  });
  res.send(result);
});

// 获取【我的任务】订单信息
app.get("/getMyHelpOrder", async (req, res) => {
  const { receivePerson } = req.query;
  const result = await Order.find({
    receivePerson,
    state: "已完成",
  });
  res.send(result);
});

// 获取【我的任务】订单数总和
app.get("/getHelpTotalNum", async (req, res) => {
  const { receivePerson } = req.query;
  // 符合条件的数据返回回来
  const result = await Order.countDocuments({
    receivePerson,
    state: "已完成",
  });
  res.send({
    count: result,
  });
});

// 获取【我的任务】订单金额总和
app.get("/getHelpTotalMoney", async (req, res) => {
  const { receivePerson } = req.query;
  const result = await Order.aggregate([
    {
      // 筛选
      $match: {
        receivePerson,
        state: "已完成",
      },
    },
    {
      // 累加
      $group: {
        _id: "",
        totalNum: {
          $sum: "$money",
        },
      },
    },
  ]);

  // console.log(result);
  res.send(result);
});

// 获取【正在悬赏】接口
app.get("/getRewardOrder", async (req, res) => {
  const result = await Order.find({
    state: "待帮助",
  });
  res.send(result);
});

// 给订单添加评论
app.post("/addComment", async (req, res) => {
  try {
    const { _id, nickName, avatarUrl, time, comment } = req.body;
    const order = await Order.findById(_id);
    const { commentList } = order;
    commentList.push({
      nickName,
      avatarUrl,
      time,
      comment,
    });
    await Order.findByIdAndUpdate(_id, {
      commentList,
    });
    res.send("success");
  } catch (error) {
    res.send("fail");
  }
});

// 点击接单
app.get("/toGetOrder", async (req, res) => {
  try {
    const { _id, receivePerson } = req.query;
    await Order.findByIdAndUpdate(_id, {
      receivePerson,
      state: "已帮助",
    });
    res.send("success");
  } catch (error) {
    res.send("fail");
  }
});

// 完成订单
app.get("/toFinishOrder", async (req, res) => {
  try {
    const { _id, starNum } = req.query;
    const result = await Order.findByIdAndUpdate(_id, {
      starNum,
      state: "已完成",
    });
    const { receivePerson } = result;
    const receiveInfo = await OrderReceive.findOne({
      openid: receivePerson,
      state: "通过",
    });

    let { OrderNumber, _id: receiveID } = receiveInfo;
    await OrderReceive.findByIdAndUpdate(receiveID, {
      OrderNumber: OrderNumber + 1,
    });
    res.send("success");
  } catch (error) {
    res.send("fail");
  }
});

// 获取接单者排行榜
app.get("/getOrderRank", async (req, res) => {
  const result = await OrderReceive.find({
    state: "通过",
  }).sort({ OrderNumber: -1 }); // 降序
  res.send(result);
});

// 后台
// 管理员登陆
app.post("/adminLogin", async (req, res) => {
  const { username, password } = req.body;
  const result = await Admin.findOne({
    username,
    password,
  });
  res.send(result);
});

// 删除订单
app.get("/deleteOrder", async (req, res) => {
  try {
    const { _id } = req.query;
    await Order.findByIdAndRemove(_id);
    res.send("success");
  } catch (error) {
    res.send("fail");
  }
});

// 修改订单
app.post("/updateOrder", async (req, res) => {
  try {
    const { _id } = req.body;
    await Order.findByIdAndUpdate(_id, req.body);
    res.send("success");
  } catch (error) {
    res.send("fail");
  }
});

// 查询管理员列表
app.get("/getAdminList", async (req, res) => {
  const result = await Admin.find();
  res.send(result);
});

// 添加管理员
app.post("/addAdmin", async (req, res) => {
  try {
    await Admin.create(req.body);
    res.send("success");
  } catch (error) {
    res.send("fail");
  }
});

// 更新管理员信息
app.post("/updateAdmin", async (req, res) => {
  try {
    const { _id } = req.body;
    await Admin.findByIdAndUpdate(_id, req.body);
    res.send("success");
  } catch (error) {
    res.send("fail");
  }
});

// 删除管理员
app.get("/deleteAdmin", async (req, res) => {
  try {
    const { _id } = req.query;
    await Admin.findByIdAndRemove(_id);
    res.send("success");
  } catch (error) {
    res.send("fail");
  }
});

// 判断当前用户是否是管理员
app.get("/getAdminPower", async (req, res) => {
  const { openid } = req.query;
  const result = await Admin.findOne({
    openid,
  });
  res.send(result);
});

app.listen(3000, () => {
  console.log("server running port 3000!");
});
