// pages/selectBuild/selectBuild.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: ['教学区', '宿舍楼', '食堂', '运动场', '办公楼', '其他建筑'],
    tabNow: 0,
    tabLink: [],
    schoolBuilding: ['1教', '2教',
      '3教', '4教', '5教', '6教', '7教', 'FIU', '圆厅教室', '阶梯教室3', '阶梯教室4', '阶梯教室5', '阶梯教室6'
    ],
    dormitory: ['桃李园', '南区', '西区', '新南区', 'FIU'],
    canteen: ['一食堂', '二食堂', '三食堂', '四食堂', '五食堂', '清真食堂', '瑞德厦餐厅'],
    playground: ['西区操场', '南区操场', '体育馆', '游泳馆', '西区篮球场', '南区篮球场', '健身房'],
    officeBuilding: ['学工楼', '现代信息交流中心', '国培楼', '经管类办公楼', '管理学院'],
    other: ['图书馆', '科学会堂', '学术交流中心', '金工车间', '冷冻冷藏技术研究中心'],
  },

  // 选择具体楼栋  【问题】怎么联系具体楼栋: 使用data-index获取逐项的索引，并将列表数组与tabNow联系起来【已解决】
  selectBuild(e) {
    const index = e.currentTarget.dataset.index;
    const that = this.data;
    const build = `${that.tabList[that.tabNow]}-${that.tabLink[that.tabNow][index]}`;
    wx.navigateTo({
      url: `../addAddress/addAddress?build=${build}`
    })
  },

  // 标题栏切换
  selectTab(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({
      tabNow: id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this.data;
    that.tabLink = [
      that.schoolBuilding,
      that.dormitory,
      that.canteen,
      that.playground,
      that.officeBuilding,
      that.other,
    ]
    // console.log(that.tabLink);
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