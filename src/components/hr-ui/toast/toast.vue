/**
 * Created by yangyang11 on 2017/11/1.
 * 
 */
<template>
    <div class="hr-toast" v-if='isShow'>
      <div class="hr-toast-content">
        <i class="icon hrfont" :class="iconType" v-if='iconType!=="hr-loading"'></i>
        <div class="hr-toast-transform" v-else></div>
        <div class="text" v-bind:style="{maxWidth : maxWidth }">
          {{ text }}
        </div>
      </div>
    </div>
</template>

<script>
/**
 * @example 
 * Toast.show({
 *   text: '提交成功',
 *   iconType: 'hr-check-mark', // 不传，则为普通提示语  icon取自hr-fonts
 *   timeout: 1000  //消失时间
 * }) 
 * Toast.show('哈哈哈') //直接传字符串 则弹出字符串内的内容   默认两秒消失
 */

export default {
    name:"my-header",
    props: {
      text: {
        type: String,
        default: ''
      },
      timeout : {
        type: Number,
        default: 2000
      },
      iconType : {
        type: String,
        default: ''
      }
    },
    data () {
        return {
          isShow: true,
        }
    },
    computed: {
      maxWidth(){
        return this.iconType?'2rem' : ''
      }
    },
    mounted(){
      setTimeout(()=>this.isShow = false, this.timeout)
    },
    methods: {
    
    },
        

}
</script>

<style lang='less' scoped>
.hr-toast{
  position: fixed;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  text-align: center;

  -webkit-justify-content:center;
  justify-content:center;
  -webkit--moz-box-pack:center;
  box-pack:center;
  
  align-items:center;
  -webkit-align-items:center;
  box-align:center;
  -webkit-box-align:center;
  .hr-toast-content{
   
    padding: .3rem;
    background: rgba(0,0,0,.7);
    border-radius: 5px;
    i{
      height: 1rem;
      width: 1rem;
      font-size: 1rem;
      color: #fff;
    }
    .text{
      max-width: 5.4rem;
      border-radius: 5px;
      z-index: 10;
      color: #fff;
    }
  }
  .shade{
    position: fixed;
    z-index: 9;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0,0,0,.4)
  }
  
}


</style>
