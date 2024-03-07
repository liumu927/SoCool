// pages/addAddress/addAddress.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultAddress: true,
    build: '',
    houseNumber: '',
    name: '',
    phone: '',
    isEdit: false,
    editNow: false,
    editIndex: 0,
  },

  // 保存地址
  saveAddress() {
    const {
      build,
      houseNumber,
      name,
      phone,
      defaultAddress,
      isEdit,
      editNow,
      index,
    } = this.data;

    let address = wx.getStorageSync('address');

    // 功能：判断是否存在默认地址，只能有一个
    if (!isEdit && address && defaultAddress) {
      for (let i = 0; i < address.length; i++) {
        // 判断每一项地址中是否存在默认地址
        if (address[i].defaultAddress) {
          wx.showToast({
            icon: 'none',
            title: '已存在默认地址!',
          })
          return;
        }
      }
    }

    // 将地址存在一个对象中
    const form = {
      build,
      houseNumber,
      name,
      phone,
      defaultAddress,
    };

    // 功能：存地址
    if (!address) {
      // 第一次存地址
      address = [form];
    } else {
      if (editNow) {
        address[Number(index)] = form;
      } else {
        address.push(form);
      }
    }

    // 存储地址：使用缓存
    wx.setStorageSync('address', address);
    wx.navigateTo({
      // delta: 3
      url: `../address/address`
    })
  },

  // 默认地址
  handleChangeSwitch(e) {
    this.setData({
      defaultAddress: e.detail.value
    })
    // console.log( e.detail.value);
  },

  // 电话
  getPhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },

  // 姓名
  getName(e) {
    this.setData({
      name: e.detail.value
    })
    // 优化：防抖
  },

  // 门牌号
  getHouseNumber(e) {
    this.setData({
      houseNumber: e.detail.value
    })
  },

  // 选择楼栋
  selectBuild() {
    wx.navigateTo({
      url: '../selectBuild/selectBuild',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {
      build,
      address,
      index
    } = options;

    if (address) {
      const {
        build: builds,
        houseNumber,
        name,
        phone,
        defaultAddress
      } = JSON.parse(address);

      if (defaultAddress) {
        this.setData({
          isEdit: true
        })
      }
      
      this.setData({
        build: builds,
        houseNumber,
        name,
        phone,
        defaultAddress,
        index,
        editNow: true,
      })
    } else {
      this.setData({
        build,
      })
    }

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