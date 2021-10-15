<!--证明审核-->
<template>
　<div style="overflow-y: scroll;overflow-x: hidden">
  <myHeader :title="title" ></myHeader>
  <dropdownMenu ref="dropdownMenu" @audit="audit"></dropdownMenu>
  <div class="bodyDiv" v-for="(d,index) in datas" @click.stop="$router.push({name:'certificationAuditDetail',query:{data:d}})">
      <div class="bodyDiv_child">
        <div style="width: 50%">申请人：{{ d.userName }}</div>
        <div style="width: 50%">申请时间：{{ d.createTime.substring(0,11) }}</div>
      </div>
      <div class="bodyDiv_child">
        <div style="width: 50%">证明名称：{{ d.pName }}</div>
        <div style="width: 50%" >状态：<span v-if="d.status==0">未审核</span><span style="color: #2479ED" v-if="d.status==1">批准</span><span style="color: #2479ED" v-if="d.status==2">不批准</span></div>
      </div>
      <img :src="d.flag?zmSelected:zmSelect" class="selectImg" @click.stop="chooseMore(index)">
  </div>
  <div style="height: 60px"></div>
  <div class="bottomButtonDiv">
    <div class="bottomButtonDiv_left" @click="pz(2)">不批准</div>
    <div class="bottomButtonDiv_right"  @click="pz(1)">批准</div>
  </div>
  </div>
</template>

<script>
import dropdownMenu from '../../components/zykj/dropdownMenu.vue';
import myHeader from '../../components/zykj/my-header';
import { Toast,Indicator } from 'mint-ui';
import { ajax, fetchData, getStorage, setStorage, clearStorage} from 'hr-utils'
import {proveRequest} from '../../utils/util'
import Vue from 'vue';
import { Search } from 'vant';
import { Calendar } from 'vant';
Vue.use(Calendar);
Vue.use(Search);
export default {
  name: 'certificationAudit',
  components: {
    myHeader,
    dropdownMenu
  },
  data () {
    return {
      zmSelected:require('../../components/zykj/img/zmSelected.png'),
      zmSelect:require('../../components/zykj/img/zmSelect.png'),
      title:'证明审核',
      datas:[],//全部数据
      bqs:[],//证明名称列表
    }
  },
  computed:{

  },
  mounted (){

    this.init()
  },
  methods:{
    init(){
      Indicator.open()
      proveRequest({
        url : 'prove/sysProve/list',
        method : 'GET',
        mock : false,
        contentType : "application/json; charset=utf-8",
        success :(data)=>{
          this.bqs=data.data
          this.$refs.dropdownMenu.init(data.data)
          Indicator.close()
        },
      })

    },
    //选择后的返回值
    audit(e){
      this.datas =e.data;
      this.datas.forEach(val=>{
        this.$set(val,'flag',false)
        this.$set(val,'pName',this.bqs.find(val1=>val1.id ==val.proveId ).name)
      })
    },
    //多选按钮
    chooseMore(index){
      if(this.datas[index].flag){
        this.datas[index].flag=false
      }else{
        this.datas[index].flag=true
      }
    },
    //1批准 2不批准
    pz(type){
      if(this.datas.filter(val=>val.flag).length==0){
        Toast('请选择证明进行审核')
        return
      }
      Indicator.open()
      proveRequest({
        url : 'prove/proveSubmit/check',
        method : 'POST',
        mock : false,
        param:{ids:this.datas.filter(val=>val.flag).map(val1=>val1.id),status:type},
        contentType : "application/json; charset=utf-8",
        success :(data)=>{
          Indicator.close()
          Toast(data.message)
           this.init();
        },
      })
    }
  }
}
</script>
<style lang="less" scoped>
table.gridtable {
  font-family: verdana,arial,sans-serif;
  font-size:11px;
  color:#333333;
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

tr>td{
  word-break: break-all;
}

.aaa{
  &::-webkit-scrollbar {
    display: none;
  }
}


#box{width:200px; height:50px; overflow:hidden; cursor: pointer; transition: all 0.35s;}
#box ul{list-style:none; margin:0; padding:0;}
#box ul li{width:198px; height:48px; line-height: 50px; text-align: center; border:1px red solid; background:#000000; color:white;}

.bodyDiv{
  height: 80px;
  margin: 10px;
  border-radius: 10px;
  background-color: #fff;
  padding: 0px 15px 0px 45px;
  font-size: 12px;
  position: relative;
  &_child{
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: left;
  }
}

.selectImg{
  position: absolute;
  left: 15px;
  top: 33px;
  width: 15px;
  height: 15px;
}

.bottomButtonDiv{
  position: fixed;
  left: 15px;
  right: 15px;
  bottom: 10px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  &_left{
    width: 48%;
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #F50000;
    height: 40px;
    border-radius: 20px;
  }
  &_right{
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
