<template>
    <div class="um-header">
        <a class="um-back" @click="goback()"></a>
        <h3>{{title}}</h3>
        <div v-if="type == 'img'">
            <img src="../../../../static/img/pages/message/share.png" />
        </div>
    </div>
</template>

<script>
export default {
    props: ["title","type"],
    data () {
        return {
          
        }
    },
    methods: {
        goback : function(){
            history.go(-1);
        }
    }      
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
.um-header {
    width:100%;
    position: relative;
    height: 44px;
    background: #ffffff;
    z-index: 5;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    border-bottom: 1px solid #ececec;
    .um-back{
    float: left;
    height: 40px;
    line-height: 40px;
    min-width: 40px;
    margin-top: 4px;
    left: 15px;
    position: absolute;
    top: 0px;
    font-weight: 500;
    color: #108ee9;
    text-decoration: none;
    }
    .um-back:before {
    content: "";
    display: inline-block;
    width: 12px;
    height: 12px;
    border-left: 2px solid #108ee9;
    border-bottom: 2px solid #108ee9;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    margin: 0px -3px 0px 0px;
    }
    h3 {
    float: left;
    font-size: 17px;
    text-align: center;
    display: block;
    margin: 0;
    box-sizing: border-box;
    margin: 0 0 0 3.1rem;
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
    div{
        float: right;
        line-height: 40px;
        img{
            position: relative;
			top: 0.12rem;
			right: 0.18rem;
        }
        a{  
            float: right;
            height: 40px;
            line-height: 40px;
            min-width: 40px;
            margin-bottom: 4px;
            top: 0px;
            font-weight: 500;
            color: #108ee9;
            text-decoration: none;
        }
        a:before {
            content: "";
            display: inline-block;
            width: 8px;
            height: 8px;
            border-left: 2px solid #108ee9;
            border-bottom: 2px solid #108ee9;
            -webkit-transform: rotate(315deg);
            transform: rotate(315deg);
            margin: 0px 0px 0px 10px;
            }
    }
}



</style>
