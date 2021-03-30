/*
 * Created by yangyang11 on 2017/8/16.
 *
 */
<template>
  <div class='comment' @touchstart='handleTouchend'>
    <div class="header">
       <HrHeader
        title='评论'
        lIcon='hr-Arrow2'
        v-on:lcallBack='goBack'
        >
      </HrHeader>
    </div>
    <ProgressBar ref='progressBar'></ProgressBar>
    <section>
      <ul
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="10"
        ref='commit'>
        <li v-for = 'data in dataItem'>
          <div class="top">
            <img v-if="data.photo" :src=  "data.photo">
            <i v-if="!data.photo"class="icon hrfont hr-head"></i>
            <div class="nameAndTime">
              <div class="name"> {{data.name}}/{{ data.deptname }} </div>
              <div class="time"> {{data.comtime}} </div>
            </div>
          </div>
          <div class="text" tabindex="0" 
            @click='handleClick' 
            @blur="handleBlur" 
            :data-authorId = "data.commentpsn" 
            :data-voiceId = "data.pk_comment">{{ data.commentinfo }}</div>
        </li>
      </ul>
    </section>
    <footer>
      <input type="text" name="" 
          placeholder="请输入评论" 
          maxlength="50" 
          @click="showpaste" 
          @input='pasteHide' 
          @blur='pasteHide' 
          @keyup='emojiFilter'
          v-model = 'commentInput'
          >
      <button @click='sendComm'>发布</button>
    </footer>
    <div ref='copy' class="copyArea">
      <div class="copy" @mousedown='copyText'>复制</div>
      <div class='triggle'></div>
    </div>
    <div ref='cpAndDel' class="copyArea">
      <div class="copy" @mousedown='deleteText'>刪除</div>
      <div class='triggle'></div>
    </div>
    <!-- <div ref='cpAndDel' class="cpAndDelArea">
      <div class="cpAndDel">
        <div class="copy" @mousedown='copyText'>复制</div>
        <div class="del" @mousedown='deleteText'>刪除</div>
      </div>
      <div class='triggle'></div>
    </div> -->
    <div ref='paste' class="pasteArea">
      <div class="paste" @mousedown='pasteText'>粘贴</div>
      <div class='triggle'></div>
    </div>
  </div>
</template>

<script>
import { InfiniteScroll, Toast, Indicator } from 'mint-ui'
import { ajax, getStorage, emojiFilter } from 'hr-utils'
import { ProgressBar, HrHeader } from 'hr-ui'

  export default {
    name: 'sendVoice',
    data (){
      return {
        dataItem : [],
        ctop : '50%',
        text : '',
        target : {},
        currPage : 0,
        loading : true,
        commentInput : ''
      }
    },
    components: {
      HrHeader,
      ProgressBar
    },
    created(){
      this.getData()
    },
    mounted(){
      this.$refs.progressBar.OK()
    },
    methods : {
      getData(){
        let _this = this
        let param = {
          pk_voice : this.$route.query.psnvoicepk,
          currPage : this.currPage,
          pageSize : 10
        }
      
        ajax('hrssc/portal/psnVoice/queryVoiceComm','get',"application/json",param,function(data) {
          try{
            _this.dataItem = _this.dataItem.concat(data.content)
            _this.currPage = _this.currPage + 1
            _this.loading = false
          }catch(error){
            console.log(error)
          }
          },function(data){
            console.log(data)
          });
      },

      //去掉输入的emoji表情
      emojiFilter (e) {
        e.target.value = emojiFilter(e.target.value)
      },
      handleClick(e) {
        
        this.target = e.target
        this.show(e)
      },
      handleTouchend : function(){
        // this.$refs.cpAndDel.style.display = "none"
      },

      handleBlur(e) {
        e.target.style.background= '#fff';
        this.$refs.copy.style.display = "none"
        this.$refs.cpAndDel.style.display = "none"
      },

      show(e) {
        let authorId = e.target.attributes['data-authorId'].nodeValue,
            pk_psndoc = getStorage('userinfo').pk_psndoc

        if(authorId === pk_psndoc) {
          this.showcpAndDel(e)
          e.target.style.background= '#EAEAEA';
        } else {
          //this.showCopy(e)
        }
      },

      showCopy(e) {
        this.$refs.copy.style.display = "block"
        this.$refs.copy.style.top =  e.clientY - 60 + "px"
        this.$refs.copy.style.left = e.clientX + "px"
      },

      showcpAndDel : function(e){
        this.$refs.cpAndDel.style.display = "block"
        this.$refs.cpAndDel.style.top =  e.clientY - 60 + "px"
        this.$refs.cpAndDel.style.left = e.clientX + "px"
      },

      copyText : function(){
      },

      //删评论
      deleteText(){
        let _this = this,
            voiceId = this.target.attributes['data-voiceId'].nodeValue

        ajax('hrssc/portal/psnVoice/deleteCommByKey','get',"application/json",{'pk_comm':voiceId},function(data){
          Toast(data.message)
          if(data.statusCode == 200){
            _this.target.parentNode.remove()
          }
        },function(data){
          Toast(data.message)
        });
      },

      showpaste(e){
        return
        if(this.target.innerHTML){
          this.$refs.paste.style.display = "block"
          this.$refs.paste.style.top =  e.clientY - 70 + "px";
          this.$refs.paste.style.left = e.clientX -10 + "px";
        }
      },
      pasteText : function(){
        if(this.target.innerHTML ){
          this.$refs.replyInput.value += this.target.innerHTML
        }
        this.pasteHide()
      },
      pasteHide : function(){
        this.$refs.paste.style.display = "none"
      },

      sendComm : function(){

        if(!this.commentInput){
          Toast('评论不能为空')
          return 
        }
        let _this= this;
        let param = {
          commInfo : this.commentInput._trim(),
          psndoc : getStorage('userinfo').pk_psndoc,
          pk_psnvoice : this.$route.query.psnvoicepk
        }
        
        ajax('hrssc/portal/psnVoice/addComm','POST',"application/json",param,function(data){
          Toast(data.message)
          if( data.statusCode == 200){
            _this.commentInput = ''
            _this.dataItem = []
            _this.currPage = 0
            _this.getData()
          }else{
          }
        },function(data){
          Toast(data.message)
        });
      },
      
      loadMore : function(){
        this.getData()
      },
      goBack() {
        this.$router.goBack()
      }
    }
  }
</script>

<style lang='less' scoped>
.comment{
  z-index : 0;
}
.header{
  position: fixed;
  height: 0.88rem;
  width: 100%;
  z-index : 9;
  line-height: 0.88rem;
}
.progress-bar{
  position: fixed;
  top: 0.88rem;
}
.copyArea{
  display: none;
  position: fixed;
  top:50%;
  left: 50%;
  z-index : 1;
  .copy{
    height: 0.7rem;
    width: 1.5rem;
    background: rgba(38,39,40,1);
    border-radius: 8px;
    z-index: 9;
    color: #fff;
    font-size: 14px;
    line-height: 0.7rem;
    letter-spacing: 0;
    text-align: center;
  }
  .triggle{
    height: 0;
    width: 0;
    margin-left: 25px;
    border-left: 9px solid transparent;
    border-right: 9px solid transparent;
    border-top: 9px solid rgba(38,39,40,1);
  }
}
.cpAndDelArea{
  position: fixed;
  display: none;
  .cpAndDel{
    width: 3rem;
    height: 0.7rem;
    background: rgba(38,39,40,1);
    border-radius: 8px;
    z-index: 9;
    .copy{
      float: left;
      color: #fff;
      width: 50%;
      text-align: center;
      line-height: 0.7rem;
      border-right: 1px solid #fff;
    }
    .del{
      float: left;
      color: #fff;
      width: 50%;
      text-align: center;
      line-height: 0.7rem;
    }
  }
  .triggle{
    clear: left;
    height: 0;
    width: 0;
    margin-left: 1.3rem;
    border-left: 9px solid transparent;
    border-right: 9px solid transparent;
    border-top: 9px solid rgba(38,39,40,1);
  }
}
.pasteArea{
  display: none;
  position: fixed;
  top:50%;
  left: 50%;
  .paste{
    height: 0.7rem;
    width: 1.5rem;
    background: rgba(38,39,40,1);
    border-radius: 8px;
    z-index: 9;
    color: #fff;
    font-size: 14px;
    line-height: 0.7rem;
    letter-spacing: 0;
    text-align: center;
  }
  .triggle{
    height: 0;
    width: 0;
    margin-left: 10px;
    border-left: 9px solid transparent;
    border-right: 9px solid transparent;
    border-top: 9px solid rgba(38,39,40,1);
  }
}
.hrfont{
  font-size: 1rem;
}
section{
  position : fixed;
  top: 0.88rem;
  height: calc(~'100% - 1.88rem');
  width : 100%;
  overflow: scroll;
  ul{
    padding: 0 12px;
    background: #fff;
    li{
      display: block;
      width: 100%;
      padding-top: 1px;
      padding-bottom: 20px;
      border-bottom: 1px solid #ddd;      
      .top{
        height: 0.64rem;
        margin-top: 18px;
        img{
          float: left;
          height: 100%;
          width: .64rem;
        }
        .hrfont{
          float: left;
          font-size: 0.6rem;
          color: #ddd;
        }
        .nameAndTime{
          float: left;
          width: 70%;
          height: 100%;
          margin-left: 0.2rem;
          .name{
            clear: left;
            height: 56.25%;
            font-size: 15px;
            color: #333333;
            letter-spacing: 0;
          }
          .time{
            height: 43.75%;
            font-size: 12px;
            color: #999999;
            letter-spacing: 0;
          }
        }
      }
      .text{
        margin-left: 0.84rem;
        margin-top: 13px;
        font-size: 14px;
        color: #666666;
        letter-spacing: 0;
        line-height: 15px;
        outline : 0;
      }
    }
  }
}
footer{
  position: fixed;
  height: 1rem;
  width: 100%;
  bottom: 0;
  left: 0;
  background: #fff;
  input{
    height: 0.66rem;
    width: 82.7%;
    margin: auto 5px;
    padding: 0 5px; 
    background: #F5F5F5;
    font-size: 0.3rem;
  }
  button{
    width: 10%;
    height: 100%;
    font-size: 16px;
    color: #0CAEF5;
    letter-spacing: 0;
    line-height: 40px;
    background: #fff;
    text-align: center;
  }
}
</style>