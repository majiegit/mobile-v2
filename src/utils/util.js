/*
 * Created by yangyang11 on 2017/8/16.
 *
 */

import Vue from 'vue'
import axios from 'axios'
import { Toast, Indicator } from 'mint-ui'
import { host, proveHost, questHost} from './hostConfig'
import { getStorage } from './tools'

// axios.defaults.timeout = 20000

//获取用户信息
function getAuth() {
  let u = getStorage('userinfo')
  return u ? `sessionId=${u.sessionId};usercode=${u.usercode}` : ''
}

module.exports = {
  proveHost: proveHost,
  /**
   * 请求后台接口工具类
   * @author yangyang11@yonyou.com
   * @version 1.0
   * @date 2017/9/1
   * @param  {string} url       接口地址
   * @param  {string} method    请求方式
   * @param  {string} content   content-type
   * @param  {object} bodyParam 参数
   * @param  {function} success 成功回调          
   * @param  {function} error   失败回调
   * @param  {string} mock      是否开启mock服务
   */
  ajax : (url, method, content, bodyParam, success, error, mock) =>{
    //get请求通过params传参 post通过data传参
    // axios.defaults.withCredentials = true   
    // axios.defaults.crossDomain = true
    axios.defaults.timeout = 25000
    let param = {},
        baseURL = host,
        auth = getAuth()

    if (method.toLocaleUpperCase() == 'GET') {
        param = bodyParam
        bodyParam = {}
    }

    if (mock == 'mock') {
      baseURL = 'https://easy-mock.com/mock/59bb76d1e0dc663341ab689c/'
    }
  
    axios({
      method: method,
      url: `${baseURL}${url}`,
      data: JSON.stringify(bodyParam),
      params : param,
      // crossDomain : true,
      // withCredentials:true,
      headers: {
        'Content-Type': content,
          'Autority' : auth
      }
    }).then(response => {
        if (response.data.statusCode == 100010) {
            window.close()
            // login 
            Indicator.close()
        }
          success(response.data)
        }).catch(response => {
          error(response);192
        });
  },
  
  /**
   * 请求后台数工具类
   * @author yangyang11@yongyou.com
   * @version 2.0
   * @date 2017/9/26
   * @param  {参数} request 
   */
  fetchData : (request) => {
    axios.defaults.timeout = 25000
    
    let param = {},
        data = request.param,
        baseURL = host,
        auth = getAuth()
    // get请求须将参数设置在axios的params
    if (request.method.toLocaleUpperCase() == 'GET') {
        param = request.param
        data = {}
    }

    if (request.mock == true) {
      baseURL = 'https://easy-mock.com/mock/59bb76d1e0dc663341ab689c/'
    }
    
    axios({
      method: request.method,
      url: `${baseURL}${request.url}`,
      data: JSON.stringify(data),
      params : param,
      // crossDomain : true,  
      // withCredentials:true,
      headers: {
        'Content-Type': request.contentType || 'application/json',
        'Autority' : auth
      },
    }).then(res=>{
      if (res.data.statusCode==10010) {
        window.close()
      }
      if (res.data.statusCode==200) {
        request.success(res.data)
      } else {
        if (!res.data.message) {
          res.data.message = '服务异常'
        } 
        request.error(res.data)
      }
    }).catch(err=>{
      request.error(err)
    })
  },

    

  myFetch : async(url, request) =>{

    let reqConf = {
      method: request.method || 'get',
      headers: {
        "Content-Type": request.contentType || "application/json",
        "Autority": getAuth() || ''
      },
      mode: 'cors',
      cache: 'force-cache',
      body: JSON.stringify(request.param),
    }
    try {
      let response = await fetch(`${host}${url}`, reqConf)
      var responseJson = await response.json()
    } catch (error) {
      throw new Error(error)
    }
    return responseJson
    // fetch(`${host}${url}`, reqConf)
    //   .then(response=> {
    //     return response.json()
    //   })
    //   .then(data=>request.success(data))
    //   .catch(function(err) {
    //     // 出错了;等价于 then 的第二个参数,但这样更好用更直观 :(
    //   });

  },
  /**
   * 请求后台数工具类
   * @author zykj 治宇科技
   * @version 2.0
   * @date 2021/9/17
   * @param  {参数} request
   */
  httpRequest : (request) => {
    axios.defaults.timeout = 25000

    let param = {},
      data = request.param,
      baseURL = host,
      auth = getAuth()
    // get请求须将参数设置在axios的params
    if (request.method.toLocaleUpperCase() == 'GET') {
      param = request.param
      data = {}
    }

    if (request.mock == true) {
      baseURL = 'https://easy-mock.com/mock/59bb76d1e0dc663341ab689c/'
    }

    axios({
      method: request.method,
      url: `${baseURL}${request.url}`,
      data: JSON.stringify(data),
      params : param,
      // crossDomain : true,
      // withCredentials:true,
      headers: {
        'Content-Type': request.contentType || 'application/json',
        'Autority' : auth
      },
    }).then(res=>{
      request.success(res.data)
    }).catch(err=>{
      if(err.response)Toast(err.response.data.message)

    })
  },
  /**
   * 证明请求接口方法
   *
   */
  proveRequest : (request) => {
    axios.defaults.timeout = 25000

    let param = {},
      data = request.param,
      baseURL = proveHost,
      auth = getAuth()
    // get请求须将参数设置在axios的params
    if (request.method.toLocaleUpperCase() == 'GET') {
      param = request.param
      data = {}
    }

    if (request.mock == true) {
      baseURL = 'https://easy-mock.com/mock/59bb76d1e0dc663341ab689c/'
    }

    axios({
      method: request.method,
      url: `${baseURL}${request.url}`,
      data: JSON.stringify(data),
      params : param,
      // crossDomain : true,
      // withCredentials:true,
      headers: {
        'Content-Type': request.contentType || 'application/json',
        'Autority' : auth
      },
    }).then(res=>{
      request.success(res.data)
    }).catch(err=>{
      if(err.response)Toast(err.response.data.message)

    })
  },
  /**
   * 问卷请求接口方法
   *
   */
  questRequest : (url, method, content, bodyParam, success) =>{
    //get请求通过params传参 post通过data传参
    // axios.defaults.withCredentials = true
    // axios.defaults.crossDomain = true
    axios.defaults.timeout = 25000
    let param = {},
      baseURL = questHost,
      auth = getAuth()

    if (method.toLocaleUpperCase() == 'GET') {
      param = bodyParam
      bodyParam = {}
    }

    axios({
      method: method,
      url: `${baseURL}${url}`,
      data: bodyParam,
      params : param,
      headers: {
        'Content-Type': content,
        'Autority' : auth
      }
    }).then(response => {
      if (response.data.statusCode == 100010) {
        window.close()
        // login
        Indicator.close()
      }
      success(response.data)
    }).catch(response => {

      }
    );
  }
}

