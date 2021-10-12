<!--证明审核-->
<template>
  　<div style="overflow-y: scroll;overflow-x: hidden">
  <myHeader :title="title" ></myHeader>
  <div class="outDiv">
    <div class="divRow">
      <div>审批流程：</div>
      <div class="divRow_right">--</div>
    </div>
    <div class="divRow">
      <div>证明名称：</div>
      <div class="divRow_picker">{{pName}}</div>
    </div>
    <div class="divRow" style="align-items: start">
      <div>证明说明：</div>
      <div class="divRow_text">{{remark}}</div>
    </div>
  </div>
  <div class="imgDiv">
    <img :src="imgSrc" class="imgDiv_img "/>
  </div>
  <div style="height: 60px"></div>
  <div class="bottomButtonDiv">
    <div class="bottomButtonDiv_left" :style="$route.query.data.status == 0 ? '':'background-color: #bdbdbd;'" @click="$route.query.data.status == 0 && pz('delete')">收回</div>
    <div class="bottomButtonDiv_right" :style="$route.query.data.status == 1 ? '':'background-color: #bdbdbd;'" @click="$route.query.data.status == 1 && pz('down')">下载证明</div>
  </div>
  <picker ref="picker" @pickerClick="pickerClick"></picker>
</div>
</template>

<script>
import picker from '../../components/zykj/picker.vue';
import dropdownMenu from '../../components/zykj/dropdownMenu.vue';
import myHeader from '../../components/zykj/my-header';
import { Toast } from 'mint-ui';
import { ajax, fetchData, getStorage, setStorage, clearStorage} from 'hr-utils'
import {proveRequest,proveHost} from '../../utils/util'
import Vue from 'vue';
import { Search } from 'vant';
import { Calendar } from 'vant';
Vue.use(Calendar);
Vue.use(Search);
export default {
  name: 'certificationApplicationDetail',
  components: {
    myHeader,
    dropdownMenu,
    picker
  },
  data () {
    return {
      title:'证明详情',
      datas:[],
      pName:this.$route.query.data.pName,
      remark:this.$route.query.data.remark,
      proveId:this.$route.query.data.proveId,
      imgSrc:this.$route.query.data.proveLook,
      lists:[],//picker
    }
  },
  computed:{

  },
  mounted (){
    // console.log(JSON.stringify(this.$route.query.data))
    proveRequest({
      url : 'prove/sysProve/list',
      method : 'GET',
      mock : false,
      contentType : "application/json; charset=utf-8",
      success :(data)=>{
        this.lists = data.data;
      },
    })
  },
  methods:{
    //delete收回 down下载
    pz(type){
      switch (type){
        case 'delete':
          proveRequest({
            url : 'prove/proveSubmit/delete',
            method : 'POST',
            mock : false,
            param:{id:this.$route.query.data.id},
            contentType : "application/json; charset=utf-8",
            success :(data)=>{
              Toast(data.message)
              setTimeout(()=>{
                this.$router.go(-1);
              },500)
            },
          })
           break;
        case 'down':
          window.location.href = proveHost + '/prove' + this.$route.query.data.provePath
          break;
      }

    },
    picker(){
      this.$refs.picker.zjClick(this.lists,'certificationSubmit')
    },
    pickerClick(e){
      this.pName = e.data.name
      this.proveId = e.data.id
      this.imgSrc =  e.data.tpLook
    },
    //保存修改.
    saveSubmit(){
      proveRequest({
        url : 'prove/proveSubmit/submit',
        method : 'POST',
        mock : false,
        param:{
          id:this.$route.query.data.id,
          userId:getStorage('userID'),
          proveId:this.proveId,
          remark:this.remark,
          userName:getStorage('userName'),
         },
        contentType : "application/json; charset=utf-8",
        success :(data)=>{
          Toast(data.message)
          setTimeout(()=>{
            this.$router.go(-1);
          },500)
        },
      })
    }
  }
}
</script>
<style lang="less" scoped>
.outDiv{
  margin: 15px;
  .divRow{
    display: flex;
    align-items: center;
    justify-content: start;
    margin-top: 15px;
    font-size: 12px;
    &_right{
      margin-left: 10px;
    }
    &_text{
      margin-left: 10px;
      width: 200px;
      min-height: 60px;
      padding: 10px;
      border: 1px solid #C9C9C9;
      background: #ffffff;
      border-radius: 3px;
    }
    &_picker{
      margin-left: 10px;
      width: 150px;
      height: 30px;
      padding: 0 10px;
      line-height: 30px;
      border: 1px solid #C9C9C9;
      border-radius: 3px;
      background-color: #fff;
      position: relative;
    }
  }
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
