// personPage/pages/management/management.js
import Api from '../../../utils/person.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAddShow: false,
    isEditShow: false,
    typeList: [], // 分类数据
    typeName: '',
    id: ''
  },
  // 显示添加输入框
  _addItem() {
    this.setData({
      isEditShow: false,
      isAddShow: !this.data.isAddShow,
      typeName:""
    })
  },
  // 显示修改输入框
  _editItem(e) {
    this.setData({
      isAddShow: false,
      isEditShow: true,
      typeName: e.currentTarget.dataset.value,
      id: e.currentTarget.dataset.id
    })
  },
  // 删除
  _delItem(e) {
    let id = e.currentTarget.dataset.id
    wx.showModal({
      title: '是否删除',
      success: async (res) => {
        if (res.confirm) {
          await Api._delManageItemId(id);
          this._showManageItem()
        } else if (res.cancel) {
          return;
        }
      }
    })
  },
  // 添加输入框
  _getAddValue(e) {
    this.setData({
      typeName: e.detail.value
    })
  },
  // 确认添加按钮
  async _addManageItem() {
    let typeName = this.data.typeName;
    if (!typeName) {
      wx.showToast({
        title: '分类名称不能为空',
        icon: 'none'
      })
      return
    }
    let res = await Api._redireManageItem(typeName)
    if (res.data.length == 1) {
      wx.showToast({
        title: '该分类已存在',
        icon: 'none'
      })
      return;
    }
    res = await Api._doManageItem(typeName)
    if (res._id) {
      wx.showToast({
        title: '添加成功',
      })
    }
    this.hiden()
    this._showManageItem()
  },

  // 修改输入框
  _getEditValue(e) {
    this.setData({
      typeName: e.detail.value
    })
  },

  // 修改按钮
  async _editManageItem() {
    let {
      id,
      typeName
    } = this.data;
    if (!typeName) {
      wx.showToast({
        title: '分类名称不能为空',
        icon: 'none'
      })
      return
    }
    let res = await Api._redireManageItem(typeName)
    if (res.data.length == 1) {
      wx.showToast({
        title: '该分类已存在',
        icon: 'none'
      })
      return;
    }
     res = await Api._editManageItem(id, typeName)
    wx.showToast({
      title: '修改成功',
    });
    this._showManageItem();
    this.hiden()
  },
  // 取消
  hiden(){
    this.setData({
      isEditShow: false,
      typeName:" "
    })
  },
  // 渲染数据
  async _showManageItem() {
    let res = await Api._findManageItem({status:1});
    this.setData({
      typeList: res.data
    })


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._showManageItem()
  },

})