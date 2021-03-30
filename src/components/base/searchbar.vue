 <template>
     <!--<mt-search v-model="" cancel-text="取消" placeholder="搜索"></mt-search>-->
     <!--<myHeader title="通讯录"></myHeader>-->
     <div class="mainpanle">
         <div class="mint-searchbar">
             <div class="mint-searchbar-inner">
                 <i class="mintui mintui-search"></i>
                 <input id="search" v-model="searchinput" type="text" placeholder="搜索" class="mint-searchbar-core" @input="" @focusin="hasFocus" >
             </div>
             <a class="mint-searchbar-cancel2" @click="goback()" style="">取消</a>
         </div>
         
         <div id="searchdiv" class="searchdiv">
             <template v-if="datas.length > 0" v-for="(data, index) in datas">
                 <div @click="showDetail(data)">
                     <div class="searchitem">
                         <div class="searchitemname">
                             <div v-if="data.photo != null">
                                 <div class="i-box tc">
                                    <img :src="data.photo" class="um-circle">
                                 </div>
                             </div>
                             <div v-else>
                                 <div class="i-box tc" id="headImg" v-bind:style="{background: data.color }">
                                     {{ (data.name + '').slice(-2) }}
                                 </div>
                             </div>
                         </div>
                         <div class="searchdetaildiv">
                             <div class="searchdetail">
                                 <span class="searchdetailname">{{ data.name}}</span><br/>
                                 <span class="searchdetailmsg">
                                     <div v-if="data.deptname == null || data.postname == null" class="searchdetailmsgdiv">
                                         {{ data.deptname}}{{ data.postname }}
                                     </div>
                                     <div class="searchdetailmsgdiv" v-else>
                                         {{ data.deptname}} / {{ data.postname }}
                                     </div>
                                 </span>
                             </div>
                         </div>
                     </div>
                 </div>
             </template>
             
             <template v-if="searchhis.length > 0" v-for="(obj, index) in searchhis">
                 <div class="searchhisdiv" @click="showDetail(obj)">
                     <span class="searchhisspan">
                         {{ obj.name }}
                     </span>
                     <span class="clearhisspan">
                         <div v-if="obj.deptname == null || obj.postname == null"  class="searchdetailmsgdiv">
                             {{ obj.deptname}}{{ obj.postname }}
                         </div>
                         <div class="searchdetailmsgdiv" v-else>
                             {{ obj.deptname}} / {{ obj.postname }}
                         </div>
                     </span>
                 </div>
             </template>
             <template v-if="searchhis.length > 0">
                 <div @click="clearCacheHis()" class="clearhisdiv">
                     <span class="clearhisspan">
                         清除历史记录
                     </span>
                 </div>
             </template>
             
             <div id="emptydiv" class="emptydiv">
                 <img src="../../../static/img/pages/application/noData.svg">
             </div>
             
         </div>
     </div>
 </template>
 
 <script>
     //import { Search } from 'mint-ui';
     import util from '../../utils/util';
     import { Header } from 'mint-ui';
     import myHeader from '../../components/base/my-header';
     import { Toast,Cell } from 'mint-ui';
     import {getStorage,setStorage} from '../../utils/tools'
     
     export default {
         name: 'searchBar',
         data() {
             return {
                 datas: [],
                 searchinput: "",
                 searchhis: []
             }
         },
         components: {
             myHeader,
         },
         mounted() {
             this.datas = [];
             this.setStyle();
             var inputCon = document.getElementById("search");
             inputCon.focus();
             
             let _this = this;
             var node = document.querySelector('#search');
             var cpLock = false;
             node.addEventListener('compositionstart', function(){
                 cpLock = true;
             });
             node.addEventListener('compositionend', function(){
                 cpLock = false;
                 if(!cpLock){
                    _this.inputFunc();
                 }
             });
             node.addEventListener('input', function(){
                 if(!cpLock){
                     _this.inputFunc();
                 }
             });
         },
         methods: {
            goback: function() {
                history.go(-1);
            },
            //搜索框获取焦点事件
            hasFocus: function(){
                let searchval = this.searchinput;
                if(searchval == "" || searchval.trim().length == 0){
                    //输入个数为0时显示搜索历史记录
                    //var obj = JSON.parse(localStorage.userinfo);
                    var obj = getStorage("userinfo");
                    var cacheKey = "searchHis_" + obj.usercode;  //缓存标识主键
                    var cacheData = getStorage("cacheData");
                    if(!!cacheData){
                        cacheData = JSON.parse(cacheData);
                        if(!!cacheData[cacheKey]){
                            //渲染
                            //console.log(cacheData[cacheKey]);
                            var arr = cacheData[cacheKey];
                            if(arr != null && arr.length > 0){
                                arr.reverse();
                            }
                            this.searchhis = arr;
                            if(this.searchhis.length > 0){
                                document.getElementById("emptydiv").style.display = 'none';
                            }else{
                                document.getElementById("emptydiv").style.display = 'block';
                            }
                        }
                    }
                    return false;
                }else{
                    this.searchhis = [];
//                  document.getElementById("emptydiv").style.display = 'block';
                    //return false;
                }
            },
            inputFunc: function() {
                this.datas = [];
                let searchval = this.searchinput;
                let specialKey = "[`~!#$^&*()=|{}':;',\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘’";//Specific Key list
                if(searchval != null && searchval != "" && searchval.trim().length > 0){
                    //var realkey = String.fromCharCode(searchval);
                    var flg = false;
                    //debugger
                    flg = (specialKey.indexOf(searchval) >= 0);
                    if (flg) {
                        Toast('请勿输入特殊字符: ' + searchval);//单行提示
                        return false;
                    }
                }
                //debugger
                if(searchval == "" || searchval.trim().length == 0){
                    //输入字符个数为0时显示搜索历史记录
                    var obj = getStorage("userinfo");
                    var cacheKey = "searchHis_" + obj.usercode;  //缓存标识主键
                    var cacheData = getStorage("cacheData");
                    if(!!cacheData){
                        cacheData = JSON.parse(cacheData);
                        if(!!cacheData[cacheKey]){
                            //渲染
                            //console.log(cacheData[cacheKey]);
                            var arr = cacheData[cacheKey];
                            if(arr != null && arr.length > 0){
                                arr.reverse();
                            }
                            this.searchhis = arr;
                            if(this.searchhis.length > 0){
                                document.getElementById("emptydiv").style.display = 'none';
                            }else{
                                document.getElementById("emptydiv").style.display = 'block';
                            }
                        }
                    }
                    return false;
                }else{
                    this.searchhis = [];
                    document.getElementById("emptydiv").style.display = 'block';
                }
                let param = {
                    searchKey: searchval,
                    pageno: 0,
                    pagesize: 40
                }
                let _this = this;
                util.ajax('hrssc/portal/psnbase/queryPsnlike', 'POST', "application/json", param, function(data) {
                    //Indicator.close()
                    if(data.statusCode == 200) {
                        //console.log(data.data);
                        if(data.data != null && data.data.length > 0) {
                            //组装通讯录界面数据
                            _this.createArray(data.data);
                            document.getElementById("emptydiv").style.display = 'none';
                        }else{
                            //显示为空图标
                            document.getElementById("emptydiv").style.display = 'block';
                        }
                    } else if(data.statusCode == 100010){
                        this.$router.push("login"); //跳转到登录页
                    } else {
                        Toast(data.message);//单行提示
                    }
                    
                }, function(data) {
                    //Indicator.close()
                    //console.log(data);
                });
            },
            
            /**
             * 跳转到人员详情页面
             * @param {Object} pk_psndoc
             */
            showDetail: function(data){
                //更新搜索缓存信息
                this.updataCache(data);
                this.$router.push("/addressDetail?pk_psndoc=" + data.pk_psndoc);
            },
            updataCache: function(data){
                var obj = getStorage("userinfo");
                var cacheKey = "searchHis_" + obj.usercode;  //缓存标识主键
                //点击时组装数据
                //debugger
                var selData = {
                    "pk_psndoc": data.pk_psndoc,
                    "name": data.name,
                    "deptname": data.deptname,
                    "postname": data.postname
                }
                var cacheData = getStorage("cacheData");
                if(!!cacheData){
                    cacheData = JSON.parse(cacheData);
                    if(!!cacheData[cacheKey]){
                        for(var i=0; i<cacheData[cacheKey].length && i<5; i++){
                            if(cacheData[cacheKey][i].pk_psndoc == selData.pk_psndoc){
                                cacheData[cacheKey].splice(i, 1);
                                break;
                            }
                        }
                        if(cacheData[cacheKey].length>=5){
                            cacheData[cacheKey].shift();
                        }
                        cacheData[cacheKey].push(selData);
                        setStorage("cacheData", JSON.stringify(cacheData));
                    }else{
                        //不处理
                        cacheData[cacheKey] = [];
                        cacheData[cacheKey].push(selData);
                        setStorage("cacheData", JSON.stringify(cacheData));
                    }
                }else{
                    cacheData = {};
                    cacheData[cacheKey] = [selData];
                    setStorage("cacheData", JSON.stringify(cacheData));
                }
            },
            
            createArray: function(data){
                var datas = data;
                if(datas != null && datas.length > 0){
                    var data = null;
                    var color = "";
                    for(var i=0;i<datas.length;i++){
                        data = datas[i];
                        color = this.getColor(datas[i].name);
                        datas[i].color = color;
                    }
                    this.datas = datas;
                }else{
                    this.datas = [];
                }
            },
            
            /**
             * 根据名字获取背景颜色
             */
            getColor: function(name) {
                var color= ['#eead10','#f99a2b','#f38134','#6495ed','#3ab1aa','#0abfb5','#06aae1','#00bfff','#96bc53','#00ced1','#89a8e0'];
                var newName = encodeURI(name).replace(/%/g, "");
                var lastName, hexadecimal, tenBinary;
                //长度大于等于6位，取后六位
                if(newName.length >= 6) {
                  lastName = newName.substr(lastName,6);
                  hexadecimal = parseInt(lastName,16);
                  //能转成数字
                  if(hexadecimal) {
                    tenBinary = hexadecimal%10;
                    return color[tenBinary];
                  } else {
                    //不能转数字
                    return color[10];
                  }
                } else {
                  return color[10]
                }
            },
            
            setStyle: function(){
                //document.body.clientHeight: 网页可见区域高
                //window.screen.height: 屏幕分辨率的高
                document.getElementById("searchdiv").style.height = (window.screen.height - 30) + "px";
            },
            
            /**
             * 清除搜索历史记录
             */
            clearCacheHis: function(){
                var obj = getStorage("userinfo");
                var cacheKey = "searchHis_" + obj.usercode;  //缓存标识主键
                var cacheData = getStorage("cacheData");
                if(!!cacheData){
                    cacheData = JSON.parse(cacheData);
                    cacheData[cacheKey] = [];
                    this.searchhis = [];
                    setStorage("cacheData", JSON.stringify(cacheData));
                    document.getElementById("emptydiv").style.display = 'block';
                }
                
            }
            
         }
     }
 </script>
 
 <style scoped>
     .mint-searchbar-cancel2 {
         color: #000;
         margin-left: 0.2rem;
         text-decoration: none;
     }
     .i-box{
        width:0.9rem;
        height:0.9rem;
        line-height:0.9rem;
        margin-left: 1.0rem;
        margin-top: 0.15rem;
        transform:translateX(-50%);
        -webkit-transform: translateX(-50%);
        border-radius:50%;
        box-shadow:0 0 0 0.05rem #fff;
        font-size:0.25rem;
        color:#fff;
    }
    .i-box img{
        width:100%;
        height:100%; margin:0; 
        padding:0; 
        position:absolute; 
        left:0; 
        top:0; 
        z-index: -1;
    }
    .tc {
        text-align: center;
    }
    .um-circle {
        border-radius: 50%;
    }
    .searchdiv{
        width: 100%; 
        height: 100%; 
        overflow: auto;
    }
    .searchitem{
        width: 100%; 
        float: right; 
        background: #fff; 
        height: 1.2rem;
    }
    .searchitemname{
        float: left; 
        width: 25%;
    }
    .searchdetaildiv{
        float: left; 
        width: 75%; 
        height: 1.2rem; 
        padding-top: 0.22rem; 
        border-bottom: 1px solid #F5F5F5;
    }
    .searchdetail{
        float: left; 
        width: 100%; 
        height: 1.0rem;
    }
    .searchdetailname{
        font-weight: bold; 
        font-family:.PingFang-SC-Medium; 
        font-size:0.3rem; 
        color:#0caef5; 
        letter-spacing:0; 
        text-align:left; 
        line-height:0.45rem;
    }
    .searchdetailmsg{
        font-family:PingFangSC-Regular; 
        font-size:0.25rem; 
        color:#666666; 
        letter-spacing:0; 
        text-align:left; 
        line-height:0.45rem;
    }
    .searchdetailmsgdiv{
        width: 90%;
        word-break: keep-all;
        /*display: inline-block;*/
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .searchhisdiv{
        width: 100%; 
        padding-left:10%; 
        padding-top:0.2rem; 
        background: #fff; 
        height: 1.0rem;
        margin-bottom: 1px;
    }
    .searchhisspan{
        font-family:.PingFang-SC-Medium; 
        font-size: 0.3rem; 
        color:#0caef5; 
        letter-spacing:0; 
        text-align:left;
    }
    .clearhisdiv{
        width: 100%; 
        background: #fff; 
        height: 0.6rem; 
        line-height: 0.6rem; 
        margin-bottom: 1px; 
        text-align: center;
    }
    .clearhisspan{
        font-family:PingFangSC-Regular; 
        font-size:0.25rem; 
        color:#666666; 
        letter-spacing:0; 
        text-align:left;
    }
    .emptydiv{
        width: 100%; 
        text-align: center; 
        margin: 2rem auto; 
        display: block;
    }
 </style>