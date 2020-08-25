import Http from '../utils/http.js'
import {apiurl} from '../utils/config.js'
// 前台模块，不需要登录
let getDemo = ()=>{
  return Http({
    url: apiurl + '/banner'
  })
}
export default {
  getDemo
}