<template>
  <div class="application" id='application' v-if='userinfo'>
    <header>
      <!--header -->
      <div
        style="width: 100%; height: .88rem; background: linear-gradient(to right, #1c66ef , #2f95fc); text-align: center; line-height: .88rem; padding: 2px 15px;">
        <span style="color: #fff; font-size: 16px;"> 员工赋能平台</span>
        <span style="float: right;">
          <van-icon name="chat-o" :badge="newsArray.length == 0 ? '' : newsArray.length " color="#fff" size="25"
                    @click="handleMessageClick"/>
        </span>
      </div>
    </header>
    <div class="body">
      <div class="personalInfo-bar" id='' style="height: 3rem;
      background: linear-gradient(to right, #1c66ef , #2f95fc);
      position: relative;
      border-bottom-right-radius: 400px 150px;
      border-bottom-left-radius: 400px 150px;">
        <div class="photo">
          <img v-if="userinfo.photo" v-bind:src="userinfo.photo"/>
          <i v-if="!userinfo.photo" class="icon hrfont hr-head"></i>
        </div>
        <div class="personalInfo-entries" v-if='userinfo.name'>
          <div class="name">
            <span class="r-border" v-show='userinfo.postname'> </span>

          </div>
          <div style="margin-left: 1.5rem">
            <div class="tittles">
              <span class="orgname">{{ userinfo.name }} </span>
              <span v-show='userinfo.postname'> | {{ userinfo.postname }}</span>
            </div>
            <div class="days">
              {{ userinfo.orgname }} <br/> {{ userinfo.deptname }}
            </div>
          </div>
        </div>
        <div class="dateEntry">
          <!--<span> 今天是您加入{{ userinfo.orgname }}的第{{ userinfo.joinsysyear }}年{{ userinfo.joinsysdate }}天</span>-->
          <span> 今天是您加入第{{ userinfo.joinsysyear }}年{{ userinfo.joinsysdate }}天</span>
        </div>
      </div>

      <div style="color: #000;">
        <van-row type="flex" v-for="(menu, index1) in menuData" :key="index1" style="background: #fff; margin-top: 12px; padding: 10px">
          <van-col :span="24" style="padding: 5px 0px; font-size: 16px;">{{ menu.template.name }}</van-col>
          <van-col :span="6" v-for="(item, index) in menu.menuList" style="text-align: center; padding: 10px 0px;" :key="index">
            <div style="width: 100%; height: 45px;">
              <div style="height: 40px; width: 40px; margin: 0 auto;border-radius: 10px;" @click='routerpush(item.phoneurl)' v-bind:style="{ background: item.iconcolor }">
                <i :class='item.icon' class="icon hrfont" style=" display: block;text-align: center; font-size: 35px; color: #fff;"></i>
              </div>
            </div>
            <div style="font-size: 13px; width: 100%; height: 30px; text-align: center; line-height: 30px;">{{ item.name }}</div>
          </van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>
<script>
  import {Header, Toast} from 'mint-ui';
  import AppTempData from './home-manage'
  import {fetchData, getStorage, setStorage} from 'hr-utils'

  export default {
    name: 'application',
    data() {
      return {
        nowDate: new Date().toLocaleDateString().replace('/', '-').replace('/', '-'),
        userName: '',
        newsArray: [],
        menuData: [],
        userinfo: {},
        newType: 'noread',
        pagesize: 16,
        pageno1: 0, // 页码
        pageno2: 0
      }
    },
    components: {},
    created() {
      this.getUserinfo()
      this.getMenus()
      this.initData()
      this.isDevelop = this.$NODE_ENV == 'development'
        ? true
        : false
    },
    mounted() {
      // 未登录过路由重定向至登陆页
      if (!getStorage('userinfo')) {
        this.$router.push('login')
      }
    },
    methods: {
      // 获取权限菜单
      getMenus() {
        console.log(1111111111)
        let userID = getStorage('userID')
        fetchData({
          url: '/hrssc/portal/psnbase/queryUserMenu',
          method: 'POST',
          param: {userId: userID, client: 'mobile'},
          contentType: "application/json",
          success: res => {
            console.log(res)
            this.menuData = res.data
          }
        })
      },
      // 消息个数统计
      initData() {
        this.getInfoNews()
        this.getWorkListNews()
        // console.log(this.newsArray)
      },
      getInfoNews() {
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
      getWorkListNews() {
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
      // 获取用户详细资料
      getUserinfo() {
        let detailInfo = {},
          sUserinfo = getStorage('userinfo')
        fetchData({
          url: 'hrssc/portal/psnbase/getPsnInfo',
          method: 'POST',
          param: {},
          contentType: "application/json",
          success: data => {
            detailInfo = data.data[0];
            this.userinfo = detailInfo
            setStorage('userinfo', Object.assign(sUserinfo, detailInfo))
          },
          error: function (error) {
            Toast(error.message)
          }
        })
      },
      routerpush(router) {
        this.$router.push(router)
      },
      handleMessageClick() {
        this.$router.push('message')
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
  @fff-color: #ffffff;
  @333-color: #333333;
  html {
    background: #ebefed;
    .application {
      height: 100%;
      width: 100%;
      overflow: scroll;
      -webkit-overflow-scrolling: touch;
      *::-webkit-scrollbar {
        display: none;
      }
    }
    .application::-webkit-scrollbar {
      display: none;
    }
    .application {
      header {
        width: 100%;
        height: .88rem;
        background: #0caef5;
        border-top: 1px solid #0caef5;
        .height {
          height: 0.8rem;
        }
        div {
          img {
            height: 0.42rem;
            width: 0.26rem;
            float: left;
            margin-left: 0.18rem;
          }
          h3 {
            font-family: SFNSText;
            font-size: 0.32rem;
            color: @fff-color;
            letter-spacing: -0.41px;
            text-align: center;
          }
        }
        .search {
          background: linear-gradient(to right, #1c66ef, #2f95fc);
          z-index: 5;
          padding-top: 0.2rem;
          width: 100%; //91.5%;
          height: 1.1rem;
          .el-badge__content {
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
          .is-fixed {
            top: 0.1rem;
            left: -0.1rem;
            position: absolute;
            transform: translateY(-50%) translateX(100%);
          }
        }
      }
      .NONEUser {
        margin-top: 25%;
        img {
          display: block;
          width: 50%;
          height: 40%;
          margin-left: 25%;
        }
      }
      .body {
        height: calc(~'100% - 0.88rem');
        color: #fff;
        .personalInfo-bar {
          .title-center {
            text-align: center;
            color: #fff;
            margin-bottom: 0.6rem
          }
          height: 2.06rem;
          width: 100%;
          padding: 0.52rem;
          //margin: 0rem 0;
          background: @fff-color;
          border-radius: 4px;
          .photo {
            float: left;
            height: 1.2rem;
            width: 1.2rem;
            margin-top: 0.1rem;
            border-radius: 50%;
            overflow: hidden;
            background: #f5f5f5;
            text-align: center;
            img {
              display: block;
              height: 100%;
              width: 100%;
            }
            i {
              position: relative;
              top: .1rem;
              font-size: .8rem;
              color: #d4d4d4;
            }
          }
          .personalInfo-entries {
            font-size: 15px;
            .tittles {
              line-height: 24px;
            }
          }
        }
        .dateEntry {
          /*max-width: 70%;*/
          width: 50%;
          display: block;
          overflow: auto;
          white-space: nowrap;
          text-align: center;
          margin: 0 auto;
          color: #0B0306;
          font-size: 12px;
          background: #fff;
          border-radius: 20px;
          padding: 10px;
          position: absolute;
          left: 25%;
          bottom: -7px;
        }
      }
    }
  }
</style>
