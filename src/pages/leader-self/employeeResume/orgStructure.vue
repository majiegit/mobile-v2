<template>
    <div class="mainpanle">
        <div ref="myheader">
            <div style="height: 0.88rem; line-height: 0.88rem;">
                <HrHeader
                    :title= 'currorgnameText'
                    lIcon='hr-Arrow2'
                    lText=''
                    v-on:lcallBack='goReturn'
                    >
                </HrHeader>
            </div>
            <div class="chooseorg">
                {{ orgtitleText }}
                <font color="#8C8C8C">{{ currorgnameText }}</font>
            </div>
        </div>
        <section>
            <div class="orgmsgdiv" :style="{ 'height': currentHeight + 'px'}" v-if="items.length > 0 || psndatas.length > 0">
                <template v-if="psndatas != null && psndatas.length > 0">
                    <div style="padding: 0.15rem 0.2rem;">组织成员</div>
                    <template v-for="(data, index) in psndatas">
                        <div class="itemstyle" @click="showEmpResume(data.pk)">
                            <div class="morecontdiv">
                                <div class="psnphoto">
                                    <div v-if="data.image != null">
                                        <div class="i-box tc">
                                            <img :src="data.image" class="um-circle">
                                        </div>
                                    </div>
                                    <div v-else>
                                        <div class="i-box tc" id="headImg" v-bind:style="{background: data.color }">
                                            {{ (data.name + '').slice(-2) }}
                                        </div>
                                    </div>
                                </div>
                                <div class="callnamediv">
                                    <div class="namediv">
                                        <span class="namespan">{{ data.name}}</span><br/>
                                        <span class="postnamespan">{{ data.postname}}</span>
                                    </div>
                                    <div class="calldiv" v-if="data.submub > 0">
                                        <div v-if="data.submub > 0">
                                            <i class="hrfont hr-right photoicon"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </template>        
                
                <template v-if="items != null && items.length > 0">
                    <div style="padding: 0.15rem 0.2rem;">组织架构</div>
                    <ul class="table-view">
                        <template v-for="item in items">
                            <li class="table-cell" @click="routerpush(item)">
                                <div class="i-box-org">
                                    <img src="../../../../static/img/pages/address/icon-dep.png" class="department" alt="" />
                                    <!--<i class="hrfont hr-organization department"></i>-->
                                </div>
                                <div class="orgname">{{ item.name }}</div>
                                <!--<div class="orgpsnnum">{{ item.hasnext }}</div>-->
                                
                                <template v-if="item.hasnext == 1">
                                    <i class="hrfont hr-right showdetail"></i>
                                </template>
                                <template v-else>
                                    <div style="width:0.5rem; height: 0.9rem;">&nbsp;</div>
                                </template>
                            </li>
                        </template>
                    </ul>
                </template>
            </div>
            <template v-if="items.length == 0 && psndatas.length == 0">
                <div style="width: 90%; margin-left: 5%; text-align: center; margin-top: 0.5rem; color: #ccc;">暂无数据</div>
            </template>
        </section>
    </div>
</template>

<script>
    import { Header } from 'mint-ui';
    import { HrHeader } from 'hr-ui'
    import { ajax, fetchData, getStorage,setStorage } from 'hr-utils'
    import { Toast, Indicator } from 'mint-ui';
    import { Search } from 'mint-ui';
    import datas from './data.js';
    import orgdatas from './orgdatas.js';

    export default {
        name: 'addressList',
        data() {
            return {
                currentHeight: this.height,
                items: [],
                psndatas: [],
                curSelOrg: null, //当前选择的组织或部门
                orgtitleText: '组织架构',
                currorgnameText: '',
            }
        },

        components: {
            HrHeader
        },
        mounted() {
            let arr = getStorage('selOrgHis') || [];
            if(arr != null && arr.length > 0){
                this.loadData(arr[arr.length-1].type, arr[arr.length-1].pk);
            }
            this.updataLabel();
            this.currentHeight = document.documentElement.clientHeight - this.$refs.myheader.offsetHeight;
        },
        watch: {
            height(val) {
                if(val) {
                    this.currentHeight = val;
                }
            }
        },
        methods: {
            opensearch: function() {
                this.$router.push("/searchBar");
            },
            /**
             * 用于缓存当前选择的组织或部门
             */
            updataSelOrgHisCache(selOrgData) {
                //debugger
                let arr = getStorage('selOrgHis') || [];
                arr = arr.concat(selOrgData);
                setStorage('selOrgHis', arr);
            },
            routerpush: function(item) {
                this.curSelOrg = item;
                let _this = this
                if (item.type !== 'psn') {
                    this.loadData(item.type, item.pk);
                    this.updataSelOrgHisCache(item);
                }
                //更新组织导航条
                this.updataLabel();
            },
            
            /**
             * 调用接口查询数据
             */
            loadData: function(type, pk) {
                this.items = [];
                this.psndatas = [];
                let temppsndatas = [];
                Indicator.open();
                let param = {
                    type: type,
                    pk: pk,
                    pagesize: 1000,
                    pageno: 0
                }
                let _this = this;
                ajax('hrssc/portal/orgs/queryOrgsOrDeptForLeaderRef', 'POST', "application/json", param, function(data) {
                    Indicator.close();
                    if(data.statusCode == 200) {
                        if(data.data.content != null && data.data.content.length > 0) {
                            for(let i=0; i<data.data.content.length; i++){
                                if(data.data.content[i].type == 'psn'){
                                    //_this.psndatas.push(data.data.content[i]); //组织人员数组
                                    temppsndatas.push(data.data.content[i]); //组织人员数组
                                }else{
                                    _this.items.push(data.data.content[i]); //组织架构数组
                                }
                            }
                            _this.createArray(temppsndatas);
                        } else {
                            _this.items = [];
                            _this.currentHeight = document.documentElement.clientHeight - _this.$refs.myheader.offsetHeight - _this.$refs.mysearch.offsetHeight;
                            document.getElementById("emptydiv").style.display = 'block';
                        }
                    } else {
                        Toast(data.message);
                    }
                }, function(data) {
                    Indicator.close();
                });
            },
            /**
             * 根据人员pk查询简历详情
             * @param {Object} pk
             */
            showEmpResume: function(pk_psndoc){
                //console.log('选中人员主键 pk_psndoc = ' + pk_psndoc);
                this.$router.push({
                    name: 'empResumeDetail',
                    query: {
                        pk_psndoc: pk_psndoc
                    }
                });
            },
            // 返回上级组织
            goReturn() {
                //获取选择的组织树缓存
                let arr = getStorage('selOrgHis') || [];
                if(arr != null && arr.length > 2){
                    arr.splice(arr.length - 1, 1);
                    this.loadData(arr[arr.length - 1].type, arr[arr.length - 1].pk);
                    setStorage('selOrgHis', arr);
                    this.curSelOrg = arr[arr.length - 1];
                }else if(arr != null && arr.length == 2){
                    this.closeTeamStruAndClearCache();
                }
                this.updataLabel();
            },
            
            closeTeamStruAndClearCache() {
                localStorage.removeItem('selOrgHis');
                this.$router.push({
                    name:'employeeResume',
                    query : {},
                    params : {}
                })
                
            },
            updataLabel: function(){
                let arr = getStorage('selOrgHis') || [];
                if(arr != null && arr.length > 0){
                    this.orgtitleText = '组织架构';
                    this.currorgnameText = '';
                    //debugger
                    if(arr.length == 1){
                        this.orgtitleText = this.orgtitleText;
                    }else{
                        for(var i=1;i<arr.length-1;i++){
                            this.orgtitleText += ">" + arr[i].name;
                        }
                        this.orgtitleText += ">";
                        this.currorgnameText = arr[arr.length-1].name;
                    }
                }
            },
            
            createArray: function(datas){
                var tempdatas = datas;
                if(tempdatas != null && tempdatas.length > 0){
                    var data = null;
                    var color = "";
                    for(var i=0;i<tempdatas.length;i++){
                        data = tempdatas[i];
                        color = this.getColor(tempdatas[i].name);
                        tempdatas[i].color = color;
                    }
                    for(var i=0;i<tempdatas.length;i++){
                        this.psndatas.push(tempdatas[i]); //组织人员数组
                    }
                }else{
                    this.psndatas = [];
                }
            },
            /**
             * 根据名字获取背景颜色
             */
            getColor: function(name) {
                var color= ['#eead10','#f99a2b','#f38134','#6495ed','#3ab1aa','#0abfb5','#06aae1','#00bfff','#96bc53','#00ced1','#89a8e0'];
                var newName = encodeURI(name).replace(/%/g, "");
                var lastName, hexadecimal, tenBinary;
                //长度大于等于6位，取后六位
                if(newName.length >= 6) {
                  lastName = newName.substr(lastName,6);
                  hexadecimal = parseInt(lastName,16);
                  //能转成数字
                  if(hexadecimal) {
                    tenBinary = hexadecimal%10;
                    return color[tenBinary];
                  } else {
                    //不能转数字
                    return color[10];
                  }
                } else {
                  return color[10]
                }
            },
            
        }
    }
</script>

<style scoped>
    .mainpanle {
        width: 100%;
    }
    
    .chooseorg {
        background: #FFF;
        padding: 0.2rem;
        width: 100%;
        overflow: auto;
        white-space: nowrap;
        color: red;
        /*word-break:keep-all;
        display:inline-block;*/
    }
    
    .teamStructure {
        position: fixed;
        top: 1.48rem;
        height: calc(~'100% - 1.48rem');
        width: 100%;
        left: 0;
        width: 100%;
        border-bottom: 1px solid #EDEDED;
        z-index: 1;
        overflow: scroll;
        background: #fff;
    }
    .table-view {
        background: #ffffff;
    }
    .table-cell {
        height: 0.9rem;
        border-bottom: 1px solid #e7e7e7;
        overflow: hidden;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-box-orient: horizontal;
        flex-flow: row;
        -webkit-flex-flow: row;
    }
    .showdetail{
        color:#adadad; 
        width: 0.5rem; 
        height: 0.9rem; 
        line-height: 0.9rem;
    }
    .i-box-org {
        width: 0.8rem;
        height: 0.9rem;
        position: relative;
    }
    .i-box-org img {
        position: absolute;
        left: 0.3rem;
        top: 48%;
        width: 0.32rem;
        transform: translateY(-50%);
        -webkit-transform: translateY(-50%);
    }
    .orgname {
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        flex: 1;
        line-height: 0.9rem;
        color: #666666;
    }
    .orgpsnnum {
        line-height: 0.9rem;
        color: #666666;
        text-align: right;
        width: 1rem;
    }
    .emptydiv{
        width: 100%; 
        text-align: center; 
        padding-top: 2rem; 
        display: none;
    }
    .orgmsgdiv{
        width: 100%;
        overflow: auto;
        margin-top:2px;
    }
    
    
    .i-box{
        width:0.9rem;
        height:0.9rem;
        line-height:0.9rem;
        margin-left: 0.9rem;
        margin-top: 0.15rem;
        transform:translateX(-50%);
        -webkit-transform: translateX(-50%);
        border-radius:50%;
        box-shadow:0 0 0 0.05rem #fff; 
        /*font-family:"微软雅黑";*/
        font-size:0.25rem;
        color:#fff;
    }
    .i-box img{
        width:100%; 
        height:100%; 
        margin:0; 
        padding:0; 
        position:absolute; 
        left:0; 
        top:0; 
        z-index: -1;
    }
    .um-circle {
        border-radius: 50%;
    }
    .tc {
        text-align: center;
    }
    .itemstyle{
        height: 1.2rem;
    }
    .morecontdiv{
        width: 100%; 
        float: right; 
        background: #fff; 
        height: 1.2rem; 
        border-bottom: 1px solid #F5F5F5;
    }
    .psnphoto{
        float: left; 
        width: 23%;
    }
    .empty{
        width: 100%; 
        text-align: center; 
        margin: 2rem auto; 
        display: block;
    }
    .photoicon{
        font-size: 23px; 
        color: #ccc;
    }
    .callnamediv{
        float: left; 
        width: 70%; 
        border-bottom: 0px solid #F5F5F5;
    }
    .namediv{
        float: left; 
        width: 70%; 
        padding-top: 0.22rem;
    }
    .namespan{
        font-size: 0.35rem; 
        line-height:0.45rem; 
        color:#343434;
    }
    .postnamespan{
        font-size: 0.25rem; 
        line-height:0.45rem; 
        color:#c6c6c6;
    }
    .calldiv{
        float: left; 
        width: 30%; 
        line-height: 1.2rem; 
        text-align: right;
    }
</style>