/*
 * Created by yangyang11 on 2017/11/7.
 *
 */
<template>
  <div>
    <header>
      <hr-header
        title='查询薪资'
        v-on:lcallBack='goApp'
        >
      </hr-header>
    </header>
    <section>
      <figure>
        <img :src="photo" class="photo" v-if='photo'>
        <div v-else class="photo">
          {{ psn_name.slice(-2) }}
        </div>
      </figure>
      <input type="password" @input='handleInput' v-if='checkPass' v-model="pwd" placeholder="请输入查询密码" maxlength="6"/>
      <input type="password" @input='handleInput' class='nopass' v-else v-model="pwd" placeholder="请输入查询密码" maxlength="6"/>
      <button @click="checkPwd">查询</button>
      <div class="moreEvent">
        <span @click="resetPWD">重置密码</span>
        <span @click="modifyPWD">修改密码</span>
        <label>首次使用请先重置密码 </label>
      </div>
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
        photo: '',
        psn_name: '',
        checkPass: true
      }
    },

    computed: {

    },
    components: { HrHeader },
    mounted(){

    },

    created(){
      this.pk_psndoc = getStorage('userinfo').pk_psndoc
      this.photo =  getStorage('userinfo').photo
      this.psn_name = getStorage('userinfo').name
    },
    methods: {
      checkPwd() {
        Indicator.open()
        fetchData({
          url : 'hrssc/portal/salary/checkPwd',
          method : 'post',
          param : {
            pk_psndoc: this.pk_psndoc,
            pwd: this.pwd
          },
          contentType : "application/json",
          success : res=> {
            Indicator.close()
            this.$router.push({
              name: 'salary',
              params: {
                secret: res.data
              }
            })
          },
          error : error => {
            Indicator.close()
            Toast(error.message)
            this.checkPass = false
          }
        })
      },

      resetPWD() {
        Indicator.open({
            text: '密码重置中，请稍等...',
            spinnerType: 'fading-circle'
          })
        fetchData({
          url : 'hrssc/portal/salary/restPwd',
          method : 'post',
          param : {
            pk_psndoc: this.pk_psndoc
          },
          contentType : "application/json",
          success : res=> {
            Indicator.close()
           Toast('新密码已经发送到您的邮箱')
          },
          error : error => {
            Indicator.close()
            Toast(error.message)
          }
        })
      },

      // 跳修改密码页
      modifyPWD() {
        this.$router.push({
          name: 'resetSalaryPWD',
          query: {
          }
        })
      },

      handleInput() {
        this.checkPass = true
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
    margin-top: 2rem;
    padding: 0 .22rem;
    figure{
      height: 1.5rem;
      width: 1.5rem;
      margin-left: 50%;
      transform: (translate(-50%,0));
      .photo{
        height: 100%;
        width: 100%;
        display: block;
        border-radius: 50%;
        background: red;
        color: #fff;
        line-height: 1.5rem;
        font-size: .4rem;
        text-align: center;
      }
    }
    input{
      height: .88rem;
      width: 100%;
      margin-top: .6rem;
      border: 1px solid #d4d4d4;
      border-radius: 3px;
      line-height: .88rem;
      padding: 0 3%;
      font-size: .32rem;
    }

    .nopass{
      border: 1px solid red;
      background:	#FFF0F5;

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
    .moreEvent{
      margin-top: .3rem;
      color: #0CAEF5;
      font-size: .32rem;
      span{
        display: block;
        float: right;
        margin-left: .5rem;
      }
      label{
        color: #888;
        font-size: .3rem;
      }
    }
  }

</style>

<style>

</style>
