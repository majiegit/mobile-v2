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
       <div class="divRow_right">{{$route.query.data.pName}}</div>
     </div>
     <div class="divRow" style="align-items: start">
       <div>证明内容：</div>
       <textarea class="divRow_text" v-model="$route.query.data.remark">{{$route.query.data.remark}}</textarea>
     </div>
   </div>
  <div class="imgDiv">
    <img :src="$route.query.data.proveLook" class="imgDiv_img "/>
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
import { Toast } from 'mint-ui';
import { ajax, fetchData, getStorage, setStorage, clearStorage} from 'hr-utils'
import {proveRequest} from '../../utils/util'
import Vue from 'vue';
import { Search } from 'vant';
import { Calendar } from 'vant';
Vue.use(Calendar);
Vue.use(Search);
export default {
  name: 'certificationAuditDetail',
  components: {
    myHeader,
    dropdownMenu
  },
  data () {
    return {
      title:'证明审核',
      datas:[]
    }
  },
  computed:{

  },
  mounted (){
     console.log(JSON.stringify(this.$route.query.data))

  },
  methods:{
    //1批准 2不批准
    pz(type){
      proveRequest({
        url : 'prove/proveSubmit/check',
        method : 'POST',
        mock : false,
        param:{ids:[this.$route.query.data.id],status:type},
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
      height: 60px;
      padding: 10px;
      border: 1px solid #C9C9C9;
      border-radius: 3px;
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
