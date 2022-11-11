<template>
  <div>
    <van-popup v-model="show" position="left" :style="{ width: '90%', height: '100%' }" closeable>
      <div style="width: 100%; height: 30px; position: relative; top: 50px;"></div>
      <div style="width: 100%; height: 30px; position: relative; top: 50px;"></div>
      <div style="width: 100%; height: 30px; position: relative; top: 50px;"></div>
      <div style="width: 100%; height: 30px; position: relative; top: 50px;"></div>
      <div style="width: 100%; height: 30px; position: relative; top: 50px;"></div>
      <div style="width: 100%; height: 30px; position: relative; top: 50px;"></div>
      <div style="width: 100%; height: 30px; position: relative; top: 50px;"></div>
      <div style="width: 100%; height: 30px; position: relative; top: 50px;"></div>
      <div style="width: 100%; height: 30px; position: relative; top: 50px;"></div>
      <div style="width: 100%; height: 30px; position: relative; top: 50px;"></div>
      <div style="width: 100%; height: 30px; position: relative; top: 50px;"></div>
      <div style="width: 100%; height: 30px; position: relative; top: 50px;"></div>
      <div style="width: 100%; height: 30px; position: relative; top: 50px;"></div>
      <div style="width: 100%; height: 30px; position: relative; top: 50px;"></div>
      <div style="width: 100%; height: 30px; position: relative; top: 50px;"></div>
      <div style="width: 100%; height: 30px; position: relative; top: 50px;"></div>
      <div style="width: 100%; height: 30px; position: relative; top: 50px;"></div>
      <div style="width: 100%; height: 30px; position: relative; top: 50px;"></div>
      <div style="width: 100%; height: 30px; position: relative; top: 50px;"></div>
      <div style="width: 100%; height: 30px; position: relative; top: 50px;"></div>
      <div style="width: 100%; height: 30px; position: relative; top: 50px;"></div>
      <div style="width: 100%; height: 30px; position: relative; top: 50px;"></div>
      <div style="width: 100%; height: 30px; position: relative; top: 50px;"></div>
      <div style="width: 100%; height: 30px; position: relative; top: 50px;"></div>
      <div style="width: 100%; height: 30px; position: relative; top: 50px;"></div>
      <div style="width: 100%; height: 30px; position: relative; top: 50px;"></div>
      <div class="logout" @click="logout">
        <van-button type="info" block>退出登录</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
  import storage from 'store'
  import {ACCESS_TOKEN, REFRESH_TOKEN,USERINFO} from '@/utils/mutation-types'
  export default {
    name: "setting",
    data() {
      return {
        show: false
      }
    },
    methods: {
      // 退出登录
      logout() {
        // token 失效,删除token
        storage.remove(ACCESS_TOKEN)
        storage.remove(REFRESH_TOKEN)
        storage.remove(USERINFO)
        this.$router.push("login")
      },
      open() {
        this.show = true
      },
      close() {
        this.show = false
      }
    }
  }
</script>

<style scoped>
  .logout {
    width: 90%;
    padding: 0px 5%;
  }
</style>
