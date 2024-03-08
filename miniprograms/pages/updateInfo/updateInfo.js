// pages/updateInfo/updateInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
  },

  updateAddress() {
    wx.navigateTo({
      url: '../address/address',
    })
  },

  updateNickName(e) {
    let userInfo = this.data.userInfo;
    userInfo.nickName = e.detail.value;
    this.setData({
      userInfo,
    })
    // 优化：防抖
  },

  // 更新头像 【问题】不使用云函数 如何将上传的用户头像存给用户信息缓存中【已解决】
  updateAvatar() {
    let userInfo = this.data.userInfo;
    // 【坑】因为this作用域指向问题 ，success函数实际是一个闭包 ， 无法直接通过this来setData，通过将当前对象赋给一个新的对象
    var that = this;

    wx.chooseMedia({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // console.log(res);
        // console.log(res.tempFiles[0].tempFilePath)

        wx.showLoading({
          title: '加载中',
        })

        // 上传图片
        wx.uploadFile({
          // 当前图片所在的位置
          filePath: res.tempFiles[0].tempFilePath,
          name: 'file',
          url: 'http://localhost:3000/uploadFile',
          success(res) {
            console.log(res);
            let {
              path
            } = JSON.parse(res.data)[0];
            // 注意：路径的 "\"
            path = path.replace(/\\/g, '/');
            let imgUrl = 'http://localhost:3000' + path.split('server')[1]

            userInfo.avatarUrl = imgUrl;

            that.setData({
              userInfo
            })

            wx.hideLoading()
          }
        })
      }
    })
  },

  // 保存修改
  saveChange() {
    wx.setStorageSync('userInfo', this.data.userInfo);

    wx.showToast({
      title: '修改成功',
    })
    wx.switchTab({
      url: '../person/person',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userInfo = wx.getStorageSync('userInfo');
    console.log(userInfo.avatarUrl);
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