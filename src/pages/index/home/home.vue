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
                <input type="text" name="" @focus='handleclick()'placeholder="搜索姓名、手机号、邮箱" ref='input'/>
                <div style="width: 18%;display: inline-block;position: fixed;" @click='handleMessageClick()'>
                  <i style="color: #F5F5F5;font-size: 0.5rem;padding-top: 0.1rem" class="icon hrfont hr-remind sn-clock"></i>
                  <sup class="el-badge__content is-fixed" style="">...</sup>
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
                <div class="personalInfo-entries" v-if='userinfo'>
                    <div class="name">{{userinfo.name}}
                        <span class="r-border" v-show='userinfo.postname'></span>
                        {{userinfo.postname}}
                    </div>
                    <div class="tittles">
                        <span class="orgname">
                            {{userinfo.orgname}}&nbsp&nbsp{{userinfo.deptname}}
                        </span>
                    </div>
                    <div class="days" v-if='userinfo.joinsysyear > 0'>
                        今天是您加入集团的第 <span>{{userinfo.joinsysyear}}</span> 年 <span>{{userinfo.joinsysdate}}</span> 天
                    </div>
                    <div class="days" v-else>
                        今天是您加入集团的第 <span>{{userinfo.joinsysdate}}</span> 天
                    </div>
                    <div class="days">
                        年假剩余<span>{{userinfo.leavebalance}}</span> 天
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
                AppTemps: [],
                userinfo:{},
                mastData:[],
                choiceData:[],
                userRole : '',
                isDevelop: false
            }
        },
        components : {
        },

        created(){
            this.isDevelop =    this.$NODE_ENV == 'development'
                              ? true
                              : false
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

                // 避免重复获取用户信息
                if(sUserinfo.pk_psndoc){
                    this.userinfo = sUserinfo
                    return
                }

                fetchData({
                  url : 'hrssc/portal/psnbase/getPsnInfo',
                  method : 'POST',
                  param : {},
                  mock : false,
                  contentType : "application/json",
                  success : data => {
                    detailInfo = data.data[0];
                    this.userinfo = detailInfo
                    setStorage('userinfo', Object.assign(sUserinfo,detailInfo))
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
                this.$refs.search.style.background = '#F5F5F5'
                this.$refs.input.style.background = '#fff'
                this.$refs.input.style.margin = '0.1rem 0.3rem'
            },

            removeSearchBarFixed() {
                this.$refs.search.style.position = ''
                this.$refs.search.style.top = ''
                this.$refs.input.style.background = 'rgba(17, 17, 17, 0.1)'
                this.$refs.search.style.background = '#0caef5'
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
                    input{
                    width: 80%;//91.5%;
                    height:0.7rem;
                    margin: 0rem 2% 0rem 4.25%;
                    color:#85daff;
                    font-size:0.28rem;
                    text-align:center;
                    background:rgba(17,17,17,0.10);
                    border-radius:5px;
                    }
                    input::-webkit-input-placeholder{
                        color:#ddd;
                        font-size:0.28rem;
                        text-align:center;
                    }
                   .el-badge__content{
                     background-color: #ff4949;
                     border-radius: 0.4rem;
                     color: #fff;
                     display: inline-block;
                     font-size: 0.2rem;
                     height: 0.37rem;
                     line-height: 0.2rem;
                     padding: 0 0.1rem;
                     text-align: center;
                     border: 0.02rem solid #fff;
                   }
                  .is-fixed{
                    top: 0.1rem;
                    left: -0.2rem;
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
                        width: 1rem;
                        margin-top: 0.05rem;
                        border-radius: 50%;
                        overflow: hidden;
                        background: #f5f5f5;
                        img{
                            display:block;
                            height: 100%;
                            width: 100%;
                        }
                        i{
                            margin-left: .1rem;
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
                            overflow-x: scroll;
                            white-space:nowrap;
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
