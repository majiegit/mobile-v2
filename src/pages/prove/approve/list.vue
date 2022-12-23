<!--证明审核-->
<template>
  　
  <div style="overflow-y: scroll;overflow-x: hidden">
    <myHeader :title="title"></myHeader>
    <van-dropdown-menu>
      <van-dropdown-item v-model="proveId" :options="proveList" @change="changeList"/>
      <van-dropdown-item v-model="proveStatus" :options="proveStatusList" @change="changeList"/>
    </van-dropdown-menu>
    <div class="bodyDiv" v-for="(d,index) in datas">
      <div style="width: 10%; height: 100%; float: left; text-align: center;">
        <van-checkbox v-model="d.flag" style="margin-top: 30px;" checked-color="#ee0a24"></van-checkbox>
      </div>
      <div style="width: 90%;height: 100%; float: left;" @click.stop="$router.push({name:'certificationAuditDetail',query:{id:d.checkId}})">
        <div class="bodyDiv_child">
          <div style="width: 50%">申请人：{{ d.userName }}</div>
          <div style="width: 50%">申请时间：{{ d.createTime.substring(0,11) }}</div>
        </div>
        <div class="bodyDiv_child">
          <div style="width: 50%">证明名称：{{ d.proveName }}</div>
          <div style="width: 50%">状态：
            <span v-if="d.checkStatus==0" style="color: #ED244A">审核进行中</span>
            <span style="color: #20D462" v-if="d.checkStatus==1">批准</span>
            <span style="color: #2479ED" v-if="d.checkStatus==2">不批准</span>
            <span v-if="d.checkStatus==3">已结束</span>
          </div>
        </div>
      </div>
    </div>
    <div style="height: 60px"></div>
    <div class="bottomButtonDiv">
      <div class="bottomButtonDiv_left" @click="pz(2)">不批准</div>
      <div class="bottomButtonDiv_right" @click="pz(1)">批准</div>
    </div>
  </div>
</template>

<script>
  import myHeader from '../../components/zykj/my-header-lihao';
  import {Toast, Indicator, MessageBox} from 'mint-ui';
  import {ajax, fetchData, getStorage, setStorage, clearStorage} from 'hr-utils'
  import {proveRequest} from '../../utils/util'

  export default {
    name: 'certificationAudit',
    components: {
      myHeader
    },
    data() {
      return {
        radio: '1',
        checked: true,
        zmSelected: require('../../components/zykj/img/zmSelected.png'),
        zmSelect: require('../../components/zykj/img/zmSelect.png'),
        title: '证明审批',
        datas: [],//全部数据
        proveId: '',
        proveList: [
          {
            text: '全部',
            value: ''
          }
        ],
        proveStatus: '',
        proveStatusList: [
          {
            text: '全部', value: ''
          },
          {
            text: '审核进行中', value: 0
          },
          {
            text: '审核通过', value: 1
          },
          {
            text: '审核不通过', value: 2
          }
        ],
        userId: getStorage('userID')
      }
    },
    computed: {},
    mounted() {
      this.getProveList()
      this.changeList()
    },
    methods: {
      // 查询审批列表
      changeList() {
        Indicator.open()
        proveRequest({
          url : 'prove/proveSubmit/checkList',
          method : 'POST',
          mock : false,
          param:{userId:getStorage('userID'), proveId: this.proveId, status: this.proveStatus},
          contentType : "application/json; charset=utf-8",
          success :(res)=>{
            this.datas = res.data
            Indicator.close()
          },
        })
      },
      // 查询证明列表
      getProveList() {
        var _this = this
        proveRequest({
          url: 'prove/sysProve/list',
          method: 'GET',
          mock: false,
          contentType: "application/json; charset=utf-8",
          success: (data) => {
            data.data.forEach(function (item) {
              var prove = {
                text: item.name,
                value: item.id,
              }
              _this.proveList.push(prove)
            })
          }
        })
      },
      //1批准 2不批准
      pz(type) {
        console.log(this.datas)
        if (this.datas.filter(val => val.flag).length == 0) {
          Toast('请选择证明进行审核')
          return
        }
        const flagArray = this.datas.filter(val => val.flag)
        if (flagArray.filter(val => (val.checkStatus !== 0)).length != 0) {
          Toast('不可选择审批完成的数据')
          return
        }
        let ids = flagArray.filter(val => val.flag).map(val1 => val1.id)
        console.log(ids)
        let msg = type === 1 ? '批准' : '不批准'
        MessageBox.prompt('请输入审批意见', '', {inputPlaceholder: `${msg}`}).then(({value, action}) => {
          if (!value) {
            value = msg
          }
          Indicator.open()
          proveRequest({
            url: 'prove/proveSubmit/check',
            method: 'POST',
            mock: false,
            param: {
              ids: ids,
              status: type,
              checkUserName: getStorage('userName'),
              checkUserId: this.userId,
              checkOpinion: value
            },
            contentType: "application/json; charset=utf-8",
            success: (data) => {
              Indicator.close()
              Toast(data.message)
              this.changeList()
            },
          })
        }).catch(err => {
          Indicator.close()
        });
      }
    }
  }
</script>
<style lang="less" scoped>
  table.gridtable {
    font-family: verdana, arial, sans-serif;
    font-size: 11px;
    color: #333333;
    border-width: 1px;
    border-color: #666666;
    border-collapse: collapse;
    margin-top: 20px;

  }

  table.gridtable th {
    border-width: 1px;
    padding: 8px;
    text-align: center;
    background-color: #E4E8F1;
    display: inline-block;
    position: relative;
    width: 100px;
  }

  table.gridtable td {
    border-width: 1px;
    padding: 8px;
    text-align: center;
    background-color: #ffffff;
    display: inline-block;
    position: relative;
  }

  tr > td {
    word-break: break-all;
  }

  .aaa {
    &::-webkit-scrollbar {
      display: none;
    }
  }

  #box {
    width: 200px;
    height: 50px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.35s;
  }

  #box ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  #box ul li {
    width: 198px;
    height: 48px;
    line-height: 50px;
    text-align: center;
    border: 1px red solid;
    background: #000000;
    color: white;
  }

  .bodyDiv {
    height: 80px;
    margin: 10px;
    border-radius: 10px;
    background-color: #fff;
    padding: 0px 15px 0px 10px;
    font-size: 12px;
    position: relative;
    &_child {
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      text-align: left;
    }
  }

  .selectImg {
    position: absolute;
    left: 15px;
    top: 33px;
    width: 15px;
    height: 15px;
  }

  .bottomButtonDiv {
    position: fixed;
    left: 15px;
    right: 15px;
    bottom: 10px;

    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #fff;
    &_left {
      width: 48%;
      font-size: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #E04F4F;
      height: 40px;
      border-radius: 20px;
    }
    &_right {
      width: 48%;
      font-size: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #20D462;
      height: 40px;
      border-radius: 20px;
    }
  }
</style>
