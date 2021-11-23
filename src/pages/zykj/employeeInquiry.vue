<template>
  <div class="outDiv">
    <myHeader :title="title" :type="1"></myHeader>
    <div class="headBlue" @click="$router.push('employeeInquiryDetail')">
      <img src="./img/robort.png" class="headBlue_img">
      <div class="headBlue_text">
        <img src="./img/qp.png" class="headBlue_text_img">
        <div class="headBlue_text_text">遇到问题 ? 点我咨询</div>
      </div>
    </div>
    <div class="headBlueChild"></div>
    <div class="bodyClass">
      <div class="bodyClass_title">猜你想问</div>
      <div class="bodyClass_secondTitle">
        <div :class="[item.flag?'bodyClass_secondTitle_selected':'bodyClass_secondTitle_noSelected']" :style="index!=0?'margin-left:15px':''"
             @click="chooseQuestion(item.id)" v-for="(item,index) in questionsList">
          {{item.typeName}}
        </div>
      </div>
      <div class="bodyClass_body">
        <div class="bodyClass_body_child" v-for="(item,index) in problem" :key="index" @click="clickProblen(item)">{{item.name}}</div>
      </div>
      <div v-if="problem.length===0">
        <van-empty description="暂无内容" />
      </div>

    </div>
  </div>
</template>

<script>
import myHeader from '../../components/zykj/my-header';
import picker from '../../components/zykj/picker';
import { Indicator } from 'mint-ui';
import {proveRequest} from "../../utils/util";
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
      title:'员工问询',
      questionsList:[],
      problem:''
    }
  },
  computed:{

  },
  mounted (){
    this.init();
  },
  methods:{
    //查询问题分类
    init(){
      Indicator.open()
      proveRequest({
        url : 'prove/seProblemType/list',
        method : 'GET',
        mock : false,
        param:{isDelete:'Y'},
        contentType : 'application/json; charset=utf-8',
        success:(data)=>{
          this.questionsList=data.data;
          this.seProble( this.questionsList[0].id)
          Indicator.close()        }
      })
    },
    //查询问题下内容
    seProble(id){
      proveRequest({
        url:'prove/seProblem/list',
        method:'GET',
        mock: 'false',
        param: {typeId:id,isDelete:'Y'},
        contentType : 'application/json; charset=utf-8',
        success:(data)=>{
          this.problem= data.data
        }
      })
    },
    //点击问题分类
    clickProblen(item){
      this.$router.push({name:'employeeInquiryDetail',query:{id:item.id}})
    },
    //选择标题 索引index
    chooseQuestion(index){
      this.seProble(index)
    },
  }
}
</script>

<style lang="less" >
.outDiv{
  position: relative;
  overflow-x: hidden;
  overflow-y: scroll;
}
.headBlue{
  background-color: #2479ED;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  &_img{
    width: 53px;
    height: 95px;
  }
  &_text{
    width: 200px;
    height: 45px;
    position: relative;
    margin-left: 15px;
    font-size: 14px;
    color: #fff;
    display: flex;
    align-items: center;
    &::after{
      content: '';
      display: block;
      position: absolute;
      border-top: 2px solid #fff;
      border-right: 2px solid #fff;
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
      width: 8px;
      height: 8px;
      top: 18px;
      right: 20px;
    }
    &_img{
      position: absolute;
      width: 200px;
      height: 45px;

    }
    &_text{
      position: absolute;
      left: 20px;
    }
  }
}

.headBlueChild{
  height: 35px;
  background-color: #2479ED;
  border-radius:   0 0  50% 50%
}

.bodyClass{
  padding: 20px 15px;
  background-color: #fff;
  width: 100%;
  margin: 5px 0px;
  color: #333333;
  &_title{
    font-size: 17px;
    font-weight: bold;
  }
  &_secondTitle{
    font-weight: bold;
    font-size: 15px;
    margin-top: 20px;
    display: flex;
    align-items: center;
    &_selected{
      color: #2479ED;
      font-size: 15px;
    }
    &_noSelected{
      color: #333333;
      font-size: 15px;
    }
  }
  &_body{
    margin-top: 15px;
    width: 100%;
    border: 1px solid #D9D9D9;
    padding: 0 15px;
    &_child{
      height: 44px;
      border-bottom: 1px solid #D9D9D9;
      display: flex;
      align-items: center;
      font-size: 15px;
      color: #333333 ;
    }
  }
}
</style>
