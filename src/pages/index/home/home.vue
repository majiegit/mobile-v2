<template>
  <div class="application" id='application' v-if='userinfo'>
    <header>
      <!--header -->
      <div
        style="width: 100%; height: .88rem; background: linear-gradient(to right, #1c66ef , #2f95fc); text-align: center; line-height: .88rem; padding: 2px 15px;">
        <span style="color: #fff; font-size: 16px;"> 员工赋能平台</span>
        <span style="float: right;">
          <van-icon name="chat-o" :badge="newsArray.length == 0 ? '' : newsArray.length " color="#fff" size="25" @click="handleMessageClick"/>
        </span>
      </div>
    </header>
    <section>
      <div class="personalInfo-bar" id='' style="height: 3rem;
      background: linear-gradient(to right, #1c66ef , #2f95fc);
      position: relative;
      border-bottom-right-radius: 320px 50px;
      border-bottom-left-radius: 320px 50px;">
        <div class="photo">
          <img v-if="userinfo.photo" v-bind:src="userinfo.photo"/>
          <i v-if="!userinfo.photo" class="icon hrfont hr-head"></i>
        </div>
        <div class="personalInfo-entries" v-if='userinfo.name'>
          <div class="name">
            <span class="r-border" v-show='userinfo.postname'> </span>
            {{ userinfo.postname }}
          </div>
          <div style="margin-left: 1.5rem">
            <div class="tittles">
              <span class="orgname">{{ userinfo.name }} | 人力资源总监</span>
            </div>
            <div class="days">
              {{ userinfo.orgname }} <br/> {{ userinfo.deptname }}
            </div>
          </div>
        </div>
        <div class="dateEntry">
          <span> 今天是您加入{{ userinfo.orgname }}的第{{ userinfo.joinsysyear }}年{{ userinfo.joinsysdate }}天</span>
        </div>
      </div>
      <figure v-for='(menu, index) in menuData' :key="index">
        <ul>
          <label>{{ menu.template.name }}</label>
          <template v-for="(item, index) in menu.menuList">
            <li @click='routerpush(item.phoneurl)' :key="index">
              <i :class='item.icon' class="icon hrfont" v-bind:style="{color :item.iconcolor }"></i>
              <span> {{ item.name }} </span>
            </li>
          </template>
          <div class='clear'></div>
        </ul>
      </figure>
    </section>
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
      section {
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
            font-size: 14px;
            .tittles {
              line-height: 24px;
            }
          }
          //.personalInfo-entries {
          //  float: left;
          //  width: 76%;
          //  margin-left: 0.2rem;
          //
          //  .name {
          //    font-size: 0.32rem;
          //    color: #fff;
          //    letter-spacing: 0;
          //    text-align: left;
          //
          //    .r-border {
          //      display: inline-block;
          //      height: .28rem;
          //      border-right: 1px solid #c5c5c5;
          //    }
          //  }
          //
          //  .tittles {
          //    width: 100%;
          //    font-size: 0.28rem;
          //    letter-spacing: 0;
          //    text-align: left;
          //    overflow-x: scroll;
          //    white-space: nowrap;
          //
          //    .orgname {
          //      display: block;
          //      width: 100%;
          //      padding-right: 0.08rem;
          //      overflow-x: hidden;
          //      white-space: nowrap;
          //      word-break: break-all;
          //      text-overflow: ellipsis
          //    }
          //
          //    .postname {
          //      margin-left: 0.1rem;
          //    }
          //  }
          //
          //  .days {
          //    // overflow-x: scroll;
          //    // white-space:nowrap;
          //    width: 100%;
          //    font-size: 0.24rem;
          //    color: #888888;
          //    letter-spacing: 0;
          //    text-align: left;
          //
          //    span {
          //      color: #0caef5;
          //    }
          //  }
          //}
        }
        .dateEntry {
          width: 85%;
          display: block;
          text-align: center;
          margin: 0 auto;
          color: #0B0306;
          font-size: 12px;
          background: #fff;
          border-radius: 20px;
          padding: 10px;
          position: absolute;
          bottom: -5px;
        }
        figure {
          //margin-top: -0.5rem;
          label {
            display: block;
            width: 100%;
            line-height: 1.2;
            font-size: 0.28rem;
            padding-left: 0.22rem;
            color: @333-color;
            margin: 0.1rem;
          }
          ul {
            width: 100%;
            margin: 0.2rem 0rem;
            padding: .2rem 0 .1rem 0;
            background: #ffffff;
            border-radius: 4px;
            label {
              display: block;
              line-height: 1.2;
              font-size: 0.3rem;
              padding-left: 0.22rem;
              color: @333-color;
              margin: 0.1rem;
            }
            li {
              float: left;
              display: block;
              height: 23.4%;
              width: 23%;
              margin-left: 0.1rem;
              margin-bottom: .2rem;
              i {
                display: block;
                //margin-top: .2rem;
                text-align: center;
                font-size: 1rem;
              }
              span {
                display: block;
                font-size: 0.26rem;
                color: #888888;
                letter-spacing: 0;
                text-align: center;
                //margin-top: .1rem;
              }
            }
            .clear {
              clear: both;
            }
          }
        }
      }
    }
  }
</style>
