<template>

  <div class="domename">
    <div ref="myheader" >
      <myHeader title="个人信息"></myHeader>
      <div class="h-title" >
        <div class="fl" v-if="!userdata.photo">
          <i class="icon hrfont hr-head"></i>
        </div>
        <div class="fl" v-if="userdata.photo" @click="openBigImg()">
          <img v-bind:src="userdata.photo" />
        </div>
        <div class="fr">
          <span class="name">{{userdata.name}}</span>
        </div>
      </div>
    </div>

    <div class="h-body" :style="{ 'height': currentHeight + 'px'}">
      <div v-for="(configlist,index) in configData" :key="index">
        <hrList2 :moduleData="configlist" :infoData="infoData[configlist.infoset_code]" :aprlist="infoData.aprlist" :allinfoData="infoData" isShowNav="show" ></hrList2>
      </div>
    </div>
    <div id="bigimgdiv" class="bigimgdiv" @click="closeBigImg()">
      <img :src="userdata.photo" class="bigimg" id="bigimg" />
    </div>
  </div>

</template>
<script>
  import { ajax, setStorage, getStorage, formatTime, formatdata, waterMark, clearWaterMark} from 'hr-utils'
  import { myHeader, imgPicker } from 'hr-ui'
  import { Picker,Popup,Toast,Cell,Indicator } from 'mint-ui'
  import hrList2 from './hr-list2.vue'
  import personalData from './personaldata.js'

  export default {
    name:'personal',
    components: {
      myHeader,hrList2,imgPicker
    },
    data(){
      return {
        isWater: false,
        pageHeight: 0,
        currentHeight: this.height,
        configData:"",//模板
        infoData:"",//数据
        userdata:"",//获取的用户数据
        aaa:{},
      }
    },
    watch:{
      height(val) {
        if (val) {
          this.currentHeight = val;
        }
      },
      // 如果路由有变化，会再次执行该方法
      "$route": "getdata"

    },
    updated () {
      var pageHeight = Math.max(document.body.scrollHeight, document.body.clientHeight)
      if (pageHeight !== this.pageHeight || this.isWater === false) {
        this.isWater = true
        clearWaterMark()
        waterMark({watermark_txt: localStorage.getItem('userName').split('-')[1] + ' ' + localStorage.getItem('mobile').split('-')[1] })
      }
    },
    mounted (){
      this.pageHeight = Math.max(document.body.scrollHeight, document.body.clientHeight)
      this.currentHeight = document.documentElement.clientHeight - this.$refs.myheader.offsetHeight - 10;
      this.getdata();

    },
    methods:{
      getImgUrl:function(imgdata){
        //console.log(imgdata.imginfo[0].data)
        var _this=this;
        var param={
          pk_psndoc:"",
          photo:(imgdata.imginfo[0].data).split(",")[1]
        }
        Indicator.open({
          text: '加载中...',
          spinnerType: 'fading-circle'
        })
        //上传头像
        ajax('hrssc/portal/psnbase/uploadPsnPhoto','POST',"application/json",param,function(data){
          Indicator.close()
          if ( data.statusCode == 200 ){
            Toast("上传成功")
            //console.log(_this.configData);
            //更新页面数据
            _this.userdata.photo=imgdata.imginfo[0].data;
            //更新缓存
            var userinfo=getStorage("userinfo");
            userinfo.photo=imgdata.imginfo[0].data
            setStorage("userinfo",userinfo);
          }else{
            //console.log("上传失败");
            Toast("上传失败")
          }

        },function(data){
          Indicator.close()
          console.log("回调进入失败的回调了上传失败")
        });
      },
      getdata:function(){
        setStorage("personal_childs",[]);//创建列表数据,用于新增子集数据的时候使用
        var _this=this;
        //获取模板数据
        ajax('hrssc/portal/psnbase/queryPsnInfoTemp','POST',"application/json",{},function(data){
          if ( data.statusCode == 200 ){
            _this.configData=data.data;
            //console.log(_this.configData);
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
            if(!!data.data){
              if(data.data.hi_psnjob.length > 0){
                data.data.hi_psnjob.reverse();
              }
            }
            _this.infoData=data.data;
            //console.log(_this.infoData)
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

      },
      /**
       * 打开大图
       */
      openBigImg:function(){
        document.getElementById("bigimgdiv").style.display = 'block';
        setTimeout(
          function(){
            var h = document.getElementById("bigimg").height; //放大图片的高度
            //alert(h);
            h = (document.documentElement.clientHeight - h)/2;
            //alert(document.documentElement.clientHeight);
            //alert(h);
            document.getElementById("bigimg").style.marginTop = h + 'px';
          },10
        );

      },
      /**
       * 关闭大图
       */
      closeBigImg: function(){
        document.getElementById("bigimgdiv").style.display = 'none';
      }

    },
    beforeDestroy () {
      clearWaterMark()
    }


  };
</script>


<style lang='less'scoped>
  @0CAEF5-color : #0CAEF5;
  @b2b2b2-color : #b2b2b2;
  .domename{
    .h-title {
      position:relative;
      top:0;
      left:0;
      width: 100%;
      height: 2.4rem;
      /*margin-bottom: 0.2rem;*/
      padding: 0.2rem 0rem 0.2rem 0.5rem;
      border-bottom: 1px solid #e4e4e4;
      background: #ffffff;
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
        position: absolute;
        right: 0;
        top: 0;
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
      margin-top: 0.2rem;
    }
    .bigimgdiv{
      width: 100%;
      text-align: center;
      position: absolute;
      height: 100%;
      top:0px;
      background: #000;
      z-index:100;
      display: none;
    }
    .bigimg{
      width: 100%;
      /*height: 1.97rem;*/
      vertical-align: middle;
      /*margin: 20% auto;*/
    }

  }

</style>
