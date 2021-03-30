<template>

<div class="editlist">
    <div ref="myheader" class="h-header">
      <myHeader :title="title"></myHeader>
      <!-- <span class="h-delete-btn" v-if="moduleData.checkflag=='Y'">删除</span> -->
      <span class="h-delete-btn" @click="showdeletebtn" v-if="!examineflag">{{deletebtn}}</span>
    </div>
    <div class="h-body" :style="{ 'height': currentHeight + 'px'}">

      <div @click="gopage({
            'name':'editpage',
            'formstate':'newadd',
            'modulelist':moduleData,
            'isEdit':true,
            'parent':'editlist'})" >
        <div class="h-body-title" v-if="addflag=='Y'&&!deleteflag&&!examineflag"><i class="icon hrfont hr-plus"></i><span>新增{{title}}</span></div>
          
      </div>
      <div class="h-list-body">

        <div class="h-term-group h-green"  v-for="(termgroup, index) in personal_childs" :key="index">
          <div class="h-relative" v-if="termgroup.optype!='del'"  @click="gopage({ 
                  'name':'editpage',
                  'modulelist':moduleData,
                  'infoData':termgroup,
                  'isEdit':true,
                  'parent':'editlist',
                  'index':index})" >
            <hrList3 :listmodule="modulelist" :listinfo="termgroup"  :isEdit="isEdit" page="showlistflag"  v-for="(modulelist,nindex) in moduleData.tablefield" :key="nindex"></hrList3>

            <div class="h-delete" v-if="deleteflag" @click="deletefun(index)"><i class="icon hrfont hr-close"></i></div>
          </div>

        </div>
       
      </div>   
     
    </div>
    <div ref="footer">
      <div   class="h-footer">
        <div v-if="!examineflag" @click="submitfun" class="h-footer-btn">提交</div>
        <div v-if="examineflag" @click="retractfun" class="h-footer-btn">撤回</div>
      </div>
    </div>
   



</div>

</template>
<script>

    import hrList3 from './hr-list3.vue'
    import { myHeader } from 'hr-ui'
    import { ajax, setStorage,getStorage } from 'hr-utils'
    import { Toast } from 'mint-ui'

    export default {
      name:'editlist',
        components: {
            myHeader,hrList3
        },         
       // props:["listtype","moduleData","infoData"],   
        data(){
            return {
                currentHeight: this.height,
                configData:"",
                infoData:"",
                modulardata:"",
                liststyle:{
                  lineheight:"0.9rem",
                  textalign:"right",
                  borderbottom:"1px solid #e7e7e7",
                },
                isEdit:false,
                title:"",
                addflag:"",
                personal_childs:"",//本地新增数据
                deleteflag:false,//是否显示删除按钮
                deletebtn:"删除",//按钮显示名称
                table_code:"",//子集code编码
                examineflag:"",//是否需要审核
            }
        },       
        watch:{
            height(val) {
                if (val) {
                  this.currentHeight = val;
                }
              },

        },
        created(){

        },
        mounted (){
            this.currentHeight = document.documentElement.clientHeight - this.$refs.myheader.offsetHeight- this.$refs.footer.offsetHeight;
            
             this.getdata();
        },
        methods:{
          getdata:function(){
                this.personal_childs=getStorage("personal_childs");
                var personal_editlist=getStorage("personal_editlist");

                if(!personal_editlist){console.log("数据有问题，localStorage没有获取到");return false}
                var personaldata=personal_editlist;

                this.infoData=personaldata.infoData;
                this.moduleData=personaldata.modulelist;
                this.addflag=personaldata.modulelist.addflag;
                this.title=personaldata.modulelist.name;
                this.table_code=personaldata.modulelist.table_code;
                this.examineflag=personaldata.examineflag;

                if(this.personal_childs.length<1&&(personaldata&&personaldata.infoData&&(personaldata.infoData instanceof Array))){//初始化子集，如果为空，则获取历史数据，如不为空，表示初始化完毕
                  this.personal_childs=personaldata.infoData;
                  setStorage("personal_childs",this.personal_childs);
                }

              return


          },
          gopage:function(param){//打开链接
            if(this.deleteflag==true||this.examineflag){return}
              this.$router.push({name:param.name})
              setStorage("personal_editpage",param)
          },
          showdeletebtn:function(){
            if(this.deleteflag==true){
              this.deleteflag=false;
              this.deletebtn="删除";
            }else{
              this.deleteflag=true;
              this.deletebtn="完成";
            }

          },
          deletefun:function(num){//删除
            var newpersonal=this.personal_childs[num];
            newpersonal.optype='del';
            newpersonal.table_code=this.table_code;
            newpersonal.pkfilecode=newpersonal.pk_psndoc_sub;

            // this.personal_childs[num]=newpersonal;
            this.personal_childs.splice(num,1,newpersonal)
            setStorage("personal_childs",this.personal_childs);
          },
          submitfun:function(){//提交数据
            var subpersonal_childs=getStorage("personal_childs");

            var newsubdata = subpersonal_childs.filter(function(item) {
                return item.optype;
            });
            var _this=this;
            newsubdata.forEach(function(value, index, array) {
                array[index].table_code=_this.table_code;
                array[index].pkfilecode=array[index].pk_psndoc_sub;

            });

            if(newsubdata<1){
              console.log("无修改");
              Toast("无修改")
              return
            }
            //console.log(newsubdata)
            ajax('hrssc/portal/psnbase/saveSubInfo','POST',"application/json",{data:newsubdata},function(data){
              //console.log(data);
              Toast("提交成功")
              setTimeout(function () {
                  _this.$router.goBack();
              }, 500)
            },function(data){
              console.log(data);
              console.log(333)
            });



          },
          retractfun:function(){//撤回
              var _this=this;
              ajax('hrssc/portal/psnbase/revokeLisn','POST',"application/json",{tableCode:this.table_code},function(data){
                
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
    .editlist{
      .h-header{
        position:relative;
        top:0;
        right:0;
        .h-delete-btn{
          position: absolute;
          right: 0.2rem;
          top: 0;
          z-index: 30;
          width: 1rem;
          height: 0.88rem;
          line-height: 0.88rem;
          color: @0CAEF5-color;
          text-align: right;
        }
      }
      .h-body{
          overflow:scroll;
          .h-body-title{
            width:100%;
            height:0.88rem;
            line-height:0.88rem;
            text-align:center;
            i{
              display:inline-block;
              width:0.88rem;
              height:0.88rem;
              font-size:0.6rem;
              color: @0CAEF5-color;
            }
            span{
              vertical-align: top;

            }
          }
          .h-list-body {
            padding: 0.2rem;
            border-bottom: 1px solid #e4e4e4;
            margin-bottom: 1.2rem;
            background:#fff;
            .h-term-group {
              border-bottom: 1px solid #e7e7e7;
              margin-bottom:0.1rem;
              .h-relative{
                position:relative;
                .h-delete{
                  position:absolute;
                  right: 0;
                  top: 0;
                  width: 0.88rem;
                  height: 0.88rem;
                  text-align: center;
                  i{
                    color:#FE5B5B;
                    font-size: 0.44rem;
                    line-height: 0.88rem;
                  }
                }
              }
            }
            .h-green{
              background:rgba(0,128,0,0.1)
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
