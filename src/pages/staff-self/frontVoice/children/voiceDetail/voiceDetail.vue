/*
 * Created by yangyang11 on 2017/8/16.
 *
 */
<template>
  <div class="voiceDetail">
    <div class="header">
      <HrHeader
        title='声音详情'
        lIcon='hr-Arrow2'
        v-on:lcallBack='goBack(false)'
        >
      </HrHeader>
    </div>
    <ProgressBar ref='progressBar'></ProgressBar>
    <section v-if='data' :style="{height : h}">
      <div class="title">{{ data.title }}</div>
      <label>{{ data.createtime }}</label>
      <figure>
        <div ref='content'>
         <!--  {{data.content}}
          111<br/> 12 -->
        </div>
        <img v-lazy="path.viewUrl"  v-for='path in pathItem'>
      </figure>
    </section>
    <footer>
      <div class="reply">
        <router-link :to="{path:'/reply',query: {psnvoicepk:this.$route.query.psnvoicepk,managepsn:data.managepsn}}">
        回复({{ count.replyCount }})</router-link>
      </div>

      <div class="line"></div>

      <div class="comment">
        <router-link :to="{path:'/comment',query: {psnvoicepk:this.$route.query.psnvoicepk}}">
        评论({{ count.commCount }})</router-link>
      </div>
    </footer>
  </div>
</template>

<script>
import { ProgressBar, HrHeader } from 'hr-ui'
import { ajax } from 'hr-utils'
import { Lazyload, Toast} from 'mint-ui';
  export default {
    name: 'sendVoice',
    data (){
      return {
        data : {},
        count : {
          replyCount: 0,
          commCount : 0 ,
        },
        attachpath : '',
        imgpath : '',
        pathItem : [],
        h : '',
        psnvoicepk: ''
      }
    },
    components: {
      HrHeader,
      ProgressBar
    },
    mounted(){
      let psnvoicepk = this.$route.query.psnvoicepk,
          _this = this,
          param = {
            pk_voice : psnvoicepk,
            currPage : 0,
            pageSize : 2
          }

      this.psnvoicepk = psnvoicepk
      this.h = document.body.clientHeight - (1.88*window.fontSize) + 'px'
    
      ajax('hrssc/portal/psnVoice/queryVoiceByKey', 'get', "application/json", param, function(data) {
        if(!data.data){
          Toast('很遗憾，该条消息已被删除')
          _this.$refs.progressBar.OK()
          setTimeout(()=>{_this.goBack(true)},1500)
          return
        }
        try{
          _this.getFormatCode(data.data.voiceContent.content)
          _this.data = data.data.voiceContent
          _this.count = data.data.replyAndCommCount
          _this.attachpath =  data.data.voiceContent.attachpath
          _this.getImgPath(_this.attachpath)

        }catch(err){
            Toast('服务异常')
            _this.$refs.progressBar.OK()
        }
        },function(data) {
          Toast(data.message)
          _this.$refs.progressBar.OK()
        });
    },
    methods : {
      getImgPath(attachpath) {
        let _this = this
        let param = {
          filePath : attachpath
        }
        ajax('hrssc/portal/fileManager/imgList', 'get', "application/json", param, function(data) {
          try{
            _this.pathItem = data.data
            _this.$refs.progressBar.OK()
          }catch(err){
            Toast('服务异常')
            _this.$refs.progressBar.OK()
          }
        },function(data) {
          Toast(data.message)
          _this.$refs.progressBar.OK()
        });
      },

      //回车符转为<br/>
      getFormatCode(strValue) {  
          this.$refs.content.innerHTML = strValue.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ')
      },

      goBack(freshFlag) {
        this.$router.push({
          'name' : 'frontVoice',
          'query': {
             'fresh' : freshFlag
          }
        })
      }
    }
  }
</script>

<style lang='less' scoped>
.voiceDetail{
  height: 100%;
  .header{
    position: fixed;
    height: 0.88rem;
    width: 100%;
    z-index : 1;
    line-height: 0.88rem;
  }
  .progress-bar{
        position: fixed;
        top: 0.88rem;
      }
  section{
    width: 100%;
    padding: 3% 3.3%;
    margin-top: 0.88rem;
    overflow-y: scroll;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    background: #fff;
    z-index : 0;
    .title{
      font-family: MicrosoftYaHei;
      font-size: 23px;
      color: #333333;
      letter-spacing: 0;
      overflow: hidden; 
    }
    label{
      display: block;
      margin-top: 2%;
      font-size: 17px;
      color: #8C8C8C;
      letter-spacing: 0;
    }
    figure{
      div{
        margin-top: 4%;
        font-size: 0.32rem;
        color: #666666;
        letter-spacing: 0;
      }
      img{
        display: block;
        margin: 0.6rem 0 0 0;
        width: 100%;
      }
    }
  }
  
  footer{
    position: fixed;
    height: 1rem;
    width: 100%;
    bottom: 0;
    left: 0;
    line-height: 0.8rem;
    text-align: center;
    background: #fff;
    border-top: 1px solid #DDDDDD;
    .reply{
      float: left;
      width: 49%;
      height: 100%;
    }
    .line{
      float: left;
      height: 60%;
      width: 1px;
      margin-top: 0.2rem;
      background: #ddd;

    }
    .comment{
      float: right;
      width: 50%;
      height: 100%;
    }
    a{
      display: block;
      width: 100%;
      height: 100%;
      text-align: center;
      text-decoration:none;
      font-size: 16px;
      color: #0CAEF5;
      letter-spacing: 0;
      line-height: 1rem;
    }
  }
}
.hrfont{
  font-size: 1rem;
}


</style>