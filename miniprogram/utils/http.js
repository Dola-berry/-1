// 封装一个http的ajax 基于wx.request的promise
export default ({
  url,
  data={},
  method='get',
  header ={'content-type':'application/json'},
} = {}) => {
  return new Promise((reslove,reject)=>{
    wx.request({
      url,
      data,
      header,
      method,
      success:reslove,
      error:reject
    })
  })
}