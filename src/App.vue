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
//     watch: {
// 　　　'$route' (to, from) {
// 　　　　let isBack = this.$router.isBack  //  监听路由变化时的状态为前进还是后退
//         console.log(isBack,to.path)
// 　　　　　　if(isBack || to.path =='/application') {   //返回或返回首页
// 　　　　　　　　this.transitionName = 'slide-right'
// 　　　　　　} else {
// 　　　　　　       this.transitionName = 'slide-left'
// 　　　　　}
// 　     this.$router.isBack = false
// 　　}
// 　  } 
  }  
</script>
<style>

.Router {
       position: absolute;
       width: 100%;
       height: 100%;
       transition: all .8s ease;
    }
    .slide-left-enter,
       .slide-right-leave-active {
           opacity: 0;
          -webkit-transform: translate(100%, 1);
          transform: translate(100%, 0);
      }
      .slide-left-leave-active,
      .slide-right-enter {
        opacity: 0;
        -webkit-transform: translate(-100%, 1);
        transform: translate(-100% 0);
      }
  html {
    font-size: 50px;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: block;
    background:#e4f1fc;
    font-family: PingFangSC-Regular;
  }
  body {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    font-size: 0.32rem;
    background: #F5F5F5;
  }
  #app{
    height: 100%;
    width: 100%;
  }
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    border:0;
    word-wrap:break-word;
    -webkit-touch-callout:none;
  }
  * {-webkit-tap-highlight-color:rgba(0,0,0,0);}
  input,button,select,textarea{
    outline:none;
    border:none;
  }
</style>
