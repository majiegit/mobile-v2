<template>
  <div class="outDiv">
    <div class="um-header">
      <a class="um-back"  @click="goToChatBox()"></a>
      <h3 style="color: #ffffff">{{title}}</h3>
    </div>
    <div class="outDiv_body">
      <div class="outDiv_body_first">
        <img src="./img/select.png" class="outDiv_body_first_img">
        <div>{{problem.name}}</div>
      </div>
      <div class="outDiv_body_second" v-html="problem.content"></div>
      <div class="outDiv_body_third">附件</div>
      <div class="outDiv_body_forth" v-for="item in problemFuJian" @click="clickFuJian(item)">{{item.fileName}}</div>
      <div class="outDiv_body_third" style="margin-top: 10px;">相关推荐</div>
      <div class="outDiv_body_forth" v-for="item in problemTuiJian" @click="clickProblen(item)">{{item.name}}</div>
      <div class="outDiv_body_row"></div>
      <div class="outDiv_body_five">
         <div class="outDiv_body_five_first">
           <img src="./img/collect.png" class="outDiv_body_five_first_img"/>
           <div>已收藏</div>
         </div>
        <div class="outDiv_body_five_second">
          <div class="outDiv_body_five_second_left">
            <img src="./img/left.png" class="outDiv_body_five_second_left_img">
            <div class="outDiv_body_five_second_left_text">有帮助</div>
          </div>
          <div class="outDiv_body_five_second_right">
            <img src="./img/right.png" class="outDiv_body_five_second_right_img">
            <div class="outDiv_body_five_second_right_text">没帮助</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import myHeader from '../../components/zykj/my-header';
import picker from '../../components/zykj/picker';
import { Indicator } from 'mint-ui';
import {proveRequest} from "../../utils/util";
import {proveHost,} from '@/utils/hostConfig.js'
export default {
  name: 'employeeManagementMenu',
  components: {
    myHeader,
    picker
  },
  data () {
    return {
      title:'员工问询',
      problem: [],
      problemTuiJian: [],
      problemId: '',
      arr: [],
      problemFuJian: []
    }
  },
  watch: {
    problemId(val) {
      this.init(val);
      this.xiangGuanTuiJian(val);
      this.xiangGuanFuJian(val);
    }
  },
  computed:{

  },
  mounted (){
    this.problemId = this.$route.query.id
    this.arr = this.$route.query.arr
  },
  methods:{
    goToChatBox(){
      this.$router.push({name:'chatBox',query:{arr: this.arr}})
    },
    // 附件管理
    clickFuJian(item) {
      window.location.href = proveHost + 'prove' + item.filePath
    },
    //点击问题分类
    clickProblen(item){
      this.problemId = item.id
    },
    init(id){
      Indicator.open()
      proveRequest({
        url: 'prove/seProblem/getByProblemId',
        method: 'GET',
        mock: 'false',
        param: {problemId: id },
        contentType: 'application/json; charset=utf-8',
        success: (data) => {
          this.problem= data.data
          Indicator.close()
        }
      })
    },
    xiangGuanTuiJian(id) {
      Indicator.open()
      proveRequest({
        url: 'prove/seProblem/getByProblemIdRelevant',
        method: 'GET',
        mock: 'false',
        param: {problemId:  id },
        contentType: 'application/json; charset=utf-8',
        success: (data) => {
        this.problemTuiJian= data.data
          Indicator.close()
        }
      })
    },
    xiangGuanFuJian(id) {
      Indicator.open()
      proveRequest({
        url: 'prove/seProblemFile/list',
        method: 'GET',
        mock: 'false',
        param: {problemId:  id },
        contentType: 'application/json; charset=utf-8',
        success: (data) => {
          this.problemFuJian= data.data
          Indicator.close()
        }
      })
    },

  }
}
</script>

<style lang="less" >
.outDiv{
  position: relative;
  overflow-x: hidden;
  overflow-y: scroll;
  &_body{
     margin: 17px 10px;
     background-color: #fff;
     border-radius: 9px 0 0 0;
     color: #333333;
    padding-bottom: 10px;
    &_first{
      height: 58px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #D4D4D4;
      width: 100%;
      padding: 0 15px;
      font-size: 18px;
      font-weight: bold;
      &_img{
        width: 25px;
        height: 25px;
        margin-right: 10px;
        margin-top: 1px;
      }
    }
    &_second{
      /*display: flex;*/
      align-items: center;
      font-size: 15px;
      margin: 17px 15px;
      padding-bottom: 15px;
      border-bottom: 1px solid #D4D4D4;
    }
    &_third{
      padding:0 15px;
      font-size: 18px;
      font-weight: bold;
    }
    &_forth{
      padding:22px 15px 0 15px;
      font-size: 15px;
      color: #2479ED;
    }
    &_row{
     margin: 22px 15px;
     border-bottom: 1px solid #D4D4D4;
    }
    &_five{
      padding:10px 15px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &_first{
        width: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-size: 12px;
        color: #97969B;
        &_img{
          width: 21px;
          height: 21px;
          margin-bottom: 10px;
        }
      }
      &_second{
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        width: 184px;
        &_left{
          width: 95px;
          height: 35px;
          position: relative;
          align-items: center;
          display: flex;
          justify-content: center;
          color: #227CE7;
          &_img{
            width: 95px;
            height: 35px;
            position: absolute;
          }
          &_text{
            z-index: 999;
            font-weight: bold;
          }
        }
        &_right{
          width: 95px;
          height: 35px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #D2511D;
          &_img{
            width: 95px;
            height: 35px;
            position: absolute;
          }
          &_text{
            z-index: 999;
            font-weight: bold;
          }
        }
      }
    }
  }
}

.um-header {
  width:100%;
  position: relative;
  height: 0.88rem;
  background: #2479ED;
  z-index: 5;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  border-bottom: 1px solid #ececec;
}
.um-back, .um-header-left {
  height: 0.88rem;
  line-height: 0.88rem;
  min-width: 40px;
  padding-top: 4px;
  left: 15px;
  position: absolute;
  top: 0px;
  font-weight: 500;
  color: #ffffff;
  text-decoration: none;
}
.um-back:before {
  content: "";
  display: inline-block;
  width: 12px;
  height: 12px;
  border-left: 2px solid #ffffff;
  border-bottom: 2px solid #ffffff;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
  margin: 0px -3px 0px 0px;
}
.um-header h3 {
  font-size: 17px;
  text-align: center;
  display: block;
  margin: 0;
  box-sizing: border-box;
  width: 6.5rem;
  margin: 0 auto;
  height: 44px;
  line-height: 44px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;
  pointer-events: none;
  color: #333333;
  font-weight: 500;
}
</style>
