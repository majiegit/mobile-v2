/*
 * Created by yangyang11 on 2017/8/16.
 *
 */
<template>
  <div id='voiceSquare' :style="{height : h}">
  <div>
    <mt-loadmore 
      :autoFill='autoFill' 
      :top-method="loadTop" 
      :bottom-method="loadBottom" 
      :bottom-all-loaded="allLoaded" 
      @bottom-status-change = 'handleStatusChange'
      :topLoadingText = 'loadingText'
      ref="loadmoreSq">

      <ul>
          <li v-for='(data, index) in dataItem' :key='data.articleId'>
            <div class="router-link" @click='openDetail(data.psnvoicepk)' :data-voiceKey='data.psnvoicepk'>
              <div class="title">
                  {{data.title}}
                </div>
                <div class="auAndClass">
               <!--  <span class="className">{{data.voicetype}}</span>-->
                  <span class="author">{{data.creator}}</span>
                </div>
            </div>
             <!-- <router-link :to="{name:'voiceDetail',query: {psnvoicepk:data.psnvoicepk}}">
                <div class="title">
                  {{data.title}}
                </div>
                <div class="auAndClass">
                  <span class="className">{{data.voicetype}}</span>
                  <span class="author">{{data.creator}}</span>
                </div>
              </router-link> -->
          </li>
      </ul>
    </mt-loadmore>
</div>
</div>
</template>

<script>
  import { ajax, fetchData } from 'hr-utils'
  import { InfiniteScroll, Indicator, Toast, Loadmore } from 'mint-ui'


  export default {
    name: 'test',
    data (){
      return {
        dataItem : [], 
        currPage : 0,
        pageSize : 20,
        list : [],
        loading : true,
        h : '',
        allLoaded : false,  
        autoFill : false,
        loadingText : '加载中...'
      }
    },
    components: {
    },
    created (){
      if (this.$route.query.fresh || !sessionStorage.getItem("voiceItem")){
        this.queryVoiceList('fresh');
      }else{
        this.dataItem = JSON.parse(sessionStorage.getItem("voiceItem"))
      }
      // 进入声音详情页，不清缓存，保证返回列表时看到已加载数据
      // 退出当前页面时，清缓存
       // if(sessionStorage.getItem("voiceItem")) {
       //    this.dataItem = JSON.parse(sessionStorage.getItem("voiceItem"))
       //  }else{
       //    this.queryVoiceList('fresh');
       //  } 
    },
    watch:{
      currPage(){
        let page = this.currPage
        sessionStorage.setItem("voiceCacheConf", page)
      }
    },
    mounted(){
      let page = sessionStorage.getItem("voiceCacheConf")
      this.currPage = page || 1
      this.h = document.body.clientHeight - (2.76*window.fontSize) + 'px'
    },
   
    methods : {
      loadTop (){
        this.queryVoiceList('fresh')
      },
      loadBottom(){
        this.queryVoiceList('loadMore')
      },
      handleStatusChange(status){
      },

      /*
       * @param String refresh 如果为true，为上拉刷新操作
       *
       */
      queryVoiceList(loadStatus) {
        Indicator.open({
          spinnerType : 'fading-circle'
        })
        
        if( loadStatus == 'fresh') {
          this.currPage = 0
          this.dataItem = []
        }

        let _this = this,
            param = {
              voiceType : 'SquareVoiceList',
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
                  _this.distributeDataByloadStatus(loadStatus, data.data)
                  // if(refresh) {
                  //   _this.handleRefreshVoiceList(data.data)
                  // } else {
                  //   _this.handleLoadMoreVoiceList(data.data)
                  // }
                } else {
                  // Toast('已经没有更多了！')
                  _this.$refs.loadmoreSq.onBottomLoaded()  
                  _this.allLoaded = true
                }
              },
              error : function(error) {
                Indicator.close()
                Toast(error.message)
              }
        })
      },
      distributeDataByloadStatus(status, data){
          switch (status){
            case 'fresh' : {
              this.handleRefreshVoiceList(data)
            }
            break;
            case 'fresh' : {
              this.handleRefreshVoiceList(data)
            }
            break;
            case 'loadMore' : {
              this.handleLoadMoreVoiceList(data)
            }
            break;
          }
      },

      handleRefreshVoiceList(items) {
        this.dataItem = items
        this.currPage = 1
        // 上拉刷新，清历史缓存，存当前最新数据
        sessionStorage.removeItem("voiceItem")
        this.writeVoiceCache(items)
        this.$refs.loadmoreSq.onTopLoaded()
      },

      handleLoadMoreVoiceList(items) {
        this.dataItem = this.dataItem.concat(items)
        this.currPage = this.currPage + 1
        this.$refs.loadmoreSq.onBottomLoaded()
        this.writeVoiceCache(items)
      },

      writeVoiceCache(data) {
        let arr = sessionStorage.getItem("voiceItem") ? JSON.parse(sessionStorage.getItem("voiceItem")) : []

        if(!this.allLoaded){
          arr = [...arr, ...data]
          sessionStorage.setItem("voiceItem",JSON.stringify(arr))
        }
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
#voiceSquare{
  position: fixed;
  width: 100%;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  a{
     -webkit-touch-callout: none;
  }
}
.hrfont{
  font-size: 0.5rem;
}
section{
  ul{
    li{
      .router-link{
        display: block;
        height: 1.52rem;
        text-decoration:none;
        background: #fff;
        padding: 0.3rem 0.24rem 0.21rem 0.24rem;
        border-bottom: 1px solid #d4d4d4;
        .title{
          height: 100%;
          font-size: 16px;
          color: #333333;
        }
        .auAndClass{
          height: 100%;
          margin-top: -6%;
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
  }
}
</style>
