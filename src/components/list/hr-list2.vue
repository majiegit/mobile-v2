<template>

<div class="hr-list2">

  <div class="h-list-group" >
    <div class="h-list-title">
      <div class="h-title-content">
        <h3>{{moduleData.name}}</h3>
        <span class="h-title-mark">信息待审批</span> 
        <span class="h-title-edit"><i class="icon hrfont hr-edit2"></i></span>
      </div>
    </div>
    <div class="h-list-body" v-if="listtype==1">
      
        <hrList3  :listmodule="modulelist" v-for="modulelist in moduleData.tablefield"></hrList3>
    </div>

    <div class="h-list-body" v-if="listtype==2" >
      <div class="h-term-group" v-for="(termgroup, index) in infoData" v-show="index<2||termshow">
        <hrList3 :listmodule="modulelist" :listinfo="termgroup"  v-for="modulelist in moduleData.tablefield" ></hrList3>
      </div>

      <div class="h-term-more" v-if="infoData.length>1" @click="toggleShow">{{tremshowname}}</div>
      <div class="h-term-more" v-if="infoData.length==0" >暂无数据</div>
     
    </div>

  </div>


   
<!--   <div class="h-list-group" >
    <div class="h-list-title">
      <div class="h-title-content">
        <h3>{{moduleData.name}}</h3>
        <span class="h-title-mark">信息待审批</span> 
        <span class="h-title-edit"><i class="icon hrfont hr-edit2"></i></span>
      </div>
    </div>
    <div class="h-list-body" v-if="listtype==1">
      
        <hrList3  :listdata="modulelist" v-for="modulelist in moduleData.tablefield"></hrList3>
    </div>

    <div class="h-list-body" v-if="listtype==2" >
      <div class="h-term-group" v-for="termgroup in 3" v-show="termgroup<2||termshow">
        <hrList3 :listdata="modulelist"  v-for="modulelist in moduleData.tablefield" ></hrList3>
      </div>

      <div class="h-term-more" @click="toggleShow">{{tremshowname}}</div>
     
    </div>

  </div> -->



</div>

</template>
<script>
/*
使用说明
引入组件html zhanghua-2017-08-25
    <hrList2 :moduleData="n" listtype="1"></hrList2>
    

 */



import hrList3 from './hr-list3.vue'
    

    export default {
      name:'hr-list2',
        components: {
            hrList3
        },
         props:["listtype","moduleData","infoData"],
        data(){
            return {
                termshow:false,//控制是否显示所有字段
                tremshowname:"显示更多",//显示更多数据字段
                num:2,//默认显示条数
            }
        },       
        watch:{

        },
        mounted (){
            

        },
        methods:{
            toggleShow(){//切换显示与隐藏字段
                this.termshow=!this.termshow;
                if(this.termshow){
                    this.tremshowname="隐藏更多"
                }else{
                    this.tremshowname="显示更多"
                }
            }
 
        }
        

    };
</script>


<style lang='less'scoped>
    @0CAEF5-color : #0CAEF5;
    @b2b2b2-color : #b2b2b2;
    .hr-list2{
        .h-list-group{
          background:#fff;
          .h-list-title {
            width: 100%;
            height: 0.8rem;
            border-bottom: 1px solid #e4e4e4;
            position: relative;
            overflow: hidden;
            .h-title-content {
              width:100%;
              height: 0.4rem;
              line-height: 0.4rem;

              position: relative;
              left: 0.12rem;
              top: 0.2rem;

              border-left: 0.08rem solid #1baede;
              font-size: 0.34rem;
              color: #343434;
              text-indent: 0.5em;
              h3{
                display:inline-block;
                font-size: 0.34rem;
                line-height:0.4rem;
              }
              .h-title-mark{
                font-size: 0.28rem;
                line-height:0.4rem;
                background:@0CAEF5-color;
                border-radius:5px;
                color:#fff;
                padding:0.04rem 0.1rem;
                margin-left:0.1rem;
              }
              .h-title-edit{
                position: absolute;
                right: 0.32rem;
                top: -0.2rem;
                color: #0CAEF5;
                width: 0.8rem;
                height: 0.8rem;
                line-height: 0.8rem;
                i{  
                  font-size: 0.5rem;
                  color: @0CAEF5-color;
                }
              }
            }
          }
          .h-list-body {
            padding: 0.2rem;
            border-bottom: 1px solid #e4e4e4;
            margin-bottom: 0.2rem;
            .h-term-group{
              border-bottom: 1px solid #e4e4e4;
              padding: 0.2rem 0;
            }

            .h-term-more {
              width: 100%;
              height: 0.6rem;
              line-height: 0.4rem;
              font-size: 0.3rem;
              text-align: center;
              padding-top: 0.2rem;
           }
          }
        }
            
            
        

    }
    
</style>
