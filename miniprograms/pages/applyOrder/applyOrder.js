// pages/applyOrder/applyOrder.js
import {
  getTimeNow
} from '../../utils/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    userIDImg: '',
    showTips: false,
    modalContent: '1. 证件号指您的学生证上面的号码 2. 证件证明是指学生证带信息首页 3. 需要加急请点击微信客服添加好友加急申请',
    name: '',
    userID: '',
    studentId: ''
  },

  // 申请接单提交
  submit() {
    const {
      name,
      userID,
      userIDImg,
      studentId
    } = this.data;

    if (!name || !userID || !studentId || !userIDImg) {
      wx.showToast({
        title: '您输入的信息不全',
        icon: "none"
      })
      return;
    }
    wx.request({
      url: 'http://localhost:3000/addNewReceiver',
      method: 'POST',
      data: {
        openid: wx.getStorageSync('openid'),
        name,
        userID,
        studentId,
        userIDImg,
        userInfo: wx.getStorageSync('userInfo'),
        state: "待审核",
        // 封装的工具函数
        time: getTimeNow(),
      },
      success: (res) => {
        const {
          data
        } = res;
        if (data === "success") {
          // 清空输入内容
          this.setData({
            name: '',
            userID: '',
            userIDImg: '',
            studentId: ''
          })
          wx.showToast({
            title: '提交成功',
          })
          wx.navigateTo({
            url: '../receiveLoading/receiveLoading',
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '上传失败',
          })
        }
      },
    })
  },

  // 接单者姓名
  getName(e) {
    this.setData({
      name: e.detail.value
    })
  },

  // 证件号
  getUserID(e) {
    this.setData({
      userID: e.detail.value
    })
  },

  // 获取学号
  getStudentID(e) {
    this.setData({
      studentId: e.detail.value
    })
  },

  // 电子邮件
  toAgreement() {
    wx.navigateTo({
      url: '../agreement/agreement',
    })
  },

  // 复制微信
  getAdminWX() {
    wx.setClipboardData({
      data: 'yungui666',
      success: (res) => {
        wx.showToast({
          title: '复制微信成功',
        })
      }
    })
  },


  showTips() {
    this.setData({
      showTips: !this.data.showTips
    })
  },

  uploadImg() {
    wx.chooseMedia({
      count: 1,
      sizeType: ['compressed', 'original'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        wx.showLoading({
          title: '加载中',
        })
        // console.log(res);
        // console.log(random);
        wx.uploadFile({
          filePath: res.tempFiles[0].tempFilePath,
          name: 'file',
          url: 'http://localhost:3000/uploadFile',
          success: (res) => {
            let {
              path
            } = JSON.parse(res.data)[0];
            // 注意：路径的 "\"
            path = path.replace(/\\/g, '/');
            let imgUrl = 'http://localhost:3000' + path.split('server')[1]
            this.setData({
              userIDImg: imgUrl
            })
            wx.hideLoading()
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userInfo = wx.getStorageSync('userInfo');
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