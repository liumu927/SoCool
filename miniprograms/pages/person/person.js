// pages/person/person.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    /* personReceiveState
      - success代表已经是接单员了
      - fail代表曾经申请过但是没通过
      - loading代表目前有正在审核中的
      - null代表从未申请过
    */
    personReceiveState: 'null',
    admin: false,
  },


  // 登陆后，去往个人中心页
  updateInfo() {
    if (this.data.hasUserInfo) {
      wx.navigateTo({
        url: '../updateInfo/updateInfo',
      })
    }
  },

  // 新接口 getUserProfile
  getUserProfile() {
    wx.getUserProfile({
      desc: '获取用户信息',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        // 数据存储：存缓存
        wx.setStorageSync('userInfo', res.userInfo);
      }
    })
  },

  // 老接口 getUserInfo
  getUserInfo(e) {
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  // 申请接单  【问题】这里无法正确验证申请接单的状态
  applyOrder() {
    const userInfo = wx.getStorageSync('userInfo');
    const {personReceiveState} = this.data;

    if (!userInfo) {
      wx.showToast({
        icon: 'none',
        title: '请先登录 !',
      })
      return;
    }

    // 【问题】这个设置很不合理  使用解构赋值【已解决】
    // const personReceiveState = 'null';
    // console.log(personReceiveState);

    // 判断 [申请接单] 的状态
    if (personReceiveState === 'success') {
      wx.showModal({
        title: '提示',
        content: '您已经是接单员了, 请勿重复申请!',
        showCancel: false
      })
    } else if (personReceiveState === 'fail') {
      wx.showModal({
        title: '提示',
        content: '您之前提交的申请未通过审核, 您可以继续申请, 如有疑问请联系管理员: yungui666',
        success: (res) => {
          const {
            confirm
          } = res;
          // confirm 表示用户点击了确定
          if (confirm) {
            wx.navigateTo({
              url: '../applyOrder/applyOrder',
            })
          }
        }
      })
    } else if (personReceiveState === 'loading') {
      wx.showModal({
        title: '提示',
        content: '您之前申请的内容正在审核中, 请耐心等待! 如加急审核请添加管理员微信: yungui666',
        showCancel: false,
      })
    } else if (personReceiveState === 'null') {
      wx.navigateTo({
        url: '../applyOrder/applyOrder',
      })
    }
  },

  // 审核接单申请
  orderReceiver() {
    const userInfo = wx.getStorageSync('userInfo');

    if (!userInfo) {
      wx.showToast({
        icon: 'none',
        title: '请先登录 !',
      })
      return;
    }
    wx.navigateTo({
      url: '../orderReceiver/orderReceiver',
    })
  },

  // 微信客服
  getWXCustomer() {
    // 复制内容
    wx.setClipboardData({
      data: 'yungui666',
      success: () => {
        wx.showToast({
          title: '复制微信号成功',
        })
      }
    })
  },

  // 关于我们
  toAbout() {
    wx.navigateTo({
      url: '../aboutAs/aboutAs',
    })
  },

  // 判断当前用户是否是管理员
  getAdminPower() {
    wx.request({
      url: 'http://localhost:3000/getAdminPower',
      data: {
        openid: wx.getStorageSync('openid')
      },
      success: (res) => {
        this.setData({
          // 存在值，取反是false
          admin: !!res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 容错处理：判断API是否存在
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }

    wx.showLoading({
      title: '加载中',
    })

    const userInfo = wx.getStorageSync('userInfo');
    this.setData({
      // 若是空值，取反再取反可以变为布尔值
      hasUserInfo: !!userInfo,
      userInfo: userInfo,
    })

    // 保存当前用户的身份状态: 是不是接单员,是否在审核中
    let personReceiveState = '';

    this.getAdminPower();

    // 更改申请接单的状态,用以判断
    wx.request({
      url: 'http://localhost:3000/findAllReceive',
      data: {
        openid: wx.getStorageSync('openid')
      },
      success: (res) => {
        const {
          data
        } = res;

        if (data.length) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].state === '通过') {
              personReceiveState = 'success';
              break;
            } else if (data[i].state === '不通过') {
              personReceiveState = 'fail';
            } else {
              // 审核中
              personReceiveState = 'loading';
              break;
            }
          }
        } else {
          personReceiveState = 'null';
        }

        // console.log(personReceiveState);

        this.setData({
          personReceiveState,
        })
        wx.hideLoading();
      }
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
    // 强制重新加载
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
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})