<template>
  <div class="outDiv">
    <myHeader :title="title" :type="1"></myHeader>
    <div class="outDiv_body">
      <div class="outDiv_body_first">
        <img src="./img/select.png" class="outDiv_body_first_img">
        <div>{{problem.name}}</div>
      </div>
      <div class="outDiv_body_second" v-html="problem.content"></div>
      <div class="outDiv_body_third">相关推荐</div>
      <div class="outDiv_body_forth">社保新参保</div>
      <div class="outDiv_body_forth">社保新参保</div>
      <div class="outDiv_body_forth">社保新参保</div>
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
    problem:[]
    }
  },
  computed:{

  },
  mounted (){
    this.init();
  },
  methods:{
    init(){
      Indicator.open()
      proveRequest({
        url: 'prove/seProblem/getByProblemId',
        method: 'GET',
        mock: 'false',
        param: {problemId: this.$route.query.id },
        contentType: 'application/json; charset=utf-8',
        success: (data) => {
          this.problem= data.data
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

</style>
