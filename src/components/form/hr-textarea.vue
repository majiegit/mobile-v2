<template>

<div class="h-textarea">
  
  <div class="h-textarea-group">
    <textarea  ref="textarea" v-bind:value="value" v-on:input="updateValue($event.target.value)"  :placeholder="placeholder"></textarea>
    <span class="h-fontnum">{{fontnum()}}</span>
  </div>

</div>
</template>
<script>
/*
使用说明
引入组件html
    <hrTextarea v-model="textdata" num="num" placeholder="请描述你要开具的证明的要求"></hrTextarea>
    @placeholder:填写提示信息
    @num:允许输入的最多字数,默认140
    @textarea：绑定的数据名称，可以自定义
    在父组件的data函数中创建一个textdata的属性名，这个属性名的值就是要的数据

 */


    

    export default {
        name:'hrTextarea',
        props: ['value','placeholder','num'],
        data(){
            return {
                provetext:"",//绑定的数据对象
                textnum:140,//最多的字数
            }
        },
        mounted (){
            if(!isNaN(this.num)){
                this.textnum=this.num;
            }

        },
        methods:{
            updateValue: function (value) {
              this.provetext=value;
              var formattedValue = value
                // 删除两侧的空格符
                //.trim()
                // 控制输入内容
                .slice(
                  0,
                  this.textnum
                )
              // 如果值不统一，手动覆盖以保持一致
              if (formattedValue !== value) {
                this.$refs.textarea.value = formattedValue
              }
              // 通过 input 事件发出数值
              this.$emit('input', formattedValue)
            },
            fontnum:function(){//输入字数
                var num=this.textnum - this.provetext.length
                return  num>=0?num:0;
            },
        }
        

    };
</script>


<style lang='less'scoped>
    @0CAEF5-color : #0CAEF5;
    @b2b2b2-color : #b2b2b2;
    .h-textarea{
        .h-textarea-group{
            width:100%;
            padding:0.2rem 0.2rem 0.4rem;
            background:#fff;
            position:relative;
            top:0;
            left:0;
            textarea{
                width:100%;
                height:2rem;
                font-size: 0.26rem;
                line-height: 0.4rem;
                resize: none;

            }
            .h-fontnum{
                position:absolute;
                right:0.2rem;
                bottom:0.2rem;
                background:#ccc;
                border-radius:0.5rem;
                padding:0.06rem 0.2rem;
                font-size:0.28rem;

            }

        }

    }
    
</style>
