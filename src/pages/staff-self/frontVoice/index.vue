/*
 * Created by yangyang11 on 2017/8/16.
 *
 */
<template>
  <div id='fontVoice'>
    <div class="header">
      <HrHeader
        title='一线声音'
        lIcon='hr-Arrow2'
        v-on:lcallBack='goApp'
        >
      </HrHeader>
    </div>
    <section>
      <!-- <ProgressBar ref='ProgressBar'> </ProgressBar> -->
      <mt-navbar v-model="selected">
        <mt-tab-item id="1" class='selectbar-font'>员工声音</mt-tab-item>
        <mt-tab-item id="2">我的声音</mt-tab-item>
      </mt-navbar>  

    <!-- tab-container -->
      <mt-tab-container v-model="selected">
            <mt-tab-container-item id="1">
              <VoiceSquare @progressEnd='progressEnd' ref='voiceSquare'> </VoiceSquare>
            </mt-tab-container-item>
            <mt-tab-container-item id="2">
              <MyVoice @progressEnd='progressEnd' @refresh = 'refresh' ref='myVoice'> </MyVoice>
            </mt-tab-container-item>
      </mt-tab-container>
    </section>
    <footer>
      <div @click='goSendVoice'>
          发布声音
      </div>
     <!-- <router-link :to="{path:'/frontVoice/sendVoice',query: {}}">发布声音</router-link> -->
    </footer>
  </div>
</template>

<script>
  
  import { HrHeader, ProgressBar } from 'hr-ui'
  import { Indicator, Navbar, TabItem, TabContainer, TabContainerItem } from 'mint-ui'
  import MyVoice from './children/myVoice'
  import VoiceSquare from './children/voiceSquare'
  export default {
    name: 'test',
    data (){
      return {
         selected:""
      }
    },
    components: {
      HrHeader,
      MyVoice,
      VoiceSquare,
      ProgressBar
    },
    mounted(){
      this.$route.params.selected?this.selected = this.$route.params.selected : this.selected = '1'
    },
    methods : {
      //顶部加载滚动条消失
      progressEnd() {
        this.$refs.ProgressBar.isOk()
      },

      //返回首页
      goApp() {
        this.$router.push('application')
        sessionStorage.removeItem("voiceItem")
        sessionStorage.removeItem("voiceCacheConf")
      },

      //刷新员工声音
      refresh() {
        this.$refs.voiceSquare.queryVoiceList('fresh')
      },
      goSendVoice(){
        this.$router.push('/sendVoice')
      }
    }
  }
</script>

<style lang='less'>
#fontVoice {
  .mint-tab-container{
    margin-top: 1.76rem;
  }
  .header{
    position: fixed;
    height: 0.88rem;
    width: 100%;
    line-height: 0.88rem;
  }
  .mint-navbar{
    position: fixed;
    width: 100%;
    top: 0.88rem;
    height: 0.88rem;
    border-bottom: 1px solid #EDEDED;
    .mint-tab-item-label{
      font-size: 0.3rem;
      line-height: 15px;
      color: #888888;
    }
    .mint-tab-item{
      padding: 12px 0
    }
    .is-selected{
      margin-bottom: 0px;
      color: #26a2ff;
    }
  }
  section {
      .progress-bar{
        position: fixed;
      }
  }
  footer{
    position: fixed;
    height: 1rem;
    width: 100%;
    bottom: 0;
    left: 0;
    background: #fff;
    border-top: 1px solid #ddd;
    div{
      display: block;
      height: 100%;
      line-height: 1rem;
      text-align: center;
      text-decoration: none;
      font-size: 0.32rem;
      color: #0CAEF5;
      letter-spacing: 0;
    }
  }
 
}

</style>