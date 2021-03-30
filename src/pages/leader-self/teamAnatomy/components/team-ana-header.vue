<template>
    <div class="um-header">
        <a class="um-back" @click="goback()"></a>
        <h3>{{title}}</h3>
        <div @click="gorouter()">
             <label>象屿</label>
             <a></a>
        </div>
       
        <!-- <div class="um-header-right none" id="myLeave">
            <a class="um-btn" href="javascript:openLeaveList();">我的请假</a>
        </div> -->
    </div>
</template>

<script>
export default {
    props: ["title"],
    data () {
        return {
          
        }
    },
    methods: {
        gorouter: function() {        
            this.$router.push('teamPicker');
        },
        goback : function(){
            this.$router.push('application');   
        }
    }      

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
.um-header {
    width:100%;
    position: fixed;
    height: 0.88rem;
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
    margin: 0 0 0 2.5rem;
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
        label{
            clear: both;
            float: left;
            line-height: 44px;
            font-size: 14px;
            color: #0CAEF5;
            letter-spacing: 0;
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
