// foregroundPage/pages/cate/cate.js
import Api from '../../../utils/person.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    menus:[],
    keyword:''
  },
  async _navigateList(e){
    let {recipeid,typename} = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../list/list?',
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { recipeid,typename })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {
    this._getMenus()
  },
// 获取分类数据
  async _getMenus(){
    let menus = await Api._findManageItem({status:1});
    this.setData({
      menus:menus.data
    })
    
  },


  // 获取搜索关键词
    // input事件
    _keyworksInput(e){
      this.setData({
        keywords:e.detail.value
      })
    },
   // 搜索
   _getSearchList() {
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
      url: '../searchList/searchList',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          keywords
        })
      }
    })

  },
})