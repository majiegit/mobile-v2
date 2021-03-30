<template>
  <div id='teamPicker'>
    <header>
      <HrHeader
        :title='dept'
        lIcon='hr-Arrow2'
        rIcon='hr-close02'
        v-on:lcallBack='goReturn'
        v-on:rcallBack='goback'>
        >
      </HrHeader>
    </header>
    <nobr class="now-choose" id='mychoose'>当前选择:{{ labelText }}</nobr>
    <!-- <mt-navbar v-model="selected">
      <mt-tab-item id="1">管理类</mt-tab-item>
      <mt-tab-item id="2">股权类</mt-tab-item>
      <mt-tab-item id="3">事业部类</mt-tab-item>
    </mt-navbar>   -->

<!-- tab-container -->
    <!-- <mt-tab-container v-model="selected">
      <mt-tab-container-item id="1" > -->
      <div class="teamStructure">
        <teamStructure  
          v-on:deptName='setHeader' 
          ref='mt1' 
          v-on:setDefaultOrg = 'setDefaultOrg'
          v-on:setLabel = 'setLabel'
          > </teamStructure>
      </div>
      <!-- </mt-tab-container-item>

      <mt-tab-container-item id="2"> -->
        <!-- <teamStructure v-on:deptName='setHeader' ref='mt2' labelText='labelText' :strData='structureData1'> </teamStructure> -->
      <!-- </mt-tab-container-item>
      
      <mt-tab-container-item id="3"> -->
       <!-- <teamStructure v-on:deptName='setHeader' ref='mt3' labelText='labelText' :strData='structureData'> </teamStructure> -->
     <!--  </mt-tab-container-item>
    </mt-tab-container> -->

  </div>
</template>
<script>
  import { Navbar, TabItem, TabContainer, TabContainerItem } from 'mint-ui';
  import { HrHeader } from 'hr-ui'
  import teamStructure from './teamStructure/teamStructure'
    export default {
        components : {
          HrHeader, 
          Navbar,
          TabItem,
          TabContainer,
          TabContainerItem,
          teamStructure
        },
        name: 'teamPicker',
        data (){
          return {
            selected:'1',
            dept : '全部组织',
            labelText : ''
          }
        },
        watch : {
          //通过检测selected的改变，动态修改当前选择的部门名
          // selected(){
          //   let innerHTML;

          //   switch(this.selected) {
          //     case'1': {
          //       document.getElementById('mychoose').innerHTML ='当前选择：管理类'
          //       this.$refs.mt1.getChildDeptItem('hrssc/portal/statistic/queryOrgFirstLeader','')
          //       this.$refs.mt1.checkCache()
          //       this.$refs.mt1.returnIconStatus = 'close'
          //     }
          //     break;
          //     case'2': {
          //       document.getElementById('mychoose').innerHTML ='当前选择：股权类'
          //     }
          //     break;
          //     case'3': {
          //       document.getElementById('mychoose').innerHTML ='当前选择：事业部类'
          //     }
          //     break;
          //   }
          // },
        },
        mounted(){
            //this.structureData1 = structureData;
            //this.dept = this.$route.params.pk_name
        },
        methods : {
          // 退出当前选择页
          goback() {
            this.$router.push({
              name : 'teamAnatomy'
            })
          },

          // 返回上级组织
          goReturn() { 
            switch (this.selected) {
                case'1': {
                  this.$refs.mt1.getParenDept()
                }
                break;
                case'2': {
                  this.$refs.mt2.getParenDept()
                }
                break;
                case'3': {
                  this.$refs.mt3.getParenDept()
                }
                break;
              }
          },

          setHeader(deptName) {
            this.dept = deptName
          },

          setDefaultOrg(orgName){
            // this.labelText = orgName
          },

          setLabel(orgList){
            let arr = new Array()
            orgList.map((org) =>{
              arr.push(org.name)
            })
            this.labelText = arr.join('-')
          }
        },
        
    }
</script>
<style lang='less'>
  #teamPicker{
    header{
      position: fixed;
      width: 100%;
      height: 0.88rem;
      line-height: 0.88rem;
    }
    .mint-navbar{
      position: fixed;
      top: 1.48rem;
      left: 0;
      width: 100%;
      border-bottom: 1px solid #EDEDED;
      z-index: 1;
    }
    .mint-tab-container{
      position: fixed;
      top: 2.52rem;
      height: calc(~"100% - 2.64rem");
      width: 100%;
      overflow: scroll;
      background: #fff;
    }
    .is-selected{
      margin-bottom: 0px;
    }
    .now-choose{
      position: fixed;
      display: block;
      width: 100%;
      height: 0.6rem;
      top: 0.88rem;
      padding: 0 5%;
      line-height: 0.6rem;
      background: rgba(255,157,5,0.1);
      text-align: center;
      font-size: 14px;
      color: #DC8500; 
      overflow: scroll;
    }
    .now-choose::-webkit-scrollbar {display:none}
    .mint-tab-item-label{
      font-size: 15px;
    }
    .teamStructure{
      position: fixed;
      top: 1.48rem;
      height: calc(~'100% - 1.48rem');
      width: 100%;
      left: 0;
      width: 100%;
      border-bottom: 1px solid #EDEDED;
      z-index: 1;
      overflow: scroll;
      background: #fff;
    }

  }


</style>