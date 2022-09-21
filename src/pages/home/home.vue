<template>
  <div style="width: 100%; height: 100%; background: #f5f5f5;">
    <!--顶部区域-->
    <div
      style="width: 100%; height: 210px; background: linear-gradient(to right, #1c66ef , #2f95fc); position: relative; border-bottom-right-radius: 400px 150px; border-bottom-left-radius: 400px 150px;">
      <div
        style="width: 94%; height: 50px; text-align: center; line-height:50px; padding: 0 3%;">
        <span style="color: #fff; font-size: 16px;"> 员工赋能平台</span>
        <span style="float: right;">
            <van-icon name="chat-o" :badge="newsArray.length == 0 ? '' : newsArray.length " color="#fff" size="25"
                      @click="handleMessageClick"/>
          </span>
      </div>
      <div style="width: 100%;">
        <van-row type="flex">
          <van-col :span="5" offset="2">
            <van-image
              style="margin-top: 20px;"
              round
              width="70px"
              height="70px"
              :src="userinfo.photo"
            />
          </van-col>
          <van-col :span="12">
            <p style="color: #fff; font-size: 16px; line-height: 25px;">
              <span>
              {{ userinfo.name }} | {{userinfo.postname}}
              </span> <br/>
              <span>{{ userinfo.orgname }}</span> <br/>
              <span>{{ userinfo.deptname }}</span>
            </p>
          </van-col>
        </van-row>
        <van-row type="flex">
          <van-col :span="24">
            <div class="dateEntry">
              <span> 今天是您加入第{{ userinfo.joinsysyear }}年{{ userinfo.joinsysdate }}天</span>
            </div>
          </van-col>
        </van-row>
      </div>
    </div>

    <!--菜单区域-->
    <div style="color: #000;">
      <van-row type="flex" v-for="(menu, index1) in menuData" :key="index1"
               style="background: #fff; margin-top: 12px; padding: 10px">
        <van-col :span="24" style="padding: 5px 0px; font-size: 16px;">{{ menu.template.name }}</van-col>
        <van-col :span="6" v-for="(item, index) in menu.menuList" style="text-align: center; padding: 10px 0px;"
                 :key="index">
          <div style="width: 100%; height: 45px;">
            <div style="height: 40px; width: 40px; margin: 0 auto;border-radius: 10px;"
                 @click='routerpush(item.phoneurl)' v-bind:style="{ background: item.iconcolor }">
              <i :class='item.icon' class="icon hrfont"
                 style=" display: block;text-align: center; font-size: 35px; color: #fff;"></i>
            </div>
          </div>
          <div style="font-size: 13px; width: 100%; height: 30px; text-align: center; line-height: 30px;">{{ item.name
            }}
          </div>
        </van-col>
      </van-row>
    </div>
  </div>
</template>
<script>
  import {Toast} from 'vant';
  import Header from '@/components/Header/Index';
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
    components: {
      Header
    },
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

<style lang='less' scoped>
  .dateEntry{
    width: 50%;
    display: block;
    overflow: auto;
    white-space: nowrap;
    text-align: center;
    margin: 23px auto;
    color: #0b0306;
    font-size: 12px;
    background: #fff;
    border-radius: 20px;
    padding: 10px;
  }
</style>
