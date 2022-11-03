<template>
  <div class="bodyDiv">
    <!--顶部区域-->
    <div class="top">
      <div
        class="header">
        <span class="headerTitle"> 员工赋能平台</span>
        <span style="float: right; margin-top: 5px;">
            <van-icon name="bell" :badge="messageTotal" color="#fff" size="25"
                      @click="handleMessageClick"/>
          </span>
      </div>
      <div>
        <van-row type="flex">
          <van-col :span="5" offset="2">
            <van-image
              style="margin-top: 20px;"
              round
              width="70px"
              height="70px"
              :src="userInfo.photo"
            />
          </van-col>
          <van-col :span="17">
            <p class="userInfo">
              <span v-show='userInfo.name'>
              {{ userInfo.name }}  &nbsp;&nbsp; {{userInfo.jobname}}
              </span> <br/>
              <span>{{ userInfo.orgname }}</span> <br/>
              <span>{{ userInfo.deptname }}</span><br/>
              <span>{{ userInfo.postname }}</span>
            </p>
          </van-col>
        </van-row>
        <div class="dateEntry">
          <span> 今天是您加入的第{{ userInfo.joinsysday }}天</span>
        </div>
      </div>
    </div>

    <!--菜单区域-->
    <div>
      <van-row type="flex" v-for="(menu, index1) in menuData" :key="index1" class="menuDiv">
        <van-col :span="24" class="menuRole">{{ menu.role.staffRoleName }}</van-col>
        <van-col :span="6" v-for="(item, index) in menu.menuList" :key="index" class="menuList">
          <div class="menuListItemDiv">
            <div
              class="menuListItem"
              @click='routerpush(item.mobilePath)' v-bind:style="{ background: item.iconColor }">
              <div v-html="item.icon" class="menuIcon"></div>
            </div>
          </div>
          <div class="menuName">{{item.name}}</div>
        </van-col>
      </van-row>
    </div>
  </div>
</template>
<script>
  import storage from 'store'
  import {queryUserRoleMenu, queryPsndocInfo} from '@/api/home'
  import {queryIsReadMessageCount} from '@/api/message'
  import {USERINFO, TOKEN_TIME_EXP} from '@/utils/mutation-types'

  export default {
    name: 'application',
    data() {
      return {
        menuData: [],
        userInfo: {},
        messageTotal: ''
      }
    },
    components: {},
    created() {
      this.getUserInfo()
      this.getMenus()
    },
    mounted() {
    },
    methods: {
      // 获取权限菜单
      getMenus() {
        let params = {
          status: 1,
          menuType: 1
        }
        queryUserRoleMenu(params).then(res => {
          this.menuData = res.data
        })
      },
      // 消息个数统计
      getMessageNumber(userId) {
        let params = {
          userId: userId
        }
        queryIsReadMessageCount(params).then(res => {
          this.messageTotal = res.data
        })
      },
      // 获取用户详细资料
      getUserInfo() {
        queryPsndocInfo().then(res => {
          this.userInfo = res.data
          storage.set(USERINFO, this.userInfo, TOKEN_TIME_EXP)
          this.getMessageNumber(res.data.user_id)
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
  .bodyDiv {
    width: 100%;
    height: 100%;
    background: #f5f5f5;
  }

  .top {
    width: 100%;
    height: 210px;
    background: linear-gradient(to right, #1c66ef, #2f95fc);
    position: relative;
    border-bottom-right-radius: 400px 150px;
    border-bottom-left-radius: 400px 150px;
  }

  .header {
    width: 94%;
    height: 50px;
    text-align: center;
    line-height: 50px;
    padding: 0 3%;
  }

  .headerTitle {
    color: #fff;
    font-size: 16px;
  }

  .userInfo {
    color: #fff;
    font-size: 14px;
    line-height: 25px;
  }

  .menuName {
    font-size: 13px;
    width: 100%;
    height: 30px;
    text-align: center;
    line-height: 30px;
  }

  .menuListItemDiv {
    width: 100%;
    height: 45px;
  }

  .menuListItem {
    height: 45px;
    width: 45px;
    margin: 0 auto;
    border-radius: 10px;
    text-align: center;
    position: relative;
  }

  .menuList {
    text-align: center;
    padding: 10px 0px;
  }

  .menuRole {
    padding: 5px 0px;
    font-size: 16px;
  }

  .menuDiv {
    background: #fff;
    margin-top: 12px;
    padding: 10px
  }

  .dateEntry {
    position: absolute;
    bottom: -5px;
    left: 25%;
    width: 50%;
    display: block;
    overflow: auto;
    white-space: nowrap;
    text-align: center;
    /*margin: 0px auto;*/
    color: #0b0306;
    font-size: 12px;
    background: #fff;
    border-radius: 20px;
    padding: 10px;
  }
</style>

<style>
  .menuIcon {
    position: absolute;
    left: 25%;
    top: 25%;
  }

  .menuIcon svg {
    width: 25px;
    height: 25px;
  }
</style>
