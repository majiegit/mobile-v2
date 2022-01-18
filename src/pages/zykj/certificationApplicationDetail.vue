<!--证明审核-->
<template>
  　<div style="overflow-y: scroll;overflow-x: hidden">
    <myHeader :title="title" ></myHeader>
    <div style="width: 90%; height: 50px; margin:15px 15px 0px 15px;float: left;">
      <div style="float: left; width: 20%; height: 100%; font-size: 12px;">审批流程：</div>
      <div class="check_user" style="width: 80%; height: 50px; float:left; overflow-x: auto; overflow-y: hidden;  white-space: nowrap;">
        <div style="width: 95px; height: 100%; display: inline-block;" v-for="(item,index) in checkList" :key="index">
          <div style="float: left; width: 100%; height: 50%; ">
            <div style="width: 20px; height: 20px;  border-radius: 50%; text-align: center; line-height: 20px; float: left; background: #E04F4F; color: #fff;">
              <van-icon name="success" size="20px"/>
            </div>
            <div style="width: 75px; height: 3px; float: left; background: #E04F4F; position: relative; top: 8px" v-if="index !== checkList.length - 1">
            </div>
          </div>
          <div style="width: 100%; float: left; padding-top: 5%; font-size: 12px; position: relative; color: #333333;">{{item.USER_NAME}}</div>
        </div>
      </div>
    </div>
  <div class="outDiv">
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
import myHeader from '../../components/zykj/my-header-lihao';
import { Toast } from 'mint-ui';
import { ajax, fetchData, getStorage, setStorage, clearStorage} from 'hr-utils'
import {proveRequest} from '../../utils/util'
import {proveHost,} from '@/utils/hostConfig.js'
export default {
  name: 'certificationApplicationDetail',
  components: {
    myHeader,
    picker
  },
  data () {
    return {
      title:'证明详情',
      datas:[],
      active: 1,
      pName:this.$route.query.data.pName,
      remark:this.$route.query.data.remark,
      proveId:this.$route.query.data.proveId,
      imgSrc:this.$route.query.data.proveLook,
      lists:[],//picker
      checkList: [],
      prove: {}
    }
  },
  computed:{

  },
  mounted (){
    this.prove = this.$route.query.data
    console.log(this.prove)
    this.getCheckStep(this.prove.proveId)
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
    getCheckStep(proveId){
      proveRequest({
        url : 'prove/sysProve/checkUserList',
        method : 'GET',
        mock : false,
        param:{proveId: proveId},
        contentType : "application/json; charset=utf-8",
        success :(data)=>{
          this.checkList = data.data
        },
      })
    },
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
          window.location.href = proveHost + 'prove' + this.$route.query.data.provePath
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
  float: left;
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
