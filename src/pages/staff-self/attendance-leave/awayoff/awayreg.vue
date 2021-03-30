<template>
  <div>
    <header>
      <hr-header
        title='出差记录选择'
        v-on:lcallBack='goApp'
      >
      </hr-header>
    </header>
    <section>
      <figure>
        <div class="items-bar" v-for="data in regDatas" v-if="regDatas.length != 0">
          <div class="items" @click="updownDetail(data)">
            <i class="hrfont hr-list" style="font-size: 14px;"></i>
            <span>{{data.begindate}}</span>
            &nbsp;
            <span>{{data.type}}</span>
            <i class="hrfont hr-drop-down02" style="font-size: 14px;" v-show="!data.isshow"></i>
          </div>
          <div class="item" v-show="data.isshow" @click="addNewoff(data)">
            <div class="item-top">
              <div class="item-top-item">
                <span>开始时间</span>
                <label>{{data.begintime}}</label>
              </div>
              <div class="item-top-item">
                <span>结束时间</span>
                <label>{{data.endtime}}</label>
              </div>
              <div class="item-top-item">
                <span>出差时长</span>
                <label>{{data.awayhour}}{{data.unit}}</label>
              </div>
              <div class="area">
                <div class="area-left">
                  <span>出差地点</span>
                </div>
                <div class="area-right">
                  <label>{{data.awayaddress}}</label>
                </div>
              </div>
              <div class="area">
                <div class="area-left">
                  <span>任务安排</span>
                </div>
                <div class="area-right">
                  <label>{{data.workprocess}}</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="emptydiv" class="emptydiv" v-if="regDatas.length === 0" style="margin-top: 40%; text-align: center;">
          <img src="../../../../../static/img/pages/application/noData.svg">
        </div>
      </figure>
    </section>
  </div>
</template>

<script>
  import { Toast, Indicator, Cell, MessageBox, Spinner } from 'mint-ui';
  import { fetchData, emojiFilter } from 'hr-utils'
  import { HrHeader} from 'hr-ui'
  export default {
    name: "awayreg",
    data() {
      return {
        regDatas: []
      }
    },
    components: {HrHeader},
    mounted(){
      this.init()
    },
    methods: {
      init(){
        let _this = this
        Indicator.open()
        fetchData({
          url: 'hrssc/portal/tbmquery/queryAwayReg',
          method: 'post',
          param: {
            billtype: 'awayoff'
          },
          mock: false,
          contentType: "application/json",
          success: function(data) {
            Indicator.close()
            let datas = data.data.data
            if(datas == undefined || datas == null || datas.length == 0){
              _this.regDatas = []
              return
            }
            for(let i=0; i<datas.length; i++) {
              if ( i === 0) {
                datas[i].isshow = true
              }else {
                datas[i].isshow = false
              }
            }
            _this.regDatas = datas
          },
          error: function(error) {
            Indicator.close()
            Toast(error.message)
          }
        })
      },

      updownDetail(data) {
        data.isshow = !data.isshow
      },

      addNewoff(data){
        let regpk = data.id
        this.$router.push({
          name: 'awayoff',
          params: regpk,
          query: {
            isnew: true,
            pk_reg: regpk
          }
        })
      },
      //返回首页
      goApp() {
        this.$router.go(-1)
      }
    }
  }
</script>

<style lang='less' scoped>
  header{
    position: fixed;
    width: 100%;
    height: .88rem;
    line-height: .88rem;
    z-index: 2;
  }
  section{
    height: 85.9%;
    margin-top: .88rem;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    .items-bar {
      width: 100%;
      text-align: left;
      background-color: #fff;
      .items {
        min-height: 48px;
        font-size: .3rem;
        padding: 12px .2rem;
        border-bottom: solid 1px #d9d9d9;
        color: #0caef5;
      }
      .item{
        border-bottom: solid 1px #d9d9d9;
        .item-top{
          padding: .2rem;
          font-size: .3rem;
          .item-top-item{
            padding: .2rem;
            color: #888;
            label {
              float: right;
            }
          }
          .area{
            line-height: .55rem;
            padding: .2rem;
            color: #888;
            .area-left{
              display: inline-block;
              width: 20%;
              float: left;
            }
            .area-right{
              display: inline-block;
              width: 78.5%;
            }
          }
        }
      }
    }
  }
</style>
