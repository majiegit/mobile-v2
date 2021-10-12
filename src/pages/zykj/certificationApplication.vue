<!--证明审核-->
<template>
  　<div style="overflow-y: scroll;overflow-x: hidden">
  <myHeader :title="title" ></myHeader>
  <div class="bodyDiv" v-for="(d,index) in datas" @click.stop="$router.push({name:'certificationApplicationDetail',query:{data:d}})">
    <div class="bodyDiv_child">
      <div style="width: 50%">证明名称：{{ d.pName }}</div>
      <div style="width: 50%">申请人：{{ d.userName }}</div>
    </div>
    <div class="bodyDiv_child">
      <div style="width: 50%" >状态：<span v-if="d.status==0">未审核</span><span style="color: #2479ED" v-if="d.status==1">审核通过</span><span style="color: #ED244A " v-if="d.status==2">审核未通过</span></div>
      <div style="width: 50%">申请时间：{{ d.createTime.substring(0,11) }}</div>
    </div>
  </div>
  <div style="height: 80px"></div>
  <div class="bottomButtonDiv">
    <div class="bottomButtonDiv_center" @click="$router.push('certificationSubmit')">开证明</div>
  </div>
</div>
</template>

<script>
import dropdownMenu from '../../components/zykj/dropdownMenu.vue';
import myHeader from '../../components/zykj/my-header';
import { ajax, fetchData, getStorage, setStorage, clearStorage} from 'hr-utils'
import {proveRequest} from '../../utils/util'
import Vue from 'vue';
import { Search } from 'vant';
import { Calendar } from 'vant';
Vue.use(Calendar);
Vue.use(Search);
export default {
  name: 'certificationApplication',
  components: {
    myHeader,
    dropdownMenu
  },
  data () {
    return {
      userId: getStorage("userID"),
      zmSelected:require('../../components/zykj/img/zmSelected.png'),
      yes:require('../../components/zykj/img/yes.png'),
      title:'证明申请',
      datas:[]
    }
  },
  computed:{

  },
  mounted (){

    this.init()
  },
  methods:{
    chooseBox(id){


    },
    init(){
      proveRequest({
        url : 'prove/proveSubmit/list',
        method : 'POST',
        mock : false,
        param:{status:"", userId: this.userId},
        contentType : "application/json; charset=utf-8",
        success :(data)=>{
         this.datas = data.data
          proveRequest({
            url : 'prove/sysProve/list',
            method : 'GET',
            mock : false,
            contentType : "application/json; charset=utf-8",
            success :(data)=>{
              this.bqs=data.data
              this.datas.forEach(val=>{
                this.$set(val,'flag',false)
                this.$set(val,'pName',this.bqs.find(val1=>val1.id ==val.proveId ).name)
              })
            },
          })

        },
      })

    },
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
  padding: 0px 15px 0px 15px;
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
  bottom: 30px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;

  &_center{
    width: 100%;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #208CEB;
    height: 45px;
    border-radius: 20px;
  }
}
</style>
