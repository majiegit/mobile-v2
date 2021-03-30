/*
 * Created by yangyang11 on 2017/11/7.
 *
 */
<template>
  <div>
    <header>
      <hr-header
        title='修改薪资密码'
        v-on:lcallBack='goApp'
        >
      </hr-header>
    </header>
    <section>
      <input type="password" v-model="pwd" placeholder="原密码" maxlength="6"/>
      <input type="password" v-model="newpwd1" placeholder="新密码" maxlength="6"/>
      <input type="password" v-model="newpwd2" placeholder="确认密码" maxlength="6"/>
      <label> 请勿使用旧密码作为新密码</label>
      <button @click="modifyPWD">确定</button>
    </section>
  </div>
</template>

<script>
  import { Toast, Indicator, Spinner } from 'mint-ui';
  import { fetchData, emojiFilter, getStorage } from 'hr-utils'
  import { HrHeader, ImgPicker} from 'hr-ui'
  export default {
    name: 'test',
    data (){
      return {
        pk_psndoc: '', // 用户id
        pwd: '',
        newpwd1: '',
        newpwd2: ''
      }
    },

    computed: {

    },
    components: { HrHeader },
    mounted(){

    },

    created(){
      this.pk_psndoc = getStorage('userinfo').pk_psndoc
    },
    methods: {

      // 修改密码
      modifyPWD() {
        if (!this.pwd || !this.newpwd1 || !this.newpwd2) {
          Toast('必选项不能为空')
          return
        }
        if (this.newpwd1 != this.newpwd2) {
          Toast('新密码和确认密码不一致！')
          return
        }
        fetchData({
          url : 'hrssc/portal/salary/updatePwd',
          method : 'post',
          param : {
            pk_psndoc: this.pk_psndoc,
            oldPwd: this.pwd,
            newPwd: this.newpwd2
          },
          contentType : "application/json",
          success : res=> {
            Toast('密码修改成功')
            this.$router.go(-1)
          },
          error : error => {
            Toast(error.message)
          }
        })
      },

      goApp() {
        this.$router.go(-1)
      },

    }
  }
</script>

<style lang='less' scoped>
  header{
    position: fixed;
    height: .88rem;
    width: 100%;
    line-height: .88rem;
  }
  section{
    margin-top: .88rem;
    input{
      height: .88rem;
      width: 100%;
      border-bottom: 1px solid #d4d4d4;
      line-height: .88rem;
      padding: 0 3%;
      font-size: .32rem;
    }
    button{
      height: .88rem;
      width: 100%;
      margin-top: .3rem;
      line-height: .88rem;
      background: #0CAEF5;
      color: #fff;
      font-size: .32rem;
      border-radius: 3px;
    }
    label{
      width: 100%;
      display: block;
      height: .5rem;
      text-align: center;
      margin-top: .2rem;
      color: #d4d4d4;
    }
  }

</style>

<style>

</style>
