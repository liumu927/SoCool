// pages/address/address.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: [],
    url: '',
  },

  selectAddress(e) {
    const {
      index
    } = e.currentTarget.dataset;
    const url = wx.getStorageSync('urlNow')
    const address = this.data.address[index];

    wx.setStorageSync('addressNow', address);
    wx.redirectTo({
      url: `../${url}/${url}`,
    })
  },


  // 【问题】如何设置点击图标处设置默认地址【已解决】
  selectDefault(e) {
    // 当前点击项索引
    const index = e.currentTarget.dataset.index;
    const address = this.data.address;
    const addressDefault = address[index];

    for (let i = 0; i < address.length; i++) {
      if (address[i].defaultAddress) {
        address[i].defaultAddress = false;
      }
    }

    addressDefault.defaultAddress = true;

    wx.setStorageSync('address', address);

    this.onLoad();
  },

  // 编辑
  edit(e) {
    const index = e.currentTarget.dataset.index;
    const address = this.data.address[index];
    wx.navigateTo({
      url: `../addAddress/addAddress?address=${JSON.stringify(address)}&index=${index}`,
    })
  },

  // 删除
  delete(e) {
    const index = e.currentTarget.dataset.index;
    const address = this.data.address;
    address.splice(index, 1);
    wx.setStorageSync('address', address);
    wx.showToast({
      title: '删除成功',
    })
    // 【问题】当地址全被删除后，在选择页面更新当前收件地址
    console.log(address);
    // if (address.length === 0) {
    //   wx.setStorageSync('addressNow', {})
    //   console.log("1111");
    // }
    this.onLoad();
    // wx.navigateTo({
    //   url: '../address/address',
    // })
  },

  // 添加地址 按钮
  addAddress() {
    wx.navigateTo({
      url: '../addAddress/addAddress',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 从缓存取地址
    const address = wx.getStorageSync('address');
    this.setData({
      address,
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
    this.setData({
      address: wx.getStorageSync('address')
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

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