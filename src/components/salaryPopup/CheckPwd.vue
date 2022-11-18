<template>
  <div>
    <div style="width: 90%; text-align: center; margin: 0 5%;">
      <!-- 验证密码 -->
      <div v-if="checkPwdShow">
        <p style="line-height: 25px;">薪资密码验证</p>
        <van-field style="width: 100%; margin: 10px 0%; border-radius: 10px; border: 1px solid grey;"
                   v-model="password"
                   type="password"
                   placeholder="请输入薪资密码"
        />
        <van-button block type="info" round @click="checkPwdClick">验 证</van-button>
        <van-row>
          <van-col :span="12" class="moreEvent1">
            <span>首次使用请先重置密码 </span>
          </van-col>
          <van-col :span="12" class="moreEvent2">
            <span @click="updateShow">修改密码</span>
            <span @click="resetPwd">重置密码</span>
          </van-col>
        </van-row>
      </div>
      <!-- 修改密码 -->
      <div v-if="updatePwdShow">
        <van-form @submit="updatePwd" colon>
          <p style="line-height: 25px;">
            <span>修改薪资密码</span>
            <span style="float: right;">
                <van-icon name="cross" @click="clickCloseIcon"/>
              </span>
          </p>
          <van-field
            name="oldPassword"
            required
            v-model="oldPassword"
            label="旧密码"
            placeholder="请输入旧密码"
            type="password"
          />
          <van-field
            name="newPassword"
            required
            v-model="newPassword"
            label="新密码"
            placeholder="请输入新密码"
            type="password"
          />
          <van-field
            name="confirmPassword"
            required
            v-model="confirmPassword"
            label="确认密码"
            placeholder="请确认密码"
            type="password"
          />
          <div style="margin: 16px">
            <van-button round block type="info" native-type="submit">确认</van-button>
          </div>
        </van-form>
      </div>
    </div>
  </div>
</template>

<script>
import {Dialog, Toast} from "vant";
import {updatePwd, restPwd, checkPwd} from '@/api/salary'
import {userInfoPkPsndoc} from "@/utils/storageUtils";

export default {
  name: "CheckPwd",
  props: {
    checkPwdShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 二次密码验证
      password: '',
      // 修改密码
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      updatePwdShow: false,
    }
  },
  created() {
  },
  methods: {
    // 验证密码
    checkPwdClick() {
      if (this.password === '') {
        Toast("请输入薪资密码")
        return
      }
      let params = {
        password: this.password
      }
      checkPwd(params).then(res => {
        Toast.success(res.message)
        // this.enableSalaryPwd = false
        // this.querySalaryData()
        this.$emit('closePwd',false)
      })
    },
    // 重置密码
    resetPwd() {
      let params = {
        pk_psndoc: userInfoPkPsndoc
      }
      Dialog.confirm({
        title: '重置密码',
        message: '确定要重置密码吗?'
      }).then(() => {
        restPwd(params).then(res => {
          Toast.success(res.message)
        })
      }).catch(err => {
      })
    },
    // 二次密码输入验证一致
    checkTwoPwd() {
      let ischeck = true
      if (this.oldPassword === '' || this.newPassword === '' || this.confirmPassword === '') {
        Toast('必填项不能为空')
        ischeck = false
      } else if (this.newPassword !== this.confirmPassword) {
        Toast('密码输入不一致')
        ischeck = false
      }
      return ischeck
    },
    // 修改密码点击
    updateShow() {
      this.checkPwdShow = false
      this.updatePwdShow = true
    },
    // 修改密码关闭
    clickCloseIcon() {
      this.checkPwdShow = true
      this.updatePwdShow = false
      this.oldPassword = ''
      this.newPassword = ''
      this.confirmPassword = ''
    },
    // 修改密码确认
    updatePwd() {
      if (this.checkTwoPwd()) {
        let params = {
          pk_psndoc: userInfoPkPsndoc,
          oldPassword: this.oldPassword,
          newPassword: this.newPassword
        }
        updatePwd(params).then(res => {
          Toast.success(res.message)
          this.clickCloseIcon()
        })
      }
    },
  }
}
</script>

<style lang='less' scoped>
.moreEvent1 {
  margin-top: 20px;
  font-size: 12px;

  span {
    color: #888;
    float: left;
  }
}

.moreEvent2 {
  margin-top: 20px;
  font-size: 12px;

  span {
    float: right;
    color: #2479ed;
    margin-left: 15px;
  }
}

  .button_bottom {
    width: 100%;
    height: 50px;
    padding: 5px 0px;
  }
</style>
