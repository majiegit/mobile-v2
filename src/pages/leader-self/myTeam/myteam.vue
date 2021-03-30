<template>
    <div class="mainpanle">
        <div ref="myheader" >
            <myHeader title="我的团队"></myHeader>
        </div>
        <section>
            <div ref="headtitle" >
                <template v-if="refInfos != null && refInfos.length > 0">
                    <div class="teamdiv">
                        <mt-navbar v-model="selected">
                            <template v-for="(refInfo, index) in refInfos">
                                <mt-tab-item :id="index + 1">{{ refInfo.postname }}</mt-tab-item>
                            </template>
                        </mt-navbar>
                    </div>
                </template>
                
                <template v-if="refInfos != null && refInfos.length > 0">
                    <div id="depttitle" class="depttitle">
                        <!--用友网络科技股份有限公司 / 友人才产品部 {{ selected }}-->
                        {{ (refInfos[selected-1]).orgname }} / {{ (refInfos[selected-1]).deptname }}
                    </div>
                </template>
            </div>
            
            <mt-tab-container v-model="selected">
                <div ref="myTeamContdiv" class="teamdiv" :style="{ 'height': currentHeight + 'px'}">
                    
                    <template v-if="refInfos != null && refInfos.length > 0" v-for="(refInfo, index) in refInfos">
                        <mt-tab-container-item :id="index + 1">
                            <template v-if="datas != null && datas.length > 0">
                                <div class="" class="xzdiv">行政下属</div>
                            </template>
                            <template v-if="datas != null && datas.length > 0" v-for="(data, index2) in datas">
                                <template v-if="data.qtype == 1">
                                    <div class="itemstyle" @click="showDetail(data.pk_psndoc, data.submub)">
                                        <div class="morecontdiv">
                                            <div class="psnphoto">
                                                <div v-if="data.photo != null">
                                                    <div class="i-box tc">
                                                        <img :src="data.photo" class="um-circle">
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
                                                    <!--<a :href="'tel:' + data.mobile " style="text-decoration:none;" @click.stop>-->
                                                        <!--<img src="../../../static/img/pages/address/icon-call.png" class="tel">-->
                                                        <!--<i class="hrfont hr-right photoicon"></i>-->
                                                    <!--</a>-->
                                                    <div v-if="data.submub > 0">
                                                        <i class="hrfont hr-right photoicon"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </template>
                            <template v-if="xzpageNo < xztotalPage">
                                 <div @click="loadMoreXZDatas(refInfo.pk_psnjob)" class="moredatas">
                                     <span class="moredataspan">加载更多</span>
                                 </div>
                            </template>
                    
                            <template v-if="datas != null && datas.length > 0">
                                <div class="" class="ywdiv">业务下属</div>
                            </template>
                            
                            <template v-if="ywdatas != null && ywdatas.length > 0" v-for="(data, index2) in ywdatas">
                                <template v-if="data.qtype == 2">
                                    <div class="itemstyle" @click="showDetail(data.pk_psndoc, data.submub)">
                                        <div class="morecontdiv">
                                            <div class="psnphoto">
                                                <div v-if="data.photo != null">
                                                    <div class="i-box tc">
                                                        <img :src="data.photo" class="um-circle">
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
                                                    <!--<a :href="'tel:' + data.mobile " style="text-decoration:none;" @click.stop>-->
                                                        <!--<img src="../../../static/img/pages/address/icon-call.png" class="tel">-->
                                                        <!--<i class="hrfont hr-right photoicon"></i>-->
                                                    <!--</a>-->
                                                    <div v-if="data.submub > 0">
                                                        <i class="hrfont hr-right photoicon"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </template>
                            
                            <template v-if="ywpageNo < ywtotalPage">
                                 <div @click="loadMoreYWDatas(refInfo.pk_psnjob)" class="moredatas">
                                     <span class="moredataspan">加载更多</span>
                                 </div>
                            </template>
                            
                            <template v-if="datas != null && datas.length <= 0">
                                <div id="emptydiv" class="empty">
                                    <img src="../../../../static/img/pages/application/noData.svg">
                                </div>
                            </template>
                            
                        </mt-tab-container-item>
                    </template>
                    
                </div>
                
            </mt-tab-container>
            
            <template v-if="refInfos == null || refInfos.length <= 0">
                <div id="emptydiv" class="empty">
                    <img src="../../../../static/img/pages/application/noData.svg">
                </div>
            </template>
        </section>
    </div>

</template>

<script>
    import { myHeader, ImgPicker } from 'hr-ui'
    import { ajax, getStorage,setStorage } from 'hr-utils'
    import { Toast, Indicator } from 'mint-ui';
    
    export default {
        name: 'mytema',
        data() {
            return {
                currentHeight: this.height,
                depts: [],
                selected: 1,
                datas: [],
                ywdatas: [],
                refInfos: [], //职位信息参照数据
                datarets: [],
                
                xzpageNo: 0,  //当前页码
                xztotalCount: 0,  //总记录数
                xzpageSize: 20,   //每页条数
                xztotalPage: 0,    //记录总页数
                
                ywpageNo: 0,  //当前页码
                ywtotalCount: 0,  //总记录数
                ywpageSize: 20,   //每页条数
                ywtotalPage: 0    //记录总页数
            }
        },
        
        components: {
            myHeader
        },
        mounted() {
            var pk_psndoc = getStorage("userinfo").pk_psndoc;
            //调用接口查询数据
            this.loadRefData(pk_psndoc);
            this.$watch("selected", function () {
                this.datas = [],
                this.ywdatas = [],
                
                this.xzpageNo = 0;  //当前页码
                this.xztotalCount = 0;  //总记录数
                this.xzpageSize = 20;   //每页条数
                this.xztotalPage = 0;    //记录总页数
                
                this.ywpageNo = 0;  //当前页码
                this.ywtotalCount = 0;  //总记录数
                this.ywpageSize = 20;   //每页条数
                this.ywtotalPage = 0;    //记录总页数
                
                var pk_psnjob = this.refInfos[this.selected-1].pk_psnjob;
                this.datas = [];
                this.loadXZData(pk_psnjob);
                this.loadYWData(pk_psnjob);
                
            });
            //this.currentHeight = document.documentElement.clientHeight - this.$refs.myheader.offsetHeight;
        },
        methods: {
            routerpush: function(deptid) {
                this.$router.push("/addressDeptList?deptid=" + deptid);
            },
            /**
             * 调用接口查询主职、兼职职位数据
             */
            loadRefData: function(pk_psndoc) {
                // var pk_psndoc = JSON.parse(localStorage.userinfo).pk_psndoc;
                // var pk_psndoc = getStorage("userinfo").pk_psndoc;//JSON.parse(localStorage.userinfo).pk_psndoc;
                let param = {
                    pk_psndoc: pk_psndoc
                }
                let _this = this;
                ajax('hrssc/portal/psnbase/getSubPsnRef', 'POST', "application/json", param, function(data) {
                    if(data.statusCode == 200) {
                        if(data.data != null && data.data.length > 0) {
                            _this.refInfos = data.data;
                            _this.loadXZData(data.data[0].pk_psnjob);
                            _this.loadYWData(data.data[0].pk_psnjob);
                        }else{
                            _this.refInfos = [];
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
             * 调用接口查询行政下属数据
             */
            loadXZData: function(pk_psnjob) {
                Indicator.open();
                let _this = this;
                //var pk_psnjob = _this.refInfos[_this.selected-1].pk_psnjob;
                let param = {
                    pk_psnjob: pk_psnjob,
                    type: 1,
                    pageno: _this.xzpageNo,
                    pagesize: _this.xzpageSize
                }
                ajax('hrssc/portal/psnbase/getSubPsnVO', 'POST', "application/json", param, function(data) {
                    Indicator.close()
                    if(data.statusCode == 200) {
                        if(data.data != null && data.data.length > 0) {
                            _this.createXZArray(data.data);
                            _this.xzpageNo = data.pageno;
                            _this.xztotalCount = data.totalCount;
                            _this.xztotalPage = Math.ceil(_this.xztotalCount/_this.xzpageSize);
                            if(_this.xztotalPage > _this.xzpageNo){
                                _this.xzpageNo = _this.xzpageNo + 1;
                            }
                        }else{
                            _this.datas = [];
                            _this.xzpageNo = 0;
                            _this.xztotalCount = 0;
                            _this.xztotalPage = 0;
                        }
                        _this.setStyle();
                    } else {
                        Toast(data.message);//单行提示
                    }
                }, function(data) {
                    Indicator.close()
                    //console.log(data)
                });
            },
            /**
             * 调用接口查询业务下属数据
             */
            loadYWData: function(pk_psnjob) {
                let _this = this;
                //var pk_psnjob = _this.refInfos[_this.selected-1].pk_psnjob;
                let param = {
                    pk_psnjob: pk_psnjob,
                    type: 2,
                    pageno: _this.ywpageNo,
                    pagesize: _this.ywpageSize
                }
                ajax('hrssc/portal/psnbase/getSubPsnVO', 'POST', "application/json", param, function(data) {
                    //Indicator.close()
                    if(data.statusCode == 200) {
                        if(data.data != null && data.data.length > 0) {
                            _this.createYWArray(data.data);
                            _this.ywpageNo = data.pageno;
                            _this.ywtotalCount = data.totalCount;
                            _this.ywtotalPage = Math.ceil(_this.ywtotalCount/_this.ywpageSize);
                            if(_this.ywtotalPage > _this.ywpageNo){
                                _this.ywpageNo = _this.ywpageNo + 1;
                            }
                        }else{
                            _this.ywdatas = [];
                            _this.ywpageNo = 0;
                            _this.ywtotalCount = 0;
                            _this.ywtotalPage = 0;
                        }
                        _this.setStyle();
                    } else {
                        Toast(data.message);//单行提示
                    }
                }, function(data) {
                    //Indicator.close()
                    //console.log(data)
                });
            },
            /**
             * 查看人员详情
             * @param {Object} pkpsndoc
             */
//          showDetail: function(pkpsndoc){
//              // this.$router.push("/personal");
//              this.$router.push("/personalstaff?pkpsndoc=" + pkpsndoc);
//              
//          },
            
            /**
             * 向下穿透人员信息
             * @param {Object} pkpsndoc
             */
            showDetail: function(pk_psndoc, submub){
                if(submub == null || submub == 0){
                    return false;
                }
                this.depts = [],
                this.selected = 1,
                this.datas = [],
                this.ywdatas = [],
                this.refInfos = [], //职位信息参照数据
                this.datarets = [],
                
                //调用接口查询数据
                this.loadRefData(pk_psndoc);
                
                this.xzpageNo = 0;  //当前页码
                this.xztotalCount = 0;  //总记录数
                this.xzpageSize = 20;   //每页条数
                this.xztotalPage = 0;    //记录总页数
                    
                this.ywpageNo = 0;  //当前页码
                this.ywtotalCount = 0;  //总记录数
                this.ywpageSize = 20;   //每页条数
                this.ywtotalPage = 0;    //记录总页数
            },
            
            createXZArray: function(datas){
                var tempdatas = datas;
                if(tempdatas != null && tempdatas.length > 0){
                    var data = null;
                    var color = "";
                    for(var i=0;i<tempdatas.length;i++){
                        data = tempdatas[i];
                        color = this.getColor(tempdatas[i].name);
                        tempdatas[i].color = color;
                    }
                    //this.datas = datas;
                    for(var i=0;i<tempdatas.length;i++){
                        this.datas.push(tempdatas[i]);
                    }
                }else{
                    this.datas = [];
                }
            },
            createYWArray: function(datas){
                var tempdatas = datas;
                if(tempdatas != null && tempdatas.length > 0){
                    var data = null;
                    var color = "";
                    for(var i=0;i<tempdatas.length;i++){
                        data = tempdatas[i];
                        color = this.getColor(tempdatas[i].name);
                        tempdatas[i].color = color;
                    }
                    //this.datas = datas;
                    for(var i=0;i<tempdatas.length;i++){
                        this.ywdatas.push(tempdatas[i]);
                    }
                }else{
                    this.ywdatas = [];
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
            
            setStyle: function(){
                //document.body.clientHeight: 网页可见区域高
                //window.screen.height: 屏幕分辨率的高
                //document.getElementById("myTeamContdiv").style.height = (window.screen.height - 110) + "px";
                
                this.currentHeight = document.documentElement.clientHeight - this.$refs.myheader.offsetHeight - this.$refs.headtitle.offsetHeight;
            },
            loadMoreXZDatas: function(){
                this.loadXZData(pk_psnjob);
            },            
            loadMoreYWDatas: function(){
                this.loadYWData(pk_psnjob);
            }
        }
    }
</script>

<style scoped>
    .mainpanle {
        width: 100%;
    }
    .mint-navbar{
        height: 1rem;
        line-height: 1rem;
        overflow-x: auto;
        overflow-y: hidden;
    }
    .mint-navbar .mint-tab-item{
        width: 50%;
        height: 1rem;
        line-height: 1rem;
        font-family:.PingFang-SC-Medium;
        color:#777777;
        letter-spacing:-0.39px;
        padding: 0 5px;
    }
    .mint-navbar .mint-tab-item.is-selected{
        height: 1rem;
        line-height: 1rem;
        color: #0caef5;
        border-bottom: 2px solid #26a2ff;
        padding: 0 5px;
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
    .tel{
        width: 0.4rem;
    }
    .teamdiv{
        width: 100%; 
        overflow: auto;
    }
    .depttitle{
        width:100%; 
        height: 0.6rem; 
        line-height: 0.6rem; 
        padding-left: 0.4rem; 
        background: #F5F5F5; 
        font-family: .PingFangSC-Regular; 
        font-size: 0.28rem; 
        color: #ADADAD; 
        letter-spacing: 0;
    }
    .xzdiv{
        width: 100%; 
        height: 0.8rem; 
        line-height: 0.8rem; 
        padding-left: 0.4rem; 
        border-bottom: 1px solid #F5F5F5; 
        font-family: .PingFangSC-Regular; 
        font-size: 0.35rem; 
        color: #333333; 
        background: #FFF; 
        letter-spacing: 0;
    }
    .ywdiv{
        width: 100%; 
        height: 0.8rem; 
        line-height: 0.8rem; 
        margin-top: 0.2rem; 
        padding-left: 0.4rem; 
        border-bottom: 1px solid #F5F5F5; 
        font-family: .PingFangSC-Regular; 
        font-size: 0.35rem; 
        color: #333333; 
        background: #FFF; 
        letter-spacing: 0;
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
    .moredatas{
        width: 100%; 
        background: #F5F5F5; 
        height: 0.6rem; 
        line-height: 0.6rem; 
        text-align: center; 
        padding-bottom: 0.8rem;
    }
    .moredataspan{
        font-family:PingFangSC-Regular; 
        font-size:0.25rem; 
        color:#666666; 
        letter-spacing:0; 
        text-align:left;
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
</style>

<style>
    .mainpanle .mint-tab-item-label{
        width: 100%;
        font-size: 0.35rem;
        font-family:PingFangSC-Regular;
        letter-spacing:-0.39px;
        word-break:keep-all;
        display:inline-block;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
        line-height: 1rem;
    }
    .mainpanle .mint-tab-container-item2{
        background:#ecf2f7;
        overflow-x: auto;
    }
</style>