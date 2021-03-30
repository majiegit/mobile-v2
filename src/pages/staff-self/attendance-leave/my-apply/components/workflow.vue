<template>
  <div>
    <header>
      <hr-header title='流程图' v-on:lcallBack='goApp'>
      </hr-header>
    </header>
    <section>
      <div id="showApprove">
        <div class="approveContent">
          <article>
            <section v-for="(workflow,index) in billInfo.workflownote" v-if="billInfo.workflownote && billInfo.workflownote.length-index>1">
              <span class="point-time point-green">{{workflow.order}}</span>
              <time datetime="2013-03">
                <span>&nbsp;</span>
                <span v-if="workflow.approveresult ==''">{{workflow.sendernameml}}</span>
                <span v-else>{{workflow.checknameml}}</span>
              </time>
              <aside>
                <span>&nbsp;</span>
                <p class="things">{{workflow.dealdate}}</p>
                <p class="brief">
                  <span class="text-green">{{workflow.approveresult =='Y'? '批准':workflow.approveresult =='R'?'驳回':workflow.approveresult =='N'?'不批准':'待批准'}}</span>
                  <span class="text-green" v-if="workflow.approveresult !=''">{{workflow.checknote}}</span>
                </p>
              </aside>
            </section>
            <section v-for="(workflow,index) in billInfo.workflownote" v-if="billInfo.workflownote && billInfo.workflownote.length==1">
              <span class="point-time point-green">1</span>
              <time datetime="2013-03">
                <span>&nbsp;</span>
                <span v-if="workflow.approveresult ==''">{{workflow.sendernameml}}</span>
                <span v-else>{{workflow.sendernameml}}</span>
              </time>
              <aside>
                <span>&nbsp;</span>
                <p class="things">{{workflow.senddate}}</p>
                <p class="brief">
                  <span class="text-green">提交</span>
                  <span class="text-green" v-if="workflow.approveresult !=''">{{workflow.checknote}}</span>
                </p>
              </aside>
            </section>
            <section v-for="(workflow,index) in billInfo.workflownote" v-if="billInfo.workflownote && billInfo.workflownote.length-index==1">
              <span class="point-time point-green" v-if="billInfo.workflownote && billInfo.workflownote.length==1">2</span>
              <span class="point-time point-green" v-else>{{workflow.order}}</span>
              <time datetime="2013-03">
                <span>&nbsp;</span>
                <span v-if="workflow.approveresult ==''">{{workflow.sendernameml}}</span>
                <span v-else>{{workflow.checknameml}}</span>
              </time>
              <aside>
                <span>&nbsp;</span>
                <p class="things">{{workflow.dealdate}}</p>
                <p class="brief" >
                  <span class="text-green">{{billInfo.approve_state =='0'? '审批不通过':billInfo.approve_state =='1'?'审批通过':'待审批'}}</span>
                  <span class="text-green" v-if="workflow.approveresult !=''">{{workflow.checknote}}</span>
                </p>
              </aside>
            </section>
          </article>
        </div>
      </div>
    </section>
  </div>


</template>
<script>

  import { HrHeader } from 'hr-ui'
  import { fetchData, getStorage } from 'hr-utils'
  import { Toast, Indicator, MessageBox } from 'mint-ui'

  export default {
    name: 'workflow',
    data () {
      return {
        billInfo: {}
      }
    },
    mounted() {
      this.writeEditData(this.$route.params)
    },
    methods: {
      writeEditData(EditData) {
        this.billInfo = EditData
      },
      goApp() {
        this.$router.go(-1)
      }
    },
    components: { HrHeader }
  }

</script>
<style>
  @import '../../../../../../static/style/workflowstyle/timeline.css';
</style>

<style lang='less' scoped>
  div{
    background: #fff;
  }
  header{
    position: fixed;
    width: 100%;
    height: .88rem;
    line-height: .88rem;
    .um-h-middle{
      width: 50%;
    }
  }
  section{
    position: relative;
    z-index: 2;
    height: 85.0%;
    margin-top: 1.23rem;
    padding-left: 25%;
    -webkit-overflow-scrolling: touch;
    overflow-y: auto;
  }
</style>
