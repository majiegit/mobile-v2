<!--证明审核-->
<template>
  　
  <div style="overflow-y: scroll;overflow-x: hidden">
    <myHeader :title="title"></myHeader>
    <div class="outDiv">
      <div class="divRow">
        <div class="dirRow_div1">证明名称：</div>
        <div class="divRow_picker">{{prove.proveName}}</div>
      </div>
      <div class="divRow" v-if="fieldList.length !== 0" v-for="(item, index) in fieldList":key="index">
        <div class="dirRow_div1">{{item.fieldName}}：</div>
        <div class="divRow_picker">{{item.fieldValue}}</div>
      </div>
      <div class="divRow" style="align-items: start">
        <div class="dirRow_div1">证明说明：</div>
        <textarea class="divRow_text" v-model="prove.remark">{{prove.remark}}</textarea>
      </div>
    </div>
    <div class="imgDiv">
      <img :src="prove.proveLook" class="imgDiv_img "/>
    </div>
    <CheckStatus :arrowShow = arrowShow :proveCheckUser="proveCheckUser" @arrowShowClick="arrowShowClick"></CheckStatus>
    <div style="height: 60px"></div>
    <div class="bottomButtonDiv" v-if="prove.checkStatus == 0">
      <div class="bottomButtonDiv_left" @click="pz(2)">不批准</div>
      <div class="bottomButtonDiv_right" @click="pz(1)">批准</div>
    </div>
    <div class="bottomButtonDiv" v-else>
      <div class="bottomButtonDiv_left" style="background-color: #999999;">不批准</div>
      <div class="bottomButtonDiv_right" style="background-color: #999999;">批准</div>
    </div>
  </div>
</template>

<script>
  import myHeader from '../../components/zykj/my-header-lihao';
  import CheckStatus from './checkstatus';
  import {Toast, Indicator,MessageBox } from 'mint-ui';
  import {ajax, fetchData, getStorage, setStorage, clearStorage} from 'hr-utils'
  import {proveRequest} from '../../utils/util'

  export default {
    name: 'certificationAuditDetail',
    components: {
      myHeader,
      CheckStatus
    },
    data() {
      return {
        arrowShow: false,
        title: '证明审批',
        prove: {},
        proveId: '',
        proveName: '',
        userId: getStorage('userID'),
        proveCheckUser: {},
        fieldList: []
      }
    },
    computed: {},
    watch: {
      prove(val){
      }
    },
    mounted() {
      this.getProve(this.$route.query.id)
    },
    methods: {
      getProveField(id) {
        proveRequest({
          url : 'prove/sysProveSubmitField/list',
          method : 'GET',
          param: { proveSubmitId: id, type: 'temp'},
          mock : false,
          contentType : "application/json; charset=utf-8",
          success :(data)=>{
            this.fieldList = data.data
          },
          error :(data) =>{
          }
        })
      },
      arrowShowClick(){
        if(this.arrowShow){
          this.arrowShow = false
        }else {
          this.arrowShow = true
        }
      },
      getProveCheckUserList(id) {
        proveRequest({
          url: 'prove/proveSubmit/checkUserList',
          method: 'GET',
          mock: false,
          param: {proveSubmitId: id},
          contentType: "application/json; charset=utf-8",
          success: (data) => {
            this.proveCheckUser = data.data
          },
        })
      },
      getProve(id) {
        Indicator.open()
        proveRequest({
          url: 'prove/proveSubmit/byCheckId',
          method: 'GET',
          mock: false,
          param: {id: id, userId: this.userId},
          contentType: "application/json; charset=utf-8",
          success: (res) => {
            this.prove = res.data
            if(res.data.checkStatus == 1 || res.data.checkStatus == 2) {
              Toast("已审核过该证明")
            } else if(res.data.checkStatus == 3) {
              Toast("该证明审批已结束")
            }
            this.getProveCheckUserList(res.data.id)
            this.getProveField(res.data.id)
            Indicator.close()
          },
        })
      },
      //1批准 2不批准
      pz(type) {
        let msg = type === 1 ? '批准' : '不批准'
        MessageBox.prompt('请输入审批意见','',{inputPlaceholder: `${msg}`}).then(({ value, action }) => {
          if(!value){
            value = msg
          }
          Indicator.open()
          proveRequest({
            url: 'prove/proveSubmit/check',
            method: 'POST',
            mock: false,
            param: {ids: [this.prove.id], status: type, checkUserName: getStorage('userName'),checkUserId: this.userId,checkOpinion: value},
            contentType: "application/json; charset=utf-8",
            success: (data) => {
              Indicator.close()
              Toast(data.message)
              setTimeout(() => {
                this.$router.go(-1);
              }, 500)
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
  .proveCheckOption_body{
    width: 94%;
    border-radius: 10px;
    padding-top: 15px;
    margin: 3%;
    background: #fff;
  }
  .proveCheckOption_title {
    margin: 15px;
    display: flex;
    align-items: center;
    justify-content: start;
    font-size: 14px;
  }


  .outDiv {
    float: left;
    margin: 15px;
    .divRow {
      display: flex;
      align-items: center;
      justify-content: start;
      margin-top: 15px;
      font-size: 14px;
      &_right {
      }
      &_text {
        min-width: 200px;
        height: 60px;
        padding: 0px 10px;
        border: 1px solid #C9C9C9;
        border-radius: 3px;
      }
      &_picker{
        height: 30px;
        min-width: 200px;
        padding: 0px 10px;
        line-height: 30px;
        border: 1px solid #C9C9C9;
        border-radius: 3px;
        background-color: #fff;
        position: relative;
      }
    }
  }

  .imgDiv {
    margin: 15px 10px;
    &_img {
      width: 100%;
      object-fit: cover;
    }
  }

  .bottomButtonDiv {
    position: fixed;
    left: 15px;
    right: 15px;
    bottom: 20px;

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
  .backgroundRed{
    background: rgb(208,89,84);
  }
  .backgroundGrey{
    background: rgb(161,161,161);
  }
  .dirRow_div1{
    width: 100px;
  }
</style>
