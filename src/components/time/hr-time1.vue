<template>

<div class="hrtime1">
    <mt-popup
      v-model="popupVisible"
      position="bottom" closeOnClickModal=false class="h-mt-popup">
        <div class="h-btn-group">
            <div class="h-btn-title">开始期间<i></i>结束期间</div>
            <span class="h-btn-l" @click="closepopup">取消</span><span class="h-btn-r" @click="entersel">确定</span>
        </div>
        <mt-picker :slots="slots" @change="onValuesChange" ></mt-picker>
    </mt-popup>
</div>

</template>
<script>
/**
 *  调用该组件，父组件的写法
 *  <diyChild :timedata="timeArrs" v-on:increment="incrementTotal" ref="picker"></diyChild>
 *  @timeArra:Array，必须是数组，格式如下['2015-03', '2015-02']，倒叙
 *  @incrementTotal:回写函数，父组件通过该函数获取子组件数据
 *  @picker：父组件获取子组件对象，调用格式如：this.$refs.picker.open()，open是子组件的方法
 * 
 */

    import { Picker,Popup,Toast } from 'mint-ui';

    export default {
      name:'hrtime1',
        components: {
        },
        props:["timedata"],
        data(){
            return {
                slots: [
                    {
                      flex: 1,
                      values: ['2015-01', '2015-02', '2015-03', '2015-04', '2015-05', '2015-06'],
                      className: 'slot1',
                      textAlign: 'right',
                    }, {
                      divider: true,
                      content: '-',
                      className: 'slot2'
                    }, {
                      flex: 1,
                      values: ['2015-01', '2015-02', '2015-03', '2015-04', '2015-05', '2015-06'],
                      className: 'slot3',
                      textAlign: 'left',
                    }
                  ],
                popupVisible:false,//时间弹窗的开关
                selectedtime:[],//选中的时间
                searchNum:12,//最多显示数据的月份
                hpicker:"",//保存picker对象
                items:[],//用于监听数据变化的数组
            }
        },
        mounted (){
            this.init();
        },
        watch:{
          items() {
            this.init();
          }
        },
        methods:{
            init() {
                this.items=this.timedata;//获取变化的数据
                this.slots[0].values=this.items;
                this.slots[2].values=this.items;
                //设置时间组件的默认数据
                this.hpicker.setSlotValue(0, this.slots[0].values[1]) 
                this.hpicker.setSlotValue(1, this.slots[2].values[0]) 
              },
            incrementCounter:function(arr){//调用父组件的方法
                this.$emit('increment',arr);
            },
            openpopup(){//打开时间遮罩
                this.popupVisible=true;
            },
            onValuesChange(picker, values) {
                this.hpicker=picker;
                if (values[0] > values[1]) {
                   picker.setSlotValue(1, values[0]);
                }

                //判断时间长度
                var monthnum=this.contrastSize(values[0],values[1]);
                if(monthnum<=this.searchNum&&monthnum>0){
                    this.selectedtime=values;
                }else if(monthnum>this.searchNum){
                    console.l
                    Toast('起止时间不能大于12个月');
                }
            },
            contrastSize(str1,str2){//获取两个时间相差多少个月
                if(!str1||!str2){return 0}
                var arr1=str1.split("-");
                    arr1=[Number(arr1[0]),Number(arr1[1])]
                var arr2=str2.split("-");
                    arr2=[Number(arr2[0]),Number(arr2[1])]
                var year=arr2[0]-arr1[0];
                var month=arr2[1]-arr1[1];
                var newmonth=0
                
                return (year*12+arr2[1]-arr1[1]+1)
           
                
            },
            closepopup(){//关闭遮罩
                this.popupVisible=false;
            },
            entersel(){//确定获取数据
                if(!this.selectedtime[0]||!this.selectedtime[1]){
                    Toast('请选择起止时间');
                }else{
                    var monthnum=this.contrastSize(this.selectedtime[0],this.selectedtime[1]);
                    if(monthnum<=this.searchNum&&monthnum>0){

                        this.incrementCounter([this.selectedtime[0],this.selectedtime[1]]);
                        this.popupVisible=false;
                    }
                    if(monthnum>this.searchNum){
                        Toast('起止时间不能大于12个月');
                    }
                }
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
    .hrtime1 .h-mt-popup .picker-center-highlight{
        background: rgba(66, 61, 61, 0.12);
    }
</style>