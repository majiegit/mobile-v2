/**
 * Created by yangyang11 on 2017/10/10.
 * 
 */
<template>
    <div class="um-header">
        <div class="um-h-left">
            <i class="icon hrfont" v-bind:class='lIcon' @mousedown="lClick($event)"></i>
            <h4>{{lText}}</h4>
        </div>
        <div class="um-h-middle">{{title}}</div>
        <div class="um-h-right" @mousedown="RClick($event)">
            <i class="icon hrfont" v-bind:class='rIcon'></i>
            <h4>{{rText}}</h4>
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
 * <HrHeader
      title='测试heasr'
      lIcon='hr-Arrow2'
      rIcon='hr-drop-down02'
      lText='返阿a啊是的撒打算撒旦阿斯达阿达少打'
      :rText='tt'
      v-on:lcallBack='testClick'
      v-on:rcallBack='testClick'>
    </HrHeader>
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
      'lIcon':{
        type : String,
        default :'hr-Arrow2'
      },
      'rIcon':{
        type : String,
        default :''
      },
      'lText':{
        type : String,
        default :''
      },
      'rText':{
        type : String,
        default :''
      },
      'lcallBack' :{
        type : null,
        default:false
      }
    },
    data () {
        return {
          
        }
    },
    methods: {
        lClick(e){
          e.preventDefault()
          this.$emit('lcallBack','')
        },
        RClick(e){
          e.preventDefault()
          this.$emit('rcallBack','')  
        }  
    },
        

}
</script>

<style lang='less' scoped>
.um-header{
    clear: both;
    height: 100%;
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #ececec;
    .um-h-left{
        float: left;
        width: 28%;
        height: 100%;
        .hrfont {
            color: #0CAEF5;
            font-size: 0.6rem;
        }
        h4{
            width: 100%;
            overflow: hidden;
            font-size: 14px;
            color: #0CAEF5;
            letter-spacing: 0;
            text-overflow: ellipsis;
            white-space: nowrap;
            word-break: break-all;
            pointer-events: none;
            font-weight: 500;
        }
    }
    .um-h-middle{
        width:43%;
        overflow: hidden;
        font-size: 0.36rem;
        letter-spacing: 0;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-break: break-all;
        pointer-events: none;
        text-align: center;
        display: inline-block;
    }
    .um-h-right{
        float: right;
        width: 28%;
        padding-right: 0.2rem;
        h4{ 
            float: right;
            width: 60%;
            height: 100%;
            overflow: hidden;
            font-size: 14px;
            color: #0CAEF5;
            letter-spacing: 0;
            text-align: right;
            text-overflow: ellipsis;
            white-space: nowrap;
            word-break: break-all;
            pointer-events: none;
            font-weight: 500;
        }
        .hrfont {
            float: right;
            color: #0CAEF5;
            font-size: 0.5rem;
        }
    }
}
</style>
