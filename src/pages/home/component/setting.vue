<template>
  <div class="container">
    <van-popup v-model="show" position="left" :style="{ width: '90%', height: '100%' }" closeable>
      <div style="margin-top: 40px">
        <van-row type="flex">
          <van-col :span="6" offset="2">
            <van-image
              style="margin-top: 20px;"
              round
              width="70px"
              height="70px"
              :src="userInfo.photo"
            />
          </van-col>
          <van-col :span="15" style="margin-top: 4px">
            <p class="userInfo" v-show='userInfo.name'>
              <span>
             {{ userInfo.name }}
              </span> <br/>
              <span>{{ userInfo.orgname }}</span> <br/>
              <span>{{ userInfo.deptname }}</span><br/>
            </p>
          </van-col>
        </van-row>
      </div>
      <div class="main" :style="{'height': currentHeight}">
<!--          <div style="height: 500px"></div>-->
<!--          <div style="height: 500px"></div>-->
<!--          <div style="height: 500px"></div>-->
<!--          <div style="height: 500px"></div>-->
      </div>
      <div class="footer" @click="logout">
        <van-button type="info" block>退出登录</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import storage from 'store'
import { ACCESS_TOKEN, REFRESH_TOKEN, USERINFO } from '@/utils/mutation-types'

export default {
  name: 'setting',
  data () {
    return {
      userInfo: {},
      currentHeight: '',
      show: false
    }
  },
  created () {
    // console.log(this.userInfo)
    this.userInfo = storage.get(USERINFO)
    console.log(this.userInfo)
    // console.log(userInfo.photo)
    // localStorage
  },
  mounted() {
    this.currentHeight = (document.documentElement.clientHeight - 100 -94) + 'px'
  },
  methods: {
    // 退出登录
    logout () {
      // token 失效,删除token
      storage.remove(ACCESS_TOKEN)
      storage.remove(REFRESH_TOKEN)
      storage.remove(USERINFO)
      this.$router.push('login')
    },
    open () {
      this.show = true
    },
    close () {
      this.show = false
    }
  }
}
</script>

<style scoped>
.container{
  display: flex;
  /*布局方向是垂直的*/
  flex-direction: column;
  width: 90%;
  height: 100%;
}
.main{
  flex: 1;
  width: 90%;
  overflow-y: auto;
}
.footer {
  width: 90%;
  height: 44px;
  padding: 0px 5%;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
}

</style>
