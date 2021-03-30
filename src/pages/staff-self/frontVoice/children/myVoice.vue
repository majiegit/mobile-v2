/*
 * Created by yangyang11 on 2017/8/16.
 *
 */
<template>
  <div id='MyVoice' :style="{height : h}">
    <div>
    <!-- <mt-loadmore 
      :autoFill='autoFill' 
      :bottom-all-loaded="allLoaded" 
      :bottomAllLoaded = 'bottomAllLoaded'
      @bottom-status-change = 'handleStatusChange'
      :topLoadingText = 'loadingText'
      ref="loadmoreMy"> -->
      <figure>
        <div v-for='data in dataItem' key='data.articleId' :style="txtStyle"  tabindex="0" :id='data.psnvoicepk' class="voice">
            <div class='ovBar'>
              <div class="router-link" @click='openDetail(data.psnvoicepk)' :style='st'>
                <div class="left"
                  @touchstart="_touchStart"
                  @touchmove="_touchMove"
                  @touchend="_touchEnd"
                 >
                    <div class="title">
                    {{data.title}}
                      </div>
                    <div class="auAndClass" >
                      <span class="className">{{data.voicetype}}</span>
                      <span class="author">{{data.creator}}</span>
                    </div>
                </div>
              </div>
              <div @click='_delete(data.psnvoicepk)' class="_delete">删除</div>
            </div>
          </div>
        </figure>
      <!-- </mt-loadmore> -->
    </div>
  </div>
</template>

<script>
  import { ajax, fetchData } from 'hr-utils'
  import { Indicator, InfiniteScroll, CellSwipe, Toast, Loadmore, MessageBox } from 'mint-ui'
  export default {
    name: 'test',
    data (){
      return {
        dataItem : [], 
        currPage : 0,
        pageSize : 8,
        list : [],
        loading : true,
        startX : 0,
        moveX : 0,
        disX : 0,//滑动距离
        txtStyle : '',
        st :'',
        h : '',
        allLoaded : false,  
        dataItemLen : 8,
        autoFill : false,
        noData : false
      }
    },
    components: {
    },
    mounted (){
      this.h = document.body.clientHeight - (2.76*window.fontSize) + 'px'
      this.getData()
      this.st = 'width:'+ screen.width+'px'
      document.getElementById('MyVoice').addEventListener('scroll', this._scroll)
    },
    methods : {
      // 上拉刷新
      loadTop () {
        this.$refs.loadmoreMy.onTopLoaded()
      },

      // 下拉加载
      loadBottom() {
        this.getData()
      },

      //监听loadmore状态
      handleStatusChange(status) {
      },
      _scroll() {
        if(!this.noData){
          this.getData()
        }
      },
      getData() {
        Indicator.open({
          spinnerType : 'fading-circle'
        })

        let _this = this,
            param = {
              voiceType : 'MyVoiceList',
              currPage : this.currPage,
              pageSize : this.pageSize 
            }
        fetchData({
              url : 'hrssc/portal/psnVoice/queryVoiceListByPage',
              method : 'get',
              param : param,
              mock : false,
              contentType : "application/json",
              success : function(data) {
                Indicator.close()
                if(data.data.length > 0) {
                  _this.dataItem = _this.dataItem.concat(data.data)
                  _this.currPage = _this.currPage + 1
                } else {
                  _this.noData = true
                }
              },
              error : function(error) {
                Indicator.close()
                Toast(error.message)
              }
        })
      },
   
      _touchStart(e) {
        //只记录单只手指的情况
        if(e.touches.length == 1) {
          this.startX = e.touches[0].clientX
        }
          
      },
      _touchMove: function(e) {
        return
        if(e.touches.length == 1){
          //实时位置
          this.moveX = e.touches[0].clientX
          this.disX = this.startX - this.moveX
          //左滑显示删除
          if (this.disX > 0) {
            //最多允许滑动80px
            if( this.disX<80) {
              e.currentTarget.style= "transform:translateX(-" + this.disX/50 + "rem)"
            }
          } else if(this.disX < 0) {  //右滑动去除删除
             e.currentTarget.style= "transform:translateX(+" + this.disX/50 + "rem)"
              console.log(e.currentTarget.parentNode.lastChild.style)
             e.currentTarget.parentNode.lastChild.style = "transform:translateX(+" + this.disX/50 + "rem)"
          }
        }
      },
      _touchEnd: function(e){
            // let endX = e.changedTouches[0].clientX;
            // let moveLen = this.startX - endX
            // if (  moveLen < 40){
            //     e.currentTarget.style= "transform:translateX(+" + 0 + "rem)";
            // }else{
            //   e.currentTarget.style= "transform:translateX(-" + 80/50 + "rem)";
            // }
      },
      _delete : function(psnvoicepk){
          let _this = this 
          MessageBox.confirm('确定删除吗？','').then(action => {
            Indicator.open({
              spinnerType : 'fading-circle'
            })
            fetchData({
              url : 'hrssc/portal/psnVoice/deleteByKey',
              method : 'get',
              param : {pk_voice:psnvoicepk},
              mock : false,
              contentType : "application/json",
              success : function(data) {
                Indicator.close()
                document.getElementById(psnvoicepk).remove()
                _this.$emit('refresh','')
              },
              error : function(error) {
                Indicator.close()
                // Toast(error.message)
              }
            })
          }).catch(error=>{ 
            console.log(error)
          })
      },
      openDetail(psnvoicepk) {
          this.$router.push({
            'name' : 'voiceDetail',
            'query': {
              'psnvoicepk':psnvoicepk
            }
          })
        }

    }
  }
</script>

<style lang='less' scoped>
::-webkit-scrollbar{
  display:none;
}

#MyVoice{
  position: fixed;
  width: 100%;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  a{
     -webkit-touch-callout: none;
  }
  figure{
    .ovBar{
      width: calc(~"100% + 1.6rem");
      height : 100%;
    }
    .voice{
      width: 100%;
      height : 1.52rem;
      overflow-x:scroll;
      overflow-y : hidden;
      .router-link{
        display: inline-block;
        float: left;
        height: 1.52rem;
        width: 82.41%;
        text-decoration:none;
        out-line: none;
        background: #fff;
        padding: 0.3rem 0.24rem 0.21rem 0.24rem;
        border-bottom: 1px solid #d4d4d4;
        .left{
          height: 100%;
          width: 100%;
          .title{
            height: 100%;
            font-size: 16px;
            color: #333333;
          }
          .auAndClass{
            height: 100%;
            margin-top: -6%;
            width: 100%;
            .author{
              float: right;
              margin-right: 0.15rem;
              font-size: 12px;
              color: #999999;
              letter-spacing: 0;
            }
            .className{
              float: right;
              font-size: 12px;
              color: #FFCC66;
              letter-spacing: 0;
              border: 1px solid #FFCC66;
              padding: 0px 1px;
            }
          }
        }
      }
      ._delete{
          float: left;
          display: inline-block;
          height: 1.52rem;
          background: #FF3B30;
          width: 1.6rem;
          text-align: center;
          font-size: 18px;
          color: #FFFFFF;
          letter-spacing: 0;
          line-height: 1.52rem;
        }
      
    }
  }
}
.hrfont{
  font-size: 0.5rem;
}

footer{

}
</style>