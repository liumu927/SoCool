// pages/print/print.js
import {
  getTimeNow
} from '../../utils/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    printImg: '',
    address: '',
    userInfo: {},
    pageNum: null,
    remark: '',
    colorPrint: false,
    twoSided: false,
  },

  getTwoSided(e) {
    this.setData({
      twoSided: e.detail.value
    })
  },

  getColorPrint(e) {
    this.setData({
      colorPrint: e.detail.value
    })
  },

  submit() {
    const {
      printImg,
      address,
      userInfo,
      pageNum,
      colorPrint,
      remark,
      twoSided
    } = this.data;
    if (!printImg || !address || !pageNum) {
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
        name: '打印服务',
        // 当前时间
        time: getTimeNow(),
        // 订单金额
        money: colorPrint ? (2 * pageNum + 3) : (0.5 * pageNum + 3),
        // 订单状态
        state: '待帮助',
        // 收件地址
        address,
        // 订单信息
        info: {
          // 打印原件
          printImg,
          // 页数
          pageNum,
          // 备注
          remark,
          // 是否彩印
          colorPrint,
          // 是否双面
          twoSided,
        },
        // 用户信息
        userInfo,
        // 用户手机号
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

  getRemark(e) {
    this.setData({
      remark: e.detail.value
    })
  },

  getPageNumber(e) {
    this.setData({
      pageNum: Number(e.detail.value)
    })
  },

  selectAddress() {
    wx.setStorageSync('urlNow', 'print')
    wx.redirectTo({
      url: '../address/address',
    })
  },

  // 上传文档
  getFile() {
    const that = this
    wx.chooseMessageFile({
      count: 5,
      type: 'file',
      success: (res) => {
        wx.showLoading({
          title: '加载中',
        })
        // console.log(res);

        // 上传后端
        wx.uploadFile({
          url: 'http://localhost:3000/uploadFile',
          filePath: res.tempFiles[0].path,
          name: 'file',
          success(res) {
            let {
              path
            } = JSON.parse(res.data)[0];
            path = path.replace(/\\/g, '/');
            // console.log(path);
            let fileUrl = `http://localhost:3000${path.split('server')[1]}`
            that.setData({
              printImg: fileUrl
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
    const address = wx.getStorageSync('addressNow');
    const userInfo = wx.getStorageSync('userInfo');

    if (address) {
      const {
        build,
        houseNumber
      } = address;
      this.setData({
        address: `${build}-${houseNumber}`,
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