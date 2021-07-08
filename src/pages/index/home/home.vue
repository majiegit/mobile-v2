/*
 * Created by yangyang11 on 2017/8/16.
 *
 */

<template>
    <div class="application" id='application' v-if='userinfo'>
        <header>
            <!--<div>-->
                <!--<mt-header title="人力资源自助平台" class='height'>-->
                    <!--<router-link to="/login" slot="left" v-show='isDevelop'>-->
                        <!--<mt-button icon="back"></mt-button>-->
                    <!--</router-link>-->
                <!--</mt-header>-->
            <!--</div>-->
            <div class="search" ref='search'>

                <div style="width: 14%;display: inline-block;position: fixed; right: 0px;" @click='handleMessageClick()'>
                  <i style="color: #F5F5F5;font-size: 0.5rem;padding-top: 0.1rem" class="icon hrfont hr-remind sn-clock"></i>
                  <sup class="el-badge__content is-fixed" style="" v-if="this.newsArray.length !=0 ">{{this.newsArray.length}}</sup>
                </div>
            </div>
        </header>
        <div v-show='userRole == "NONE"' class="NONEUser">
            <img src="../../../../static/img/common/NONEUser.png">
        </div>
        <section v-show='userRole !== "NONE"'>
            <div class="personalInfo-bar" id='infoBar'>
                <div class="photo">
                    <img v-if="userinfo.photo" v-bind:src= "userinfo.photo" />
                    <i v-if="!userinfo.photo" class="icon hrfont hr-head"></i>
                </div>
                <div class="personalInfo-entries" v-if='userinfo.name'>
                    <div class="name">{{userinfo.name}}
                        <span class="r-border" v-show='userinfo.postname'> </span>
                        {{userinfo.postname}}
                    </div>
                    <div class="tittles">
                        <span class="orgname">
                          {{userinfo.orgname}}&nbsp;&nbsp;
                          {{userinfo.deptname}}
                        </span>
                    </div>
                    <div class="days">
                        今天是您加入{{userinfo.orgname}}第 <span>{{userinfo.joinsysyear}}</span> 年 <span>{{userinfo.joinsysdate}}</span> 天
                    </div>
                </div>
            </div>
            <figure v-for='(appClass, index) in AppTemps' :key="index">
                <ul v-if='appClass'>
                    <label>{{ appClass.lable }}</label>
                    <template v-for="(item, index) in appClass.items" >
                        <li @click='routerpush(item.path)' :key="index">
                            <i :class='item.imgpath' class="icon hrfont" v-bind:style="{color :item.color }"></i>
                            <span> {{ item.name }} </span>
                        </li>
                    </template>
                    <div class= 'clear'></div>
                </ul>
            </figure>
        </section>
      <div style=" background-color: rgba(22,24,28,0.6); width: 100%; height: 100%; position: fixed; top: 0; left: 0; z-index: 2;" v-if="shengriShow" >
        <div style="width: 247.5px; height: 395.5px; z-index: 4;  position: absolute; top: 0; left: 0; right: 0; bottom: 0; margin: auto;">
          <img src="../../../../static/img/pages/index/shengri.png" style="width: 247.5px; height: 295.5px;"/>
          <p style="position: absolute; z-index:  6; top: 100px; padding: 0px 25px; font-size: 13px; line-height: 22px; color: #333;">
            <span>亲爱的{{userinfo.name}}: </span><br/>
            <span style="text-indent:20px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;今天是您的生日,在这个特殊的日子里，{{userinfo.orgname}}全体同事衷心祝愿你<span style="color: #ff2424;"> 生日快乐、身体健康</span></span><br/>
            <span style="color:#ABA8A6; position: relative; left: 120px; top: 10px; ">{{nowDate}}</span>
          </p>
          <p style="width: 100%;">
            <img src="../../../../static/img/pages/index/x.png" style="width: 30.5px; height: 30.5px; position: relative; left: 106.5px; top: 30px;" @click="shengriShowClick"/>
          </p>
        </div>
      </div>
      <div style=" background-color: rgba(22,24,28,0.6); width: 100%; height: 100%; position: fixed; top: 0; left: 0; z-index: 2;" v-if="shiqingShow" >
          <div style="width: 231px; height: 395.5px; z-index: 4;  position: absolute; top: 0; left: 0; right: 0; bottom: 0; margin: auto;">
            <img src="../../../../static/img/pages/index/shiqing.png" style="width: 231px; height: 295.5px;"/>
            <p style="position: absolute; top: 100px; left: 44%;
            background-image: linear-gradient(#a55900,#fff6e2,#a55900);
            -webkit-background-clip:text;
            color: transparent;
             font-weight: bold;
              font-size: 38px;
               font-family:'Microsoft YaHei' !important;">
              <span>1</span>
            </p>
            <p style="position: absolute; z-index:  6; bottom: 115px; padding: 0px 25px; font-size: 12px; font-weight:bolder; line-height: 15px; text-align: center; color: #333;">
              <span>通往成功的路上, </span><br/>
              <span>处处埋伏着失败,但只要你顽强地走下去,希望的一天终将到来</span><br/>
              <img src="../../../../static/img/pages/index/song.png" style="width: 103px; height: 26px;position: relative; top:7.5px;"/>
            </p>
            <p style="width: 100%;">
              <img src="../../../../static/img/pages/index/x.png" style="width: 25px; height: 25px; position: absolute; right:5px; top: 5px;" @click="shiQingShowClick"/>
            </p>
          </div>
      </div>
      <div style=" background-color: rgba(22,24,28,0.6); width: 100%; height: 100%; position: fixed; top: 0; left: 0; z-index: 2;" v-if="zhouNianShow" >
        <div style="width: 319px; height: 315px;  z-index: 4;  position: absolute; top: 0; left: 0; right: 0; bottom: 0; margin: auto;">
          <img src="../../../../static/img/pages/index/zhounian.png" style="width: 100%; height: 100%;"/>
          <p style="position: absolute; z-index:  6; top: 50px; padding: 0px 25px; width: 100%; font-family:'Microsoft YaHei' !important;text-align:center;">
            <span style="line-height: 22px; color: #5B5958; letter-spacing: 2px; font-size: 12px; margin-left: -20px; font-weight: bolder;">
              恭喜{{userinfo.name}}您入职{{userinfo.orgname}}{{zhouNianNumber}}周年</span><br/>
            <span style="color: #F4BD7D; font-weight: bolder; font-size: 40px; position: relative; left: -15px; top: 20px;
            font-family:'Microsoft YaHei' !important;">{{zhouNianNumber}}</span>
          </p>
          <p style="width: 100%;">
            <img src="../../../../static/img/pages/index/x.png" style="width: 30.5px; height: 30.5px; position: relative; left: 130px; " @click="zhounianShowClick"/>
          </p>
        </div>
      </div>
      <div style=" background-color: rgba(22,24,28,0.6); width: 100%; height: 100%; position: fixed; top: 0; left: 0; z-index: 2;" v-if="yeJianShow" >
        <div style=" width: 100%; height: 100%; z-index: 4;  position: absolute; top: 0; left: 0; right: 0; bottom: 0; margin: auto;">
          <img src="../../../../static/img/pages/index/_1.gif" style="width: 100%; height: 100%; position:absolute; z-index: 6"/>
          <div style="width: 306.5px; height: 451px;  position: absolute; top: 0; left: 0; right: 0; bottom: 0; margin: auto;">
            <img src="../../../../static/img/pages/index/yejian.png" style="width: 306.5px; height: 451px; z-index: 5 "/>
<!--            <p style="position: absolute; top: 115px; z-index:  6; width: 100%; font-family:'Microsoft YaHei' !important;text-align:center; color: #fff;">
              <span style="line-height: 42px; letter-spacing: 2px; font-size: 30px;">
                心里藏着小星星
              </span><br/>
              <span style="line-height: 42px;  letter-spacing: 2px; font-size: 30px;">
                夜里才能亮晶晶
              </span><br/>
            </p>-->
              <img src="../../../../static/img/pages/index/x.png" style="width: 30.5px; height: 30.5px; position: absolute; left: 45%; bottom: -40px; z-index: 7 " @click="yeJIanShowClick"/>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
    import { Header, Toast } from 'mint-ui';
    import AppTempData from './home-manage'
    import { fetchData, getStorage, setStorage } from 'hr-utils'

    export default {
        name : 'application',
        data () {
            return {
                nowDate: new Date().toLocaleDateString().replace('/','-').replace('/','-'),
                userName: '',
                shengriShow: false,
                shengriType: '1-'+ new Date().toLocaleDateString().replace('/','-').replace('/','-'),
                zhouNianShow: false,
                zhouNianType: '2-'+ new Date().toLocaleDateString().replace('/','-').replace('/','-'),
                shiqingShow: false,
                shiqingType: '3-'+ new Date().toLocaleDateString().replace('/','-').replace('/','-'),
                yeJianShow: false,
                yeJianType: '4-'+ new Date().toLocaleDateString().replace('/','-').replace('/','-'),
                zhouNianNumber: 0,
                newsArray: [],
                AppTemps: [],
                userinfo:{},
                mastData:[],
                choiceData:[],
                userRole : '',
                isDevelop: false,
                newType: 'noread',
                pagesize: 16,
                pageno1: 0, // 页码
                pageno2: 0
            }
        },
        components : {
        },

        created(){
          this.initData()
            this.isDevelop =    this.$NODE_ENV == 'development'
                              ? true
                              : false

          // 夜间10点以后提示
         if(new Date().getHours() >= 22){
           this.getSession(this.yeJianType,4)
         }
         // 集团成立日期提示
          this.getOrgTime()
        },

        mounted (){
            // 未登录过路由重定向至登陆页
            if (!getStorage('userinfo')) {
                this.$router.push('login')
            } else {
                this.checkUserRole()
                // 滚动时顶部搜索栏变为绝对定位
                document.getElementById('application').addEventListener('scroll', this.changeSearchBarStyle)
            }

        },

        methods: {
           // 获取集团成立日期
          getOrgTime(){
            fetchData({
              url: '/hrssc/portal/orgs/queryOrgGroupCreateDate',
              method: 'POST',
              param: {},
              contentType: "application/json",
              success: res => {
              var now = new Date();
              var yy = now.getFullYear();    //年
              var mm = now.getMonth() + 1;    //月
              var dd = now.getDate();
              var clock = ""
              if(mm < 10) clock += "0";
              clock += mm + "-";
              if(dd < 10) clock += "0";
              clock += dd + " ";
                if(res.data.indexOf(clock) != -1){
                  this.getSession(this.shiqingType,3)
                }
              }
            })
          },
          saveSession(type){
            fetchData({
              url: 'hrssc/portal/cache/saveMsgCache',
              method: 'POST',
              param: {
                type: type,
                status: 'Y'
              },
              mock: false,
              contentType: "application/json",
              success: res => {
              }
            })
          },
          getSession(type,value){
            fetchData({
              url: 'hrssc/portal/cache/queryCacheStatus',
              method:'POST',
              param: {
                type: type
              },
              contentType: "application/json",
              success: res => {
                var obj = {};
                if(res.data.status == undefined){
                  switch (value) {
                    case 1 :
                    {this.shengriShow = true;} break;
                    case 2 :
                    {this.zhouNianShow = true;} break;
                    case 3 :
                    {this.shiqingShow = true;} break;
                    case 4 :
                    {this.yeJianShow = true;} break;
                  }
                }
              }
            })
          },
          zhounianShowClick(){
            this.saveSession(this.zhouNianType)
            this.zhouNianShow = false
          },
          shengriShowClick(){
            this.saveSession(this.shengriType)
            this.shengriShow = false
          },
          shiQingShowClick(){
            this.saveSession(this.shiqingType)
            this.shiqingShow = false
          },
          yeJIanShowClick(){
            this.saveSession(this.yeJianType)
            this.yeJianShow = false
          },
            // 消息个数统计
          initData(){
              this.getInfoNews()
              this.getWorkListNews()
             // console.log(this.newsArray)
          },
          getInfoNews(){
            fetchData({
              url: '/hrssc/portal/message/queryInfoMessageListByPage',
              method: 'post',
              param: {
                currPage: this.pageno1,
                pageSize: this.pagesize,
                newType: this.newType
              },
              mock: false,
              contentType: "application/json",
              success: res => {
                this.newsArray = this.newsArray.concat(res.data.content)
              }
            })
          },
          getWorkListNews(){
            fetchData({
              url: '/hrssc/portal/message/queryWorkMessageListByPage',
              method: 'post',
              param: {
                currPage: this.pageno2,
                pageSize: this.pagesize,
                newType: this.newType
              },
              mock: false,
              contentType: "application/json",
              success: res => {
                this.newsArray = this.newsArray.concat(res.data.content)
              }
            })
          },
            // 权限检测
            checkUserRole() {
              let _this = this
              fetchData({
                url : 'hrssc/portal/psnbase/queryUserRole',
                method : 'POST',
                param : {
                  usercode: getStorage('userinfo').usercode
                },
                mock : false,
                contentType : "application/json",
                success : data => {
                  if (data != null && data.data != null) {
                    _this.userRole = data.data
                    if(_this.userRole == 'NONE') {
                      Toast('请联系系统管理员新建用户')
                    }else{
                      this.getAppTemp()
                      this.getUserinfo()
                      this.getUserData()
                    }
                  }
                },
                error : function(error) {
                  Toast(error.message)
                }
              })
            },

            // 根据不同角色，分配不同功能模块
            getAppTemp() {
              let item = []
              fetchData({
                url : 'hrssc/portal/psnbase/queryMobileAppInfo',
                method : 'POST',
                param : {},
                mock : false,
                contentType : "application/json",
                success : data => {
                  let rsData = {
                    lable: '员工自助',
                    items: data.data
                  }

                  switch (this.userRole) {
                    case 'staff': {
                      item.push(rsData)
                    }
                      break;
                    case 'SoundReview': {
                        item.push(rsData)
                    }
                      break;
                    case 'Leader': {
                      item.push(rsData)
                      item.push(AppTempData.LeaderApp)
                    }
                      break;
                    case 'Manager': {
                      item.push(rsData)
                      item.push(AppTempData.ManagerApp)
                    }
                      break;
                    case 'LeaderManager': {
                      item.push(rsData)
                      item.push(AppTempData.LeaderManagerApp)
                    }
                      break;
                    default: {
                    }
                  }
                  this.AppTemps = item
                },
                error : function(error) {
                  Toast(error.message)
                }
              })
            },

            // 获取用户详细资料
            getUserinfo() {
                let detailInfo = {},
                    sUserinfo = getStorage('userinfo')
                fetchData({
                  url : 'hrssc/portal/psnbase/getPsnInfo',
                  method : 'POST',
                  param : {},
                  contentType : "application/json",
                  success : data => {
                    detailInfo = data.data[0];
                    this.userinfo = detailInfo
                    setStorage('userinfo', Object.assign(sUserinfo,detailInfo))
                   // 判断是不是周年庆
                    if(this.userinfo.joinsysdate === 1 && this.userinfo.joinsysyear !== 0 ) {
                        this.zhouNianNumber = this.userinfo.joinsysyear
                        this.getSession(this.zhouNianType,2)
                    }
                  },
                  error : function(error) {
                    Toast(error.message)
                  }
                })
            },
          // 获取用户详细资料
          getUserData() {
            fetchData({
              url : 'hrssc/portal/psnbase/getSubInfoVO',
              method : 'POST',
              param : {
                tabcode:"all"
              },
              mock : false,
              contentType : "application/json",
              success : data => {
                console.log(data)
              // 判断是不是生日
                let  birehdate = data.data.bd_psndoc[0].birthdate;
                let  dateBiredh = birehdate.substring(birehdate.indexOf("-")+1)
                let date = new Date();
                let mon = date.getMonth()  + 1;         //getMonth()返回的是0-11，则需要加1
                if(mon <=9){                                     //如果小于9的话，则需要加上0
                  mon = "0" + mon;
                }
                let day = date.getDate();                   //getdate()返回的是1-31，则不需要加1
                if(day <=9){                                     //如果小于9的话，则需要加上0
                  day = "0" + day;
                }
                let nowdate = mon + "-"+ day
                if( dateBiredh === nowdate ){
                  this.getSession(this.shengriType,1)
                }
              },
              error : function(error) {
                Toast(error.message)
              }
            })
          },

            routerpush(router) {
              this.$router.push(router)
            },
            handleMessageClick(){
              this.$router.push('message')
            },
            handleclick() {
              this.$router.push('searchBar')
            },

            // 顶部搜索栏滑动效果
            changeSearchBarStyle() {
                this.scroll = document.getElementById('application').scrollTop
                if(this.scroll > 35) {
                    this.setSearchBarFixed()
                } else {
                    this.removeSearchBarFixed()
                }
            },

            setSearchBarFixed() {
                this.$refs.search.style.position = 'fixed'
                this.$refs.search.style.top = '0'
                this.$refs.search.style.width = '100%'
               // this.$refs.search.style.background = '#F5F5F5'
               // this.$refs.input.style.background = '#fff'
               /// this.$refs.input.style.margin = '0.1rem 0.3rem'
            },

            removeSearchBarFixed() {
                this.$refs.search.style.position = ''
                this.$refs.search.style.top = ''
              //  this.$refs.input.style.background = 'rgba(17, 17, 17, 0.1)'
               // this.$refs.search.style.background = '#0caef5'
            }

        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'scoped>
    @fff-color : #ffffff;
    @333-color : #333333;
    html {
        background: #ebefed;
        .application{
            height: 100%;
            width: 100%;
            overflow: scroll;
            -webkit-overflow-scrolling: touch;
            *::-webkit-scrollbar{
                display: none;
            }
        }
        .application::-webkit-scrollbar{
          display:none;
        }
        .application{
            header{
                width: 100%;
                height: 2.1rem;
                background:#0caef5;
                border-top: 1px solid #0caef5;
                .height{
                    height: 0.8rem;
                }
                div{
                    img{
                        height:0.42rem;
                        width:0.26rem;
                        float:left;
                        margin-left:0.18rem;
                    }
                    h3{
                        font-family:SFNSText;
                        font-size:0.32rem;
                        color:@fff-color;
                        letter-spacing:-0.41px;
                        text-align:center;
                    }
                }
                .search{
                    background: #0caef5;
                    z-index: 5;
                    padding-top: 0.2rem;
                    width: 100%;//91.5%;
                    height: 1rem;
                   .el-badge__content{
                     background-color: #ff4949;
                     border-radius: 50%;
                     color: #fff;
                     display: inline-block;
                     font-size: 0.2rem;
                     height: 0.4rem;
                     width: 0.4rem;
                     line-height: 0.35rem;
                     padding: 0.01rem;
                     text-align: center;
                     border: 0.02rem solid #fff;
                   }
                  .is-fixed{
                    top: 0.1rem;
                    left: -0.1rem;
                    position: absolute;
                    transform: translateY(-50%) translateX(100%);
                  }
                }

            }
            .NONEUser{
                margin-top: 25%;
                img{
                    display: block;
                    width: 50%;
                    height: 40%;
                    margin-left: 25%;
                }
            }
            section{
                margin-top: -0.88rem;
                height: calc(~'100% - 2.7rem');
                .personalInfo-bar{
                    height: 2.06rem;
                    width: 91.5%;
                    padding: 0.32rem;
                    margin: 0rem 4.25%;
                    background:@fff-color;
                    border-radius:4px;
                    .photo{
                        float: left;
                        height:1.2rem;
                        width: 1.2rem;
                        margin-top: 0.05rem;
                        border-radius: 50%;
                        overflow: hidden;
                        background: #f5f5f5;
                        text-align: center;
                        img{
                            display:block;
                            height: 100%;
                            width: 100%;
                        }
                        i{
                          position: relative;
                          top: .1rem;
                          font-size: .8rem;
                          color: #d4d4d4;
                        }
                    }
                    .personalInfo-entries{
                        float: left;
                        width: 76%;
                        margin-left: 0.2rem;
                        .name{
                            font-size:0.32rem;
                            color:@333-color;
                            letter-spacing:0;
                            text-align:left;
                            .r-border{
                                display: inline-block;
                                height: .28rem;
                                border-right: 1px solid #c5c5c5;
                            }
                        }

                        .tittles{
                            width: 100%;
                            font-size:0.28rem;
                            letter-spacing:0;
                            text-align:left;
                            overflow-x: scroll;
                            white-space:nowrap;
                            .orgname{
                                display: block;
                                width: 100%;
                                padding-right: 0.08rem;
                                overflow-x: hidden;
                                white-space: nowrap;
                                word-break: break-all;
                                text-overflow: ellipsis
                            }

                            .postname{
                                margin-left: 0.1rem;
                            }
                        }
                        .days{
                           // overflow-x: scroll;
                           // white-space:nowrap;
                            width: 100%;
                            font-size:0.24rem;
                            color:#888888;
                            letter-spacing:0;
                            text-align:left;
                            span{
                              color: #0caef5;
                            }
                        }
                    }
                }
                figure {
                      label{
                            display: block;
                            width: 100%;
                            line-height: 1.2;
                            font-size: 0.26rem;
                            padding-left: 0.22rem;
                            color: @333-color;
                            margin: 0.1rem;
                        }
                        ul{
                            width:91.5%;
                            margin: 0.2rem 4.25% 0rem 4.25%;
                            padding: .2rem 0 .1rem 0;
                            background:#ffffff;
                            border-radius:4px;
                            label{
                                display: block;
                                line-height: 1.2;
                                font-size: 0.26rem;
                                padding-left: 0.22rem;
                                color: @333-color;
                                margin: 0.1rem;
                            }
                            li{
                                float: left;
                                display:block;
                                height:23.4%;
                                width: 23%;
                                margin-left: 0.1rem;
                                margin-bottom: .2rem;
                                i{
                                    display:block;
                                    margin-top: .2rem;
                                    text-align: center;
                                    font-size: 1rem;
                                }
                                span{
                                    display:block;
                                    font-size:0.28rem;
                                    color:#888888;
                                    letter-spacing:0;
                                    text-align:center;
                                    margin-top: .1rem;
                                }
                            }
                            .clear{
                                clear: both;
                            }
                        }
                        }

                    }
        }
    }





</style>
