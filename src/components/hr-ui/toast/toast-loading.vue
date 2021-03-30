/**
 * Created by yangyang11 on 2017/11/1.
 * 
 */
<template>
    <div class="hr-toast" v-if='isShow' id='hrToastLoading' @click='hidden'>
      <div class="hr-toast-content">
        <div class="hr-toast-rotate">
          <div class="hr-toast-transform"></div>
        </div>
        <div class="text">
          {{ text }}
        </div>
      </div>
      <div class="shade" v-if='shadeColor=="gray"'/>
      <div class="whiteshade" v-if='shadeColor=="white"'/>   
    </div>
</template>

<script>
/**
 * @example 
 * Toast.loading('哈哈哈')
 * Toast.close() // 关加载动画
 */

export default {
    name:"my-header",
    props: {
      text: {
        type: String,
        default: ''
      },
      close: {
        type: Boolean,
        default: false
      },
      shadeColor: {
        type: String,
        default: ''  // white gray  都遮挡全部  空或不传 没遮罩，只有中间显示框
      },
    },
    data () {
        return {
          isShow: true,
        }
    },
    mounted(){
    },
    methods: {
     hidden(){
      if(this.close){
        this.isShow = false
      }
     }
    },
        

}
</script>

<style lang='less' scoped>
.hr-toast{
  // position: fixed;
  // display: -webkit-box;
  // display: -webkit-flex;
  // display: flex;
  // height: 100%;
  // width: 100%;
  // left: 0;
  // top: 0;
  // text-align: center;
  // z-index: 0;
  // -webkit-justify-content:center;
  // justify-content:center;
  // -webkit--moz-box-pack:center;
  // box-pack:center;
  
  // align-items:center;
  // -webkit-align-items:center;
  // box-align:center;
  // -webkit-box-align:center;
  .hr-toast-content{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: .3rem;
    background: rgba(0,0,0,.7);
    border-radius: 5px;
    .hr-toast-rotate{
      width: 100%;
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      -webkit-justify-content:center;
      justify-content:center;
      -webkit--moz-box-pack:center;
      box-pack:center;
      margin-bottom: 0.3rem;
      .hr-toast-transform{
        display: inline-block;
        border: 3px solid transparent;
        border-top-color: rgb(204, 204, 204);
        border-left-color: rgb(204, 204, 204);
        border-bottom-color: rgb(204, 204, 204);
        height: 32px;
        width: 32px;
        transform: translate(0, -50%);
        animation: rotate .8s linear infinite;
        border-radius: 50%;
      }
    }
    .text{
      max-width: 2rem;
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
  .whiteshade{
    position: fixed;
    z-index: 9;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }
}
@-webkit-keyframes rotate{from{transform: rotate(0deg)}
    to{transform: rotate(360deg)}
}

</style>
