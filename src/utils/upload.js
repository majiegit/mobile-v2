import Vue from 'vue'
import axios from 'axios'
import { Toast, Indicator } from 'mint-ui';
import { host } from './hostConfig'
import { getStorage } from './tools'
axios.defaults.timeout = 8000
//获取用户信息
function getAuth() {
  let auth='';
  // if(localStorage.getItem('userinfo')){
  //   var userinfo = JSON.parse(localStorage.getItem('userinfo'));
  if(getStorage('userinfo')){
    var userinfo = getStorage('userinfo');
    var sessionId = userinfo.sessionId;
    var usercode = userinfo.usercode;
    auth = "sessionId="+sessionId+";usercode="+ usercode;
  }
  return auth;
}

module.exports={

/**
 * base64编码的图片上传至图片服务器，后台数据库只存图片服务器path
 * @author yangyang11@yonyou.com
 * @param  {object} bodyParam 参数 
 * @param  {[object]} success   成功回调
 * @param  {[object]} error     失败回调
 */
  imguploads: (bodyParam, success,error) => {
    // let bodyParam = {
    //   imgInfo : [
    //     {
    //       name : '111.jpg',
    //       data : 'base64://'
    //     }
    //   ],
    //   //图片类别
    //   groupType : '1xsy'
    // }
    axios({
      method: 'post',
      url: host + 'hrssc/portal/fileManager/imgUpload',
      data: JSON.stringify(bodyParam),
      // crossDomain : true,
      // withCredentials:true,
      headers:{
            'Content-Type': "application/json",
            'Autority' : getAuth()
          },
    }).then(response => {
        if(response.data.statusCode == 200){
          success(response.data)
        }else{
           error(response.data); 
        }
    }).catch(err =>{
      error(err.data);
    });

  },

//文件上传
  fileloads : (bodyParam, success,error) => {
    axios({
      method: 'post',
      url: host + 'hrssc/portal/fileManager/upload',
      data: bodyParam,
      // crossDomain : true,
      // withCredentials:true,
      headers:{
            'Content-Type': "application/json",
            'Autority' : getAuth()
          },
    }).then(response => {
        
          success(response.data)
        }).catch(response =>{
          error(response);
        }); 

  }
}
