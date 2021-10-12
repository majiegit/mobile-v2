<template>
　<div>
  <van-popup v-model="show" position="bottom" :style="{ height: '40%' }"  >
    <van-picker
    title=""
    show-toolbar
    :columns="columns"
    @confirm="onConfirm"
    @cancel="onCancel"
  />
  </van-popup>
  </div>
</template>

<script>
import Vue from 'vue';
import {Picker} from 'vant';
import { Popup } from 'vant';
Vue.use(Popup);
Vue.use(Picker);
export default {
  data(){
    return{
      columns: [],
      show:false,
      type:'',//组件类型
      data:[],//父组件原数据
    }
  },
  filters:{

  },
  mounted (){

  },
  methods:{
    //点击zj后弹出组件
    zjClick(data, type) {
      this.type = type;
      if (data) this.data = data;
      switch (type) {
        case 'zbfl'://指标分类组件
          this.columns = data.map(val => val.refname)
          break;
        case 'glmb'://关联目标
          if (data) {
            this.columns = data.map(val => val.refname)
          } else {
            this.columns = []
          }
          break;
        case 'khr'://考核人分类
          this.columns = data.map(val => val.dimtypename)
          break;
        case 'queryFirstArr'://绩效期间
          this.columns = []
          data.unshift({
            periodid: "",
            periodname: "全部"
          })
          this.columns = data.map(val => val.periodname)
          break;
        case 'querySecondArr'://绩效方案
          this.columns = []
          data.unshift({
            schemeid: "",
            schemename: "全部"
          })
          this.columns = data.map(val => val.schemename)
          break;
        case 'shzt'://审核状态
          this.columns = data.map(val => val.name)
          break;
        case 'statistics'://部门假勤统计
          this.columns = data.map(val => val.name)
          break;
        case 'calendar'://部门假勤统计
          this.columns = data.map(val => val.staffName)
          break;
        case 'workType'://选择编辑排班类型
          this.columns = data.map(val => val.name)
          break;
        case 'echarts'://统计图
          this.columns = data.map(val=>val.refname)
          break;
        case 'departmentPersonnelInformation'://部门人员信息
          this.columns = data.map(val=>val.hashValue).map(val1=>val1.name)
          break;
        case 'certificationSubmit'://开证明
          this.columns = data.map(val=>val.name)
        break;
      }
      this.show = true;
    },
    /*
    * 点击取消
    *
    * */
    onCancel(){

      this.show=false
    },
    /*
    * 点击确认
    *
    * */
    onConfirm(e,index){
      if(this.type=='certificationSubmit'){
        this.$emit('pickerClick',{data:this.data[index],type:'certificationSubmit'})
      }else if(this.type=='departmentPersonnelInformation'){
        this.$emit('pickerClick',{data:this.data[index],type:'departmentPersonnelInformation'})
      }else if(this.type=='echarts'){
        this.$emit('pickerClick',{data:this.data[index],type:'echarts'})
      }else if(this.type=='workType'){
        this.$emit('pickerClick',{data:this.data[index],type:'workType'})
      }else if(this.type=='calendar'){
        this.$emit('pickerClick',{data:this.data[index],type:'calendar'})
      }else if(this.type=='statistics'){
        this.$emit('pickerClick',{data:this.data[index],type:'statistics'})
      }else if(this.type=='queryFirstArr'){
        this.$emit('pickerClick',{data:this.data.find(val=>val.periodname==e),type:'queryFirstArr'})
      }else if(this.type=='querySecondArr'){
        this.$emit('pickerClick',{data:this.data.find(val=>val.schemename==e),type:'querySecondArr'})
      }else if(this.type=='shzt'){
        this.$emit('pickerClick',{data:this.data.find(val=>val.name==e),type:'shzt'})
      }else if(this.type=='khr'){
        this.$emit('pickerClick',{data:this.data.find(val=>val.dimtypename==e)})
      }else{
        this.$emit('pickerClick',{indi_parent:this.data.find(val=>val.refname==e).id,indi_parent_name:e})
      }
      this.show=false;
    },
  }
}
</script>
<style lang="less" scoped>

</style>
