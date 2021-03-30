<template>

<div class="hrcontrast">
    <mt-popup
      v-model="popupVisible"
      position="top" closeOnClickModal=false class="h-mt-popup">
        <div class="h-btn-group" :style="{  'height': currentHeightall+'px' }">
            <div ref="myheader" >
              <myHeader title="参照列表" :callbackfun="closepopup"></myHeader>
              <span class="h-btn-ok" @click="enterfun">确定</span>
              <div class="h-sel-title">
                <span v-if="seldata<1">请选择</span>
                <span v-for="(sel,index) in seldata" class="h-title-list" @click="sellisttitle(sel)">{{sel.title}}<i v-if="(index+1)!=seldata.length" class="icon hrfont hr-right"></i></span>
              </div>
            </div>
            <div class="h-list-group" :style="{  'height': currentHeightall+'px' }">

                <div v-for="list in listdata">
                   <div class="h-list-data" @click="sellist(list)">
                       <span>{{list.title}}</span>
                       <!-- <span class="h-list-mark"><i  class="icon hrfont hr-check-mark2"></i></span> -->
                   </div>
                </div>
            
            </div>
            <div class="h-prompt" :class="{active:isActive}"><span>您还没有选择条目</span></div>
        </div>
      
    </mt-popup>
</div>

</template>
<script>
 /*
 * Created by zhanghuag on 2017/09/08.
 * 多级参照组件，
 * @module components/scroll
 *
 * @param {string} [param] - 读取localStorage中数据的属性名
 * @param {function} [increment] - 回调函数，用于把数据传回啦
 *
 *
 * example
 * <hrcontrast  v-on:increment="incrementContrast" :param="stringtype" ref="pickercontrast"></hrcontrast>
 *
    incrementContrast:function(data){//传递到子组件中的回调方法
        console.log(data);//data子组件返回的数据
    },
    openPicker() {//打开子组件
      this.$refs.pickercontrast.openpopup();
    },
 *
 */

    import { Popup} from 'mint-ui'
    import { Toast} from 'mint-ui'

    import myHeader from '../../components/base/my-header.vue'
    import tools from '../../utils/tools'

    export default {
      name:'hrcontrast',
        components: {
            myHeader
        },
        props:["param"],
        data(){
            return {
                currentHeight: this.height,
                currentHeightall:'500',//设置可现实的默认高度
                popupVisible:false,//弹窗的开关
                listdata:"",//参照数据列表
                seldata:[],//选择的数据列表
                isActive:false,//提示信息是否显示
            }
        },
        mounted (){
            this.currentHeight = document.documentElement.clientHeight - this.$refs.myheader.offsetHeight;
            this.currentHeightall = document.documentElement.clientHeight;
            //this.getData()
        },
        watch:{
            height(val) {
                if (val) {
                  this.currentHeight = val;
                }
              },
        },
        methods:{      
            openpopup(){//打开遮罩
                this.popupVisible=true;
                this.getData();
            },
            closepopup(){//关闭遮罩
                this.popupVisible=false;
                this.seldata=[];
            },
            getData:function(){//获取参照数据
               this.listdata=tools.getStorage(this.param);
            },
            sellist:function(ldata){//选择展示列表中的数据
                this.seldata.push(ldata)
                this.listdata=ldata.data;
            },
            sellisttitle:function(ldata){//点击选中列表数据，切换数据
                var num=this.seldata.indexOf(ldata)+1;
                this.seldata=this.seldata.splice(0,num);
                this.listdata=ldata.data;
            },
            enterfun:function(){

              if(this.seldata.length>0){
                this.$emit('increment',this.seldata);//调用父组件的方法
                this.popupVisible=false;
                this.seldata=[];
              }else{
                this.isActive=true;
                setTimeout(() => {
                  this.isActive=false;
                }, 2000);
              }
            },




        }
        

    }
</script>


<style lang='less'scoped>
    @0CAEF5-color : #0CAEF5;
    @b2b2b2-color : #b2b2b2;
    .h-mt-popup{
        width:100%;
        .h-btn-group{
            width:100%;
            background:#fff;
            position:relative;
            top:0;
            left:0;
            height:5rem;
            .h-btn-ok {
                position: absolute;
                right: 0.2rem;
                top: 0;
                z-index: 20;
                width: 1rem;
                height: 0.88rem;
                line-height: 0.88rem;
                text-align: right;
                color:@0CAEF5-color;
            }
            .h-sel-title{
                width: 100%;
                padding: 0.2rem;
                line-height:0.6rem;
                border-bottom: 1px solid #e7e7e7;
                .h-title-list {
                    padding-right: 0.2rem;
                    color:@0CAEF5-color;
                }
            }
            .h-list-data {
                width: 100%;
                height: 0.8rem;
                line-height: 0.8rem;
                padding: 0 0.2rem;
                border-bottom: 1px solid #e7e7e7;
                position:relative;
                top:0;
                left:0;
                .h-list-mark{
                    display: block;
                    width: 0.8rem;
                    height:0.8rem;
                    line-height:0.8rem;
                    position: absolute;
                    right: 0.2rem;
                    top: 0px;
                    color: @0CAEF5-color;
                    i{
                        font-size:0.4rem;
                    
                    }

                }
            }
            .h-list-group{
              overflow-x:hidden;
              padding-bottom:2rem;

            }
            .h-prompt {
              display: none;
              position: absolute;
              top: 5rem;
              left: 0;
              z-index: 200;
              text-align: center;
              width: 100%;
              height: 0.88rem;
              line-height: 0.88rem;
              span {
                padding: 0.1rem;
                background: rgba(0, 0, 0, 0.7);
                color: #fff;
                border-radius: 5px;
                font-size: 0.28rem;
              }
            }
            .h-prompt.active{
              display:block;
            }
        }

    }    

</style>