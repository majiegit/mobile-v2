<!--证明审核-->
<template>
  　
  <div style="overflow-y: scroll;overflow-x: hidden">
    <myHeader :title="title"></myHeader>
    <div style="width: 90%; height: 50px; margin:15px 15px 0px 15px;float: left;">
      <div style="float: left; width: 20%; height: 100%; font-size: 12px;">审批流程：</div>
      <div class="check_user" style="width: 80%; height: 50px; float:left; overflow-x: auto; overflow-y: hidden;  white-space: nowrap;">
        <div style="width: 95px; height: 100%; display: inline-block;" v-for="(item,index) in checkList" :key="index">
          <div style="float: left; width: 100%; height: 50%; ">
            <div style="width: 20px; height: 20px;  border-radius: 50%; text-align: center; line-height: 20px; float: left; background: #E04F4F; color: #fff;">
              <van-icon name="success" size="20px"/>
            </div>
            <div style="width: 75px; height: 3px; float: left; background: #E04F4F; position: relative; top: 8px" v-if="index !== checkList.length - 1">
            </div>
          </div>
          <div style="width: 100%; float: left; padding-top: 5%; font-size: 12px; position: relative; color: #333333;">{{item.USER_NAME}}</div>
        </div>
      </div>
    </div>
    <div class="outDiv">
      <div class="divRow">
        <div>证明名称：</div>
        <div class="divRow_right">{{proveName}}</div>
      </div>
      <div class="divRow" style="align-items: start">
        <div>证明内容：</div>
        <textarea class="divRow_text" v-model="prove.remark">{{prove.remark}}</textarea>
      </div>
    </div>
    <div class="imgDiv">
      <img :src="prove.proveLook" class="imgDiv_img "/>
    </div>
    <div style="height: 60px"></div>
    <div class="bottomButtonDiv" v-if="prove.status == 0">
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
  import {Toast, Indicator} from 'mint-ui';
  import {ajax, fetchData, getStorage, setStorage, clearStorage} from 'hr-utils'
  import {proveRequest} from '../../utils/util'

  export default {
    name: 'certificationAuditDetail',
    components: {
      myHeader
    },
    data() {
      return {
        title: '证明审批',
        prove: {},
        checkList: [],
        proveId: '',
        proveName: ''
      }
    },
    computed: {},
    watch: {
      prove(val){
        this.getProveList(val)
      }
    },
    mounted() {
      this.getProve(this.$route.query.id)
      this.getProveList()
    },
    methods: {

      // 查询证明列表
      getProveList(val) {
        var _this = this
        proveRequest({
          url: 'prove/sysProve/list',
          method: 'GET',
          mock: false,
          contentType: "application/json; charset=utf-8",
          success: (res) => {
            for (var i = 0; i < res.data.length; i++) {
              if (res.data[i].id == val.proveId) {
                _this.proveName = res.data[i].name
              }
            }
          }
        })
      },
      getProve(id) {
        proveRequest({
          url: 'prove/proveSubmit/byId',
          method: 'GET',
          mock: false,
          param: {id: id},
          contentType: "application/json; charset=utf-8",
          success: (data) => {
            this.prove = data.data
            this.getCheckStep(this.prove.proveId)
          },
        })
      },
      getCheckStep(proveId) {
        proveRequest({
          url: 'prove/sysProve/checkUserList',
          method: 'GET',
          mock: false,
          param: {proveId: proveId},
          contentType: "application/json; charset=utf-8",
          success: (data) => {
            this.checkList = data.data
          },
        })
      },
      //1批准 2不批准
      pz(type) {
        Indicator.open()
        proveRequest({
          url: 'prove/proveSubmit/check',
          method: 'POST',
          mock: false,
          param: {ids: [this.prove.id], status: type, checkUserName: getStorage('userName')},
          contentType: "application/json; charset=utf-8",
          success: (data) => {
            Indicator.close()
            Toast(data.message)
            setTimeout(() => {
              this.$router.go(-1);
            }, 500)
          },
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .check_user {
    width: 80%;
    height: 40px;
    float: left;
    overflow-x: auto;
  }

  .outDiv {
    float: left;
    margin: 15px;
    .divRow {
      display: flex;
      align-items: center;
      justify-content: start;
      margin-top: 15px;
      font-size: 12px;
      &_right {
        margin-left: 10px;
      }
      &_text {
        margin-left: 10px;
        width: 200px;
        height: 60px;
        padding: 10px;
        border: 1px solid #C9C9C9;
        border-radius: 3px;
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
      background-color: #208CEB;
      height: 40px;
      border-radius: 20px;
    }
  }
</style>
