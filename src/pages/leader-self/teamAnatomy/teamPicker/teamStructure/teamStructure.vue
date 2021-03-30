<template>
  <div id="teamAnatomy">
    <div class="structureBar">
      <div class="parentDept" @click='chooseAllDept(orgStack[orgStack.length - 1])'>{{ title }}</div>
      <div class="childrenDept"
           :key='childDept.pk_org'
           v-for='childDept in childDeptItem'
           @click='setChildDept(childDept)'
      >
        <div class="line"></div>
        <span>
            {{childDept.name}}
          </span>
        <i style="display:none" class="icon hrfont hr-check-mark" :ref='childDept.pk_org'></i>
        <a v-if='childDept.hasNextOrg'></a>
      </div>
    </div>
  </div>
</template>
<script>
  import { Toast, Indicator } from 'mint-ui';
  import { ajax, fetchData, getStorage,setStorage } from 'hr-utils'

  export default {
    components : {
    },
    name: 'structureData',
    data (){
      return {
        childDept:{},
        childDeptItem:[],
        nowdeptName :'',
        parentDept : {

        },
        returnIconStatus : 'close',
        defaultOrg: {}, // 默认组织
        title: '',
        orgStack: []
      }
    },

    watch :{
      orgStack() {
        let localOrg = this.orgStack[this.orgStack.length - 1]
        this.getChildDeptItem(localOrg.pk_org)
        this.title = this.orgStack[this.orgStack.length - 1].name
        this.$emit('setLabel', this.orgStack)
      }
    },

    mounted(){
      //获取默认子组织
      this.getDefaultOrgData()
    },

    methods : {
      getDefaultOrgData(){
        Indicator.open({
          spinnerType : 'fading-circle'
        })
        let _this = this
        fetchData({
          url : 'hrssc/portal/statistic/queryNextLeaderList',
          method : 'get',
          param : {},
          // mock : true,
          contentType : "application/json",
          success: data=> {
            Indicator.close()
            // 获取默认组织信息后，写缓存，
            if(data.data[0]){
              // 获取默认组织子组织
              this.defaultOrg = data.data[0]
              this.title = data.data[0].name;
              this.orgStack.push(data.data[0])
            }
          },
          error: error=> {
            Indicator.close()
            Toast(error.message)
          }
        })
      },

      //获取当前组织子组织信息
      getChildDeptItem(pk_org) {
        let _this = this,
          param = {
            pk_org : pk_org
          }

        Indicator.open({
          spinnerType : 'fading-circle'
        })

        fetchData({
          url : 'hrssc/portal/statistic/queryNextLeaderList',
          method : 'get',
          param : param,
          mock : false,
          contentType : "application/json",
          success: data => {
            Indicator.close()
            this.childDeptItem = data.data
          },
          error: error=>{
            Indicator.close()
            Toast(error.message)
          }
        })
      },

      // 点击子组织回调
      setChildDept(data) {
        let _this = this
        if (data.hasNextOrg) {
          _this.orgStack.push(data)
        } else {
          this.$refs[data.pk_org][0].style.display = ''
          setTimeout(() => {
            this.chooseAllDept(data)
          }, 100);
        }
      },

      // 点击全部部门  选定当前组织 返回绘图页
      chooseAllDept : function(data) {
        this.$router.push({
          name:'teamAnatomy',
          query : {
            deptId : data.pk_org,
            hasNextOrg : data.hasNextOrg,
            selectedWinId: this.$route.query.selectedWinId
          },
          params : {
            pk_name :  data.name,
            pk_org : data.pk_org
          }
        })
      },

      //返回上一级
      getParenDept() {
        // 组织栈中只有一个元素  则此元素为顶级组织  此时点击后退 直接退出
        if (this.orgStack.length <= 1) {
          this.closeTeamStru()
        } else {
          this.orgStack.pop()
        }
      },

      // 关闭组织选择
      closeTeamStru() {
        this.$router.push({
          name:'teamAnatomy',
          query : {
            deptId : ''
          },
          params : {
            pk_name :  this.orgStack[0].name
          }
        })
      },
    },
  }
</script>
<style lang='less' scoped>
  #teamAnatomy{
    width: 100%;
    background: #fff;
    .structureBar{
      border-bottom: 1px solid  #F3F3F3;
      .parentDept{
        height: 1rem;
        line-height: 1rem;
        background: #fff;
        padding-left: 0.8rem;
        border-top: 1px solid  #F3F3F3;
      }
      .childrenDept{
        height: 1rem;
        line-height: 1rem;
        margin-left: 1.6rem;
        border-top: 1px solid  #F3F3F3;
        .line{
          display: inline-block;
          position: relative;
          float: left;
          height: 0.56rem;
          width: 0.37rem;
          border-left: 1px solid  #d5d5d5;
          border-bottom: 1px solid  #d5d5d5;
          top: -0.1rem;
          margin-left: -.5rem;
        }
        span{
          float: left;
          width: 70%;
          height: 100%;
          overflow: hidden;
          white-space: nowrap;
          word-break: break-all;
          text-overflow: ellipsis;
        }
        i{
          margin-left: 5%;
          font-size: 12px;
          color: #fff;
          background: #227700;
          border-radius: 50%;
        }
        a{
          float: right;
          height: 40px;
          line-height: 40px;
          min-width: 40px;
          top: 0px;
          font-weight: 500;
          color: #108ee9;
          text-decoration: none;
        }
        a:before {
          content: "";
          display: inline-block;
          width: 8px;
          height: 8px;
          border-left: 2px solid #979797;
          border-bottom: 2px solid #979797;
          -webkit-transform: rotate(225deg);
          transform: rotate(225deg);
          margin: 0px 0px 0px 10px;
        }
      }
    }
    .mint-tab-item-label{
      font-size: 15px;
    }
  }



</style>

<style>
  .mint-indicator-wrapper {
    z-index: 1;
  }
</style>
