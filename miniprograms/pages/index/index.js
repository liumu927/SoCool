Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: ['../../images/banner1.jpg', '../../images/banner2.jpg'],
    // 首页显示数组
    indexConfig: [{
        icon: '../../images/paotui.png',
        text: '校园跑腿',
        url: '../run/run',
      },
      {
        icon: '../../images/daiqu.png',
        text: '快递代取',
        url: '../getExpress/getExpress'
      },
      {
        icon: '../../images/kuaididaiji.png',
        text: '快递代寄',
        url: '../expressReplace/expressReplace',
      },
      {
        icon: '../../images/dayin.png',
        text: '打印服务',
        url: '../print/print',
      },
      {
        icon: '../../images/zujie.png',
        text: '租借服务',
        url: '../lease/lease',
      },
      {
        icon: '../../images/youxi.png',
        text: '游戏陪玩',
        url: '../playGame/playGame',
      },
      {
        icon: '../../images/bangsong.png',
        text: '帮我送',
        url: '../helpMeGive/helpMeGive',
      },
      {
        icon: '../../images/jieban.png',
        text: '结伴服务',
        url: '../replaceMe/replaceMe',
      },
      {
        icon: '../../images/qita.png',
        text: '其它帮助',
        url: '../otherHelp/otherHelp',
      }
    ]
  },

  // 跳转详情页
  toDetail(e) {
    const userInfo = wx.getStorageSync('userInfo');
    const url = e.currentTarget.dataset.url;
    if (userInfo) {
      wx.navigateTo({
        url,
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '请前往个人中心登录',
      })
    }
  },

  // 点击公告提示
  handleClickNotice() {
    wx.showModal({
      title: '公告',
      content: '关注公众号可享订单推送-接单员请务必添加客服v: yungui666'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const openid = wx.getStorageSync('openid');

    // 获取openid并存缓存
    if (!openid) {
      // 通过这个api获取登陆凭证（code），并返回给后端接口
      wx.login({
        success: (res) => {
          wx.request({
            url: 'http://localhost:3000/login',
            data: {
              code: res.code
            },
            success: (res) => {
              // console.log(res);
              const {
                openid
              } = res.data;
              wx.setStorageSync('openid', openid)
            }
          })
        },
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