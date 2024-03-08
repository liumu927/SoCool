import {
  getTimeNow
} from "../../utils/index";

// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: ['全部任务', '我的订单', '历史任务', '悬赏榜', '赏金猎人榜'],
    // 默认选中
    tabNow: 0,
    orderList: [],
    myOrder: [],
    rewardOrder: [],
    helpOrder: [],
    openid: '',
    canReceive: false,
    helpTotalNum: 0,
    helpTotalMoeny: 0,
    comment: '',
    showComment: false,
    starList: [
      '../../images/star.png',
      '../../images/star.png',
      '../../images/star.png',
      '../../images/star.png',
      '../../images/star.png',
    ],
    showStar: false,
    // 判断当前操作的订单
    finishId: '',
    orderRank: [],
    indexConfig: [{
        text: '校园跑腿',
        check: false
      },
      {
        text: '快递代取',
        check: false
      },
      {
        text: '快递代寄',
        check: false
      },
      {
        text: '打印服务',
        check: false
      },
      {
        text: '租借服务',
        check: false
      },
      {
        text: '游戏陪玩',
        check: false
      },
      {
        text: '帮我送',
        check: false
      },
      {
        text: '结伴服务',
        check: false
      },
      {
        text: '其它帮助',
        check: false
      }
    ]
  },

  // 顶部tab选项
  selectTab(e) {
    const {
      id
    } = e.currentTarget.dataset;

    this.setData({
      tabNow: id,
    })

    if (id === 0) {
      this.onLoad();
    } else if (id === 1) {
      this.getMyOrder();
    } else if (id === 2) {
      this.getMyHelpOrder();
      this.getHelpTotalNum();
      this.getHelpTotalMoney();
    } else if (id === 3) {
      this.getRewardOrder();
    } else if (id === 4) {
      this.getOrderRank();
    }
  },

  // 赏金猎人榜
  getOrderRank(e) {
    wx.request({
      url: 'http://localhost:3000/getOrderRank',
      success: (res) => {
        this.setData({
          orderRank: res.data
        })
      }
    })
  },
  // 评分
  selectStar(e) {
    console.log(e);

    const {
      index
    } = e.currentTarget.dataset;
    let starList = this.data.starList;

    for (let i = 0; i < starList.length; i++) {
      if (i <= index) {
        starList[i] = '../../images/star_fill.png';
      } else {
        starList[i] = '../../images/star.png'
      }
    }

    // 存
    this.setData({
      starList
    })
  },
  // 确认评分
  submitStar() {
    wx.showLoading({
      title: '加载中',
    })

    let starNum = 0;
    let _id = this.data.finishId;

    // 评分星数 获取对应数字
    this.data.starList.forEach(item => {
      if (item === '../../images/star_fill.png') {
        starNum++;
      }
    })

    this.setData({
      showStar: false
    })

    wx.request({
      url: 'http://localhost:3000/toFinishOrder',
      data: {
        _id,
        starNum
      },
      success: (res) => {
        wx.hideLoading();
        if (res.data === "success") {
          this.getMyOrder();
        } else {
          wx.showToast({
            icon: "none",
            title: '操作失败',
          })
        }
      }
    })
  },

  // 显示/隐藏评论
  showComment(e) {
    const {
      index,
      tab
    } = e.currentTarget.dataset;
    if (tab === '0') {
      const data = this.data.orderList;
      data[index].showComment = !data[index].showComment;
      this.setData({
        orderList: data
      })
    } else if (tab === '1') {
      const data = this.data.myOrder;
      data[index].showComment = !data[index].showComment;
      this.setData({
        myOrder: data
      })
    } else if (tab === '2') {
      const data = this.data.helpOrder;
      data[index].showComment = !data[index].showComment;
      this.setData({
        helpOrder: data
      })
    } else if (tab === '3') {
      const data = this.data.rewardOrder;
      data[index].showComment = !data[index].showComment;
      this.setData({
        rewardOrder: data
      })
    }

  },
  // 获取全部评论
  getComment(e) {
    const comment = e.detail.value;
    const _id = e.currentTarget.dataset.id;

    const {
      avatarUrl,
      nickName
    } = wx.getStorageSync('userInfo');

    wx.request({
      url: 'http://localhost:3000/addComment',
      method: 'POST',
      data: {
        _id,
        comment,
        nickName,
        avatarUrl,
        time: getTimeNow()
      },
      success: (res) => {
        if (res.data === "success") {
          wx.showToast({
            title: '评论成功',

          })
          this.setData({
            comment: ''
          })
          const tabNow = this.data.tabNow;

          if (tabNow === 0) {
            this.onLoad();
          } else if (tabNow === 1) {
            this.getMyOrder();
          } else if (tabNow === 2) {
            this.getMyHelpOrder();
            this.getHelpTotalNum();
            this.getHelpTotalMoney();
          } else if (tabNow === 3) {
            this.getRewardOrder();
          }
        } else {
          wx.showToast({
            icon: 'none',
            title: '评论失败',
          })
        }
      }
    })
  },

  // 筛选：重置
  reset() {
    this.data.indexConfig.forEach(item => {
      item.check = false
    })
    this.setData({
      indexConfig: this.data.indexConfig
    })
    this.getOrderList()
  },
  // 筛选
  checkThis(e) {
    const {
      item
    } = e.currentTarget.dataset;
    let i = this.data.indexConfig.filter(i => i.text == item.text)[0]
    i.check = !i.check
    let arr = []
    this.data.indexConfig.forEach(item => {
      if (item.check) {
        arr.push(item.text)
      }
    })
    this.setData({
      indexConfig: this.data.indexConfig
    })
    this.getOrderList(arr.join(','))
  },
  // 筛选点击事件
  showHideSort() {
    if (this.data.showSort) {
      this.setData({
        showSort: false
      })
    } else {
      this.setData({
        showSort: true
      })
    }
  },

  // 删除订单
  deleteOrder(e) {
    wx.showLoading({
      title: '处理中',
    })
    const {
      id
    } = e.currentTarget.dataset;

    wx.request({
      url: 'http://localhost:3000/deleteOrder',
      data: {
        _id: id
      },
      success: () => {
        wx.showToast({
          title: '删除成功',
        })
        this.getMyOrder();
        // wx.hideLoading();
      },
      fail: () => {
        wx.showToast({
          icon: 'none',
          title: '删除失败',
        })
        // wx.hideLoading();
      }
    })
  },
  // 联系方式
  callPhone(e) {
    const {
      phone
    } = e.currentTarget.dataset;
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  // 获取【历史任务】订单信息 
  getMyHelpOrder() {
    wx.request({
      url: 'http://localhost:3000/getMyHelpOrder',
      data: {
        receivePerson: this.data.openid
      },
      success: (res) => {
        const {
          data
        } = res;
        data.forEach(item => {
          item.info = this.formatInfo(item);
          item.stateColor = this.formatState(item.state);
        });
        this.setData({
          helpOrder: data,
        })
        wx.hideLoading();
      }
    })
  },

  // 【历史任务】订单单数总和
  getHelpTotalNum() {
    wx.request({
      url: 'http://localhost:3000/getHelpTotalNum',
      data: {
        receivePerson: wx.getStorageSync('openid')
      },
      success: (res) => {
        this.setData({
          helpTotalNum: res.data.count
        })
      }
    })
  },

  // 【历史任务】订单金额总和
  getHelpTotalMoney() {
    wx.request({
      url: 'http://localhost:3000/getHelpTotalMoney',
      data: {
        receivePerson: wx.getStorageSync('openid')
      },
      success: (res) => {
        // console.log(res);
        // 【问题】接单数为0时会报错 =》没数据时就不赋值【已解决】
        if (!(res.data.length === 0)) {
          this.setData({
            helpTotalMoeny: res.data[0].totalNum
          })
        }
      }
    })
  },

  // 获取【悬赏榜】的订单信息
  getRewardOrder() {
    wx.request({
      url: 'http://localhost:3000/getRewardOrder',
      success: (res) => {
        const {
          data
        } = res;
        data.forEach(item => {
          item.info = this.formatInfo(item);
          item.stateColor = this.formatState(item.state);
        });
        this.setData({
          rewardOrder: data,
        })
        wx.hideLoading();
      }
    })
  },

  // 获取【我的订单】信息
  getMyOrder() {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'http://localhost:3000/getMyOrder',
      data: {
        openid: this.data.openid
      },
      success: (res) => {
        console.log(res);
        const {
          data
        } = res;
        data.forEach(item => {
          item.info = this.formatInfo(item);
          item.stateColor = this.formatState(item.state);
        });
        this.setData({
          myOrder: data,
        })
        wx.hideLoading();
      }
    })
  },

  // 点击接单
  orderReceive(e) {
    if (this.data.canReceive) {
      const {
        item
      } = e.currentTarget.dataset;
      const {
        _id
      } = item;

      wx.request({
        url: 'http://localhost:3000/toGetOrder',
        data: {
          receivePerson: this.data.openid,
          _id
        },
        success: (res) => {
          if (res.data === "success") {
            if (this.data.tabNow === 0) {
              this.onLoad();
            } else {
              this.getRewardOrder();
            }
            wx.hideLoading();
          } else {
            wx.showToast({
              icon: "none",
              title: '接单失败',
            })
          }
        },
      })
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '您目前不是接单员, 请前往个人中心申请成为接单员!'
      })
    }

  },

  // 完成订单
  async toFinish(e) {
    const {
      item
    } = e.currentTarget.dataset;
    const {
      _id,
      receivePerson,
      money
    } = item;
    console.log(item);

    // 评分
    this.setData({
      showStar: true,
      finishId: _id
    })

    wx.request({
      url: 'http://localhost:3000/toFinishOrder',
      data: {
        _id,
        receivePerson,
        money,
      },
      success: (res) => {
        if (res.data === "success") {
          this.getMyOrder();
        } else {
          wx.showToast({
            icon: "none",
            title: '操作失败',
          })
        }
      }
    })
  },

  // 面板信息
  formatInfo(orderInfo) {
    const {
      name,
      info,
    } = orderInfo;
    if (name === '快递代取') {
      const {
        business,
        expectGender,
        expectTime,
        number,
        remark,
        size
      } = info;
      return `快递类型: ${size} -- 快递数量: ${number}个 -- 快递商家: ${business} -- 期望送达: ${expectTime} -- 性别限制: ${expectGender} -- 备注: ${remark}`;
    } else if (name === '打印服务') {
      const {
        colorPrint,
        pageNum,
        remark,
        twoSided
      } = info;
      return `页数: ${pageNum} -- 是否彩印: ${colorPrint ? '是' : '否'} -- 是否双面: ${twoSided ? '是' : '否'} -- 备注: ${remark}`;
    } else if (name === '校园跑腿') {
      const {
        helpContent,
        pickUpAddress
      } = info;
      return `帮助内容: ${helpContent} -- 取货地点: ${pickUpAddress}`;
    } else if (name === '快递代寄') {
      const {
        helpContent,
        business,
        remark
      } = info;
      return `帮助内容: ${helpContent} -- 快递商家: ${business} -- 备注: ${remark}`;
    } else if (name === '租借服务') {
      const {
        leaseItem,
        leaseTime,
        deliveryTime
      } = info;
      return `租借物品: ${leaseItem} -- 租借时长: ${leaseTime} -- 预计交货时间: ${deliveryTime}`;
    } else if (name === '游戏陪玩') {
      const {
        gameID,
        gameName,
        gameTime,
        remark
      } = info;
      return `游戏名称: ${gameName} -- 游戏时间or盘数: ${gameTime} -- 游戏ID: ${gameID} -- 备注信息: ${remark}`;
    } else if (name === '帮我送') {
      const {
        deliveryInfo
      } = info;
      return `送达地点: ${deliveryInfo}`;
    } else if (name === '结伴服务') {
      const {
        helpContent
      } = info;
      return `帮助内容: ${helpContent}`;
    } else if (name === '其它帮助') {
      const {
        helpContent
      } = info;
      return `帮助内容: ${helpContent}`;
    }
  },

  // 面板状态
  formatState(state) {
    if (state === '待帮助') {
      return 'top_right';
    } else if (state === '已帮助') {
      return 'top_right_help';
    } else if (state === '已完成') {
      return 'top_right_finish';
    }
  },

  // 获取用户的接单权限
  getPersonPower() {
    wx.request({
      url: 'http://localhost:3000/getPersonPower',
      data: {
        openid: wx.getStorageSync('openid'),
      },
      success: (res) => {
        this.setData({
          canReceive: !!res.data.length
        })
      }
    })
  },
  // 获取全部订单接口
  getOrderList(names) {
    wx.request({
      url: 'http://localhost:3000/getAllOrder',
      data: {
        names
      },
      success: (res) => {
        console.log(res);
        const {
          data
        } = res;
        data.forEach(item => {
          if (item.name === "快递代取" && item.info.expressCode) {
            item.expressCode = item.info.expressCode;
          }
          // 在信息面板处显示【查看大图】
          if ((item.name === "快递代取" || item.name === "快递代寄") && item.info.codeImg) {
            item.codeImg = item.info.codeImg;
          }
          item.info = this.formatInfo(item);
          item.stateColor = this.formatState(item.state);
        });
        this.setData({
          orderList: data,
          openid: wx.getStorageSync('openid')
        })
        // wx.hideLoading();
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPersonPower();
    this.getOrderList()
  },

  showCodeImg(e) {
    const {
      item: {
        codeImg,
        state,
        receivePerson
      }
    } = e.currentTarget.dataset;
    if (state !== '已帮助' || receivePerson !== this.data.openid) {
      wx.showToast({
        icon: 'none',
        title: '无权查看!',
      })
      return;
    }
    wx.previewImage({
      urls: [codeImg],
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onLoad();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})