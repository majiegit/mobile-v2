<template>
    <div class="mainpanle">
        <div ref="myheader">
            <div style="height: 0.88rem; line-height: 0.88rem;">
                <HrHeader
                    title='通讯录'
                    lIcon='hr-Arrow2'
                    lText=''
                    v-on:lcallBack='goReturn'
                    >
                </HrHeader>
            </div>
        </div>
        <section>
            <div ref="mysearch">
                <div class="search">
                    <div class="s-box" @click="opensearch()">
                        <div class="mid-box">
                            <div class="searchimgdiv">
                                <!--<img src="../../../../static/img/pages/address/search.png" class="searchimg" alt="" />-->
                                <i class="hrfont hr-magnifier" style="color:#adadad;"></i>
                            </div>
                            <div class="searchmsg">
                                <p class="txt">搜索姓名/手机号/邮箱</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="orgmsgdiv" :style="{ 'height': currentHeight + 'px'}">
                <ul class="table-view">
                    <template v-if="items != null && items.length > 0" v-for="item in items">
                        <li class="table-cell" @click="routerpush(item.deptname, item.pk_dept)">
                            <div class="i-box">
                                <img src="../../../../static/img/pages/address/icon-dep.png" class="department" alt="" />
                            </div>
                            <div class="deptname">{{ item.deptname }}</div>
                            <i class="hrfont hr-right showdetail"></i>
                        </li>
                    </template>
                    
                    <!--<template v-if="items == null || items.length <= 0">
                        <div id="emptydiv" class="emptydiv" :style="{ 'height': currentHeight + 'px'}">
                            <img src="../../../../static/img/pages/application/noData.svg">
                        </div>
                    </template>-->
                    
                </ul>
            
                <div style="width: 90%; margin-left: 5%; margin: 0.2rem;">组织架构</div>
                <template v-if="orgs != null && orgs.length > 0">
                    <!--<div style="padding: 0.15rem 0.2rem;">组织架构</div>-->
                    <ul class="table-view">
                        <template v-for="org in orgs">
                            <li class="table-cell" @click="orgsRouterPush(org)">
                                <div class="i-box-org">
                                    <img src="../../../../static/img/pages/address/icon-dep.png" class="department" alt="" />
                                </div>
                                <div class="orgname">{{ org.name }}</div>
                                <!--<div class="orgpsnnum">{{ org.hasnext }}</div>-->
                                
                                <template v-if="org.hasnext == 1">
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
        </section>
    </div>

</template>

<script>
    import { ajax, fetchData, getStorage,setStorage } from 'hr-utils';
    import { HrHeader } from 'hr-ui';
    import { Toast, Indicator } from 'mint-ui';
    import { Search } from 'mint-ui';
    
    export default {
        name: 'addressList',
        data() {
            return {
                currentHeight: this.height,
                items: [],
                orgs: []
            }
        },
        
        components: {
            HrHeader
        },
        mounted() {
            //调用接口查询数据
            this.loadData();
            
            //调用接口查询组织架构数据，初次加载的时候type, pk 为空，不用传值
            this.loadOrgsDatas('', '');
            let orgs = '{"type": "", "pk": "", "role": "all"}';
            this.curSelOrg = JSON.parse(orgs);
            localStorage.removeItem('selAllOrgHis');
            this.updataSelOrgHisCache(this.curSelOrg); //默认组织元素添加到缓存中
        },
        watch:{
            height(val) {
                if (val) {
                    this.currentHeight = val;
                }
            }
        },
        methods: {
            opensearch: function() {
                this.$router.push("/searchBar");
            },
            routerpush: function(deptname, deptid) {
                this.$router.push({name: 'addressDeptList', query: { deptname: deptname, deptid: deptid}});
            },
            /**
             * 用于缓存一级组织数据
             */
            updataSelOrgHisCache(selOrgData) {
                //debugger
                let arr = getStorage('selAllOrgHis') || [];
                arr = arr.concat(selOrgData);
                setStorage('selAllOrgHis', arr);
            },
            /**
             * 调用接口查询数据
             */
            loadData: function() {
                let param = {
                }
                let _this = this;
                ajax('hrssc/portal/psnbase/queryDeptList', 'POST', "application/json", param, function(data) {
                    //Indicator.close()
                    if(data.statusCode == 200) {
                        if(data.data != null && data.data.length > 0) {
                            _this.items = data.data;
                            document.getElementById("emptydiv").style.display = 'none';
                        }else{
                            _this.items = [];
                            _this.currentHeight = document.documentElement.clientHeight - _this.$refs.myheader.offsetHeight - _this.$refs.mysearch.offsetHeight;
                            document.getElementById("emptydiv").style.display = 'block';
                        }
                    } else {
                        Toast(data.message);//单行提示
                    }
                }, function(data) {
                    //Indicator.close()
                    //console.log(data)
                });
            },
            /**
             * 查询组织架构数据
             */
            loadOrgsDatas: function(type, pk) {
                this.orgs = [];
                Indicator.open();
                let param = {
                    type: type,
                    pk: pk,
                    role: "all",
                    pagesize: 100,
                    pageno: 0
                }
                let _this = this;
                ajax('hrssc/portal/orgs/queryOrgsOrDeptForLeaderRef', 'POST', "application/json", param, function(data) {
                    Indicator.close();
                    if(data.statusCode == 200) {
                        if(data.data.content != null && data.data.content.length > 0) {
                            for(let i=0; i<data.data.content.length; i++){
                                if(data.data.content[i].type !== 'psn'){
                                    _this.orgs.push(data.data.content[i]); //组织架构数组
                                }
                            }
                        } else {
                            _this.orgs = [];
                        }
                    } else {
                        Toast(data.message);
                    }
                }, function(data) {
                    Indicator.close();
                });
            },
            orgsRouterPush: function(org) {
                this.updataSelOrgHisCache(org);
                this.$router.push({
                    name: 'addressOrgStructure',
                    query: {
                        //selOrg: org
                    }
                });
            },
            goReturn: function() {
                localStorage.removeItem('selAllOrgHis');
                this.$router.push('application');
            },
        }
    
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .mainpanle {
        width: 100%;
    }
    .search{
        padding:0.2rem;
        border-bottom:0.02rem solid #e7e7e7;
    }
    .search .s-box{
        background:#ffffff;
        border-radius:0.1rem;
    }
    .searchimgdiv{
        float: left; 
        width: 10%;
    }
    .searchimg{
        width: 0.35rem;
        padding-top: 0.15rem;
    }
    .searchmsg{
        float: left; 
        width: 80%;
    }
    .s-box{
        height:0.6rem;
        position:relative;
    }
    .s-box .txt{
        display:inline-block;
        height:0.6rem;
        line-height:0.6rem;
        font-size:0.3rem;
        color:#adadad;
        position: relative;
    }
    .mid-box{
        display:inline-block;
        height:0.6rem;
        position:absolute;
        left:50%;
        top:0;
        transform:translateX(-50%);
        -webkit-transform:translateX(-50%);
        white-space:nowrap;
        height: 0.6rem;
        line-height: 0.6rem;
    }
    .table-view {
        background: #ffffff;
    }
    .table-cell {
        height: 0.9rem;
        border-bottom: 1px solid #e7e7e7;
        overflow: hidden;
        /*background: url(../../../../static/img/pages/address/right.png) no-repeat 96% center;
        background-size: 0.17rem 0.3rem;*/
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-box-orient: horizontal;
        flex-flow: row;
        -webkit-flex-flow: row;
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
    .showdetail{
        color:#adadad; 
        width: 0.5rem; 
        height: 0.9rem; 
        line-height: 0.9rem;
    }
    .i-box {
        width: 0.8rem;
        height: 0.9rem;
        position: relative;
    }
    .i-box img {
        position: absolute;
        left: 0.3rem;
        top: 48%;
        width: 0.32rem;
        transform: translateY(-50%);
        -webkit-transform: translateY(-50%);
    }
    .deptname {
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        flex: 1;
        line-height: 0.9rem;
        color: #666666;
    }
    .emptydiv{
        width: 100%; 
        text-align: center; 
        padding-top: 2rem; 
        display: none;
    }
</style>