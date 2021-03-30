/*
 * Created by yangyang11 on 2017/8/16.
 *
 */
<template>
  <div>
    <myHeader title="正在努力开发中..."></myHeader>
    <img src="../../../../static/img/pages/application/noData.svg">
  </div>
</template>

<script>
import myHeader from '../../../components/base/my-header'
  export default {
    name: 'test',
    data (){
      return {
      }
    },
    components: {
      myHeader
    },
    methods : {
     
    }
  }
</script>

<style lang='less' scoped>
div{
  position: fixed;
  height: 100%;
  width: 100%;
}
img{
  margin-left: 26%;
  margin-top: 30%;
  height: 45%;
  width: 45%;
}
</style>