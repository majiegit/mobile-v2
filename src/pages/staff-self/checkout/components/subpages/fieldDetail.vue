<template>
  <div id="fieldDetail" style="height: 100%;">
    <header>
      <hr-header
        title='外勤申请单'
        v-on:lcallBack='goApp'
      >
      </hr-header>
    </header>
    <div class="fieldBody">
      <div class="model">
        <span class="name">外勤时间</span>
        <span class="content" style="color: #26a2ff">{{filedvo.fieldtime}}</span>
      </div>
      <div class="model">
        <span class="name">外勤地点</span>
        <span class="content" style="color: #26a2ff"><i class="hrfont hr-sign2" style="font-size: 20px;"></i>{{filedvo.addr}}</span>
      </div>
      <div class="model">
        <span class="name">外勤类型</span>
        <span class="content" style="color: #26a2ff">{{filedvo.fieldtype == 0 ? '公事外出' : '外地出差'}}</span>
      </div>
      <div class="model">
        <span class="name">外勤说明</span>
        <span class="content">{{filedvo.content == undefined ? '无' : filedvo.content}}</span>
      </div>
      <div class="model" style="padding-top: 10px;">
        <mt-cell title="审核人" :value="filedvo.name"></mt-cell>
      </div>
      <div class="imgSytle" style="text-align: center;height: 30%">
        <img src="../../../../../../static/img/pages/attendance-leave/pass.png" style="height: 100%" v-if="state == 1 && filedvo.apprstate == 1" />
        <img src="../../../../../../static/img/pages/attendance-leave/nopass.png" style="height: 100%" v-if="state == 1 && filedvo.apprstate == 2" />
      </div>
    </div>
    <div class="btn">
      <mt-button type="primary" style="width: 100%;height: 100%;" @click="back()" v-if="type == 0 && state == 0 ">
        撤回
      </mt-button>
      <mt-button type="primary" style="width:49%;height: 100%;" @click="pass()" v-if="type == 1 && state == 0 ">
        审批通过
      </mt-button>
      <mt-button type="primary" style="width:49%;height: 100%;" @click="refused()" v-if="type == 1 && state == 0 ">
        审批不通过
      </mt-button>
    </div>
  </div>
</template>

<script>
  import { Toast, Indicator, MessageBox } from 'mint-ui';
  import { HrHeader } from 'hr-ui'
  import { fetchData, getStorage } from 'hr-utils'

  export default {
    data() {
      return {
        filedvo: null,
        state: this.$route.query.state,
        type: this.$route.query.type
      }
    },
    components: {
      HrHeader
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        Indicator.open({
          text: '加载中...',
          spinnerType: 'fading-circle'
        })
        let _this = this
        let param = {
          'pk': this.$route.query.pk
        }
        fetchData({
          url : 'hrssc/portal/tbmcheck/queryMyFieldByPK',
          method : 'POST',
          param : param,
          mock : false,
          contentType : "application/json",
          success : function(data) {
            if(data.statusCode == 200) {
              Indicator.close()
              _this.filedvo = data.data
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
      back() {
        let _this = this
        MessageBox.confirm('撤回即删除该单据，是否执行？').then(action => {
          let param = {
            'pk': _this.$route.query.pk
          }
          fetchData({
            url: 'hrssc/portal/tbmcheck/deleteMyFieldByPK',
            method: 'POST',
            param: param,
            mock: false,
            contentType: "application/json",
            success: function (data) {
              if (data.statusCode == 200) {
                Indicator.close()
                Toast('撤回成功')
                _this.$router.push({
                  name: 'checkout',
                  query: {
                    'select': '2'
                  }
                })
              } else {
                Indicator.close()
                Toast({
                  message: data.data.message,
                  duration: 2000
                });
              }
            },
            error: function (error) {
              Indicator.close()
              Toast(error.message)
            }
          })
        });
      },
      pass() {
        let _this = this
        MessageBox.confirm('是否确认审批通过？').then(action => {
          let param = {
            'pk': _this.$route.query.pk,
            'state': '0' // 0：审批通过 1：审批不通过
          }
          fetchData({
            url: 'hrssc/portal/tbmcheck/updateMyFieldByPK',
            method: 'POST',
            param: param,
            mock: false,
            contentType: "application/json",
            success: function (data) {
              if (data.statusCode == 200) {
                Indicator.close()
                Toast('审批成功')
                _this.$router.push({
                  name: 'checkout',
                  query: {
                    'select': '3'
                  }
                })
              } else {
                Indicator.close()
                Toast({
                  message: data.data.message,
                  duration: 2000
                });
              }
            },
            error: function (error) {
              Indicator.close()
              Toast(error.message)
            }
          })
        });
      },
      refused() {
        let _this = this
        MessageBox.confirm('是否确认审批不通过？').then(action => {
          let param = {
            'pk': _this.$route.query.pk,
            'state': '1' // 0：审批通过 1：审批不通过
          }
          fetchData({
            url: 'hrssc/portal/tbmcheck/updateMyFieldByPK',
            method: 'POST',
            param: param,
            mock: false,
            contentType: "application/json",
            success: function (data) {
              if (data.statusCode == 200) {
                Indicator.close()
                Toast('审批成功')
                _this.$router.push({
                  name: 'checkout',
                  query: {
                    'select': '3'
                  }
                })
              } else {
                Indicator.close()
                Toast({
                  message: data.data.message,
                  duration: 2000
                });
              }
            },
            error: function (error) {
              Indicator.close()
              Toast(error.message)
            }
          })
        });
      },
      goApp() {
        this.$router.push({
          name: 'checkout',
          query: {
            'select': this.type == '0' ? '2' : '3'
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  html {
    header {
      position: fixed;
      height: .88rem;
      width: 100%;
      line-height: .88rem;
    }
    .fieldBody {
      padding-top: 1rem;
      height: 93%;
      span {
        display: block;
      }
      .model {
        .name {
          padding: 10px 10px 5px;
        }
        .content {
          background: white;
          padding: 10px;
          color: #999999;
        }
      }
    }
    .btn {
      height: 7%;
    }
  }
</style>
