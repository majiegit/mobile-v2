<!--证明提交-->
<template>
  　<div style="overflow-y: scroll;overflow-x: hidden">
    <myHeader :title="title" ></myHeader>
    <div class="seachDiv">
      <div class="seachDiv_first inputAfter" @click="picker()">{{ listSelectedName }}</div>
    </div>
    <div>
      <van-cell-group v-if="fieldList.length !== 0">
        <van-field v-model="item.fieldValue" :label="item.fieldName" :placeholder="'请输入'+ item.fieldName" v-for="(item, index) in fieldList" :key="index"/>
      </van-cell-group>
    </div>
   <textarea class="textClass" v-model="remark" placeholder="请描述你开具证明的用途">{{remark}}</textarea>
    <div class="imgDiv">
      <img :src="imgSrc" class="imgDiv_img "/>
    </div>
    <div style="height: 60px"></div>
    <div class="bottomButtonDiv">
      <div class="bottomButtonDiv_left" @click="pz(0)">取消</div>
      <div class="bottomButtonDiv_right" @click="pz(1)">提交</div>
    </div>
  <picker ref="picker" @pickerClick="pickerClick"></picker>
</div>
</template>

<script>
import picker from '../../components/zykj/picker.vue';
import myHeader from '../../components/zykj/my-header-lihao';
import { Toast,Indicator } from 'mint-ui';
import { ajax, fetchData, getStorage, setStorage, clearStorage} from 'hr-utils'
import {proveRequest} from '../../utils/util'
import Vue from 'vue';
import { ImagePreview } from 'vant';
// 全局注册
Vue.use(ImagePreview);
import { Search } from 'vant';
import { Calendar } from 'vant';
Vue.use(Calendar);
Vue.use(Search);
export default {
  name: 'certificationSubmit',
  components: {
    myHeader,
    picker
  },
  data () {
    return {
      fieldList: [],
      zmSelected:require('../../components/zykj/img/zmSelected.png'),
      yes:require('../../components/zykj/img/yes.png'),
      title:'开证明',
      lists:[],//证明列表
      listSelectedName:'',//已选中证明名城
      proveId:'',//已选中证明id
      imgSrc:'',//证明图片
      remark:'',//备注
      userId: getStorage('userID')
    }
  },
  computed:{

  },
  mounted (){

    this.init()
  },
  watch: {
    proveId(val) {
      this.getProveLook(val)
      this.getProveField(val)
    }
  },
  methods:{
    getProveLook(proveId) {
      Indicator.open()
      proveRequest({
        url : 'prove/sysProve/view',
        method : 'GET',
        param: { proveId: proveId, userId: this.userId},
        mock : false,
        contentType : "application/json; charset=utf-8",
        success :(data)=>{
          this.imgSrc = data.data.image
          Indicator.close()
        },
        error :(data) =>{
          Indicator.close()
        }
      })
    },
    getProveField(proveId) {
      proveRequest({
        url : 'prove/sysProveField/list',
        method : 'GET',
        param: { proveId: proveId, type: 'temp'},
        mock : false,
        contentType : "application/json; charset=utf-8",
        success :(data)=>{
          this.fieldList = data.data
        },
        error :(data) =>{
        }
      })
    },
    init(){
      Indicator.open()
      proveRequest({
        url : 'prove/sysProve/list',
        method : 'GET',
        mock : false,
        contentType : "application/json; charset=utf-8",
        success :(data)=>{
          this.lists = data.data;
          this.listSelectedName =  this.lists[0].name
          this.proveId =  this.lists[0].id
          Indicator.close()
        },
      })
    },
    picker(){
      this.$refs.picker.zjClick(this.lists,'certificationSubmit')
    },
    pickerClick(e){
      this.listSelectedName = e.data.name
      this.proveId = e.data.id
    },
    //同意 0取消 1同意
    pz(type){
      switch (type){
        case 0:
          this.remark=''
          break;
        case 1:
          if(!this.remark){
            Toast('请描述你开具证明的用途')
            return;
          }
          Indicator.open()
          proveRequest({
            url : 'prove/proveSubmit/submit',
            method : 'POST',
            mock : false,
            param:{proveId:this.proveId,remark:this.remark,userId: getStorage('userID'),userName:getStorage('userName'),
              sysProveFieldExpands: this.fieldList},
            contentType : "application/json; charset=utf-8",
            success :(data)=>{
              Indicator.close()
              Toast('提交成功')
              setTimeout(()=>{
                this.$router.go(-1);
              },500)
            },
          })
          break;
      }
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
.seachDiv{
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &_first{
    width: 100%;
    height: 50px;
    font-size: 15px;
    padding:0 10px;
    border-radius: 5px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    &::after{
      content: '';
      display: block;
      position: absolute;
      border-top: 2px solid #636363;
      border-right: 2px solid #636363;
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
      width: 8px;
      height: 8px;
      top: 20px;
      right: 15px;
    }
  }
  &_second{
    font-size: 12px;
    display: flex;
    align-items: center;
  }
}
.textClass{
  width: 100%;
  padding: 10px 15px;
  height: 150px;
  margin-top: 15px;
  font-size: 13px;
}
.imgDiv{
  margin: 15px 10px;
  &_img{
    width: 100%;
    object-fit: cover;
  }
}
.bottomButtonDiv{
  position: fixed;
  left: 15px;
  right: 15px;
  bottom: 20px;

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
    background-color: #E04F4F;
    height: 40px;
    border-radius: 20px;
  }
  &_right{
    width: 48%;
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #20D462;
    height: 40px;
    border-radius: 20px;
  }
}
</style>
