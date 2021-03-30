<template>

<div class="hrscroll">
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
    <hrScroll :scrolldata="data"  v-on:increment="incrementTotal" ref="scrollpopup"></hrScroll>
    @data：{ type:"",data:[]}，type:sex/date/blood/data,data是给自定义内容，数据放到data中
    @incrementTotal：回调函数
        incrementTotal:function(data){//传递到子组件中的回调方法
            console.log(data);//{data:"Array"},date的类型是数组
        },            
        openpopup(){//打开时间遮罩
            this.popupVisible=true;
            this.openpopup();
        },
        openpopup() {//调用子组件的方法
          this.$refs.scrollpopup.openpopup();//子组件的方法
        },

 */

    import { Picker,Popup,Toast,Cell } from 'mint-ui';

    export default {
      name:'hrscroll',
        components: {
        },
        props:["scrolldata"],
        data(){
            return {
                slots: [
                    {
                      flex: 1,
                      values: ['2015', '2016', '2017', '2018', '2019', '2020'],
                      className: 'slot1',
                      textAlign: 'center',
                    }, {
                      divider: true,
                      content: '-',
                      className: 'slot2',
                      textAlign: 'center',
                    }, {
                      flex: 1,
                      values: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
                      className: 'slot3',
                      textAlign: 'center',
                    },
                     {
                      divider: true,
                      content: '-',
                      className: 'slot4',
                      textAlign: 'center',
                    }, {
                      flex: 1,
                      values: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
                      className: 'slot5',
                      textAlign: 'center',
                    }
                  ],
                popupVisible:false,//弹窗的开关
                selected:[],//选中的数据
                searchNum:12,//最多显示数据的月份
                hpicker:"",//保存picker对象
                items:[],//用于监听数据变化的数组
                dateslots: [
                    {
                      flex: 1,
                      values: ['2015', '2016', '2017', '2018', '2019', '2020'],
                      className: 'slot1',
                      textAlign: 'center',
                    }, {
                      divider: true,
                      content: '-',
                      className: 'slot2',
                      textAlign: 'center',
                    }, {
                      flex: 1,
                      values: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
                      className: 'slot3',
                      textAlign: 'center',
                    },
                     {
                      divider: true,
                      content: '-',
                      className: 'slot4',
                      textAlign: 'center',
                    }, {
                      flex: 1,
                      values: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
                      className: 'slot5',
                      textAlign: 'center',
                    }
                ],
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
                datalots: [
                    {
                      flex: 1,
                      values: [],
                      className: 'slot1',
                      textAlign: 'center',
                    }
                ],
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
                this.items=this.scrolldata;
                switch(this.items.type){
                    case "blood":
                        this.slots=this.bloonslots;
                    break;
                    case "sex":
                        this.slots=this.sexslots;
                    break;
                    case "date":
                        //this.slots=this.dateslots;
                        this.hpicker.setSlotValue(1, this.slots[2].values[2])  
                        this.hpicker.setSlotValue(2, this.slots[4].values[2]) 
                    break;
                    case "data":
                        this.datalots[0].values=this.items.data
                        this.slots=this.datalots;
                    break;
                }
                
                // //设置时间组件的默认数据
                this.hpicker.setSlotValue(0, this.slots[0].values[2])    
              },
            incrementCounter:function(data){//调用父组件的方法
                this.$emit('increment',data);
            },
            onValuesChange(picker, values) {
                this.hpicker=picker;
                console.log(values)
                this.selected=values;
            },
            openpopup(){//打开遮罩
                this.popupVisible=true;
            },
            closepopup(){//关闭遮罩
                this.popupVisible=false;
            },
            entersel(){//确定获取数据
                this.incrementCounter({"data":this.selected});
                this.popupVisible=false;
                 
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
    .hrscroll .picker-center-highlight{
        background: rgba(66, 61, 61, 0.12);
    }
</style>