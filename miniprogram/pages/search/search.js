// pages/search/search.js
import Api from '../../utils/person.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keywords: '',
    list: '',
    isHidden: true,
    hotSearch:''
  },
  _getSearchList() {
    let keywords = this.data.keywords.trim();
    if (keywords == '') {
      wx.showToast({
        title: '请输入关键字',
        icon: 'none'
      })
      return
    }
    this.setData({
      keywords:'',
      isHidden:true
    })
    //设置用户最近搜索的缓存 historykeywords
    let historykeywords = wx.getStorageSync('historykeywords') || []
    if(historykeywords.length > 5) {
      historykeywords = []
    }
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
  // input事件
  _keyworksInput(e) {
    this.setData({
      keywords: e.detail.value
    })
  },
  // 获取近期搜索
  _getSearch() {
    let list = wx.getStorageSync('historykeywords');
    if (list.length == 0) {
      this.setData({
        isHidden: false,
        list: list,
        keywords: ' '
      })
      return
    }
    this.setData({
      list: list
    })
  },
  // 获取热门
  // 获取热门美食
  async _getHotSearch() {
    let limit = 7;
    let res = await Api._getHotSearch({
      status: 1
    }, limit);
    let hotSearch =  res.data.map(item => item.recipeName)
    this.setData({
      hotSearch:hotSearch
    })

  },
  _keywords(e){
    let keywords = e.currentTarget.dataset.value;
    this.setData({
      keywords:keywords
    })
    
  },
  onShow: function () {
    this._getSearch();
    this._getHotSearch()
  },

})