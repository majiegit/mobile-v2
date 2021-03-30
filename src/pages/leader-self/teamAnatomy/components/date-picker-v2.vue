<template>
    <div >
        <div class="hr2-time-group">
            <!-- <span class="h-time-section">{{ title }}</span>  -->
            <div class="hr2-time-content">
                截止 {{timestart}}
                <i class="icon hrfont hr-calendar" @click='openpopup'></i>
            </div>
        </div>
        <div class="time-picker">
            <mt-datetime-picker
              ref="picker"
              v-model="pickerVisible"
              type="date"
              :endDate = 'endDate'
              year-format="{value} 年"
              month-format="{value} 月"
              date-format="{value} 日"
              @confirm="handleConfirm"
              :confirmText = 'text'
              :label = 'label'
              >
            </mt-datetime-picker>   
        </div>
        <!-- <hrTime1 :timedata="timeArrs" v-on:increment="incrementTotal" ref="picker"></hrTime1> -->
    </div>
</template>
<script>
    import { myHeader, hrTime1 } from 'hr-ui'
    import { ajax, getStorage,setStorage } from 'hr-utils'
    import { Picker, Popup, Toast, Cell, DatetimePicker } from 'mint-ui';
    export default {
      name:'dataPicker',
        components: {
            myHeader,hrTime1
        },

        data(){
            return {
                popupVisible:true,//时间弹窗的开关
                timestart:"",//开始时间
                timeend:"",//结束时间
                start: '',
                end : '',
                timeArrs:[],
                text : '确定',
                startDate : new Date(),
                endDate : new Date(),
                pickerVisible : new Date(),
                label: '截止日期'
            }
        },
        props : ['title'],
        mounted (){
            this.getCurrentTime();
        },
        watch:{

        },
        methods:{

            //点击确定回调事件
            handleConfirm:function(data){
                this.start = data
                //将选择的时间回传给父组件
                this.format(this.start)
            },

            openpopup(){//打开时间遮罩
                this.$refs.picker.open();
                // this.popupVisible=true;
                // this.openPicker();
            },

            format : function(start){
                this.timestart = this.start.getFullYear()+'-'+(this.start.getMonth()+1)+'-'+this.start.getDate();
                this.pickerVisible = this.timestart
                this.$emit('getDate',this.timestart,'clicked');
            },

            initTimefun:function(){
                var times=this.timeend.split("-");
                times[0]=Number(times[0]);
                times[1]=Number(times[1]);

                var arr1=[times[0]-3,times[1]];
                var arr2=[times[0],times[1]];
                
                var newtimearr=[];
                while(arr1[0]!=arr2[0]||arr1[1]!=arr2[1]){
                    newtimearr.push(arr1[0]+"-"+(arr1[1]>9?arr1[1]:"0"+arr1[1]));
                    if(arr1[1]==12){
                        arr1[0]=Number(arr1[0])+1;
                        arr1[1]=1;
                    }else{
                        arr1[1]=Number(arr1[1])+1;
                    }
                }
                newtimearr.reverse();
                
                this.timeArrs=newtimearr;
            },

            getCurrentTime:function(){
              var endyear=(new Date()).getFullYear();
              var endmonth=(new Date()).getMonth()+1;
              var endDay = (new Date()).getDate();
              var startmonth=endmonth;
              var startyear=endyear;
              var startDay = endDay
              if(startmonth<1){
                  startmonth=9+Number(endmonth);
                  startyear=Number(startyear)-1;
              }
              //设置显示的默认时间数据
              this.timestart=this.outString(startyear,startmonth,startDay);
              this.timeend=this.outString(endyear,endmonth,endDay);
              this.initTimefun();


            },
            outString(year,month,day){//把数字时间转为字符串
              this.$emit('getDate',this.timestart,'init');
              return year+"-"+(month>9?month:"0"+month)+"-"+day
            },

        }
    };
</script>


<style lang='less' scope>
    @b2b2b2-color : #b2b2b2;
    .hr2-time-group{
        width:100%;
        height:0.58rem;
        margin-top: .15rem;
        position:relative;
        top: 0;
        left: 0;
        // line-height:0.88rem;
        background:#f5f5f5;
        .h-time-section{
            margin-left: 0.3rem;
            font-size:0.28rem;
            color:#B2B2B2;
        }
        .hr2-time-content{
            padding-left: .1rem;
            line-height: 0.58rem;
            font-size: .28rem;
        }
    }
    .time-picker{
        .mint-popup-bottom{
            height: 5.4rem;
        }
        
    }

    
</style>
