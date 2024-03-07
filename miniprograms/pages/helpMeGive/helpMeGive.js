// pages/helpMeGive/helpMeGive.js
import {
  getTimeNow
} from '../../utils/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: '',
    userInfo: {},
    deliveryInfo: '',
    money: 0,
  },


  selectAddress() {
    wx.setStorageSync('urlNow', 'helpMeGive')
    wx.redirectTo({
      url: '../address/address',
    })
  },

  submit() {
    const {
      address,
      userInfo,
      deliveryInfo,
      money
    } = this.data;
    if (!deliveryInfo || !address || !money) {
      wx.showToast({
        icon: 'none',
        title: '您填写的信息不全',
      })
      return;
    }


    wx.request({
      url: 'http://localhost:3000/addOrder',
      method: 'POST',
      data: {
        // 模块的名字
        name: '帮我送',
        // 当前时间
        time: getTimeNow(),
        // 订单金额
        money,
        // 订单状态
        state: '待帮助',
        // 取货地址
        address,
        // 订单信息
        info: {
          // 送达地点
          deliveryInfo,
        },
        // 用户信息
        userInfo,
        // 手机号
        phone: wx.getStorageSync('phone'),
      },
      success: (res) => {
        if (res.data === "success") {
          wx.switchTab({
            url: '../index/index',
          })
          wx.showToast({
            title: '发布成功',
          })
        } else {
          wx.showToast({
            title: '发布失败',
            icon: "none"
          })
        }
      }
    })
  },

  getMoney(e) {
    this.setData({
      money: Number(e.detail.value)
    })
  },

  getDeliveryInfo(e) {
    this.setData({
      deliveryInfo: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const address = wx.getStorageSync('addressNow');
    const userInfo = wx.getStorageSync('userInfo');
    if (address) {
      const {
        build,
        houseNumber
      } = address;
      this.setData({
        address: `${build}-${houseNumber}`
      })
    }
    this.setData({
      userInfo,
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