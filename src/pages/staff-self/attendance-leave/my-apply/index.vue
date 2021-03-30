/*
 * Created by yangyang11 on 2017/11/7.
 *
 */
<template>
  <div>
    <header>
      <hr-header
        title='我的申请'
        v-on:lcallBack='goApp'
        >
      </hr-header>
    </header>
    <section>
      <mt-loadmore
        :autoFill='autoFill'
        :bottom-method="loadBottom"
        :bottom-all-loaded="allLoaded"
        ref="loadmore">
        <ul>
          <li class="item"
            v-for='(apply, index) in ApplyList'
            v-bind:key = index
            @click='openDetail(apply)'>
            <div class="top">
              <span class="name">{{ apply.tbm_h_name }} <font v-show='apply.tbmtype_name'> -  </font>{{ apply.tbmtype_name}}</span>
              <span class="time"> {{ apply.apply_date}}</span>
            </div>
            <label class="free" :class="tg+ apply.approve_state">{{ apply.approve_state_name }}</label>
          </li>
        </ul>
      </mt-loadmore>
    </section>
  </div>
</template>

<script>
  import { HrHeader } from 'hr-ui'
  import { fetchData } from 'hr-utils'
  import { Toast, Loadmore, Indicator } from 'mint-ui';
  export default {
    name: 'test',
    data (){
      return {
        ApplyList: [],
        tg: 'tg',
        allLoaded: false,
        autoFill : false,
        pageno: 0 // 页码
      }
    },

    components: { HrHeader },

    created() {
      this.queryMyApplication()
    },

    methods: {
      openDetail(applyObj) {
        this.$router.push({
          name: 'apply-detail',
          query : {
            pk_h: applyObj.pk_h,
            approve_state: applyObj.approve_state,
            tbm_h_name: applyObj.tbm_h_name,
            billtype: applyObj.billtype,
            bill_code: applyObj.bill_code
          }
        })
      },

      //返回首页
      goApp() {
        this.$router.push({name: 'application'})
      },

      queryMyApplication() {
        Indicator.open()

        fetchData({
          url: 'hrssc/portal/tbmquery/getMyApplication',
          method: 'post',
          param: {
            pageno: this.pageno,
            pagesize: 10,
            state: '',
            billtype: '',
            timescope: ''
          },
          mock: false,
          contentType: "application/json",
          success: res=>{
            Indicator.close()
            if(res.data.length < 1){
              this.$refs.loadmore.onBottomLoaded()
              this.allLoaded = true
              Toast('已经没有更多了！')
            }
            this.ApplyList = this.ApplyList.concat(res.data)
          },
          error: error=> {
            Indicator.close()
            Toast(error.message)
          }
        })
      },

      loadBottom() {
        this.pageno ++
        this.queryMyApplication()
      }
    }
  }
</script>

<style lang='less' scoped>
div{
  background: #fff;
}
header{
  position: fixed;
  width: 100%;
  height: .88rem;
  line-height: .88rem;
}
section{
  margin: .88rem 0 0 ;
  border-bottom: 1px solid #d5d5d5;
  height: 93.5%;
  overflow-y: scroll;
  // -webkit-overflow-scrolling: touch;
  .item{
    height: 1.4rem;
    margin-left: .22rem;
    padding: .2rem 0;
    border-bottom: 1px solid #d5d5d5;
    background: #fff;
    .top{
      height: .48rem;
      .name{
        font-size:17px;
        color:#444444;
        letter-spacing:-0.47px;
        text-align:left;
        font-family: PingFang-SC-Medium;
        p{
          display: inline-block;
        }
      }
      .time{
        float: right;
        margin-right: .22rem;
        font-size:17px;
        color:#999999;
        letter-spacing:-0.47px;
        text-align:right;
      }
    }
    label{
      font-size:15px;
      letter-spacing:-0.5px;
      text-align:left;
    }
    .free{
      color:#88a3af;
    }
    .tg0{
      color:#f17e71;
    }
    .tg1{
      color:#3fc691;
    }
    .tg2{
      color:red;
    }
    .tg3{
      color:#e9ae24;
    }
    .submit{
      color:#e9ae24;
    }
    .adopt{
      color:#3fc691;
    }
  }
  // .item:last-child{
  //   border-bottom: none;
  // }
}

</style>
