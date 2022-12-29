<!--审核状态-->
<template>
  <div>
    <van-collapse v-model="arrowShow">
      <van-collapse-item title="审批流程" name="1">
        <van-steps direction="vertical" :active="active" active-color="#2479ed">
          <van-step>
            <!--提交人-->
            <div>
              <p style="margin: 0px">
                <span>{{detail.psndocname}}</span>
                <span>提交</span>
              </p>
              <p>{{detail.submitdate}}</p>
            </div>
          </van-step>
          <van-step>
            <!--审批人-->
            <div>
              <p style="margin: 0px">
                <span>{{detail.checkusername}}</span>
                <span>{{PsnInfoApproveStatus[detail.checkstatus]}}</span>
              </p>
              <p>{{detail.checknote}}</p>
              <p>{{detail.checkdate}}</p>
            </div>
          </van-step>

        </van-steps>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
  import {PsnInfoApproveStatus} from '@/utils/ConstantUtils'
  export default {
    name: 'PsnInfoApproveStatus',
    components: {},
    props: {
      detail: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        PsnInfoApproveStatus,
        arrowShow: ['1'],
        active: 1
      }
    },
    watch: {},
    computed: {},
    mounted() {
      console.log(this.detail)
    },
    methods: {}
  }
</script>
<style lang="less" scoped>
  .proveCheckOption_body {
    width: 94%;
    margin: 0 3%;
    border-radius: 10px;
    padding-top: 5px;
    background: #fff;
  }

  .proveCheckOption_title {
    display: flex;
    align-details: center;
    justify-content: start;
    font-size: 14px;
    line-height: 14px;
    color: #999;
  }

  .backgroundRed {
    background: #2479ED;
  }

  .backgroundGrey {
    background: rgb(161, 161, 161);
  }
</style>
