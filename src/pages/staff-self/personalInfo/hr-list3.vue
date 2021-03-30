<template>

<div class="hr-list3" >

  <div class="h-body-term" v-if="listmodule[page]=='Y'" :style="{ 'borderBottom':liststyle.borderbottom}">
    <span class="h-term-name"
    :style="{  'lineHeight': liststyle.lineheight}"
    >{{listmodule.name}}</span><span v-if="isEditType=='noedit'" class="h-term-value" :class="{active:(aprlist&&aprlist[listmodule.code])}" :style="{ 'textAlign': liststyle.textalign, 'lineHeight': liststyle.lineheight }" @click="prompt1">{{tempmodel}}</span>

    <!-- 不包含特殊字符非中文字符串 -->
    <input v-if="isEditType==0" class="h-term-value" ref="hinput" :style="{ 'textAlign': liststyle.textalign, 'lineHeight': liststyle.lineheight}" v-model="tempmodel" />
    <!-- 正整数 -->
    <input v-if="isEditType==1" class="h-term-value" ref="hinput"  :style="{ 'textAlign': liststyle.textalign, 'lineHeight': liststyle.lineheight}" v-model="tempmodel" />
    <!-- 小数double -->
    <input v-if="isEditType==2" class="h-term-value" ref="hinput"  :style="{ 'textAlign': liststyle.textalign, 'lineHeight': liststyle.lineheight}" v-model="tempmodel"  />
    <!-- boolean -->
    <span v-if="isEditType==4" class="h-term-value" :style="{ 'textAlign': liststyle.textalign, 'lineHeight': liststyle.lineheight}"   @click="prompt1"><mt-switch :disabled="listmodule.caneditflag=='N'" v-model="tempmodel"></mt-switch></span>
    <!-- 树形参照 -->
    <span v-if="isEditType==5" class="h-term-value" @click="openpopup" :style="{ 'textAlign': liststyle.textalign, 'lineHeight': liststyle.lineheight , 'height': liststyle.lineheight}">{{tempmodel}}</span>
    <!-- 下拉参照 -->
    <span v-if="isEditType==6" class="h-term-value" @click="openpopup" :style="{ 'textAlign': liststyle.textalign, 'lineHeight': liststyle.lineheight , 'height': liststyle.lineheight}">{{tempmodel}}</span>
    <!-- 照片 -->
    <img  v-if="isEditType==10" style="width:100%;" :src="tempmodel" alt="" />
    <!-- 长时间 （2017-09-18 12:09:09） -->
    <span v-if="isEditType==15" class="h-term-value" @click="openPickerTime" :style="{ 'textAlign': liststyle.textalign, 'lineHeight': liststyle.lineheight , 'height': liststyle.lineheight}">{{tempmodel}}</span>
    <!-- 文本 -->
    <input v-if="isEditType==17" class="h-term-value" ref="hinput"  :style="{ 'textAlign': liststyle.textalign, 'lineHeight': liststyle.lineheight}"  v-model="tempmodel"  />
    <!-- 短时间 （2017-09-08）-->
    <span v-if="isEditType==20" class="h-term-value" @click="openPickerTime" :style="{ 'textAlign': liststyle.textalign, 'lineHeight': liststyle.lineheight}">{{tempmodel}}</span>
    <!-- 数字 -->
    <input v-if="isEditType==100" class="h-term-value" ref="hinput"  :style="{ 'textAlign': liststyle.textalign, 'lineHeight': liststyle.lineheight}" v-model="tempmodel" />

    <span class="h-nullable"  v-if="isEdit"  :class="{active:isActive}" @click="obtainFocus">{{isNullable()}}</span>
  </div>
  <div v-if="(isEditType==5)">
    <hrcontrast  v-on:increment="incrementContrast" :param="stringtypenew" ref="pickercontrast"></hrcontrast>
  </div>
  <div v-if="(isEditType==6)">
    <hrScrollcustomall  v-on:increment="incrementTotal" ref="scrollcustomallpopup"></hrScrollcustomall>
  </div>
  <div v-if="(isEditType==15||isEditType==20)">
    <mt-datetime-picker v-model="pickerVisible" :startDate="(new Date(1900,0,1))" :endDate="(new Date(2050,11,29))" value="1506077091416" :type="isEditType==15?'datetime':'date'" ref="pickertime"  @confirm="handleConfirm"></mt-datetime-picker>
  </div>
</div>

</template>
<script>

/**
 * zhanghuag 20170905
 * hr-list3
 * @module pages/personalInfo
 *
 * @param {object} [listmodule] - 模板数据
 * @param {object} [listinfo] -用户数据
 * @param {string} [liststyle] -展现样式
 * @param {object} [isEdit] -是否可以进行编辑
 * @param {string} [page] -区分不同页面，对应进行显示与隐藏
 *
 * @example
 * <hrList3 :listmodule="modulelist" :listinfo="termgroup" page="hideda"  :isEdit=isEdit ></hrList3>
 */




  import { ajax, setStorage, getStorage, formatTime, formatdata} from 'hr-utils'
  import { hrScrollcustomall, hrcontrast } from 'hr-ui'
  import { DatetimePicker, Switch, Toast, Indicator } from 'mint-ui';
    export default {
      name:'hr-list3',
        components: {
          hrScrollcustomall,
          hrcontrast
        },
        props:{
          "listmodule":{//数据模板
            type:Object,
          },
          "listinfo":{//数据
            type:Object,
          },
          "liststyle":{//模板样式
            type:Object,
            default:function(){
              return{
                lineheight:"0.5rem",
                textalign:"left",
                borderbottom:"none",
              }
            }
          },
          "isEdit":{//是否可以编辑
            type:Boolean,
            default:true,
          },
          "addflag":{//是否可以新增
            type:String,
            // default:'N1',
          },
          "page":{//当前显示的页面
            type:String,
          },
          "stringtype":{//缓存用的字段名称
            type:String
          },
          "aprlist":{//需要添加审核标记的数据
            type:null
          }

        },

        data(){
            return {
              tempmodel:"",//当前条目的数据
              editpage:{},//
              isEditType:"",
              isActive:false,//true不提示，false显示
              stringtypenew:this.stringtype,//缓存用的字段名称,解耦赋值
              pickerVisible:"",

            }
        },
        watch:{
          tempmodel(val) {
            if(this.isEdit){//
                this.verifyData(this.listmodule.code,this.listmodule.name,val,this.listmodule.datatype);
            }
            this.isShowfun(val)
          },
        },
        mounted (){
          this.getdata();
        },
        directives: {
            focus: {
                inserted: function (el, {value}) {
              console.log(el);
              console.log(value);
                    if (value) {
                        console.log(333)
                        el.focus();
                    }
                }
            }
        },
        methods:{
            getdata:function(){//获取数据类型，根据类型展示
              if(this.addflag=='Y'){
                this.listmodule.caneditflag='Y'
              }
              this.isEditType=this.isEditfun()
              this.tempmodel=this.dataformat(this.listmodule,this.listinfo);
              this.editpage=getStorage("editpage");
              this.stringtypenew="c_"+this.listmodule.code;

            },
            openPickerTime() {//打开时间相关组件
              this.$refs.pickertime.open();
              var cutDate=new Date()
              var cutyear=cutDate.getFullYear().toString();
              var cutmonth=(cutDate.getMonth()+1);
              var cutday=cutDate.getDate();
              var cutarr=[cutyear.toString(),(cutmonth>9?""+cutmonth:"0"+cutmonth).toString(),cutday.toString()];
              this.$refs.pickertime.$refs.picker.setValues(cutarr)
              //this.$refs.pickertime.$refs.picker.setValues(['2007', '01', '01', '00', '00']);
            },
            handleConfirm(value){//时间组件回调函数
              if(this.listmodule.datatype==15){
                  this.tempmodel=formatTime((new Date(value)),"yyyy-MM-dd hh:mm:ss");
              }else{
                  this.tempmodel=formatTime((new Date(value)),"yyyy-MM-dd");
              }
            },
            incrementTotal:function(data){//下拉单选子组件的回调函数
                this.tempmodel=data.data.title;

                this.editpage[this.listmodule.code]=data.data.value;
                this.editpage[this.listmodule.code+'_name']=data.data.title;

            },
            openpopup:function() {//调用单选下拉组件，子组件的方法
               //console.log(this.listmodule)
               var code=this.listmodule.code;
               var name=this.listmodule.name;
              var param={//请求参数
                // refType:code
                dataType:this.listmodule.datatype,
                pk_refinfo:this.listmodule.pk_refinfo,
                refModel:this.listmodule.refmodel,
              };
              var _this=this;
              var contrastdata=getStorage("c_"+code);//获取参照数据

              //debugger
              if(contrastdata){//有数据
                _this.openchildfun(contrastdata,code,name);
              }else{//无数据
                Indicator.open({
                  text: '数据请求中...',
                  spinnerType: 'fading-circle'
                })
                ajax('hrssc/portal/psnbase/queryReferencePsn','POST',"application/json",param,function(data){

                   Indicator.close()

                  if ( data.statusCode == 200 ){
                      if(data.data.datatype=="tree"){
                        contrastdata=formatdata(undefined,'pid','tid',data.data.body)
                      }else{
                        contrastdata=data.data.body;
                      }
                      setStorage("c_"+code,contrastdata);
                      _this.openchildfun(contrastdata,code,name);
                  }else{//返回数据不对
                      console.log("数据不对");
                  }
                },function(data){//失败的回调
                   Indicator.close()
                  console.log("进入了失败回调")
                });
              }
            },
            openchildfun:function(data,code,name){//向子组件传递数据，并打开
              //console.log(data,code,name)
              var _this=this;
              var contrastobj={
                          "type":"custom",
                          "data":data,
                          "name":code+","+name,
                          "mark":"title"
                      }

              if(this.isEditType==6){//下拉数据
                _this.$refs.scrollcustomallpopup.openpopup();//子组件的方法
                _this.$refs.scrollcustomallpopup.refresh(contrastobj);//刷新子组件的方法，val刷新数据
              }else if(this.isEditType==5){//参照数据
                _this.$refs.pickercontrast.openpopup();//子组件的方法
              }

            },
            dataformat:function(module,info){//根据数据类型，进行不同处理
              var type=module.datatype;
              var showdata="";
              switch (type){
                case 0://正整数
                  showdata=info[module.code];
                case 1://正整数
                  showdata=info[module.code];
                break;
                case 2://小数double
                  showdata=info[module.code];
                break;
                case 4://boolean
                  if(!this.isEdit){
                    showdata=info[module.code]=="Y"?"是":"否";
                  }else{
                    //可编辑
                    showdata=info[module.code]=="Y"?true:false;
                  }
                break;
                case 5://树形参照
                  showdata=info[module.code+"_name"];
                break;
                case 6://下拉参照
                  showdata=info[module.code+"_name"];
                break;
                case 10://照片
                  showdata=info[module.code];
                break;
                case 15://长时间 （2017-09-18 12:09:09）
                  showdata=info[module.code];
                break;
                case 17://文本
                  showdata=info[module.code];
                break;
                case 20://短时间 （2017-09-08）
                  showdata=info[module.code];
                break;
                case 100://正整数
                  showdata=info[module.code];
                break;

              }
              //debugger
              this.isShowfun(showdata);
              //console.log(this);
              return showdata

            },
            verifyData:function(code,name,data,type){//对应key值，对应类别名称，数据
                 //console.log(code,name,data,type)
                if(type==0){//该类型不能输入汉字，验证提醒
                  //验证数据
                }

                var editpageStack=getStorage("editpageStack");//修改统计变量
                var editpageVerify=getStorage("editpageVerify");//获取验证数据


                if(this.isEditType==5||this.isEditType==6){
                  // console.log(this.editpage[code+"_name"])
                  // console.log(editpageVerify[code+"_name"])

                  if(this.listmodule.mustflag=='Y'){
                    this.editpage[code+"_name"]=!data?'':data
                  }else{
                    this.editpage[code+"_name"]=data;
                  }
                  // this.editpage[code]=data
                  //
                  // console.log(this.editpage[code])
                  // console.log(this.editpage[code+"_name"])
                  // console.log(111111112222)
                  // console.log(this.editpage[code]==editpageVerify[code])
                  //   console.log(this.isEditType=='noedit')
                  //   console.log(((this.isEditType==6||this.isEditType==5)&&this.editpage[code+"_name"]==editpageVerify[code+"_name"]))
                  //   console.log((this.isEditType==4&&this.editpage[code]!='Y'&&this.editpage[code]!='N'))
                }else{
                  if(!data){
                    this.editpage[code]=""
                  }else{
                    this.editpage[code]=(typeof data=="object")?data.data.title:data;//获取更新的数据
                  }
                }

                if((this.isEditType!==6&&this.isEditType!==5)&&this.editpage[code]==editpageVerify[code]||
                    this.isEditType=='noedit'||
                    ((this.isEditType==6||this.isEditType==5)&&this.editpage[code+"_name"]==editpageVerify[code+"_name"])||
                    (this.isEditType==4&&this.editpage[code]!='Y'&&this.editpage[code]!='N')
                  ){//相等就不统计
                  editpageStack=editpageStack.filter(function(ele){
                                    return ele.code!=code
                                  })

                }else{//统计修改的内容
                  editpageStack=editpageStack.filter(function(ele){//过滤掉已有数据
                                    return ele.code!=code
                                  })
                  if(this.isEditType==5||this.isEditType==6){
                    editpageStack.push({code:code,codevalue:this.editpage[code],name:name,mustflag:this.listmodule.mustflag});//添加更新s
                  }else{
                    editpageStack.push({code:code,codevalue:this.editpage[code],name:name,mustflag:this.listmodule.mustflag});//添加更新
                  }
                }
                setStorage("editpage",this.editpage)
                setStorage("editpageStack",editpageStack)


            },

            isEditfun:function(){//是否可以修改
              //浏览态 不允许修改 isEdit为false为浏览态
              //if(!isEdit){//浏览态}
              //不允许修改
              //if(isEdit&&listmodule.caneditflag=='N'){//}
              //特殊处理
              //if(listmodule.datatype==10){//图片特殊处理}

              //console.log(this.listmodule)

              if(this.listmodule.datatype==10){//图片特殊处理
                return 10
              }else if(this.listmodule.datatype==4&&this.listmodule.caneditflag=='N'&&this.isEdit){//不能修改
                return 4
              }else if((!this.isEdit||(this.isEdit&&this.listmodule.caneditflag=='N'))){//不能修改
                return 'noedit'
              }else {
                return this.listmodule.datatype
              }

            },
            prompt1:function(){//点击只读显示提醒信息
              if(this.listmodule.caneditflag=='N'&&this.isEdit&&this.page=="showflag"){
                Toast('该字段为只读，不可编辑');
              }
            },
            isNullable:function(){//判断提示信息显示内容
              if(this.listmodule.caneditflag=='N'){//只读不显示提示
                return ''
              }else if(this.listmodule.datatype==4){//boolean不显示提示信息
                return ''
              }else if(this.listmodule.datatype==5||this.listmodule.datatype==6||this.listmodule.datatype==15||this.listmodule.datatype==20){
                if(this.listmodule.mustflag=='Y'){//下拉显示是否必选
                  return '必选'
                }else{
                  return '非必选'
                }
              }else{
                if(this.listmodule.mustflag=='Y'){//输入显示是否必填
                  return '必填'
                }else{
                  return '非必填'
                }
              }
            },
            isShowfun:function(val){//是否显示提示内容

              if(typeof val=='boolean'){
                this.isActive=true;
              }else if(!!val){//true不提示
                this.isActive=true;
              }else{
                this.isActive=false;
              }
            },
            incrementContrast:function(data){//多级选项子组件中的回调方法

                this.editpage[this.listmodule.code]=data[data.length-1].value;
                this.editpage[this.listmodule.code+'_name']=data[data.length-1].title;

                //debugger
                this.tempmodel=data[data.length-1].title;
            },
            openPickercontrast() {//打开多级选项子组件
              this.$refs.pickercontrast.openpopup();
            },
            obtainFocus:function(e){
              if(this.listmodule.datatype==5||this.listmodule.datatype==6){//参照类型
                this.openpopup();
              }else if(this.listmodule.datatype==15||this.listmodule.datatype==20){//时间类型
                this.openPickerTime();
              }else{//输入框类型
                this.$refs.hinput.focus();
              }

            }
        }


    };
</script>


<style lang='less'scoped>
    @0CAEF5-color : #0CAEF5;
    @b2b2b2-color : #b2b2b2;
    .hr-list3{
      .h-body-term {
        line-height: 0.5rem;
        text-align: left;
        position:relative;
        top: 0;
        left:0;
        .h-term-name {
          display: inline-block;
          width: 1.8rem;
          line-height: 0.5rem;
          color: #808080;
          font-size: 0.3rem;
          text-align: left;
        }
        .h-term-value {
          display: inline-block;
          width: 5rem;
          /*height:0.5rem;*/
          line-height: 0.5rem;
          color: #343434;
          font-size: 0.3rem;
          text-align: left;
          padding-left: 10px;
          vertical-align: top;
          .mint-switch {
            float: right;
            position: relative;
            top: 0.12rem;
          }
        }
        .h-term-value.active{
          color:#0CAEF5;
        }
        .h-nullable {
          position: absolute;
          width: 1rem;
          height: 0.2rem;
          font-size: 0.2rem;
          right: 0;
          top: 0.2rem;
        }
        .h-nullable.active{
          display: none;
        }
      }




    }

</style>
<style lang='less' >
  a {
    text-decoration: none;
}
.list3{
  img{
    width:100%;
  }
}
</style>


