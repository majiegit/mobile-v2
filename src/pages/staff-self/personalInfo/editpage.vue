<template>

<div class="editpage">
    <div ref="myheader" >
      <myHeader :title="title"></myHeader>
    </div>
    <div class="h-body" :style="{ 'height': currentHeight + 'px'}">

      <div class="h-list-body">
        <div v-for="(modulelist,index) in modulardata" :key="index">



          <hrList3  :listmodule="modulelist" :addflag="addflag" :listinfo="infoData" :isEdit="isEdit" page="showflag"  :liststyle="liststyle" ></hrList3>

        </div>


          <!-- <hrList3 :listmodule="modulelist" :listinfo="infoData" :isEdit="isEdit" page="showflag"  :liststyle="liststyle"  v-for="(modulelist,index) in modulardata" :key="index"></hrList3>    -->
      </div>

    </div>
    <div ref="footer" >
      <div v-if="isEdit"  class="h-footer">
        <div v-if="parent=='personal'&&!examineflag" @click="submitfun" class="h-footer-btn">提交</div>
        <div v-if="parent=='editlist'" @click="nextfun" class="h-footer-btn">下一步</div>
        <div v-if="parent=='personal'&&examineflag" @click="retractfun" class="h-footer-btn">撤回</div>
      </div>
    </div>




</div>

</template>
<script>

    import hrList3 from './hr-list3.vue';
    import { MessageBox,Toast } from 'mint-ui';
    import { myHeader } from 'hr-ui'
    import { ajax, setStorage,getStorage, waterMark, clearWaterMark} from 'hr-utils'
    // import tools from '../../utils/tools';


    export default {
      name:'editpage',
        components: {
            myHeader,hrList3
        },
        data(){
            return {
                isWater: false,
                pageHeight: 0,
                currentHeight: this.height,
                infoData:"",//数据
                modulardata:"",//数据模板
                liststyle:{//修改默认样式
                  lineheight:"0.9rem",
                  textalign:"right",
                  borderbottom:"1px solid #e7e7e7",
                },
                isEdit:false,//是否可编辑
                title:"",//title显示名称
                parent:"",//父级页面标识
                  //增删改查相关字段
                table_code : "",   //子集的标识
                pkfilecode : "",//子集的主键(是主键的值，不是主键的code)   * 删除和修改时必须传，新增不需要传。
                optype:"",  //操作类型(del/删除，add/新增，edit/修改)

                listindex:"",//editlist带过来数据的编辑数据的编号
                examineflag:"",//是否需要审核
                addflag:"",//是否允许新增
                formstate:"",//单据状态，newadd表示进入新增单据状态
            }
        },
        watch:{
            height(val) {
                if (val) {
                  this.currentHeight = val;
                }
              },

        },
        updated () {
          var pageHeight = Math.max(document.body.scrollHeight, document.body.clientHeight);
          if (pageHeight !== this.pageHeight || this.isWater === false) {
            this.isWater = true
            clearWaterMark()
            waterMark({watermark_txt: localStorage.getItem('userName').split('-')[1] + ' ' + localStorage.getItem('mobile').split('-')[1] })
          }
        },
        created(){

        },
        mounted (){
          this.pageHeight = Math.max(document.body.scrollHeight, document.body.clientHeight);
          this.currentHeight = document.documentElement.clientHeight - this.$refs.myheader.offsetHeight- this.$refs.footer.offsetHeight;
          this.getdata();
        },
        beforeDestroy () {
          clearWaterMark()
        },
        methods:{
          getImgUrl : function(imgUrl){
            console.log(imgUrl)
          },
          getdata:function(){
                var personal_childs=getStorage("personal_childs");
                var personal_editpage=getStorage("personal_editpage");
                if(!personal_editpage){console.log("数据有问题，localStorage没有获取到");return false}
                var personaldata=personal_editpage;
                this.table_code=personaldata.modulelist.table_code;
                this.examineflag=personaldata.examineflag;
                this.parent=personaldata.parent;
                this.modulardata=personaldata.modulelist.tablefield;
                this.isEdit=personaldata.isEdit;
                this.title=personaldata.modulelist.name;
                this.formstate=personaldata.formstate;
                if(this.formstate=='newadd'||personaldata.modulelist.caneditflag=='Y'){
                  this.addflag=personaldata.modulelist.addflag;
                }

                if(!personaldata.infoData){//数据为空，表示新增
                  this.infoData={};
                  this.pkfilecode="";
                  this.optype="add";
                }else{//有数据表示编辑
                  this.infoData=(personaldata.infoData instanceof Array)?personaldata.infoData[0]:personaldata.infoData;

                  if(this.parent=='personal'){//基本信息的编辑
                    this.pkfilecode=this.infoData.pk_psndoc;
                  }else if(this.parent=='editlist'){//子集信息的编辑
                    this.pkfilecode=this.infoData.pk_psndoc_sub;
                  }
                  this.optype="edit";
                  this.listindex=personaldata.index;
                  if(typeof this.listindex=='number'){//获取子集中的某一条数据
                    this.infoData=personal_childs[this.listindex];
                  }
                }

                setStorage("editpage",this.infoData);
                setStorage("editpageVerify",this.infoData);
                setStorage("editpageStack",[])

              return


          },
          submitfun:function(){//基本信息提交按钮

            var editpageStack=getStorage("editpageStack");
            var editpage=getStorage("editpage");
            var str=""
            var _this=this;
            if(editpageStack.length>0){
              editpageStack.forEach(function(ele, index, a){
                str+=ele.name+","
                console.log(ele)
                editpage[ele.code]=ele.codevalue
              });
              str=str.slice(0,-1);
              MessageBox({
                title: '以下信息是需要审核的信息',
                message: str,
                confirmButtonText:"我要提交",
                cancelButtonText:"我要取消",
                showCancelButton: true
              }).then(action => {
                  if(action=='confirm'){
                    //确定
                      editpage.table_code=_this.table_code;
                      editpage.pkfilecode=_this.pkfilecode;
                      editpage.optype="edit";
                      // return

                      ajax('hrssc/portal/psnbase/saveSubInfo','POST',"application/json",{data:[editpage]},function(data){
                         console.log(data);
                        Toast("提交成功")
                        //debugger
                        setTimeout(function () {
                            _this.$router.goBack();
                        }, 500)
                      },function(data){
                        console.log(data);
                      });

                  }else{
                    //取消
                    return
                  }
                });
            }else{
              MessageBox('提示', '没有修改过数据');
            }
          },
          nextfun:function(){//其他子集信息提交按钮
            var editpageStack=getStorage("editpageStack");
            var editpage=getStorage("editpage");
            var str="";
            var addobj={};//新增时使用的对象
            var _this=this;
            var tempeditpagesatck=[];//临时暂存
            if(editpageStack.length>0){

              try{
                editpageStack.forEach(function(ele, index, a){
                  if(!ele.codevalue&&ele.mustflag=='Y'){
                     MessageBox('提示', ele.name+'为必填项');
                    forEach.break=new Error("StopIteration")
                  }

                  if(!ele.codevalue){//无数据则删除
                    //console.log(ele)
                  }else{
                    str+=ele.name+","
                    addobj[ele.code]=ele.codevalue;
                    tempeditpagesatck.push(ele)
                  }
                });
              }catch(e){
                console.log(e)
                return
              }

              editpageStack=tempeditpagesatck;
              if(editpageStack.length<1){
                MessageBox('提示', '没有修改过数据');
                return
              }

              str=str.slice(0,-1);
              MessageBox({
                title: '以下信息是需要审核的信息',
                message: str,
                confirmButtonText:"我要保存",
                cancelButtonText:"我要取消",
                showCancelButton: true
              }).then(action => {
                  if(action=='confirm'){
                    //成功

                    if(_this.optype=="add"){
                      editpage=addobj;
                    }
                    editpage.table_code=_this.table_code;
                    editpage.pkfilecode=_this.pkfilecode;
                    editpage.optype=_this.optype;

                    var personal_childs=getStorage("personal_childs");
                    if(typeof _this.listindex=='number'){
                      personal_childs[_this.listindex]=editpage;
                    }else{
                      personal_childs.push(editpage);
                    }
                    setStorage("personal_childs",personal_childs);

                    Toast("保存成功")
                    setTimeout(function () {
                        _this.$router.goBack();
                    }, 500)

                  }else{
                    //失败
                    return
                  }
                });
            }else{
              MessageBox('提示', '没有修改过数据');
            }
          },
          retractfun:function(){//撤回
              var _this=this;
              ajax('hrssc/portal/psnbase/revokeLisn','POST',"application/json",{tableCode:this.table_code},function(data){
                //console.log(data);
                Toast("撤回成功")
                setTimeout(function () {
                    _this.$router.goBack();
                }, 500)
              },function(data){
                console.log(data);
                console.log(333)
              });
          },

        }


    };
</script>


<style lang='less'scoped>
    @0CAEF5-color : #0CAEF5;
    @b2b2b2-color : #b2b2b2;
    .editpage{
        .h-body{
            overflow:scroll;
            .h-list-body {
              padding: 0.2rem;
              /*padding-bottom:1rem;
              border-bottom: 1px solid #e4e4e4;*/
              margin-bottom: 1.2rem;
              background:#fff;
              .h-body-term-img{
                height:2rem;
                border-bottom: 1px solid rgb(231, 231, 231);
                line-height: 0.5rem;
                text-align: left;
                position: relative;
                top: 0;
                left: 0;
                .h-term-name {
                  display: inline-block;
                  width: 1.8rem;
                  line-height: 0.5rem;
                  color: #808080;
                  font-size: 0.3rem;
                  text-align: left;
                  height:1.8rem;
                  line-height:1.8rem;
                }
                .h-term-value,.h-term-img {
                  display: inline-block;
                  width: 1.4rem;
                  height:1.8rem;
                  line-height: 1.8rem;
                  color: #343434;
                  font-size: 0.3rem;
                  text-align: center;
                  padding-left: 10px;
                  vertical-align: top;
                  float:right;
                  margin-right:0.2rem;

                  i{
                    font-size:1rem;
                  }
                }
              }
            }


        }
        .h-footer {
          width: 100%;
          height: 0.9rem;
          line-height: 0.9rem;
          position: fixed;
          bottom: 0;
          left: 0;
          .h-footer-btn {
            width: 100%;
            height: 0.9rem;
            text-align: center;
            background: @0CAEF5-color;
            color: #fff;
          }
        }

    }


</style>
