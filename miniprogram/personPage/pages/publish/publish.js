// personPage/pages/publish/publish.js
import Api from '../../../utils/person.js';
import {openid} from '../../../utils/config.js'
Page({

  data: {
    menus: [],
    files:[],  //图片
  },
  // 获取菜单
   onLoad(){
    this.getMenus()
  },
  async getMenus(){
    let res = await Api._findManageItem({status:1});
    this.setData({
      menus:res.data
    })
  },
  // 获取图片
  _selectFile(e){
    let {tempFilePaths} = e.detail;
    let files = tempFilePaths.map(item => {
      return {url:item}
    })
   this.setData({
     files:this.data.files.concat(files)
   })
    
  },
  // 删除图品
  _delFile(e){
    // console.log(e);
    this.data.files.splice(e.detail.index,1)
  },
  // 表单发布
  async _bindPublish(e) {
      /**   菜谱表名：re-recipes
      recipeName 菜谱名称
      recipeId 菜谱所属分类的id
      recipeImgs 菜谱图片
      recipeInfo 菜谱描述
      views:查看次数
      fav:收藏个数
      addtime:添加时间
      status:通用属性  1正常  2删除  */
    let data = e.detail.value;
    if(data.recipeName == ''){
      wx.showToast({
        title: '名称不能为空！',
        icon:'none'
      })
      return
    }
    let {_openid} = wx.getStorageSync('userInfo');
    data.views = 0;
    data.fav = 0;
    let curr_time = new Date();
    data.addtime = this.myformatter(curr_time);
    
    if(_openid == openid){
      // console.log(_openid,openid)
      data.status = 1;
    }else{
      
      data.status = 3;
    }
    let uploaders = await this._doImage(this.data.files);
    data.recipeImgs = uploaders.map(item => {
      return item.fileID
    })
    let res = await Api._doRecipes(data);
    if(res._id) {
      wx.showToast({
        title: '发布成功',
        duration:2000
      })
      wx.switchTab({
        url:'../../../pages/mine/mine'
      })
    }
    
  },
  // 格式化时间
  myformatter(date){       
    let Y = (date.getFullYear()).toString().padStart(2,'0') 
    let M = ( date.getMonth() + 1 ).toString().padStart(2,'0') 
    let D = (date.getDate()).toString().padStart(2,'0') 
    let h = (date.getHours()).toString().padStart(2,'0') 
    let m = (date.getMinutes()).toString().padStart(2,'0') 
    let s = (date.getSeconds()).toString().padStart(2,'0') 
    let strDate = Y + '-' + M + '-' + D +' ' + h + ':' + m + ':' + s
    
    return strDate;
},
  // 图片上传处理
  async _doImage(files){
    let uploaders = [];
    files.forEach(item => {
      // 切割拿到后缀名
      let fileNames = item.url.split('.');
      let suffixName = fileNames[fileNames.length - 1];
      // 随机名
      let name = Math.random().toString().substring(2) + '.' + suffixName;
      let res = wx.cloud.uploadFile({
        cloudPath:name,
        filePath:item.url
      })
      uploaders.push(res)
    })
    let res = await Promise.all(uploaders);
    return res
    
  },
})