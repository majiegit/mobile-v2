<template>

<div  class="salarydetail">
    <div ref="myheader" >
        <div class="header"> 
            <hr-header
                title='薪资详情'
                v-on:lcallBack='goback'
                >
            </hr-header>
       </div>
    </div>

    <div class="h-hrlist1" :style="{ 'height': currentHeight + 'px'}">
      <div class="h-time" >
        <span>{{detaildata.salaryList[detaildata.countItem[0]].content.slice(0,4)}}年{{detaildata.salaryList[detaildata.countItem[0]].content.slice(5,7)}}月</span>
      </div>
      <salaryDetaillist :listdata="detaildata" ></salaryDetaillist>
    </div>
</div>

</template>


<script>
/*
    查薪资详情页  zhanghua 2017/08/26
 */

    import { HrHeader } from 'hr-ui'
    import salaryDetaillist from './salary-detaillist.vue'
    

    export default {
      name:'salarydetail',
        components: {
            HrHeader,salaryDetaillist
        },
        data(){
            return {
                currentHeight: this.height,
                detaildata:JSON.parse(this.$route.params.detaildata)
            }
        },
        mounted (){
            this.currentHeight = document.documentElement.clientHeight - this.$refs.myheader.offsetHeight;
        },
        watch:{
            height(val) {
                if (val) {
                  this.currentHeight = val;
                }
              }
        },
        methods:{
            goback() {
                this.$router.push({
                    name: 'salary',
                    params: {
                      secret: this.$route.params.secret,
                      timestart: this.$route.params.timestart
                    }
                })
            }
        }
        

    };
</script>


<style lang='less'scoped>
    @fff-color : #ffffff;
    @333-color : #333333;

   .h-time{
      width: 100%;
      padding: 0.2rem 0.2rem 0.2rem 0.25rem;
      font-size: 0.3rem;
      color:#666;
   }
   .h-hrlist1{
    overflow: scroll;
   }
    
.header{
    height: .88rem;
    line-height: .88rem;
}
    
</style>
