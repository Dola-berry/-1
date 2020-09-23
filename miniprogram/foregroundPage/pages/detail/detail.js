// foregroundPage/pages/detail/detail.js
import Api from '../../../utils/person.js';
import {
  openid
} from '../../../utils/config.js';
let db = wx.cloud.database();
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailInfo: null,
    _id: '',
    isLike: false, //默认未关注
    message: '', //留言
    messageCount:'',//留言总数
    messageList: [],
    isShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', (res) => {
      this.setData({
        detailInfo: res.detailInfo,
      })
      this._getViews()
      this._getFllows()
      this._getMessageList()
      this._showAdd()
    })

  },

  // 判断是否关注
  async _getFllows() {
    let {
      _openid
    } = wx.getStorageSync('userInfo');
    let recipeTypeId = this.data.detailInfo._id;
    if (!_openid) {
      this.setData({
        isLike: false
      })
      return
    }
    let res = await Api._getFllows({
      _openid,
      recipeTypeId
    });

    if (res.data.length != 0) {
      this.setData({
        isLike: true
      })
    } else {
      this.setData({
        isLike: false
      })
    }
  },

  // 点击关注
  async _getLike() {
    let {
      _openid
    } = wx.getStorageSync('userInfo');
    if (!_openid) {
      wx.showModal({
        title: '请先登录，是否跳转到登陆页面',
        success: async (res) => {
          if (res.confirm) {
            wx.switchTab({
              url: '../../../pages/mine/mine',
            })
          } else if (res.cancel) {
            return;
          }
        }
      })
      return
    }
    let recipeTypeId = this.data.detailInfo._id;
    if (this.data.isLike) {

      await Api._editDetail({
        _id: recipeTypeId,
      }, {
        fav: _.inc(-1)
      })
      wx.showToast({
        title: '已取消关注',
        icon: 'none'
      })
      this.setData({
        isLike: false
      })
      await Api._delFllows({
        _openid,
        recipeTypeId
      });
    } else {

      await Api._editDetail({
        _id: this.data.detailInfo._id,
      }, {
        fav: _.inc(1)
      })
      wx.showToast({
        title: '关注成功',
      })
      this.setData({
        isLike: true
      })
      await Api._addFllows({
        _openid,
        recipeTypeId
      });
    }
  },

  //浏览量增加
  async _getViews() {
    await Api._editDetail({
      _id: this.data.detailInfo._id,
    }, {
      views: _.inc(1)
    });
  },

  /*
  数据表：re-discuss
  _id:当前详情页的id
  _openid:当前用户的id
  addtime：发表的时间
  avatarUrl:用户头像
  detailId：当前详情页id
  message：评论语
  nickName：用户昵称
*/
async _showAdd() {
  let res = await Api._findStatus({
    status: 1
  });
  if (res.data.length > 0) {
    this.setData({
      isShow: true
    })
  } else {
    this.setData({
      isShow: false
    })
  }
},
  // 删除自己的留言
  // 管理员可删除所有
  _delMessage(e) {
    let {
      _openid
    } = wx.getStorageSync('userInfo');
    let {
      id,
      idx
    } = e.currentTarget.dataset
    let that = this
    if (openid == _openid) {
      // 删除提示模态框
      wx.showModal({
        title: '删除留言',
        content: '是否确定删除该评论',
        async success(res) {
          if (res.confirm) {
            await Api._delDiscuss({
              _id:id
            })
            that._getMessageList()
          } else if (res.cancel) {
            return
          }
        }
      })
    }else{
      if(this.data.messageList[idx]._openid != _openid){
        wx.showToast({
          title: '只能删除自己的留言',
          icon:'none'
        })
        return
      }else{
        wx.showModal({
          title: '删除留言',
          content: '是否确定删除该评论',
          async success(res) {
            if (res.confirm) {
              await Api._delDiscuss({
                _id:id
              })
              that._getMessageList()
            } else if (res.cancel) {
              return
            }
          }
        })
      }
    }

  },

  // 获取留言数据
  async _getMessageList() {
    let detailId = this.data.detailInfo._id
    let res = await Api._getDiscuss({
      detailId,
    }, 'addtime', 'desc')
    this.setData({
      messageList: res.data,
      messageCount:res.data.length
    })


  },
  // 格式化时间
  myformatter(date) {
    let strDate = (date.getFullYear()).toString().padStart(2,'0') + "-";
    strDate += ( date.getMonth() + 1 ).toString().padStart(2,'0') + "-";
    strDate += (date.getDate()).toString().padStart(2,'0')  + " ";
    strDate += (date.getHours()).toString().padStart(2,'0') + ":";
    strDate += (date.getMinutes()).toString().padStart(2,'0') + ":";
    strDate += (date.getSeconds()).toString().padStart(2,'0');
    // console.log(strDate)
    return strDate;
  },
  // 获取用户输入
  _inputValue(e) {
    this.setData({
      message: e.detail.value
    })
  },
  // 留言处理
  async _sendMessage() {
    let message = this.data.message;
    message = message.trim()
    if (message == '') {
      wx.showToast({
        title: '输入不能为空',
        icon: 'none'
      })
      return
    }
    let {
      _openid,
      avatarUrl,
      nickName
    } = wx.getStorageSync('userInfo');
    if (!_openid) {
      wx.showModal({
        title: '请先登录，是否跳转到登陆页面',
        success: async (res) => {
          if (res.confirm) {
            wx.switchTab({
              url: '../../../pages/mine/mine',
            })
          } else if (res.cancel) {
            return;
          }
        }
      })
      return
    }
    let addtime = this.myformatter(new Date());
    let detailId = this.data.detailInfo._id;
    let res = await Api._addDiscuss({
      addtime,
      avatarUrl,
      detailId,
      message,
      nickName
    })
    if (res._id) {
      wx.showToast({
        title: '发送成功',
      })
      this._getMessageList()
      this.setData({
        message: ''
      })
    }
  }
})