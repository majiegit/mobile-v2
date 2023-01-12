<template>
    <van-popup v-model="show" position="left" :style="{ width: '90%', height: '100%' }" closeable>
      <div :style="{'height': currentHeight, 'padding-top': '50px'}">
        <van-cell>
          <template #title>
              <span style="line-height: 37px;">头像</span>
          </template>
          <template #right-icon>
              <van-image v-if="userInfo.photo"
                radius="20%"
                width="37px"
                height="37px"
                :src="userInfo.photo"
              />
          </template>
        </van-cell>
        <van-cell title="名字" :value="userInfo.name"/>
        <van-cell title="手机号码" :value="userInfo.mobile"/>
        <van-cell title="密码修改" is-link to="updatePassword" />
      </div>
      <div class="footer" @click="logout">
        <van-button type="info" block>退出登录</van-button>
      </div>
    </van-popup>
</template>

<script>
import storage from 'store'
import { ACCESS_TOKEN, REFRESH_TOKEN, USERINFO } from '@/utils/mutation-types'
import { Dialog, Toast } from 'vant'

export default {
  name: 'setting',
  data () {
    return {
      userInfo: storage.get(USERINFO),
      currentHeight: '',
      show: false
    }
  },
  created () {
  },
  mounted() {
    this.currentHeight = (document.documentElement.clientHeight - 114) + 'px'
  },
  methods: {
    // 退出登录
    logout () {
      Dialog.confirm({
        title: '',
        message: '是否退出登录?',
      }).then(() => {
        // token 失效,删除token
        storage.remove(ACCESS_TOKEN)
        storage.remove(REFRESH_TOKEN)
        storage.remove(USERINFO)
        this.$router.push('login')
      }).catch(() => {
      })
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
.footer {
  width: 90%;
  height: 44px;
  padding: 0px 5%;
  margin: 10px 0px;
  display: flex;
  flex-direction: column;
}

</style>
