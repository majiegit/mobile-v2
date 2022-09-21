<template>
  　  <transition :name="transitionName">
  　　　  <router-view class='Router'></router-view>
  　　</transition>
</template>

<script>
  export default {
    name: 'app',
    data () {
      return {
        transitionName: 'slide-left'
      }
    },
    mounted (){

    },
  }
</script>
<style>
</style>
