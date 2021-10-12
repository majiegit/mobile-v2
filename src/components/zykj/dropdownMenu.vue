<!--证明审核-->
<template>
  <div class="outDiv">
  <div id="box" class="box" @click="chooseBox('box',zmName.length)">
    <ul>
      <li v-for="(z,index) in zmName" @click="index!=0&&chooseItem('box',index)" :style="z.flag&&index!=0?'color:#2479ED':''">
        {{ z.name }}
        <img :src="yes" class="yesImg" v-if="z.flag&&index!=0">
      </li>
    </ul>
  </div>
  <div id="box1" class="box" @click="chooseBox('box1',statusArr.length)">
      <ul>
        <li v-for="(s,index) in statusArr" @click="index!=0&&chooseItem('box1',index)" :style="s.flag&&index!=0?'color:#2479ED':''">
          {{ s.name }}
          <img :src="yes" class="yesImg" v-if="s.flag&&index!=0">
        </li>

      </ul>
    </div>
  </div>
</template>
<script>
import { ajax, fetchData, getStorage, setStorage, clearStorage} from 'hr-utils'

import {proveRequest} from "../../utils/util";
export default {
  name: 'dropdownMenu',
  components: {
  },
  data () {
    return {
        statusArr:[
          {
            name:'未审核',id: 0
          },
          {
            name:'审核通过',id:1
          },
          {
            name:'审核不通过',id:2
          }
        ],
      zmName:[]

    }
  },
  computed:{

  },
  mounted (){
  },
  methods:{
    //点击初始值给高度
    chooseBox(id,size){
      if(document.getElementById(id).style.height==50*parseInt(size)+'px'||!document.getElementById(id).style.height){
        document.getElementById(id).style.height='50px';
      }else{
        document.getElementById(id).style.height=50*parseInt(size)+'px';
      }
    },
    //第一列数据
    init(data){
      this.zmName = [...this.zmName,...data]
      this.zmName.forEach(val=>{this.$set(val,'flag',false)})
      this.$set(this.zmName[0],'flag',true)
      this.statusArr.forEach(val=>{this.$set(val,'flag',false)})
      this.$set(this.statusArr[0],'flag',true)
      this.getData();
    },
    //选择单独给样式
    chooseItem(type,index){
      switch (type){
          case 'box':
            this.zmName.forEach(val=>{this.$set(val,'flag',false)})
            this.$set(this.zmName[index],'flag',true)
            this.zmName=[...this.zmName.filter(val=>val.flag),...this.zmName.filter(val=>!val.flag)]
            break;
          case 'box1':
            this.statusArr.forEach(val=>{this.$set(val,'flag',false)})
            this.$set(this.statusArr[index],'flag',true)
            this.statusArr=[...this.statusArr.filter(val=>val.flag),...this.statusArr.filter(val=>!val.flag)]
            break;
        }
        this.getData();
    },
    getData(){
      proveRequest({
        url : 'prove/proveSubmit/list',
        method : 'POST',
        mock : false,
        param:{userId:getStorage('userID'),proveId:this.zmName.find(val=>val.flag).id,status:this.statusArr.find(val=>val.flag).id},
        contentType : "application/json; charset=utf-8",
        success :(data)=>{
          this.$emit('audit',{data:data.data})
        },
      })

    }
  }
}
</script>
<style lang="less" scoped>
.outDiv{
  display: flex;
  justify-content: space-between;
  height:50px;
  position: relative;
  width: 100%;
}
.box{width:49.5%; height:50px; overflow:hidden; cursor: pointer; transition: all 0.35s; box-shadow: 0px 7px 7px -7px #cecece;z-index: 99}
.box ul{list-style:none; margin:0; padding:0;}
.box ul li{width:100%; height:50px; line-height: 50px; text-align: left;  background:#ffffff; color:#000;font-size: 12px;padding: 0 15px;position: relative}
li:nth-child(2) {  padding-top: 10px  }
li:nth-child(1) {
  text-align: center !important;
  font-size: 15px !important;
  box-shadow: 0px 7px 7px -7px #cecece;
  position: relative;
  &:after{
    content: '';
    display: block;
    position: absolute;
    border-bottom: 1px solid #000;
    border-right: 1px solid #000;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    width: 5px;
    height: 5px;
    top: 21px;
    right: 18px;
  }
}
.yesImg{
  width: 8px;
  height: 8px;
  position: absolute;
  right: 10px;
  top: 20px;
}




</style>
