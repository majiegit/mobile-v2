<template>

<div class="domename">
    <div ref="myheader" >
      <myHeader title="个人信息"></myHeader>
    </div>
    <div class="h-body" :style="{ 'height': currentHeight + 'px'}">
<!-- 
      <div class="h-list-group">
        <div class="h-list-title">
          <div class="h-title-content">
            <h3>基本信息</h3> 
            <span class="h-title-mark">信息待审批</span> 
            <span class="h-title-edit"><i class="icon hrfont hr-edit2"></i></span>
          </div>
        </div>
        <div class="h-list-body">
          <div class="h-body-term ">
            <span class="h-term-name">姓名姓名</span><span class="h-term-value">王思雨</span>
          </div>
          <div class="h-body-term">
            <span class="h-term-name">姓名</span><span class="h-term-value">王思雨</span>
          </div>
        </div>

        <div class="h-list-body">
          <div class="h-term-group">
            <div class="h-body-term ">
              <span class="h-term-name">姓名姓名</span><span class="h-term-value">王思雨</span>
            </div>
            <div class="h-body-term">
              <span class="h-term-name">姓名</span><span class="h-term-value">王思雨王思雨王思雨王思雨王思雨王思雨王思雨王思雨王思雨王思雨王思雨王思雨</span>
            </div>
          </div>

          <div class="h-term-group">
            <div class="h-body-term ">
              <span class="h-term-name">姓名姓名</span><span class="h-term-value">王思雨</span>
            </div>
            <div class="h-body-term">
              <span class="h-term-name">姓名</span><span class="h-term-value">王思雨</span>
            </div>
          </div>
          <div class="h-term-more">显示更多</div>
         
        </div>

      </div>
 -->
      <!-- <hrList2 listtype="1"></hrList2> -->
     <!--  <hrList2 listtype="2"></hrList2>
      <hrList2 listtype="2"></hrList2> -->

      <div>
        
      </div>

      <div v-for="configlist in configData">
        <hrList2 :moduleData="configlist" :infoData="infoData[configlist.code]" listtype="2"></hrList2>
      </div>

    </div>
   

</div>

</template>
<script>

    import { ajax } from 'hr-utils'
    import { myHeader } from 'hr-ui'
    import hrList2 from './hr-list2.vue'
    import personalData from './personaldata.js'

    

    export default {
      name:'dome',
        components: {
            myHeader,hrList2
        },
        data(){
            return {
                currentHeight: this.height,
                configData:"",
                infoData:"",

               
            }
        },       
        watch:{
            height(val) {
                if (val) {
                  this.currentHeight = val;
                }
              },

        },
        mounted (){
            this.currentHeight = document.documentElement.clientHeight - this.$refs.myheader.offsetHeight;
            this.getdata();

        },
        methods:{
          getdata:function(){
              var personal={};
              console.log(personalData)
              this.configData=personalData.testConfig;
              this.infoData=personalData.testinfo;
              personal.configData=this.configData;
              personal.infoData=this.infoData;
              localStorage.setItem("personal",JSON.stringify(personal));
              return
              var _this=this;
              util.ajax('/hrssc/portal/psnbase/queryPsnInfoTemp','POST',"application/json",{},function(data){
                
                
                if ( data.statusCode == 200 ){
                    _this.configData=data.data;
                    // console.log(111);
                     //console.log(JSON.stringify(_this.configData));
                    
                    personal.configData=JSON.stringify(data.data)
                }else{
                    
                    console.log(222);
                }
                
              },function(data){
                console.log(333)
              });
              var param={
                pk_psndoc:"",
                tabcode:"all"
              }

              util.ajax('/hrssc/portal/psnbase/getSubInfoVO','POST',"application/json",param,function(data){
                
                
                  if ( data.statusCode == 200 ){
                    _this.infoData=data.data

                     console.log(JSON.stringify(_this.infoData));
                  }else{
                      
                      console.log(data);
                  }
                
              },function(data){
                console.log(data)
              });


          }
 
        }
        

    };
</script>


<style lang='less'scoped>
    @0CAEF5-color : #0CAEF5;
    @b2b2b2-color : #b2b2b2;
    .domename{
        .h-body{
            overflow:scroll;
           
            
            
        }

    }
    
</style>
