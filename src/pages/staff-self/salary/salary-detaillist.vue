<template>

  <div class="hr-list1">
      <div class="h-listgroup"   v-for="detail in detaildata.salaryItem">
          <div class="h-title">
              <span class="h-left">{{detail.className}}</span><span class="h-right h-blue">{{detail.value}}</span>
          </div>
          <div class="h-body" v-if="detail.fileds.length > 0">
              <div class="h-list" v-for="list in detail.fileds" v-if="detaildata.salaryList[list] != undefined">
                  <span class="h-left">{{detaildata.salaryList[list] == undefined ? '' : detaildata.salaryList[list].title}}</span>
                  <span class="h-right">{{detaildata.salaryList[list] == undefined ? '' : detaildata.salaryList[list].content}}</span>
              </div>
          </div>
      </div>
      <div class="h-listgroup">
          <div class="h-body-hj">
              <div class="h-list">
                  <span class="h-left-hj">{{detaildata.salaryList[detaildata.countItem[1]].title}}</span>
                  <span class="h-right">{{detaildata.salaryList[detaildata.countItem[1]].content}}</span>
              </div>
          </div>
      </div>
  </div>


</template>

<script>
  import {waterMark, clearWaterMark} from 'hr-utils'
/*
    查薪资详情页 列表组件  zhanghua 2017/08/26
 */

  export default {
    name:'hr-list1',
    props:['listdata'],
    data(){
        return {
          isWater: false,
          pageHeight: 0,
          detaildata:[]
        }
    },
    watch: {
      detaildata() {
        this.init();
      }
    },
    updated () {
      var pageHeight = Math.max(document.body.scrollHeight, document.body.clientHeight)
      if (pageHeight !== this.pageHeight || this.isWater === false) {
        this.isWater = true
        clearWaterMark()
        waterMark({watermark_txt: localStorage.getItem('userName').split('-')[1] + ' ' + localStorage.getItem('usercode').split('-')[1] })
      }
    },
    mounted (){
      this.pageHeight = Math.max(document.body.scrollHeight, document.body.clientHeight)
      this.init();
    },
    methods:{
      init() {
        this.detaildata =this.listdata;
      }
    }

  };
</script>


<style lang='less'scoped>

 /*<!-- 列表样式 -->*/
    .h-left {
        float: left;
    }
    .h-right {
        float: right;
    }
    .h-blue {
        color: #0CAEF5;
        font-size: 0.32rem;
    }
    .h-listgroup {
        background: #fff;
        border-radius: 5px;
        margin: 0 0.2rem 0.2rem;
        padding: 0.2rem;
        .h-title {
            width:100%;
            height: 0.9rem;
            padding: 0 0.1rem;
            line-height: 0.9rem;
            font-size: 0.3rem;
            font-weight: 600;
            color:#333;
        }
        .h-body {
            padding-top: 0.3rem;
            border-top: 1px solid #d5d5d5;
            .h-list {
                height: 0.6rem;
                width: 100%;
                padding: 0 0.1rem;
                line-height: 0.6rem;
                font-size: 0.28rem;
                color:#666;
            }
        }
        .h-left-hj {
            float: left;
            font-weight: bold;
        }
        .h-body-hj {
            border-top: 0px solid #d5d5d5;
            .h-list {
                height: 0.6rem;
                width: 100%;
                padding: 0 0.1rem;
                line-height: 0.6rem;
                font-size: 0.28rem;
                color:#666;
            }
        }
    }

</style>
