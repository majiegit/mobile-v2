<template>
  <div class="outDiv" :style="'background-image:url('+bg+')' ">
    <myHeader :title="title" :type="1"></myHeader>
<!--    <img src="./img/bgroad.png" class="bgImg">-->
    <div class="firstDiv" @click="$router.push('employeeInquiry')">
      <img src="./img/firstCard.png" class="firstDiv_img">
      <div class="firstDiv_text mmFont">入职流程</div>
    </div>
    <div class="secondDiv">
      <img src="./img/secondCard.png" class="secondDiv_img">
      <div class="secondDiv_text mmFont">入职办理</div>
    </div>
    <div class="thirdDiv">
      <img src="./img/thirdCard.png" class="thirdDiv_img">
      <div class="thirdDiv_text mmFont">工卡办理</div>
    </div>
    <div class="forDiv">
      <img src="./img/forthCard.png" class="forDiv_img">
      <div class="forDiv_text mmFont">设备领取</div>
    </div>
  </div>
</template>

<script>
import myHeader from '../../components/zykj/my-header';
import picker from '../../components/zykj/picker';
import {httpRequest} from "../../utils/util";
import {Toast} from "vant";
import { Dialog } from 'vant';
export default {
  name: 'employeeManagementMenu',
  components: {
    myHeader,
    picker
  },
  data () {
    return {
     title:'入职地图',
      bg:require('./img/bgroad.png')
    }
  },
  computed:{

  },
  mounted (){
    this.init();
  },
  methods:{
    init(){

    },
  }
}
</script>

<style lang="less" >
.outDiv{
  position: relative;
  width: 100vw;
  overflow-x: hidden;
  overflow-y: scroll;
  background-size: 100% 100%;
  height: 812px;

}
.bgImg{
    position: fixed;
    left: 0;
    right: 0;
    top:40px;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    object-fit: cover;
  }
 .firstDiv{
   width: 168px;
   height: 120px;
   position: absolute;
   top: 70px;
   left: 6px;
   &_img{
     width: 168px;
     height: 120px;
     position: absolute;
   }
   &_text{
     position: absolute;
     font-size: 28px;
     top: 17px;
     left:23px;
     color: #fff;

   }
 }
 .secondDiv{
   width: 134px;
   height: 178px;
   position: absolute;
   top: 204px;
   right:1%;
   &_img{
     width: 134px;
     height: 178px;
     position: absolute;
   }
   &_text{
     position: absolute;
     font-size: 28px;
     top: 50px;
     left:10px;
     color: #fff;
   }
 }
 .thirdDiv{
   width: 166px;
   height: 178px;
   position: absolute;
   top: 386px;
   left:2%;
   &_img{
     width: 134px;
     height: 178px;
     position: absolute;
   }
   &_text{
     position: absolute;
     font-size: 28px;
     top: 50px;
     left:10px;
     color: #fff;
   }
 }
.forDiv{
  width: 166px;
  height: 178px;
  position: absolute;
  top: 605px;
  right:8%;
  &_img{
    width: 134px;
    height: 178px;
    position: absolute;
  }
  &_text{
    position: absolute;
    font-size: 28px;
    top: 50px;
    left:10px;
    color: #fff;
  }
}
</style>
