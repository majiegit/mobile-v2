<template>
  <div class="h-popup">
    <mt-popup v-model="popupVisible" popup-transition="popup-fade">
      <div ref="myheader" class="h-popup-header">
        <message-header title="消息"></message-header>
      </div>
      <div class="h-popup-title">
        <h1 class="h-popup-name">{{listData.subject}}</h1>
        <span class="h-popup-time">{{listData.sendtime}}</span>
      </div>
      <div class="h-popup-content" :style="{ 'height': currentHeight + 'px'}">
        <p>{{listData.content}}</p>
      </div>
    </mt-popup>
  </div>
</template>
<script>
  import messageHeader from './messageHeader.vue'
  import {ajax} from 'hr-utils'
  export default {
    name: 'messageDetail',
    components: {
      messageHeader
    },
    data() {
      return {
        listData: {  //请求回来，要显示的数据
          subject: "",
          sendtime: '',
          content: '',
        },
        currentHeight: this.height,
        popupVisible: true
      }
    },
    mounted() {
      this.currentHeight = document.documentElement.clientHeight - this.$refs.myheader.offsetHeight;
    },
    watch: {
      height(val) {
        if (val) {
          this.currentHeight = val;
        }
      }
    },
    methods: {
    },
    created(){
      let pkmessage = this.$route.query.messagePk;
      let _this = this;
      ajax('hrssc/portal/message/queryMessageByPk?messagePk=' + pkmessage, 'GET', "application/json", {}, function (data) {
        if (data.statusCode == 200) {
          if (data.data != null && data.data.length > 0) {
            _this.listData = data.data;
            _this.listData.subject = data.data[0].subject;
            _this.listData.sendtime = data.data[0].sendtime;
            _this.listData.content = data.data[0].content;
          }
        } else if (data.statusCode == 100010) {
          Toast("请先登录");
          _this.$router.push("/login"); //跳转到登录页
        } else {
          Toast(data.message)
        }
      });
    }
  };
</script>

<style lang='less' scoped>
  .h-popup {
    position: fixed;
    top: 0;
    left: 0;
    background: #fff;
    z-index: 500;
    .h-popup-title {
      width: 100%;
      margin: 0.3rem 0 0.3rem 0.24rem;
      border-left: 0.06rem solid #0caef5;
      .h-popup-name {
        line-height: 0.5rem;
        font-size: 0.38rem;
        padding: 0 0.34rem 0 0.06rem;
        color: #333;
      }
      .h-popup-time {
        font-size: 14px;
        line-height: 20px;
        color: #999999;
        padding-left: 0.06rem;
      }
    }
    .h-popup-content {
      padding: 0.3rem;
      font-size: 0.36rem;
      line-height: 0.6rem;
      text-indent: 2em;
      overflow: scroll;
    }
  }
</style>
<style>
  .h-popup .mint-popup {
    top: 0;
    left: 0;
    -webkit-transform: translate3d(0%, 0%, 0);
    transform: translate3d(0, 0, 0);
    width: 100%;
  }
</style>
