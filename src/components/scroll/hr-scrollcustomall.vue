<template>

<div class="hrscrollcustom">
    <mt-popup
      v-model="popupVisible"
      position="bottom" closeOnClickModal=false class="h-mt-popup">
        <div class="h-btn-group">
            <!-- <div class="h-btn-title">开始时间<i></i>结束时间</div> -->
            <span class="h-btn-l" @click="closepopup">取消</span><span class="h-btn-r" @click="entersel">确定</span>
        </div>
        <mt-picker :slots="slots" @change="onValuesChange" ></mt-picker>
    </mt-popup>
</div>

</template>
<script>


/*
使用说明
引入组件html
    <hrScrollcustomall v-on:increment="incrementTotal" ref="scrollcustomallpopup"></hrScrollcustomall>
    
    @incrementTotal：回调函数
        incrementTotal:function(data){//传递到子组件中的回调方法
            console.log(data);
            //{"data":Object,"name":String,"num":String}
                data：是对应父级传递数组的一个元素，
                name：对应的回传给父级的所对应的字段名称，
                num：对应参照的顺序，以0开始
        },            
        openpopup(){//打开时间遮罩
            this.popupVisible=true;
            this.openpopup();
        },
        openpopup() {//调用子组件的方法
          this.$refs.scrollcustomallpopup.openpopup();//子组件的方法
          this.$refs.scrollcustomallpopup.refresh(val);//刷新子组件的方法，val刷新数据
          //val数据说明：{ type:"",data:[],name:"",mark:""}，
            type:sex/blood/custom,custom，是给自定义内容，
            data:数据放到data中,
            name:回传给父级的所对应的字段名称
            mark:数组中要显示的字段key值
            举例
            {
                type："custom",
                data:[{"title":"收入证明","number":"a1233","id":"32423"},{"title":"婚育证明","number":"a1234",,"id":"54534"}],
                name:"dome1",
                mark:"title"
            }
        },

 */

    import { Picker,Popup,Toast,Cell } from 'mint-ui';

    export default {
      name:'hrscrollcustomall',
        components: {
        },
        props:["scrolldata"],
        data(){
            return {
                slots: [
                    {
                      flex: 1,
                      values: ["A","B","AB","O","其他"],
                      className: 'slot1',
                      textAlign: 'center',
                    }
                  ],
                popupVisible:false,//弹窗的开关
                selected:[],//选中的数据
                hpicker:"",//保存picker对象
                items:[],//用于监听数据变化的数组
                bloonslots: [
                    {
                      flex: 1,
                      values: ["A","B","AB","O","其他"],
                      className: 'slot1',
                      textAlign: 'center',
                    }
                ],
                sexslots: [
                    {
                      flex: 1,
                      values: ['男', '女', '其他'],
                      className: 'slot1',
                      textAlign: 'center',
                    }
                ],
                customslots: [
                    {
                      flex: 1,
                      values: [],
                      className: 'slot1',
                      textAlign: 'center',
                    }
                ],
                overtimesubsidylots: [
                    {
                      flex: 1,
                      values: [],
                      className: 'slot1',
                      textAlign: 'center',
                    }
                ],
            }
        },
        methods:{
            incrementCounter:function(data){//调用父组件的方法
                this.$emit('increment',data);
            },
            onValuesChange(picker, values) {
                this.hpicker=picker;
                this.selected=values;
            },
            openpopup(){//打开遮罩
                this.popupVisible=true;
            },
            closepopup(){//关闭遮罩
                this.popupVisible=false;
            },
            entersel(){//确定获取数据
                var arrs=this.slots[0].values,num=-1;
                for(var i=0;i<arrs.length;i++){
                    if(arrs[i]==this.selected[0]){
                        num=i;
                        break;
                    }
                }

                this.incrementCounter({"data":this.items.data[num],"name":this.items.name,"num":num});
                this.popupVisible=false;
            },
            refresh(val){
                this.items=val;
                var dataarr=[];
                switch(this.items.type){
                    case "blood":
                        this.slots=this.bloonslots;
                        this.items.data=this.bloonslots[0].values;
                    break;
                    case "sex":
                        this.slots=this.sexslots;
                        this.items.data=this.sexslots[0].values;
                    break;
                    case "custom":
                        for(var i=0;i<this.items.data.length;i++){
                           dataarr.push(this.items.data[i][this.items.mark])
                        }
                        this.customslots[0].values=dataarr
                        this.slots=this.customslots;
                    break;
                    case "salary":
                        for(var i=0;i<this.items.data.length;i++){
                           dataarr.push(this.items.data[i][this.items.mark])
                        }
                        this.overtimesubsidylots[0].values = dataarr
                        this.slots = this.overtimesubsidylots;
                }
                
                // //设置组件的默认数据
                this.hpicker.setSlotValue(0, this.slots[0].values[0])  
            }


        }
        

    };
</script>


<style lang='less'scoped>
    @0CAEF5-color : #0CAEF5;
    @b2b2b2-color : #b2b2b2;
    .h-mt-popup{
        width:100%;
        .h-btn-group{
            width:100%;
            padding-top:0.8rem;
            background:#fff;
            position:relative;
            top:0;
            left:0;
            span{
                padding:0.2rem 0.3rem;
                position:absolute;
                top:0;
                z-index:30;
            }
            .h-btn-title{
                width: 100%;
                text-align: center;
                position: absolute;
                top: 0.2rem;
                left: 0;
                font-size: 0.3rem;
                z-index:20;
                i{
                    display:inline-block;
                    width:36px;
                    height:10px;
                }
            }
            .h-btn-l{
                left:0;
            }
            .h-btn-r{
                right:0;
                color:@0CAEF5-color;
            }
        }

    }    

    
</style>
<style>
    .hrscrollcustom .picker-center-highlight{
        background: rgba(66, 61, 61, 0.12);
    }
</style>