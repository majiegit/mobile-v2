<!--审核状态-->
<template>
  <div>
    <van-collapse v-model="arrowShow">
      <van-collapse-item title="审批流程" name="1">
        <van-steps direction="vertical" :active="active" active-color="#2479ed">
          <van-step v-for=" (item ,index) in workflownote" :key="index">
            <!--审批流程-->
            <div>
              <p>
                <span>{{item.dealman}}</span>
                <span>{{item.dealstatus}}</span>
              </p>
              <p>{{item.checknote}}</p>
              <p>{{item.dealdate}}</p>
            </div>
          </van-step>
        </van-steps>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
  export default {
    name: 'ApproveProcess',
    components: {},
    props: {
      workflownote: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        arrowShow: ['1'],
        active: 0
      }
    },
    watch: {},
    computed: {},
    mounted() {
      console.log(this.workflownote)
      if (this.workflownote) {
        this.active = this.workflownote.length - 1
      }
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
    align-items: center;
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
