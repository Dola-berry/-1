// const db = wx.cloud.database();
// import Api from '../../router/demo.js'
import Api from '../../utils/person.js'
Page({
  data: {
    isMore: true,
    inputShowed: false,
    inputVal: "",
    url: ["../../tabs/index/tp.png", "../../tabs/index/zc.png", "../../tabs/index/tg.png"],
    menus: [],
    hotFoodList: [],
    keywords: ''
  },
  click() {
    wx.navigateTo({
      url: "../../foregroundPage/pages/cate/cate"
    })
  },
  _getlist() {
    wx.navigateTo({
      url: "../../foregroundPage/pages/list/list"
    })
  },
  onLoad() {
    this.setData({
      search: this.search.bind(this)
    })
  },
  search: function (value) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([{
          text: '燕麦饼干',
          value: 1
        }, {
          text: '覆盆子夹心饼干',
          value: 2
        }])
      }, 200)
    })
  },
  selectResult: function (e) {
    console.log('select result', e.detail)
  },
  // 跳转到详情页
  _getdetail(e) {
    let id = e.currentTarget.dataset.id;
    let detailInfo = this.data.hotFoodList.find((item, idx) => {
      return item._id == id
    })
    // console.log(detailInfo);
    wx.navigateTo({
      url: '../../foregroundPage/pages/detail/detail',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          detailInfo
        })
      }
    })
  },
  // 滑到底部，下一页
  onReachBottom() {
      wx.showToast({
        title: '没有更多了',
        icon: 'none'
      })
  },
  onShow() {
    this._getMenus()    
    this._getHotFood();
    
  },
  // 获取热门美食
  async _getHotFood() {
    let res = await Api._getOrderFood({
      status: 1
    },'views','desc');
    // 根据openid找到对应用户
    let list = res.data.map(async item => {
      return await Api._redireuser({
        _openid: item._openid
      });
    })
    list = await Promise.all(list);
    list.forEach((item, idx) => {
      res.data[idx].userInfo = item.data[0]
    })
    this.setData({
      hotFoodList: res.data
    })
  },

  // 获取前三个分类
  async _getMenus() {
    let pagesize = 3;
    let page = 1;
    let skip = (page - 1) * pagesize;
    let res = await Api._getMenus({
      status: 1
    }, pagesize, skip, 'status', 'desc');
    this.data.url.forEach((item, idx) => {
      res.data[idx].url = item
    })
    this.setData({
      menus: res.data
    })
  },
  // 跳转
  async _navigateList(e) {
    let {
      recipeid,
      typename
    } = e.currentTarget.dataset;
    wx.navigateTo({
      url: './../../foregroundPage/pages/list/list?',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          recipeid,
          typename
        })
      }
    })
  },
  // 获取搜索关键词
  // input事件
  _keyworksInput(e) {
    this.setData({
      keywords: e.detail.value
    })
  },
  // 搜索
  _getSearchList(e) {
    let keywords = this.data.keywords.trim();
    if (keywords == '') {
      wx.showToast({
        title: '请输入关键字',
        icon: 'none'
      })
      return
    }
    //设置用户最近搜索的缓存 historykeywords
    let historykeywords = wx.getStorageSync('historykeywords') || []

    let index = historykeywords.findIndex(item => {
      return item == keywords
    })

    if (index != -1) {
      historykeywords.splice(index, 1)
    }
    historykeywords.unshift(keywords)
    wx.setStorageSync('historykeywords', historykeywords)
    wx.navigateTo({
      url: '../../foregroundPage/pages/searchList/searchList',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          keywords
        })
      }
    })
  },
  // async click(){
  //  let res = await Api.getDemo();
  //  console.log(res);

  // },
})