<template>
    <div >
        <div class="h-time-group">
            <span class="h-time-section">{{ title }}</span> 
            <div class="h-time-content ">
                <span class="h-time-start" >{{timestart}}</span>
                至 
                <span class="h-time-end">{{timeend}}</span><i class="icon hrfont hr-calendar" @click='openpopup'></i>
            </div>
        </div>
        <div class="time-picker">
            <mt-datetime-picker
              ref="picker"
              v-model="pickerVisible"d
              type="date"
              :endDate = 'endDate'
              year-format="{value} 年"
              month-format="{value} 月"
              date-format="{value} 日"
              @confirm="handleConfirm"
              :confirmText = 'text'>
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
                selectedtime:[],//选中的时间
                timeArrs:[],
                text : '下一步',
                startDate : new Date(),
                endDate : new Date(),
                //pickerVisible : new Date(),
            }
        },
        props : ['title'],
        mounted (){
            this.getdata();
            this.startDate = new Date()
        },
        watch:{

        },
        methods:{
            handleConfirm:function(data){
                this.text = '确定'
                if(this.start){
                    this.end = data //已选择开始时间，当前正在选择结束时间
                }else{
                    this.start = data//未选择开始时间，当前选择开始时间
                }
                if ( !this.end){
                    this.openpopup()    //未选择结束时间  继续弹出时间框
                }else{
                     //开始时间与结束时间均已选择，关闭选择框，将选择的时间回传给父组件
                    this.format(this.start,this.end)
                    this.text = '下一步'  
                    this.start = ''
                    this.end=''              
                }
            },
            openpopup(){//打开时间遮罩
                this.$refs.picker.open();
                // this.popupVisible=true;
                // this.openPicker();
            },
            format : function(start,end){
                this.timestart = this.start.getFullYear()+'-'+(this.start.getMonth()+1)+'-'+this.start.getDate();
                this.timeend = this.end.getFullYear()+'-'+(this.end.getMonth()+1)+'-'+this.end.getDate();
                this.$emit('getDate',[this.timestart,this.timeend]);
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
            currentTime:function(){
              var endyear=(new Date()).getFullYear();
              var endmonth=(new Date()).getMonth()+1;
              var endDay = (new Date()).getDate();
              var startmonth=endmonth-3+1;
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
              return year+"-"+(month>9?month:"0"+month)+"-"+day
              this.$emit('getDate',[this.timestart,this.timeend]);
            },
            getdata:function(){
              this.currentTime();
            }
        }
    };
</script>


<style lang='less'>
    @b2b2b2-color : #b2b2b2;
    .h-time-group{
        width:100%;
        height:0.9rem;
        position:relative;
        top: 0;
        left: 0;
        line-height:0.9rem;
        background:#f5f5f5;
        .h-time-section{
            margin-left: 0.3rem;
            font-size:0.28rem;
            color:#B2B2B2;
        }
        .h-time-content{
            width: 70%;
            height: 0.6rem;
            line-height: 0.6rem;
            background: #fff;
            position: absolute;
            border-radius: 4px;
            right: 0.2rem;
            top: 0.15rem;
            text-align: center;
            color: #333;
            .hrfont {
                position: absolute;
                right: 0.2rem;
                top: 0;
                color: @b2b2b2-color;
            }
        }
    }
    .time-picker{
        .mint-popup-bottom{
            height: 5.4rem;
        }
        
    }

    
</style>
