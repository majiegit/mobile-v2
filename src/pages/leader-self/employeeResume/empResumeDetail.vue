<template>

    <div class="domename">
        <div ref="myheader">
            <myHeader :title="title"></myHeader>
            <div class="h-title">
                <div class="fl" v-if="!userdata.photo">
                    <i class="icon hrfont hr-head"></i>
                </div>
                <div class="fl" v-if="userdata.photo">
                    <img v-bind:src="userdata.photo" />
                </div>
                <div class="fr">
                    <span class="name">{{userdata.name}}</span>
                </div>
            </div>
        </div>

        <div class="h-body" :style="{ 'height': currentHeight + 'px'}">
            <div style="width: 95%; margin-left: 2%;">
                <div class="psninfoTitle"><h3>基本信息</h3></div>
                <div class="psninfotitlediv">
                    <span class="psninfoName">人员编码：</span>
                    <span class="psninfoValue">{{ psndocVO.code }}</span>
                </div>
                <div class="psninfotitlediv">
                    <span class="psninfoName">姓名：</span>
                    <span class="psninfoValue">{{ psndocVO.name }}</span>
                </div>
                <div class="psninfotitlediv">
                    <div class="psninfoName">性别：</div>
                    <div class="psninfoValue">{{ psndocVO.sex_name }}</div>
                </div>
                <div class="psninfotitlediv">
                    <div class="psninfoName">出生日期：</div>
                    <div class="psninfoValue">{{ psndocVO.birthdate }}</div>
                </div>
                
                <div v-show="psninfotermshow">
                    <div class="psninfotitlediv">
                        <div class="psninfoName">民族：</div>
                        <div class="psninfoValue">{{ psndocVO.nationality_name }}</div>
                    </div>
                    <div class="psninfotitlediv">
                        <div class="psninfoName">籍贯：</div>
                        <div class="psninfoValue">{{ psndocVO.nativeplace_name }}</div>
                    </div>
                    <div class="psninfotitlediv">
                        <div class="psninfoName">出生地：</div>
                        <div class="psninfoValue">{{ psndocVO.glbdef1 }}</div>
                    </div>
                    <div class="psninfotitlediv">
                        <div class="psninfoName">政治面貌：</div>
                        <div class="psninfoValue">{{ psndocVO.polity_name }}</div>
                    </div>
                    <div class="psninfotitlediv">
                        <div class="psninfoName">入党时间：</div>
                        <div class="psninfoValue">{{ psndocVO.joinpolitydate }}</div>
                    </div>
                    <div class="psninfotitlediv">
                        <div class="psninfoName">参加工作时间：</div>
                        <div class="psninfoValue">{{ psndocVO.joinworkdate }}</div>
                    </div>
                    <div class="psninfotitlediv">
                        <div class="psninfoName">入司时间：</div>
                        <div class="psninfoValue">{{ psndocVO.joinsysdate }}</div>
                    </div>
                    <div class="psninfotitlediv">
                        <div class="psninfoName">专业技术职务：</div>
                        <div class="psninfoValue">{{ psndocVO.titletechpost_name }}</div>
                    </div>
                    <div class="psninfotitlediv">
                        <div class="psninfoName">特长：</div>
                        <div class="psninfoValue">{{ psndocVO.glbdef14 }}</div>
                    </div>
                    <div class="psninfotitlediv">
                        <div class="psninfoName">单位：</div>
                        <div class="psninfoValue">{{ psndocVO.pk_org_name }}</div>
                    </div>
                    <div class="psninfotitlediv">
                        <div class="psninfoName">岗位：</div>
                        <div class="psninfoValue">{{ psndocVO.pk_post_name }}</div>
                    </div>
                    <div class="psninfotitlediv">
                        <div class="psninfoName">证件类型：</div>
                        <div class="psninfoValue">{{ psndocVO.idtype_name }}</div>
                    </div>
                    <div class="psninfotitlediv">
                        <div class="psninfoName">证件号码：</div>
                        <div class="psninfoValue">{{ psndocVO.id }}</div>
                    </div>
                    <div class="psninfotitlediv">
                        <div class="psninfoName">户籍地：</div>
                        <div class="psninfoValue2">{{ psndocVO.censusaddr }}</div>
                    </div>
                    <div class="psninfotitlediv">
                        <div class="psninfoName">加入象屿时间：</div>
                        <div class="psninfoValue">{{ psndocVO.joinsysdate }}</div>
                    </div>
                    <div class="psninfotitlediv">
                        <div class="psninfoName">婚姻状况：</div>
                        <div class="psninfoValue">{{ psndocVO.marital_name }}</div>
                    </div>
                    <div class="psninfotitlediv">
                        <div class="psninfoName">邮箱：</div>
                        <div class="psninfoValue">{{ psndocVO.email }}</div>
                    </div>
                    <div class="psninfotitlediv">
                        <div class="psninfoName">手机：</div>
                        <div class="psninfoValue">{{ psndocVO.mobile }}</div>
                    </div>
                    <div class="psninfotitlediv">
                        <div class="psninfoName">应急电话：</div>
                        <div class="psninfoValue">{{ psndocVO.glbdef16 }}</div>
                    </div>
                    <div class="psninfotitlediv">
                        <div class="psninfoName">常驻地址：</div>
                        <div class="psninfoValue2">{{ psndocVO.glbdef2 }}</div>
                    </div>
                </div>
                <div class="h-term-more" @click="psninfotoggleShow">{{psninfotermshowname}}</div>
                
                <div class="subsetTitle"><h3>学历信息</h3></div>
                <template v-if="eduDatas != null && eduDatas.length > 0" v-for="(eduData, index) in eduDatas" >
                    <div class="subsetdiv1" v-show="index<1 || edutermshow" :key="index">
                        <div class="sub-item">
                            <span class="sub-item-left">入学时间：</span>
                            <span class="sub-item-right">{{ eduData.begindate }}</span>
                        </div>
                       <div class="sub-item">
                            <span class="sub-item-left">毕业日期：</span>
                            <span class="sub-item-right">{{ eduData.enddate }}</span>
                        </div>
                        <div class="sub-item">
                            <span class="sub-item-left">学校：</span>
                            <span class="sub-item-right">{{ eduData.school }}</span>
                        </div>
                        <div class="sub-item">
                            <span class="sub-item-left">专业：</span>
                            <span class="sub-item-right">{{ eduData.major }}</span>
                        </div>
                        <div class="sub-item">
                            <span class="sub-item-left">学历：</span>
                            <span class="sub-item-right">{{ eduData.education_name }}</span>
                        </div>
                        <div class="sub-item">
                            <span class="sub-item-left">学位：</span>
                            <span class="sub-item-right">{{ eduData.pk_degree_name }}</span>
                        </div>
                        <div class="sub-item">
                            <span class="sub-item-left">学习形式：</span>
                            <span class="sub-item-right">{{ eduData.studymode_name }}</span>
                        </div>

                    </div>
                </template>
                <div class="h-term-more" v-if="!!eduDatas && eduDatas.length>1" @click="edutoggleShow">{{edutermshowname}}</div>
                
                <div class="subsetTitle"><h3>工作履历</h3></div>
                <template v-if="joinDatas != null && joinDatas.length > 0" v-for="(joinData, index) in joinDatas">
                    <div class="subsetdiv1"  v-show="index<1 || jointermshow" :key="index">
                        <div class="sub-item">
                            <span class="sub-item-left">开始日期：</span>
                            <span class="sub-item-right">{{ joinData.begindate }}</span>
                        </div>
                        <div class="sub-item">
                            <span class="sub-item-left">结束日期：</span>
                            <span class="sub-item-right">{{ joinData.enddate }}</span>
                        </div>
                        <div class="sub-item">
                            <span class="sub-item-left">工作单位：</span>
                            <span class="sub-item-right">{{ joinData.workcorp }}</span>
                        </div>
                        <div class="sub-item">
                            <span class="sub-item-left">部门：</span>
                            <span class="sub-item-right">{{ joinData.workdept }}</span>
                        </div>
                        <div class="sub-item">
                            <span class="sub-item-left">职务：</span>
                            <span class="sub-item-right">{{ joinData.workjob }}</span>
                        </div>
                        <div class="sub-item">
                            <span class="sub-item-left">岗位：</span>
                            <span class="sub-item-right">{{ joinData.workpost }}</span>
                        </div>
                        <div class="sub-item">
                            <span class="sub-item-left">从事行业：</span>
                            <span class="sub-item-right">{{ joinData.glbdef1_name }}</span>
                        </div>
                    </div>
                </template>
                <div class="h-term-more" v-if="!!joinDatas && joinDatas.length>1" @click="jointoggleShow">{{jointermshowname}}</div>
                
                <div class="subsetTitle"><h3>奖励情况</h3></div>
                <template v-if="rewardDatas != null && rewardDatas.length > 0" v-for="(rewardData, index) in rewardDatas">
                    <div class="subsetdiv2" v-show="index<1 || rewardtermshow" :key="index">
                        <div class="sub-item">
                            <span class="sub-item-left">奖励级别：</span>
                            <span class="sub-item-right">{{ rewardData.encourrank_name }}</span>
                        </div>
                        <div class="sub-item">
                            <span class="sub-item-left">奖励机构：</span>
                            <span class="sub-item-right">{{ rewardData.encourrank_name }}</span>
                        </div>
                        <div class="sub-item">
                            <span class="sub-item-left">荣耀称号：</span>
                            <span class="sub-item-right">{{ rewardData.glbdef2 }}</span>
                        </div>
                        <div class="sub-item">
                            <span class="sub-item-left">奖励名称：</span>
                            <span class="sub-item-right">{{ rewardData.glbdef1 }}</span>
                        </div>
                        <div class="sub-item">
                            <span class="sub-item-left">奖励日期：</span>
                            <span class="sub-item-right">{{ rewardData.encourdate }}</span>
                        </div>
                        <div class="sub-item">
                            <span class="sub-item-left">奖励事由：</span>
                            <span class="sub-item-right">{{ rewardData.encourmatter }}</span>
                        </div>
                    </div>
                </template>
                <div class="h-term-more" v-if="!!rewardDatas && rewardDatas.length>1" @click="rewardtoggleShow">{{rewardtermshowname}}</div>
                
                <!--<div class="subsetTitle"><h3>惩罚情况</h3></div>
                <template v-if="punishDatas != null && punishDatas.length > 0" v-for="punishData in punishDatas">
                    <div class="subsetdiv2">
                        <div class="subsetName">惩罚机构：</div>
                        <div class="subsetValue">{{ punishData.punishorg }}</div>
                        <div class="subsetName">惩罚单位：</div>
                        <div class="subsetValue">{{ punishData.pk_group_name }}</div>
                        <div class="subsetName">惩罚事由：</div>
                        <div class="subsetValue">{{ punishData.punishmatter }}</div>
                        <div class="subsetName">处分名称：</div>
                        <div class="subsetValue">{{ punishData.glbdef1 }}</div>
                        <div class="subsetName">惩罚日期：</div>
                        <div class="subsetValue">{{ punishData.punishdate }}</div>
                        <div class="subsetName">惩罚类型：</div>
                        <div class="subsetValue">{{ punishData.punishtype }}</div>
                    </div>
                </template>-->
                <div class="subsetTitle"><h3>家庭成员</h3></div>
                <template v-if="familyDatas != null && familyDatas.length > 0" v-for="(familyData, index) in familyDatas">
                    <div class="subsetdiv2" v-show="index<1 || familytermshow" :key="index">
                        <div class="sub-item">
                            <span class="sub-item-left">与本人关系：</span>
                            <span class="sub-item-right">{{ familyData.mem_relation_name }}</span>
                        </div>
                        <div class="sub-item">
                            <span class="sub-item-left">家庭成员姓名：</span>
                            <span class="sub-item-right">{{ familyData.mem_name }}</span>
                        </div>
                        <div class="sub-item">
                            <span class="sub-item-left">出生日期：</span>
                            <span class="sub-item-right">{{ familyData.mem_birthday }}</span>
                        </div>
                        <div class="sub-item">
                            <span class="sub-item-left">政治面貌：</span>
                            <span class="sub-item-right">{{ familyData.politics_name }}</span>
                        </div>
                        <div class="sub-item">
                            <span class="sub-item-left">工作单位：</span>
                            <span class="sub-item-right">{{ familyData.mem_corp }}</span>
                        </div>
                        <div class="sub-item">
                            <span class="sub-item-left">职务：</span>
                            <span class="sub-item-right">{{ familyData.mem_job }}</span>
                        </div>
                    </div>
                </template>
                <div class="h-term-more" v-if="!!familyDatas && familyDatas.length>1" @click="familytoggleShow">{{familytermshowname}}</div>
                
                <div class="subsetTitle"><h3>其他任职</h3></div>
                <template v-if="partworkDatas != null && partworkDatas.length > 0" v-for="(partworkData, index) in partworkDatas">
                    <div class="subsetdiv3" v-show="index<1 || partworktermshow" :key="index">
                        <div class="sub-item">
                            <span class="sub-item-left">其他任职类型：</span>
                            <span class="sub-item-right">{{ partworkData.glbdef6_name }}</span>
                        </div>
                        <div class="sub-item">
                            <span class="sub-item-left">开始日期：</span>
                            <span class="sub-item-right">{{ partworkData.begindate }}</span>
                        </div>
                        <div class="sub-item">
                            <span class="sub-item-left">结束日期：</span>
                            <span class="sub-item-right">{{ partworkData.enddate }}</span>
                        </div>
                        <div class="sub-item">
                            <span class="sub-item-left">公司：</span>
                            <span class="sub-item-right">{{ partworkData.glbdef1_name }}</span>
                        </div>
                        <div class="sub-item">
                            <span class="sub-item-left">届次：</span>
                            <span class="sub-item-right">{{ partworkData.glbdef2 }}</span>
                        </div>
                        <div class="sub-item">
                            <span class="sub-item-left">其他任职组织：</span>
                            <span class="sub-item-right">{{ partworkData.glbdef3_name }}</span>
                        </div>
                        <div class="sub-item">
                            <span class="sub-item-left">其他任职组织：</span>
                            <span class="sub-item-right">{{ partworkData.glbdef4_name }}</span>
                        </div>
                        <div class="sub-item">
                            <span class="sub-item-left">是否任期：</span>
                            <span class="sub-item-right">{{ partworkData.glbdef5 }}</span>
                        </div>
                    </div>
                </template>
                <div class="h-term-more" v-if="!!partworkDatas && partworkDatas.length>1" @click="partworktoggleShow">{{partworktermshowname}}</div>
                
            </div>
            <!--<div id="screeheight" style="text-align: center;"></div>-->
        </div>
    </div>
</template>
<script>
    import { ajax, getStorage,setStorage } from 'hr-utils';
    import myHeader from '../../../components/base/my-header.vue'
    import imgPicker from '../../../components/base/img-picker'
    import { Picker, Popup, Toast, Cell, Indicator } from 'mint-ui'
    //import datas from './data.js'
    
    export default {
        name: 'personal',
        components: {
            myHeader,
            imgPicker
        },
        data() {
            return {
                title: '简历信息',
                currentHeight: this.height,
                psninfotermshow:false,
                psninfotermshowname:"显示更多",
                edutermshow:false,//控制是否显示所有字段
                edutermshowname:"显示更多",//显示更多数据字段
                jointermshow:false,//控制是否显示所有字段
                jointermshowname:"显示更多",//显示更多数据字段
                rewardtermshow:false,
                rewardtermshowname:"显示更多",
                familytermshow:false,
                familytermshowname:"显示更多",
                partworktermshow:false,
                partworktermshowname:"显示更多",
                
                userdata: "", //获取的用户数据
                psndocVO: '', //人员信息vo数据
                personId: '',
                eduDatas: [], //学历信息
                joinDatas: [], //工作履历
                rewardDatas: [], //奖励情况
                //punishDatas: [], //惩罚情况
                familyDatas: [], //家庭成员
                partworkDatas: [], //其他任职
            }
        },
        watch: {
            height(val) {
                if(val) {
                    this.currentHeight = val;
                }
            },
            // 如果路由有变化，会再次执行该方法
            //"$route": "getdata"
        },
        mounted() {
            this.getdata();
            let _this = this;
            setTimeout(
                function(){
                    _this.currentHeight = document.documentElement.clientHeight - _this.$refs.myheader.offsetHeight - 10;
                },500
            );
            //console.log(datas)
//          this.psndocVO = datas.data.data.psndocVO;
//          this.userdata = datas.data.data.psndocVO;
//          this.eduDatas = datas.data.data.hashTableVO.hi_psndoc_edu; //学历信息
//          this.joinDatas = datas.data.data.hashTableVO.hi_psndoc_work; //工作履历
//          this.rewardDatas = datas.data.data.hashTableVO.hi_psndoc_enc; //奖励情况
//          //this.punishDatas = datas.data.data.hashTableVO.hi_psndoc_pun; //惩罚情况
//          this.familyDatas = datas.data.data.hashTableVO.hi_psndoc_family; //家庭成员
//          this.partworkDatas = datas.data.data.hashTableVO.hi_psndoc_glbdef6; //其他任职
        },
        methods: {
            psninfotoggleShow(){//切换显示与隐藏字段
                this.psninfotermshow=!this.psninfotermshow;
                if(this.psninfotermshow){
                    this.psninfotermshowname="隐藏更多"
                }else{
                    this.psninfotermshowname="显示更多"
                }
            },
            edutoggleShow(){//切换显示与隐藏字段
                this.edutermshow=!this.edutermshow;
                if(this.edutermshow){
                    this.edutermshowname="隐藏更多"
                }else{
                    this.edutermshowname="显示更多"
                }
            },
            jointoggleShow(){//切换显示与隐藏字段
                this.jointermshow=!this.jointermshow;
                if(this.jointermshow){
                    this.jointermshowname="隐藏更多"
                }else{
                    this.jointermshowname="显示更多"
                }
            },
            rewardtoggleShow(){//切换显示与隐藏字段
                this.rewardtermshow=!this.rewardtermshow;
                if(this.rewardtermshow){
                    this.rewardtermshowname="隐藏更多"
                }else{
                    this.rewardtermshowname="显示更多"
                }
            },
            familytoggleShow(){//切换显示与隐藏字段
                this.familytermshow=!this.familytermshow;
                if(this.familytermshow){
                    this.familytermshowname="隐藏更多"
                }else{
                    this.familytermshowname="显示更多"
                }
            },
            partworktoggleShow(){//切换显示与隐藏字段
                this.partworktermshow=!this.partworktermshow;
                if(this.partworktermshow){
                    this.partworktermshowname="隐藏更多"
                }else{
                    this.partworktermshowname="显示更多"
                }
            },
            getdata: function() {
                this.currentHeight = document.documentElement.clientHeight - this.$refs.myheader.offsetHeight - 10;
                //console.log(this.currentHeight + "--" + document.documentElement.clientHeight + "--" + this.$refs.myheader.offsetHeight)
                //let ele = document.getElementById("screeheight");
                //ele.innerText = this.currentHeight + "--" + document.documentElement.clientHeight + "--" + this.$refs.myheader.offsetHeight;
                
                let pk_psndoc = this.$route.query.pk_psndoc;
                //console.log('获取到的人员主键pk_psndoc = ' + pk_psndoc)
                var _this = this;
                //获取人员信息
                var param = {
                    pk_psndoc: pk_psndoc
                }
                Indicator.open();
                //获取头像信息
                ajax('hrssc/portal/psnbase/getPsnInfo', 'POST', "application/json", param, function(data) {
                    if(data.statusCode == 200) {
                        _this.userdata = data.data[0];
                        _this.title = _this.userdata.name + '简历信息';
                    } else {
                        Toast(data.message);
                    }
                }, function(data) {
                    Indicator.close();
                });
                
                //获取人员简历信息
                ajax('hrssc/portal/psnbase/queryEmployeeResume', 'POST', "application/json", param, function(data) {
                    Indicator.close();
                    if(data.statusCode == 200) {
                        //debugger
                        if(!!data.data) {
                            if(data.data.psndocVO != null) {
                                _this.psndocVO = data.data.psndocVO; //人员基本信息
                            }
                            if(data.data.hashTableVO != null){
                                _this.eduDatas = data.data.hashTableVO.hi_psndoc_edu; //学历信息
                                _this.joinDatas = data.data.hashTableVO.hi_psndoc_work; //工作履历
                                _this.familyDatas = data.data.hashTableVO.hi_psndoc_family; //家庭成员
                                _this.rewardDatas = data.data.hashTableVO.hi_psndoc_enc; //奖励情况
                                //_this.punishDatas = data.data.hashTableVO.hi_psndoc_pun; //惩罚情况
                                _this.partworkDatas = data.data.hashTableVO.hi_psndoc_glbdef6; //其他任职
                            }
                        }
                        //console.log(_this.psndocVO)
                        //console.log(data.data.hashTableVO)
                    } else {
                        Toast(data.message);
                    }
                }, function(data) {
                    //Indicator.close();
                });
            },
        }
    };
</script>

<style lang='less' scoped>
    @0CAEF5-color : #0CAEF5;
    @b2b2b2-color : #b2b2b2;
    .domename {
        .h-title {
            position: relative;
            top: 0;
            left: 0;
            width: 100%;
            height: 2.4rem;
            margin-bottom: 0.2rem;
            padding: 0.2rem 0rem 0.2rem 0.5rem;
            border-bottom: 1px solid #e4e4e4;
            background: #ffffff;
            .fl {
                float: left;
                width: 1.4rem;
                height: 1.97rem;
                vertical-align: middle;
                position: relative;
                top: 0;
                left: 0;
                background: #e7e7e7;
                text-align: center;
                i.icon.hrfont.hr-head {
                    font-size: 1.4rem;
                    color: #adadad;
                    position: absolute;
                    bottom: 0.3rem;
                    left: 0;
                }
                img {
                    width: 1.4rem;
                    height: 1.97rem;
                    vertical-align: middle;
                }
            }
            .fr {
                float: left;
                padding-left: 0.3rem;
                padding-top: 0.4rem;
                width: 2.7rem;
                >span {
                    font-size: 0.42rem;
                    font-family: PingFang-SC-Bold;
                    color: #343434;
                }
            }
        }
        .h-body {
            overflow: scroll;
            height: 100%;
        }
        .h-term-more {
            width: 100%;
            height: 0.6rem;
            line-height: 0.4rem;
            font-size: 0.25rem;
            text-align: center;
            margin-top: 0.2rem;
            margin-bottom: 0.2rem;
        }
    }
    .psninfoTitle{
        padding: 3px 2px; color: #ccc; font-family: inherit; color: inherit;
    }
    .psninfoTitle h3{
        font-size: 0.34rem;
    }
    .psninfotitlediv{
        padding: 5px 10px; background: #FFF;  line-height: 0.5rem; margin-bottom: 1px; clear: both;position: relative;overflow: auto;
    }
    .psninfoName{
        font-size: 0.3rem; float: left; width: 28%; background: #FFF; color: #999;display: inline-block;    
    }
    .psninfoValue{
        font-size: 0.3rem; float: right; width: 72%; text-align: left;display: inline-block;
    }
    .psninfoValue2{
        font-size: 0.3rem; float: right; width: 72%; text-align: left; white-space: nowrap; text-overflow:ellipsis; overflow: hidden;display: inline-block;
    }
    .subsetTitle{
        padding: 3px 2px; color: #ccc; font-family: inherit; color: inherit; border-top: 1px solid #ccc;
    }
    .subsetTitle h3{
        font-size: 0.34rem;
    }
    .subsetdiv1{
        background: #FFF; padding: 0.1rem 0; top: 5px;  margin-bottom: 0.1rem;
    }
    .subsetdiv2{
        background: #FFF; padding: 0.1rem 0; top: 5px;  margin-bottom: 0.1rem;
    }
    .subsetdiv3{
        background: #FFF; padding: 0.1rem 0; top: 5px;  margin-bottom: 0.1rem;
    }
    .subsetName{
        font-size: 0.3rem; padding: 1px 10px; float: left; width: 35%; background: #FFF; color: #999; height: 0.5rem; line-height: 0.5rem;
    }
    .subsetValue{
        font-size: 0.3rem; padding: 1px 10px; float: right; width: 65%; background: #FFF; text-align: right; height: 0.5rem; line-height: 0.5rem;
    }
    .sub-item{
        font-size: 0.3rem;
        padding: 1px 10px;
        background: #FFF;
        line-height: 0.5rem;
        overflow: auto;
        .sub-item-left{
            float: left;
            width: 28%;
            color: #999;
        }
        .sub-item-right{
            float: left;   
            width: 72%;
            text-align: left;
        }
    }
</style>