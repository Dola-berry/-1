// foregroundPage/pages/list/list.js
import Api from '../../../utils/person.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    foodList: [],
    pagesize: 6,
    page: 1,
    typename: '',
    color: '#000',
    background: '#A3D399',
    show: true,
    isNone: false,
    recipeid: '',
    isMore: true,
    openid:''
  },
  // 下拉底部下一页
  onReachBottom() {
    this.data.page++;
    this.getList()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', (res) => {
      let {
        recipeid,
        typename,
        openid
      } = res;
      this.setData({
        typename,
        recipeid,
        openid
      })
      this.getList()
    })
  },
  // 获取列表
  async getList() {
    let recipeid = this.data.recipeid;
    let _openid = this.data.openid;
    if (!this.data.isMore) {
      return
    }
    wx.showLoading({
      title: '正在请求...',
    })
    let pagesize = this.data.pagesize;
    let skip = (this.data.page - 1) * pagesize;
    let res = await Api._getFoodList({
      recipeId: recipeid,
      status: 1,
      _openid
    }, pagesize, skip, 'addtime', 'desc');
    wx.hideLoading()
    if (res.data.length == 0) {
      if (this.data.foodList.length == 0) {
        this.setData({
          isNone: true
        })
      } else {
        this.setData({
          isMore: false
        })
      }

      wx.showToast({
        title: '没有更多了',
        icon: 'none'
      })
    }
     // 根据openid找到对应用户
     let list = res.data.map(async item => {
      return await Api._redireuser({_openid:item._openid});
    })
    list = await Promise.all(list);
    list.forEach((item,idx) => {
      res.data[idx].userInfo = item.data[0]
    })
    this.setData({
      foodList: this.data.foodList.concat(res.data)
    })
  },
  // 跳转到详情页
  _getDeatail(e){
    let id = e.currentTarget.dataset.id
    let detailInfo = this.data.foodList.find(item => item._id == id);
    wx.navigateTo({
      url: '../detail/detail',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          detailInfo
        })
      }
    })
  }

})