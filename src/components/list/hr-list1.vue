<template>

  <div>
      <div class="h-listgroup"   v-for="item in items">
          <div class="h-title">
              <span class="h-left">{{item.title}}</span><span class="h-right h-blue">{{item.maney}}</span>
          </div>
          <div class="h-body" v-if="!!item.data&&item.data.length>0">
              <div class="h-list" v-for="list in item.data">
                  <span class="h-left">{{list.name}}</span><span class="h-right">{{list.maney}}</span>
              </div>
          </div>
      </div>

  </div>
  

</template>   

<script>

/*// 数据格式,dom数据在hr-list1.js中
[{
  "title":"税前收入22",
  "maney":"2300",
  "data":[
      {
      "name":"请假扣款55",
      "maney":"5200.15"
      }
    ]
}]
*/
  
  export default {
    name:'hr-list1',
    props:['listdata'],
    data(){
        return {
            items:[]
        }
    },   
    watch: {
      items() {
        this.init();
      }
    },     
    mounted (){
        this.init();
    },
    methods:{
      init() {
        this.items =this.listdata;
      }
    }

  };
</script>


<style lang='less'scoped>

 /*<!-- 列表样式 -->*/
    .h-left {
        float: left;
    }
    .h-right {
        float: right;
    }
    .h-blue {
        color: #0CAEF5;
        font-size: 0.32rem;
    }
    .h-listgroup {
        background: #fff;
        border-radius: 5px;
        margin: 0 0.2rem 0.2rem;
        padding: 0.2rem;
        .h-title {
            width:100%;
            height: 0.9rem;
            padding: 0 0.1rem;
            line-height: 0.9rem;
            font-size: 0.3rem;
            font-weight: 600; 
            color:#333;
        }
        .h-body {
            padding-top: 0.3rem;
            border-top: 1px solid #d5d5d5;
            .h-list {
                height: 0.6rem;
                width: 100%;
                padding: 0 0.1rem;
                line-height: 0.6rem;
                font-size: 0.28rem;
                color:#666;
            }
        }
    }
    
</style>
