<template>
  <div>
    <Header :title="title" @clickLeft="clickLeft"/>
    <van-form input-align="right" ref="passwordForm" colon label-width="120px" @submit="confirmUpdate">
      <van-field v-model="passwordForm.oldPassword" type="password" label="旧密码" placeholder="请填写原密码" required
                 :rules="formRules.oldPassword"/>
      <van-field v-model="passwordForm.newPassword" type="password" label="新密码" placeholder="请填写新密码" required
                 :rules="formRules.oldPassword"/>
      <van-field v-model="passwordForm.confirmPassword" type="password" label="确认密码" placeholder="请再次确认密码" required
                 :rules="formRules.oldPassword"/>
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">确 认</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
  import storage from 'store'
  import {ACCESS_TOKEN, REFRESH_TOKEN, USERINFO} from '@/utils/mutation-types'
  import Header from '@/components/Header/Index'
  import {Toast} from 'vant';
  import {updatePassword} from '@/api/updatePassword'
  export default {
    name: 'setting',
    components: {Header},
    data() {
      return {
        formRules,
        passwordForm: {
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        },
        title: '密码修改',
        userInfo: storage.get(USERINFO)
      }
    },
    created() {
    },
    mounted() {
    },
    methods: {
      confirmUpdate(){
        Toast.loading({
          message: '修改中...',
          duration: 0
        })
        updatePassword(this.passwordForm).then(res => {
          Toast.clear()
          Toast.success(res.message)
          this.clickLeft()
        })
      },
      /**
       * 返回事件
       */
      clickLeft() {
        this.$router.go(-1)
      },
    }
  }
  // 表单校验规则
  const formRules = {
    oldPassword: [{
      required: true,
      message: ''
    }],
    newPassword: [{
      required: true,
      message: ''
    }],
    confirmPassword: [{
      required: true,
      message: ''
    }]
  }
</script>

<style scoped lang="less">
</style>
