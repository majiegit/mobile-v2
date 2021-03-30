<template>

<div class="prove">
    <header>
      <hr-header
        title='开证明'
        v-on:lcallBack='goApp'
        >
      </hr-header>
    </header>
    <div class="h-body" :style="{ 'height': currentHeight + 'px'}">
         <div  id="ddd">
            <div @click="openpopup(1)">
                <mt-cell title="证明类型" is-link ><span style="color:#333">{{provetype}}</span></mt-cell>
            </div>
            <div @click="openpopup(2)">
                <mt-cell title="受理人" is-link ><span style="color:#333">{{provename}}</span></mt-cell>
            </div>
        </div>
        <div class="h-textarea">
            <hrTextarea v-model="provetext" num="100" placeholder="请描述你要开具的证明的要求"></hrTextarea>
        </div>
        
        <div>
            <div class="h-showdome" v-if="imghtml">
                <div  v-html="imghtml"></div>
                <!-- <img id="imgshow" :src="imagesrc"> -->
            </div>
        </div>
        <!-- <div id="view"  style="position:fixed;z-index:-1;top:0;left:0; overflow:hidden;" v-html="imghtml"></div> -->
    </div>
    <div ref="footer">
      <div  class="h-footer">
        <div  @click="submitfun" class="h-footer-btn" :class="{active:isActive}">提交</div>
      </div>
    </div>
    <div>
        <hrScrollcustom :scrolldata="sdata" v-on:increment="incrementTotal" ref="scrollpopup"></hrScrollcustom>
    </div>
</div>

</template>
<script>
    import html2canvas from 'html2canvas'
    import { ajax } from 'hr-utils'
    import { myHeader, hrTextarea, hrScrollcustom , HrHeader } from 'hr-ui'
    import { Toast, Cell, MessageBox, Indicator } from 'mint-ui'
    import ProveData from './prove-data.js'
    
    export default {
      name:'prove',
        components: {
            myHeader,hrScrollcustom,hrTextarea, HrHeader
        },
        data(){
            return {
                currentHeight: this.height,
                sdata:{
                    type:"blood",
                    data:[]
                },
                provetype:"请选择",//证明类型
                provename:"请选择",//受理人,
                getProveData:{},//从后端获取的数据内容
                provetypedata:[],//证明类型的内容数组
                provenamedata:[],//受理人的内容数组
                provetext:"",//描述的数据内容
                imagesrc:"",//证明模块图片路径
                imghtml:"",//证明模块html片段
                isActive:false,//是否满足提交条件
                subdata:{//提交的数据
                    "attestType": "", //证明类型
                    "filePath": "" ,//附件
                    "applyUser": "" ,//处理人id
                    "describe": "" //备注
                }
            }
        },
        watch:{
            height(val) {
                if (val) {
                  this.currentHeight = val;
                }
              }
        },
        created() {
            // 选完证明受理人，回写数据
            let isEdit = this.$route.query.isEdit
            if (isEdit) {
                let params = this.$route.params
                this.provename = params.params.provename
                this.provetext = params.params.provetext
                this.provetype = params.params.provetype
               
                this.subdata = params.params.subdata
                this.imghtml = params.params.imghtml
                this.imagesrc = params.params.imagesrc
                this.getTemplate(this.subdata.attestType)
                if(this.provetype!='请选择'&&this.provename!='请选择'){
                    this.isActive=true;
                }
            }
        },
        mounted (){
            // this.currentHeight = document.documentElement.clientHeight - this.$refs.myheader.offsetHeight- this.$refs.footer.offsetHeight;
            this.getdata();
        },
        methods:{
            incrementTotal:function(data){//传递到子组件中的回调方法
                //console.log(data);//{data:"Array"},date的类型是数组
                if(data.name=='provetype'){
                    this.getTemplate(data.data.id);
                    this.subdata.attestType=data.data.id;
                    this[data.name]=data.data.name;
                }else{
                    this.subdata.applyUser=data.data.cuserid;
                    this[data.name]=data.data.psn_name;
                }
                if(this.provetype!='请选择'&&this.provename!='请选择'){
                    this.isActive=true;
                }
            },            
            openpopup(type){//打开下拉子组件遮罩
                //console.log(this.provetypedata)
                if(type==1){
                    this.sdata={
                        type:"custom",
                        data:this.provetypedata,
                        name:"provetype",
                        mark:"name"
                    } 
                //调用子组件的方法
              this.$refs.scrollpopup.openpopup();//子组件的方法
              this.$refs.scrollpopup.refresh(this.sdata);//子组件的方法    
                }else if(type==2){
                    // this.sdata={
                    //     type:"custom",
                    //     data:this.provenamedata,
                    //     name:"provename",
                    //     mark:"psn_name"
                    // } 
                    this.$router.push({
                        name:'proveUserList',
                        params: {
                            provetype: this.provetype,
                            provename: this.provename,
                            provetext: this.provetext,
                            subdata: this.subdata
                        }
                    })
                }
            
            },
            makeImage(){//生成图片
                //方法不完善，图片展示不全
                var _this=this;
                html2canvas(document.getElementById("view"), {
                    onrendered: function(canvas) {
                        _this.imagesrc=canvas.toDataURL("image/png")
                    },
                    width:document.documentElement.clientHeight*0.6,
                    height:document.documentElement.clientHeight*1.5*0.6
                });
            },
            getTemplate:function(attestType){//获取模板数据
                // this.imghtml=this.getProveData.html;
                // var _this=this;
                // setTimeout(function () {
                //     _this.makeImage();
                // }, 1)
                // return
                if (!attestType) {
                    return
                }
                Indicator.open({
                    text: '加载中...',
                    spinnerType: 'fading-circle'
                })
                var _this=this;
                ajax('hrssc/portal/attest/preview/'+attestType,'GET',"application/json",{},function(data){
                    Indicator.close();                  
                    if ( data.statusCode == 200 ){
                        if(!data.data){
                            //console.log("数据有问题");
                            return;
                        }
                        var responsedata=JSON.parse(data.data);
                        if(responsedata.commitFlag==true){
                            let temp = responsedata.contents;
                            temp = temp.replace(/contenteditable="true"/g, 'contenteditable="false"');
                            _this.imghtml = temp;
                        }else{
                            MessageBox.alert("该证明类型，没有模板，请在pc端提交").then(action => {
                                _this.provetype='请选择';
                                _this.isActive=false;
                                _this.imghtml="";
                            });
                        }
                        // setTimeout(function () {
                        //     _this.makeImage();
                        // }, 1)
                    }else{
                        //console.log(data);
                        Toast(data.data.message)
                    }
                  
                },function(data){
                    Indicator.close()
                    //console.log(data)
                });
            },
            goApp(){
                this.$router.push('/application')
            },
            getdata:function(){//获取参照数据
                var _this=this;

                // this.getProveData=ProveData.resdata;
                // for(var i=0;i<this.getProveData.datatype.length;i++){
                //    this.provetypedata.push(this.getProveData.datatype[i])
                //    //this.provetypedata.push(this.getProveData.datatype[i].name)
                // }
                // for(var i=0;i<this.getProveData.dataname.length;i++){
                //     this.provenamedata.push(this.getProveData.dataname[i])
                //    // this.provenamedata.push(this.getProveData.dataname[i].name)
                // }

                //return
                
                Indicator.open({
                    text: '加载中...',
                    spinnerType: 'fading-circle'
                })
                var _this=this;
                ajax('hrssc/portal/attest/getDocRef','GET',"application/json",{},function(data){
                    Indicator.close();
                    if ( data.statusCode == 200){
                        if(!data.data||!data.data.attestType||!data.data.applyer){console.log("数据有问题");return}
                        _this.provetypedata=data.data.attestType;
                        _this.provenamedata=data.data.applyer;
                        if (!_this.$route.query.isEdit) {
                            // 受理人默认选中第一个
                            _this.provename = data.data.applyer[0].psn_name;
                            _this.subdata.applyUser = data.data.applyer[0].cuserid
                        }
                    }else{
                        //console.log(data);
                        Toast(data.message);
                    }
                },function(data){
                  Indicator.close()
                  //console.log(data)
                });
            },
            submitfun:function(){//提交数据
                var _this=this;
                if(!this.isActive){
                    return
                }else{
                    //提交接口
                    this.subdata.describe=this.provetext
                    //console.log("数据提交中")
                    ajax('hrssc/portal/attest/commit','post',"application/json",this.subdata,function(data){
                        Indicator.close()
                        if ( data.statusCode == 200 ){
                            //console.log(data);
                            MessageBox(
                                {
                                  title: '提示',
                                  message: '经审批通过后，您会收到消息提醒，请按照提示前往证明领取地点办理！',
                                  confirmButtonText: '确 定'
                                }
                                ).then(action => {
                                _this.$router.push({
                                    name: 'application'
                                })
                            });
                            // MessageBox.alert(data.message).then(action => {
                            //     _this.$router.goBack();
                            // });
                        }else{
                            //console.log(data);
                            Toast(data.message)
                        }
                    },function(data){
                      Indicator.close()
                      //console.log(data)
                    });
                }
            }
        }
    };
</script>


<style lang='less'scoped>
    @0CAEF5-color : #0CAEF5;
    @b2b2b2-color : #b2b2b2;
    .prove{
        header{
            position: fixed;
            width: 100%;
            height: .88rem;
            line-height: .88rem;
            z-index: 2;
            }
        .h-body{
            position: fixed;
            width: 100%;
            height: 86%;
            top: .88rem;
            overflow:scroll;
        }
        .h-textarea{
            padding-top:0.2rem;
        }
        .h-showdome{
            position: relative;

            height: auto;
            background-color: #fff;
            border: 1px solid #ddd;
            padding: 0 0.1rem;

            box-shadow: 0.12rem 0.12rem #e4e4e4;
            margin:0.6rem 0.3rem 1rem 0.3rem;
            img {
                width: 100%;
            }

        }
        .h-footer {
          width: 100%;
          height: 0.9rem;
          line-height: 0.9rem;
          position: fixed;
          bottom: 0;
          left: 0;
          background:#fff;
          .h-footer-btn {
            width: 100%;
            height: 0.9rem;
            text-align: center;
            opacity: 0.6;
            background: @0CAEF5-color;
            color: #fff;
          }
          .h-footer-btn.active{
            opacity: 1;
          }
        }

    }
    
</style>
<style lang='less'>
    .prove{
        .mint-cell-wrapper {
            background-image: none;
        }
        .mint-msgbox-confirm{
            font-size:0.32rem;
        }
    }
        .mint-msgbox-confirm{
            font-size:0.32rem;
        }
</style>