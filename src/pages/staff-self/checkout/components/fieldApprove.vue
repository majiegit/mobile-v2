<template>
  <div id="fieldApprove" style="height: 100%; background: white;">
    <div id="title">
      <i class="icon hrfont hr-Arrow2" style="color: #0CAEF5;font-size: 0.6rem;display: inline-block;float: left;" @click="goApp"></i>
      <span style="display: inline-block; text-align: center; width: 80%;font-size: 0.36rem;">
        外勤审批&nbsp;-
        <select @change="changeLoad" id="typeChange1">
          <option value="0">待办</option>
          <option value="1">已办</option>
        </select>
      </span>
      <span id="toggle1" @click="toggleBatchEdit(1)" :style="{'display': typeValue == 0 && dataList.length !== 0 ? 'inline' : 'none','color': '#26a2ff'}">
        <i class="hrfont hr-edit2" style="font-size: 20px"></i>
      </span>
      <span id="toggle2" @click="toggleBatchEdit(2)" style="color: #26a2ff;display: none">
        取消
      </span>
    </div>
    <div id="fieldappr">
      <div id="allSelectDIV" style="padding: 10px 20px 15px;display: none ">
        <div class="checkboxFive">
          <input type="checkbox" value="1" id="allSelect" name="" style="visibility: hidden" @click="allselect()" />
          <label for="allSelect"></label>
          <span style="padding-left: 10px;">全选</span>
        </div>
      </div>
      <div class="model" v-for="item in dataList" >
        <div class="checkboxFive" style="line-height: 45px;">
          <input type="checkbox" value="1" class="checkboxSingle" :id="item.pk_field" name="" style="visibility: hidden" @click="isselect(item.pk_field)" />
          <label :for="item.pk_field"></label>
        </div>
        <div class="detialbody" @click="jump2Detail(item.pk_field)" style="display: inline-block;width: 93%;padding-left: 10px;">
          <div class="apprtitle">
          <span style="width: 30%">
            {{item.apprstate == 0 ? '待审批' : (item.apprstate == 1 ? '审批通过' : '审批不通过')}}
          </span>
            <span style="color: #999999;width: 65%;text-align: right">{{item.fieldtime}}</span>
          </div>
          <div class="apprbody">
          <span style="color: #999999;">
            {{item.name}}--{{item.fieldtype == 0 ? '公事外出' : '外地出差'}}
          </span>
          </div>
        </div>
      </div>
      <div id="btngroup" style="display: none">
        <mt-button type="primary" @click="batchPass()" style="width:49%;height: 50px;">
          批量通过
        </mt-button>
        <mt-button type="primary" @click="batchRefused()" style="width:49%;height: 50px;">
          批量不通过
        </mt-button>
      </div>
      <div id="emptydiv" class="emptydiv" v-if="this.dataList.length == 0" style="padding-top: 30%; text-align: center;">
        <img src="../../../../../static/img/pages/application/noApprove.svg">
      </div>
    </div>
  </div>
</template>

<script>
  import { Toast, Indicator, MessageBox } from 'mint-ui';
  import { fetchData, getStorage } from 'hr-utils'

  export default {
    data() {
      return {
        dataList: [],
        typeValue: '0',
        pkList: []
      }
    },
    created() {
      this.initListData(1, 0)
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
      jump2Detail(pk) {
        let value = this.typeValue
        this.$router.push({
          name: 'fielddetail',
          query: {
            'pk': pk,
            'state': value == 0 ? '0' : '1', // 0：编辑状态 1：浏览状态,
            'type': '1' // 0：申请状态 1：审批状态
          }
        })
      },
      changeLoad() {
        let el = document.getElementById('typeChange1')
        let index = el.selectedIndex
        let value = el.options[index].value
        this.typeValue = value
        Indicator.open({
          text: '加载中...',
          spinnerType: 'fading-circle'
        })
        this.initListData(1, value)
      },
      allselect() {
        let _this = this
        _this.pkList = []
        let checked = document.getElementById('allSelect').checked
        let subel = document.getElementsByClassName('checkboxSingle')
        for (let i = 0; i < subel.length; i++) {
          if (checked) {
            subel[i].checked = true
            _this.pkList.push(subel[i].id)
          } else {
            subel[i].checked = false
            _this.pkList = []
          }
        }
      },
      isselect(id) {
        let checked = document.getElementById(id).checked
        if (checked) {
          this.pkList.push(id)
        } else {
          this.pkList.splice(this.pkList.indexOf(id), 1)
        }
      },
      toggleBatchEdit(param) {
        if (param == '1') {
          document.getElementById('toggle1').style.display = 'none'
          document.getElementById('toggle2').style.display = 'inline'
          document.getElementById('allSelectDIV').style.display = 'block'
          document.getElementById('btngroup').style.display = 'block'
          let els = document.getElementsByClassName('checkboxFive')
          for (let i = 0; i < els.length; i++) {
            els[i].style.display = 'inline-block'
          }
        } else {
          document.getElementById('toggle2').style.display = 'none'
          document.getElementById('toggle1').style.display = 'inline'
          document.getElementById('allSelectDIV').style.display = 'none'
          document.getElementById('btngroup').style.display = 'none'
          let els = document.getElementsByClassName('checkboxFive')
          for (let i = 0; i < els.length; i++) {
            els[i].style.display = 'none'
          }
        }
      },
      batchPass() {
        let _this = this
        if (this.pkList.length == 0) {
          Toast('请先选择数据')
        } else {
          MessageBox.confirm('是否确认批量审批通过？').then(action => {
            let param = {
              'pks': _this.pkList,
              'state': '0' // 0：审批通过 1：审批不通过
            }
            fetchData({
              url: 'hrssc/portal/tbmcheck/batchUpdateMyFieldByPKS',
              method: 'POST',
              param: param,
              mock: false,
              contentType: "application/json",
              success: function (data) {
                if (data.statusCode == 200) {
                  Indicator.close()
                  Toast('审批成功')
                  window.location.reload()
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
          })
        }
      },
      batchRefused() {
        let _this = this
        if (this.pkList.length == 0) {
          Toast('请先选择数据')
        } else {
          MessageBox.confirm('是否确认批量审批不通过？').then(action => {
            let param = {
              'pks': _this.pkList,
              'state': '1' // 0：审批通过 1：审批不通过
            }
            fetchData({
              url: 'hrssc/portal/tbmcheck/batchUpdateMyFieldByPKS',
              method: 'POST',
              param: param,
              mock: false,
              contentType: "application/json",
              success: function (data) {
                if (data.statusCode == 200) {
                  Indicator.close()
                  Toast('审批成功')
                  window.location.reload()
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
          })
        }
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
      z-index: 13;
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
    #fieldappr {
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
      .apprtitle {
        padding-bottom: 5px;
      }
      .apprbody {
        font-size: 14px;
      }
      .checkboxFive {
        display: none;
        position: relative;
      }
      .checkboxFive label {
        cursor: pointer;
        position: absolute;
        width: 20px;
        height: 20px;
        top: 0;
        left: 0;
        background: #eee;
        border:1px solid #ddd;
      }
      .checkboxFive label:hover::after {
        opacity: 0;
      }
      .checkboxFive label:after {
        opacity: 0;
        content: '';
        position: absolute;
        width: 9px;
        height: 5px;
        background: transparent;
        top: 3px;
        left: 4px;
        border: 3px solid #333;
        border-top: none;
        border-right: none;

        -webkit-transform: rotate(-45deg);
        -moz-transform: rotate(-45deg);
        -o-transform: rotate(-45deg);
        -ms-transform: rotate(-45deg);
        transform: rotate(-45deg);
      }
      .checkboxFive input[type=checkbox]:checked + label:after {
        opacity: 1;
      }
    }
  }
</style>
