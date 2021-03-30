<template>

<div class="hr-list3">

  <div class="h-body-term" v-if="listmodule.hided=='N'">
    <span class="h-term-name">{{listmodule.name}}</span><span class="h-term-value">{{listinfo[listmodule.code]}}</span>
  </div>
   
</div>

</template>
<script>

    

    export default {
      name:'hr-list3',
        components: {
        },
         props:["listmodule","listinfo"],
        data(){
            return {
            }
        },       
        watch:{

        },
        mounted (){
            

        },
        methods:{
 
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
        .h-term-name {
          display: inline-block;
          width: 1.2rem;
          line-height: 0.5rem;
          color: #808080;
          font-size: 0.3rem;
          text-align: left;
        }
        .h-term-value {
          display: inline-block;
          width: 5.5rem;
          line-height: 0.5rem;
          color: #343434;
          font-size: 0.3rem;
          text-align: left;
          padding-left: 10px;
        }
      }
            
            
        

    }
    
</style>
