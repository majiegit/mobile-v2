/*
 * Created by yangyang11 on 2017/11/7.
 *
 */
<template>
  <div>
    <header>
      <hr-header
        title='流程结点'
        v-on:lcallBack='goApp'
        >
      </hr-header>
    </header>
    <section>
      <ul class="node-list">
          <li v-for='(node, index) in nodeList' @click='handleClick(node)' :key=index>
            <span>{{ node.node_name}} </span>
            <i class="icon hrfont hr-right"></i>
          </li>
      </ul>
    </section>
  </div>
</template>

<script>
  import { fetchData } from 'hr-utils'
  import { HrHeader } from 'hr-ui'
  import { Toast, Indicator, MessageBox } from 'mint-ui'
  
  import datas from './data.js'
  
  export default {
    name: 'test',
    data (){
      return {
        nodeList:[]
      }
    },

    components: { HrHeader },

    created() {
      this.queryProcessNodeList()
      //this.nodeList = datas.data.data
    },

    methods: {
      queryProcessNodeList() {
        Indicator.open()
        fetchData({
          url: 'hrssc/portal/tbmquery/queryProcessNodeList',
          method: 'post',
          param: {
            pk_h: this.$route.query.pk_h,
            billtype: this.$route.query.billtype
          },
          mock: false,  
          contentType: "application/json",
          success: res=> {
            Indicator.close()
            this.nodeList = res.data
          },
          error: error=> {
            Indicator.close()
            Toast(error.message)
          }
        })
      },

      handleClick(node) {
        this.$router.push({
          name: 'approver-list',
          query: {
            pk_h: this.$route.query.pk_h,
            nodeId: node.pk_node,
            flowId: node.pk_flow,
            billtype: this.$route.query.billtype,
            node: node  //暂时画界面用
          }
        })
      },

      //返回首页
      goApp() {
        MessageBox.confirm('返回将无法提交单据').then(action => {
          this.$router.go(-1)
        });
      },
    }
  }
</script>

<style lang='less' scoped>
header{
  position: fixed;
  width: 100%;
  height: .88rem;
  line-height: .88rem;
}
section{
  margin-top: .88rem;
  ul{
    li{
      height: 1.2rem;
      line-height: 1.2rem;
      border-bottom: 1px solid #d4d4d4;
      padding: 0 .22rem;
      background: #fff;
      i{
        float: right;
      }
    }
    li:hover{
      background: #ddd;
    }
  }
}
footer{
  position: fixed;
  width: 100%;
  height: 1rem;
  left: 0;
  bottom: 0;
  background: #0caef5;
  font-size:18px;
  color:#ffffff;
  line-height: 1rem;
  letter-spacing:-0.39px;
  text-align:center;
  span{
    float: left;
    height: 100%;
    width: 100%;
    
  }
}
</style>