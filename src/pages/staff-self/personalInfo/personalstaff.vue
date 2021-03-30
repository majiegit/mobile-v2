<template>

<div class="domename">
    <div ref="myheader" >
      <myHeader title="员工信息"></myHeader>
      <div class="h-title" >
        <div class="fl" v-if="!userdata.photo">
          <i class="icon hrfont hr-head"></i>
        </div>  
        <div class="fl" v-if="userdata.photo">
          <img v-bind:src="userdata.photo" />
        </div>  
        <div class="fr">
            <span class="name">{{userdata.name}}</span>               
            <p class="um-txt">完整度:<span>60</span>%</p>
            <div class="um-progress um-progress-mini">
                <div class="um-progress-bar" style="width:60%;"></div>
            </div>
        </div>
      <!--   <div class="h-camera">
          <imgPicker v-on:imgUrl='getImgUrl' type='btn-only' ref="imgPicker" class="photo-right"> </imgPicker>
        </div> -->
      </div>
    </div>
    
    <div class="h-body" :style="{ 'height': currentHeight + 'px'}">

      <div>
        
      </div>

      <div v-for="(configlist,index) in configData" :key="index">
        <hrList2 :moduleData="configlist" :infoData="infoData[configlist.table_code]" isShowNav="noshow" ></hrList2>
      </div>

    </div>
   

</div>

</template>
<script>
    import { ajax, setStorage, getStorage } from 'hr-utils'
    import { myHeader, imgPicker } from 'hr-ui'
    import hrList2 from './hr-list2staff.vue'
    import personalData from './personaldata.js'

    

    export default {
      name:'personal',
        components: {
            myHeader,hrList2,imgPicker
        },
        data(){
            return {
                currentHeight: this.height,
                configData:"",//模板
                infoData:"",//数据
                headerimg:"",//头像信息
                userinfo:"",//用户信息
                userdata:"",//获取的用户数据
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
          getImgUrl:function(data){
            console.log(data)
          },
          getdata:function(){
              // var personal={};
              // console.log(personalData)
              // this.configData=personalData.testConfig;
              // this.infoData=personalData.testinfo;
              // personal.configData=this.configData;
              // personal.infoData=this.infoData;
              // // localStorage.setItem("personal",JSON.stringify(personal));
              // tools.setStorage("personal",personal)
              // return
              setStorage("personal_template","");//数据传递使用localStorage进行传递，初始化

              var userinfo=getStorage("userinfo");
              // userinfo=JSON.parse(userinfo);

              this.userinfo=userinfo;
              this.headerimg=userinfo.photo;
              var _this=this;
              //获取模板数据
              ajax('hrssc/portal/psnbase/queryPsnInfoTemp','POST',"application/json",{},function(data){
                if ( data.statusCode == 200 ){
                    _this.configData=data.data;
                }else{
                    console.log("else数据有问题");
                }
                
              },function(data){
                console.log(data);
                console.log("回调进入失败的回调了")
              });


              var param={
                pk_psndoc:(!this.$route.query||!this.$route.query.pkpsndoc)?"":this.$route.query.pkpsndoc,
                tabcode:"all"
              }
              //获取信息数据
              ajax('hrssc/portal/psnbase/getSubInfoVO','POST',"application/json",param,function(data){
                  if ( data.statusCode == 200 ){
                    _this.infoData=data.data;
                    // console.log(JSON.stringify(_this.infoData));
                  }else{
                      console.log(data);
                  }
                
              },function(data){
                console.log(data)
              });

              //获取头像信息
              ajax('hrssc/portal/psnbase/getPsnInfo','POST',"application/json",param,function(data){
                if ( data.statusCode == 200 ){
                    _this.userdata=data.data[0];
                }else{
                    console.log("else数据有问题");
                }
                
              },function(data){
                console.log(data);
                console.log("回调进入失败的回调了")
              });

          }
 
        }
        

    };
</script>


<style lang='less'scoped>
    @0CAEF5-color : #0CAEF5;
    @b2b2b2-color : #b2b2b2;
    .domename{
        .h-title {
          background: #ffffff;
          padding: 0.2rem 0rem 0.2rem 0.5rem;
          border-bottom: 1px solid #e4e4e4;
          margin-bottom: 0.2rem;
          width: 100%;
          height: 2.4rem;
          .fl {
            float: left;
            width: 1.4rem;
            height: 1.97rem;
            vertical-align: middle;
            position: relative;
            top: 0;
            left: 0;
            background: #e7e7e7;
            text-align: center;
            i.icon.hrfont.hr-head {
              font-size: 1.4rem;
              color: #adadad;
              position: absolute;
              bottom: 0.3rem;
              left: 0;
            }
            img {
              width: 1.4rem;
              height: 1.97rem;
              vertical-align: middle;
            }
          }
          .fr {
            float: left;
            padding-left: 0.3rem;
            padding-top: 0.4rem;
            width: 2.7rem;
            > span {
              font-size: 0.42rem;
              font-family: PingFang-SC-Bold;
              color: #343434;
            }
            .um-txt {
              line-height: 0.6rem;
              color: #808080;
              font-size: 0.28rem;
            }
            .um-progress {
              height: 0.1rem;
              overflow: hidden;
              background-color: #dfdfdf;
              border-radius: 0.05rem;
              box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
              .um-progress-bar {
                float: left;
                width: 0%;
                height: 100%;
                font-size: 14.45px;
                line-height: 23.8px;
                color: #fff;
                text-align: center;
                background-color: #1BAEDE;
                box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);
                transition: width .6s ease;
              }
            }
          }
          .h-camera{

          }
          .photo-right {
            float: right;
            position: relative;
            top: 0.6rem;
            right: 0.2rem;
          }
        }
        .h-body{
            overflow:scroll;
           
            
            
        }

    }

</style>
