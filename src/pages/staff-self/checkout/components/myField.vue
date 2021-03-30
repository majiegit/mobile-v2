<template>
  <div id="myField" style="height: 100%;background: white;">
    <div id="title">
      <i class="icon hrfont hr-Arrow2" style="color: #0CAEF5;font-size: 0.6rem;display: inline-block;float: left;" @click="goApp"></i>
      <span style="display: inline-block; text-align: center; width: 80%;font-size: 0.36rem;">
        我的外勤&nbsp;-
        <select @change="changeLoad" id="typeChange">
          <option value="0">待审批</option>
          <option value="1">已审批</option>
        </select>
      </span>
    </div>
    <div id="fieldapply">
      <div class="model" v-for="item in dataList" @click="jump2Detail(item.pk_field)">
        <div class="applytitle">
          <span style="width: 30%">
            {{item.apprstate == 0 ? '待审批' : (item.apprstate == 1 ? '审批通过' : '审批不通过')}}
          </span>
          <span style="color: #999999;width: 65%;text-align: right">{{item.fieldtime}}</span>
        </div>
        <div class="applybody">
          <span style="color: #999999;">
            {{item.name}}--{{item.fieldtype == 0 ? '公事外出' : '外地出差'}}
          </span>
        </div>
      </div>
      <div id="emptydiv" class="emptydiv" v-if="this.dataList.length == 0" style="padding-top: 30%; text-align: center;">
        <img src="../../../../../static/img/pages/application/noApprove.svg">
      </div>
    </div>
  </div>
</template>

<script>
  import { Toast, Indicator } from 'mint-ui';
  import { fetchData, getStorage } from 'hr-utils'

  export default {
    data() {
      return {
        dataList: [],
        typeValue: '0'
      }
    },
    created() {
      this.initListData(0, 0)
    },
    methods: {
      initListData(type, state) {
        // type: 0:外勤申请单 1：外勤审批单
        // state： 0：待办 1：已办
        let _this = this
        let param = {
          'userId': getStorage('userinfo').pk_psndoc,
          'type': type,
          'state': state
        }
        fetchData({
          url : 'hrssc/portal/tbmcheck/queryMyField',
          method : 'POST',
          param : param,
          mock : false,
          contentType : "application/json",
          success : function(data) {
            if(data.statusCode == 200) {
              Indicator.close()
              _this.dataList = data.data
            } else {
              Indicator.close()
              Toast({
                message: data.data.message,
                duration: 2000
              });
            }
          },
          error : function(error) {
            Indicator.close()
            Toast(error.message)
          }
        })
      },
      changeLoad() {
        let el = document.getElementById('typeChange')
        let index = el.selectedIndex
        let value = el.options[index].value
        this.typeValue = value
        Indicator.open({
          text: '加载中...',
          spinnerType: 'fading-circle'
        })
        this.initListData(0, value)
      },
      jump2Detail(pk) {
        let value = this.typeValue
        this.$router.push({
          name: 'fielddetail',
          query: {
            'pk': pk,
            'state': value == 0 ? '0' : '1', // 0：编辑状态 1：浏览状态,
            'type': '0' // 0：申请状态 1：审批状态
          }
        })
      },
      goApp() {
        this.$router.push('application')
      }
    }
  }
</script>

<style lang="less" scoped>
  html {
    #title {
      background: white;
      position: fixed;
      height: .88rem;
      width: 100%;
      line-height: .88rem;
      border-bottom: 1px solid #ececec;
    }
    select {
      font-size: 0.36rem;
      background: white;
    }
    #fieldapply {
      height: 100%;
      overflow-y: auto;
      padding-top: 1rem;
      .model {
        margin: 10px 20px 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid #d5d5d5;
      }
      span {
        display: inline-block;
      }
      .applytitle {
        padding-bottom: 5px;
      }
      .applybody {
        font-size: 14px;
      }
    }

  }
</style>
