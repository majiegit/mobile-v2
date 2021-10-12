<template>
  <div class="um-header" :style="type==1?'border-bottom:none':''">
    <a class="um-back"  @click="goback()"></a>
    <h3 style="color: #ffffff">{{title}}</h3>
    <div style="position: absolute;right: 15px;top: 12px;color: #fff" v-if="!showflag&&$route.query.data.status!=1" @click.stop="headClick('update')">修改</div>
    <div style="position: absolute;right: 15px;top: 12px;color: #fff" v-if="showflag" >
      <span style="margin-right: 10px" @click.stop="headClick('cancel')" >取消</span>
      <span  @click.stop="headClick('save')" >保存</span>
    </div>
  </div>
</template>

<script>
/**
 * my-header
 * @module components/base
 * @desc 顶部导航
 * @param {string} [title] - 标题
 * @param {function} [callbackfun] -自定义回调函数
 *
 * @example
 * <my-header title="我是标题" ></my-header>  无回调的
 * <my-header title="我是标题" :callbackfun="回调函数"></my-header>    有回调的
 */

export default {
  name:"my-header",
  props:{
    "title":{
      type:String
    },
    "callbackfun":{
      type:null,
      default:false
    },
    "type":{
      type:Number
    }
  },
  data () {
    return {
      showflag:false
    }
  },
  methods: {
    goback: function() {
      if(this.callbackfun instanceof Function){
        this.callbackfun()
      }else{
        this.$router.goBack()
        // history.go(-1);
      }
    },
    headClick(type){
      switch (type){
        case 'update':
          this.showflag = !this.showflag
          break;
        case 'cancel':
          this.showflag = !this.showflag
          break;
        case 'save':
          this.showflag = !this.showflag
          this.$emit('saveSubmit')
          break;
      }
    }
  }

}
</script>

<style scoped>
.um-header {
  width:100%;
  position: relative;
  height: 0.88rem;
  background: #2479ED;
  z-index: 5;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  border-bottom: 1px solid #ececec;
}
.um-back, .um-header-left {
  height: 0.88rem;
  line-height: 0.88rem;
  min-width: 40px;
  padding-top: 4px;
  left: 15px;
  position: absolute;
  top: 0px;
  font-weight: 500;
  color: #ffffff;
  text-decoration: none;
}
.um-back:before {
  content: "";
  display: inline-block;
  width: 12px;
  height: 12px;
  border-left: 2px solid #ffffff;
  border-bottom: 2px solid #ffffff;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
  margin: 0px -3px 0px 0px;
}
.um-header h3 {
  font-size: 17px;
  text-align: center;
  display: block;
  margin: 0;
  box-sizing: border-box;
  width: 6.5rem;
  margin: 0 auto;
  height: 44px;
  line-height: 44px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;
  pointer-events: none;
  color: #333333;
  font-weight: 500;
}
</style>
