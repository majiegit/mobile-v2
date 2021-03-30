/**
 * Created by yangyang11 on 2017/11/1.
 * 
 */
<template>
    <div class="hr-messageBox" v-if='isShow' id='hr-messageBox'>
      <div class="hr-mes-content" 
          v-bind:class='Cclass'>
        <div class="hr-mes-top">
          {{ title }}
        </div>
        <div class="hr-mes-middle">
          <div class="hr-mes-text">
            {{ text }}
          </div>
        </div>
        <div class="hr-mes-bottom">
          <div class="hr-mes-cancle" @click='LClick' v-if='type == "confirm"'>{{ cancel }}</div>
          <div class="hr-mes-confirm" @click='RClick'>{{ confirm }}</div>
        </div>
      </div>
      <div class="hr-mes-bodybgc"></div>
    </div>
</template>

<script>
/**
 * @example
 * Message.confirm({
 *   title: '标题1', //不传默认无标题
 *   text: '确定执行此操作吗？', 
 *   confirm：'ok', // 不传为确定
 *   cancel: 'cancle' //不传为取消
 *   confirmEvent: ()=>{console.log('确定')}, 
 *   cancelEvent: ()=>{console.error('取消')},//可不传
 * })
 *
 * Message.alert({
 *   title: '标题1', //不传默认无标题
 *   text: '确定执行此操作吗？', 
 *   confirm：'ok', // 不传为确定
 *   confirmEvent: ()=>{console.log('确定')},
 * })
 */

export default {
    name:"my-header",
    props: {
      title: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: 'alert'
      },
      text: {
        type: String,
        default: ''
      },
      confirm : {
        type: String,
        default: '确定'
      },
      cancel : {
        type: String,
        default: '取消'
      },
      confirmEvent: {
        type: Function,
        default: ()=>{}
      },
      cancelEvent: {
        type: Function,
        default: ()=>{}
      },
    },
    data () {
        return {
          isShow: true,
          Cclass : 'hr-mes-content-show'
        }
    },
    methods: {
        LClick(){
          this.hideMessageBox()
          this.cancelEvent()
        },
        RClick(){
          this.hideMessageBox()
          this.confirmEvent() 
        },

        hideMessageBox(){
          this.Cclass = 'hr-mes-content-hidden'
          setTimeout(()=>{this.isShow = false},200)
        } 
    },
        

}
</script>

<style lang='less' scoped>
.hr-messageBox{
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
  .hr-mes-content-show{
    padding-top: .3rem;
    width: 5.4rem;
    background: #fff;
    border-radius: 5px;
    z-index: 10;
    animation: mesBoxShow .2s ease-in;
    .hr-mes-top{
      padding: .12rem .3rem .3rem;
      font-size: .36rem;
      line-height: 1;
      color: #000;
    }
    .hr-mes-middle{
      border-bottom: 1px solid #ddd;
      .hr-mes-text{
        padding: 0 .3rem .3rem;
        color: #888;
        font-size: .3rem;
        line-height: 1.5;
      }
    }
    .hr-mes-bottom{
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      -webkit-justify-content:center;
      justify-content:center;
      -webkit--moz-box-pack:center;
      box-pack:center;
      width: 100%;
      .hr-mes-cancle{
        height: 1rem;
        line-height: 1rem;
        width: 100%;
        border-right: 1px solid #ddd;
      }
      .hr-mes-confirm{
        height: 1rem;
        line-height: 1rem;
        width: 100%;
        color: #26a2ff;
      }
      .hr-mes-confirm:hover{
        background: #ddd;
      }
      .hr-mes-cancle:hover{
        background: #ddd;
      }
    }
  }
  .hr-mes-bodybgc{
    position: fixed;
    z-index: 9;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0,0,0,.4)
  }
  @-webkit-keyframes mesBoxShow{
    from{
      opacity: 0;
      transform: scale(0, 0);
     -webkit-transform: scale(0, 0);
    }
    to{
      opacity: 1;
      transform: scale(1, 1);
      -webkit-transform: scale(1, 1);
    }
  }
   @-webkit-keyframes mesBoxHidden{
      from{
        opacity: 1;
        transform: scale(1, 1);
        -webkit-transform: scale(1, 1);
      }
      to{
         opacity: 0;
        transform: scale(0, 0);
       -webkit-transform: scale(0, 0);
      }
   }
  .hrMesBoxshow{
    padding-top: .3rem;
    width: 5.4rem;
    background: #fff;
    border-radius: 5px;
    z-index: 10;
    animation: mesBoxShow .2s ease-in;
  }
  .hr-mes-content-hidden{
    padding-top: .3rem;
    width: 5.4rem;
    background: #fff;
    border-radius: 5px;
    z-index: 10;
     opacity: 0;
    animation: mesBoxHidden .2s ease-out;
  }
}

</style>

<style>
    .mint-msgbox-confirm{
        font-size: 0.35rem;
    }
    .mint-msgbox-cancel{
        font-size: 0.35rem;
    }
</style>