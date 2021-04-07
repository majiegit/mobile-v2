/*
 * Created by yangyang11 on 2017/8/16.
 *
 */
<template>
  <div style="height:100%">
  <div class="header">
      <HrHeader
        title='一线声音'
        lIcon='hr-Arrow2'
        v-on:lcallBack='goBack'
        >
      </HrHeader>
    </div>
    <section>
      <div class="title">
        <label>标题</label>
        <textarea ref='title' placeholder="必填"  @input='_titleChange' maxLength='25' v-model='title'></textarea>
        <div class='director'>{{textNum}}/25</div>
      </div>
      <div class="className" @click='openScroll'>
        <label>分类</label>
        <div>{{className}}</div>
        <i class="icon hrfont hr-drop-down02"></i>
      </div>
      <div class="content">
        <label>内容</label>
        <textarea placeholder="必填（最多输入300字）" rows="5" ref='content' maxLength='300' v-model='content'
                  @input='_contentChange'>
        </textarea>
         <div class='director'>{{contentNum}}/300</div>
      </div>
      <div class="photoArea">
        <label>图片</label>
        <ImgPicker ref='ImgPicker' v-on:imgUrl='getImgUrl' type='img-only' maxSize=10></ImgPicker>
      </div>
    </section>

    <footer>
      <button @click='commit'>
        发布
      </button>
    </footer>
    <hrScroll :scrolldata="scrolldata"  v-on:increment="incrementTotal" ref="scrollpopup"></hrScroll>
  </div>
</template>

<script>
import hrScroll from '@/components/scroll/hr-scrollcustomall';
import { Indicator  } from 'mint-ui'
import { HrHeader, ImgPicker } from 'hr-ui'
import { ajax, fetchData, emojiFilter } from 'hr-utils'

import { Toast } from 'mint-ui';
  export default {
    name: 'sendVoice',
    data (){
      return {
        scrolldata : {
          type:'custom', 
          mark:'name', 
          data:{}
        },
        classId : '',//类别ID
        className : "必选",
        imgUrl : '',
        textNum : 0,
        contentNum : 0,
        title : '',
        content : '',
        images : {}
      }
    },
    components: {
      HrHeader,
      hrScroll,
      ImgPicker
    },
    mounted(){
      //获取一线声音类型
      Indicator.open({
        text: '数据加载中...',
        spinnerType: 'fading-circle'
      })
      this.h = document.body.clientHeight - (1.88*window.fontSize) + 'px'
      
      let _this = this,
          sdata = []
         
      fetchData({
        url : 'hrssc/portal/psnVoice/queryVoiceTypeList',
        method : 'get',
        param : {},
        mock : false,
        contentType : "application/json",
        success : function(data) {
          Indicator.close()
          data.data.forEach((data=>{
            let obj = {
                name : data.name,
                id: data.voicecode
            }
            sdata.push(obj)
          }))

          _this.scrolldata = {
             type:'custom', 
             mark:'name', 
             data:sdata
          }
        },
        error : function(error) {
          Indicator.close()
          Toast(error.message)
        }
      })
    },
    methods : {
      //提交button绑定的事件
      commit : function () {
        let _this = this,
            param = {
              title : this.title._trim(), // decodeURI(encodeURI(this.title).split('%E2%80%86').join('')),
              type : this.classId,
              content  : this.content._trim(),//decodeURI(encodeURI(this.content).split('%E2%80%86').join('')),
              attachPath : ''
            }
        if(!param.title || !param.type || !param.content) {
          Toast({
            message: '必选项不能为空',
            duration: 800
          });
          return
        }
        
        Indicator.open({
          text: '声音发布中...',
          spinnerType: 'fading-circle'
        })
        this.$refs.ImgPicker.imgUpload(function(res) {
          _this.sendData(res, param)
        },function(err){
          Indicator.close()
          Toast(err.message)
        });
      },

      sendData(imgUrl, param){
        param.attachPath = imgUrl
        let _this = this

        fetchData({
          url : 'hrssc/portal/psnVoice/publishVoice',
          method : 'post',
          param : param,
          mock : false,
          contentType : "application/json",
          success : function(data) {
            Toast(data.message)
            Indicator.close()
            _this.$router.push({
              name:'frontVoice',
              params : {
                  selected : '2'
              },
              query : {
                fresh : true
              }
            })
          },
          error : function(error) {
            Indicator.close()
            Toast(error.message)
          }
        })
      },
      
      incrementTotal(data) {
          this.classId = data.data.id
          this.className = data.data.name
      },

      openScroll() {
         this.$refs.scrollpopup.openpopup();
         this.$refs.scrollpopup.refresh(this.scrolldata)
      },
      
      getImgUrl(imgUrl) {
        this.images = imgUrl;
        // //console.log(this.images.imginfo[0].data)
        // let param = {
        //   img : this.images
        // }
        // ajax('hrssc/portal/psnVoice/publishVoice','post',"application/json",param,function(data) {
          
        //   },function(data){
           
        //   });
      },

      _titleChange(e) {
        // this.textNum = (this.textNum) > 0 ? 30 - e.target.value.length : 0 ;
        e.target.value = emojiFilter(e.target.value)
        let v = e.target.value
        if (v.length > 25){
          this.textNum = 25
          this.title = v.substr(0,24)
        } else {
          this.textNum = v.length
        }

        if (this.textNum < 0) {
          this.textNum = 0
        }
      },

      _contentChange(e) {
        e.target.value = emojiFilter(e.target.value)
        let v = e.target.value

        if(v.length > 300){
          this.contentNum = 300
          this.content = e.target.value.substr(0,99)
        }else{
          this.contentNum = v.length
        }
        
        if (this.contentNum < 0) {
          this.contentNum = 0
        }
      },

      goBack() {
        this.$router.goBack()
      }
    }
  }
</script>

<style lang='less' scoped>
.header{
  position: fixed;
  height: 0.88rem;
  width: 100%;
  line-height: 0.88rem;
}
.progress-bar{
  position: fixed;
  top: 0.88rem;
}
.hrfont{
  font-size: 0.5rem;
  color: #999;
}
textarea{
  font-size: 16px;
  color: #000;
  letter-spacing: -0.5px;
  line-height: 23px;
  padding: 8px 13px;
  font-family: PingFangSC-Regular;
}
section{
  height: calc(~"100% - 94px");
  overflow-y: scroll;
  margin-top: 0.88rem;
  -webkit-overflow-scrolling: touch;
  background: #fff;
  div label{
    display: block;
    width: 100%;
    height: 0.6rem;
    padding-left: 0.2rem;
    background: #f5f5f5;
    font-size: 14px;
    line-height: 0.6rem;
    color: #666666;
    letter-spacing: -0.43px;
  }
  .title {
    position: relative;
    textarea{
      height: 1.2rem;
      width: 100%;
      resize:none;
      font-size: 0.32rem;
    }
    .director{
      position: absolute;
      bottom: 8px;
      right: 13px;
      text-align: right;
      font-size: 0.24rem;
      color: #C3C3C3;
    }
  }
  .className{
      background: #fff;
      div{
        display: inline-block;
        float: left;
        height: 1rem;
        width: 90%;
        padding: 0 13px;
        line-height: 1rem;
        font-size: 0.32rem;
        color: #666;
      }
      i{
        line-height: 1rem;
      }
  }
  .content{
    clear: both;
    textarea{
      height: 3rem;
      width: 100%;
      resize:none;
      font-size: 0.32rem;
    }
    .director{
     margin: 8px 13px;
      text-align: right;
      font-size: 0.24rem;
      color: #C3C3C3;
    }
  }
}
footer{
  position: fixed;
  height: 1rem;
  width: 100%;
  bottom: 0;
  left: 0;
  text-align: center;
  background: #fff;
  color: #0CAEF5;
  border-top: 1px solid #ddd;
  button{
    width: 1.3rem;
    line-height: 1rem;
    background: #fff;
    font-size: 16px;
    color: #0CAEF5;
    letter-spacing: 0;
  }
}
</style>
