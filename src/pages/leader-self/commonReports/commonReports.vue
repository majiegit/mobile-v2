<template>
    <div class="commrepmainpanle">
        <div ref="myheader">
            <myHeader title="常用报表" :callbackfun='callBack'></myHeader>
        </div>
        
        <section>
            <div ref="mytitle">
                <mt-navbar v-model="selected">
                    <mt-tab-item id="1">公司人数</mt-tab-item>
                    <mt-tab-item id="2">工作地点</mt-tab-item>
                </mt-navbar>
            </div>
            
            <mt-tab-container v-model="selected">
                <mt-tab-container-item id="1">
                    <div class="tableWrap" style="width: 96%; margin-left: 2%; overflow: hidden; margin-top: 5px;">
                        <div ref="tablehead">
                            <table style="border: 1px solid #dfe6ec; padding: 5px; background: #FFF; border-collapse:collapse;" class="table-thead">
                                <colgroup>
                                    <col width="15%">
                                    <col width="15%">
                                    <col width="15%">
                                    <col width="10%">
                                    <col width="15%">
                                    <col width="15%">
                                    <col width="15%">
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>板块</th>
                                        <th>二级板块</th>
                                        <th>公司</th>
                                        <th>总人数</th>
                                        <th>正式员工/退休返聘</th>
                                        <th>劳务派遣/劳务人员</th>
                                        <th>劳务外包人员</th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                        
                        <div style="overflow: auto; margin-top: 1px;" :style="{ 'height': currentCompanyHeight + 'px'}">
                            <template v-if="tempDatas != null">
                                <table style="width: 100%; border: 1px solid #dfe6ec; padding-top: 1px; background: #FFF; border-collapse:collapse;">
                                    <colgroup>
                                        <col width="15%">
                                        <col width="15%">
                                        <col width="15%">
                                        <col width="10%">
                                        <col width="15%">
                                        <col width="15%">
                                        <col width="15%">
                                    </colgroup>
                                    <tbody>
                                        <template v-if="tempDatas.data != null && tempDatas.data.length > 0" v-for="(data, index) in tempDatas.data">
                                            <template v-if="data.plate_sun != null && data.plate_sun.length > 0" v-for="(data2, index2) in data.plate_sun">
                                                <template v-if="data2.org_sun_item != null && data2.org_sun_item.length > 0" v-for="(data3, index3) in data2.org_sun_item">
                                                    <tr style="color: #5e6d82; font-size: 14px; line-height: 25px;">
                                                        <template v-if="index2 == 0 && index3 == 0">
                                                            <td :rowspan="data.sum_row" style="text-align: center;">{{ data.plate_name }}</td><!--集团-->
                                                        </template>
                                                        
                                                        <template v-if="index3 == 0">
                                                            <td :rowspan="data2.org_sun_item.length + 1" style="text-align: center;">{{ data2.org_plate_name }}</td> <!-- - -->
                                                        </template>
                                                        <td style="text-align: left;">{{ data3.org_name }}</td> <!--厦门象屿集团有限公司-->
                                                        <td>{{ data3.all }}</td>
                                                        <td>{{ data3.zsyg_txfp }}</td><td>{{ data3.lwpq_lwry }}</td><td>{{ data3.lwwbry }}</td>
                                                    </tr>
                                                </template>
                                                <tr style="background: #D8D8D8; color: #5e6d82; font-size: 14px; line-height: 25px;">
                                                    <td style="text-align: left;">小计</td>
                                                    <td>{{ data2.all }}</td>
                                                    <td>{{ data2.sum_zsyg_txfp }}</td><td>{{ data2.sum_lwpq_lwry }}</td><td>{{ data2.sum_lwwbry }}</td>
                                                </tr>
                                            </template>
                                            <tr style="background: #C8C8C8; color: #5e6d82; font-size: 14px; line-height: 25px;">
                                                <td style="text-align: left;">合计</td>
                                                <td></td>
                                                <td>{{ data.all }}</td>
                                                <td>{{ data.sum_zsyg_txfp }}</td><td>{{ data.sum_lwpq_lwry }}</td><td>{{ data.sum_lwwbry }}</td>
                                            </tr>
                                        </template>
                                    </tbody>
                                    <tfoot style="background: #B7B7B7;">
                                        <tr style="color: #5e6d82; font-size: 14px; line-height: 25px;">
                                            <td style="height: 0.5rem; text-align: center;">总计</td><td></td><td></td>
                                            <td>{{ tempDatas.all }}</td>
                                            <td>{{ tempDatas.total_zsyg_txfp }}</td><td>{{ tempDatas.total_lwpq_lwry }}</td><td>{{ tempDatas.total_lwwbry }}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </template>
                        </div>
                        
                    </div>
                </mt-tab-container-item>
                
                
                <mt-tab-container-item id="2">
                    <div class="tableWrap" style="width: 96%; margin-left: 2%; overflow-x: scroll; overflow-y: hidden;margin-top: 5px;">
                        <div ref="tablehead2">
                            <table style="width: 700px; border: 1px solid #dfe6ec; border-bottom:0px solid; padding-top: 5px; background: #FFF; border-collapse:collapse;" class="table-thead">
                                <thead>
                                    <tr style="height: 45px;">
                                        <th style="width: 50px;">板块</th>
                                        <th style="width: 50px;">二级板块</th>
                                        <th style="width: 100px;">公司</th>
                                        <th style="width: 60px;">总人数</th>
                                        <th style="width: 50px;">厦门</th>
                                        <th style="width: 50px;">上海</th>
                                        <th style="width: 50px;">福州</th>
                                        <th style="width: 50px;">天津</th>
                                        <th style="width: 50px;">青岛</th>
                                        <th style="width: 50px;">广州</th>
                                        <th style="width: 50px;">深圳</th>
                                        <th style="width: 90px;">其他地区</th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                    
                        <div style="width: 700px; overflow: auto; margin-top: 1px;" :style="{ 'height': currentWorkplaceHeight + 'px'}">
                            <template v-if="workPlaceDatas != null">
                                <table style="border: 1px solid #ccc; padding-top: 5px; background: #FFF; border-collapse:collapse;">
                                    <tbody>
                                        <template v-if="workPlaceDatas.data != null && workPlaceDatas.data.length > 0" v-for="(data, index) in workPlaceDatas.data">
                                            <template v-if="data.plate_sun != null && data.plate_sun.length > 0" v-for="(data2, index2) in data.plate_sun">
                                                <template v-if="data2.org_sun_item != null && data2.org_sun_item.length > 0" v-for="(data3, index3) in data2.org_sun_item">
                                                    <tr style="color: #5e6d82; font-size: 14px;">
                                                        <template v-if="index2 == 0 && index3 == 0">
                                                            <td :rowspan="data.sum_row" style="text-align: center; width:50px;">{{ data.plate_name }}</td><!--集团-->
                                                        </template>
                                                        
                                                        <template v-if="index3 == 0">
                                                            <td :rowspan="data2.org_sun_item.length + 1" style="width:50px; text-align: center;">{{ data2.org_plate_name }}</td> <!-- - -->
                                                        </template>
                                                        <td style="width:100px; text-align: left;" min-width="100">{{ data3.org_name }}</td> <!--厦门象屿集团有限公司-->
                                                        <td style="width:60px;">{{ data3.totalcnt }}</td>
                                                        <td style="width:50px;">{{ data3.xiamen }}</td>
                                                        <td style="width:50px;">{{ data3.shanghai }}</td>
                                                        <td style="width:50px;">{{ data3.fuzhou }}</td>
                                                        <td style="width:50px;">{{ data3.tianjin }}</td>
                                                        <td style="width:50px;">{{ data3.qingdao }}</td>
                                                        <td style="width:50px;">{{ data3.guangzhou }}</td>
                                                        <td style="width:50px;">{{ data3.shenzhen }}</td>
                                                        <td style="width:90px;">{{ data3.othercnt }}</td>
                                                    </tr>
                                                </template>
                                                <tr style="background: #D8D8D8; color: #5e6d82; font-size: 14px; line-height: 25px;">
                                                    <td style="text-align: left;">小计</td>
                                                    <td>{{ data2.sum_total }}</td><td>{{ data2.sum_xiamen }}</td><td>{{ data2.sum_shanghai }}</td>
                                                    <td>{{ data2.sum_fuzhou }}</td><td>{{ data2.sum_tianjin }}</td><td>{{ data2.sum_qingdao }}</td>
                                                    <td>{{ data2.sum_guangzhou }}</td><td>{{ data2.sum_shenzhen }}</td><td>{{ data2.sum_other }}</td>
                                                </tr>
                                            </template>
                                            <tr style="background: #C8C8C8; color: #5e6d82; font-size: 14px; line-height: 25px;">
                                                <td style="text-align: left;">合计</td><td></td>
                                                <td>{{ data.sum_total }}</td><td>{{ data.sum_xiamen }}</td><td>{{ data.sum_shanghai }}</td>
                                                <td>{{ data.sum_fuzhou }}</td><td>{{ data.sum_tianjin }}</td><td>{{ data.sum_qingdao }}</td>
                                                <td>{{ data.sum_guangzhou }}</td><td>{{ data.sum_shenzhen }}</td><td>{{ data.sum_other }}</td>
                                            </tr>
                                        </template>
                                    </tbody>
                                    <tfoot style="background: #B7B7B7;">
                                        <tr style="color: #5e6d82; font-size: 14px; line-height: 25px;">
                                            <td style="height: 0.5rem; text-align: center;">总计</td><td></td><td></td>
                                            <td>{{ workPlaceDatas.sum_total }}</td><td>{{ workPlaceDatas.sum_xiamen }}</td><td>{{ workPlaceDatas.sum_shanghai }}</td>
                                            <td>{{ workPlaceDatas.sum_fuzhou }}</td><td>{{ workPlaceDatas.sum_tianjin }}</td><td>{{ workPlaceDatas.sum_qingdao }}</td>
                                            <td>{{ workPlaceDatas.sum_guangzhou }}</td><td>{{ workPlaceDatas.sum_shenzhen }}</td><td>{{ workPlaceDatas.sum_other }}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </template>
                        </div>
                        
                    </div>
                </mt-tab-container-item>
            </mt-tab-container>
        </section>
    </div>
</template>

<script>
    import { myHeader } from 'hr-ui'
    import { ajax } from 'hr-utils'

    import { Toast, Indicator } from 'mint-ui';
    //import TempDatas from './data2'
    //import WorkPlaceDatas from './work-data'
    
    export default {
        name: 'commonReports',
        data() {
            return {
                currentCompanyHeight: this.height,
                currentWorkplaceHeight: this.height,
                selected: "1",
                //公司人数
                tempDatas: null,
                //工作地点
                workPlaceDatas: null
            }
        },
        
        components: {
            myHeader
        },
        mounted() {
            //调用接口查询公司人数数据
            this.loadCompanyData();
            
            //调用接口查询工作地点数据
            this.loadWorkplaceData();
            
            //this.tempDatas = TempDatas.resdata.data;
            //this.workPlaceDatas = WorkPlaceDatas.resdata.data;
            //console.log(JSON.stringify(this.workPlaceDatas));
            //console.log(this.workPlaceDatas);
            this.currentCompanyHeight = document.documentElement.clientHeight - this.$refs.myheader.offsetHeight - this.$refs.mytitle.offsetHeight - this.$refs.tablehead.offsetHeight - 5;
            this.currentWorkplaceHeight = document.documentElement.clientHeight - this.$refs.myheader.offsetHeight - this.$refs.mytitle.offsetHeight - 45 - 5;
        },
        watch:{
            height(val) {
                if (val) {
                    this.currentCompanyHeight = val;
                }
            },
            height(val) {
                if (val) {
                    this.currentWorkplaceHeight = val;
                }
            }
        },
        methods: {
            //返回首页
            callBack : function(){
                this.$router.push('application');
            },
            
            /**
             * 查询公司人数数据
             */
            loadCompanyData: function() {
                Indicator.open();
                let param = {}
                let _this = this;
                ajax('hrssc/portal/psnbase/numberOfStaff', 'POST', "application/json", param, function(data) {
                    Indicator.close();
                    if(data.statusCode == 200) {
                        if(data.data != null) {
                            _this.tempDatas = data.data;
                        }else{
                            _this.tempDatas = [];
                        }
                    } else {
                        Toast(data.message);//单行提示
                    }
                }, function(data) {
                    Indicator.close();
                });
            },
            /**
             * 查询工作地点数据
             */
            loadWorkplaceData: function() {
                Indicator.open();
                let param = {}
                let _this = this;
                ajax('hrssc/portal/psnbase/workingPlace', 'POST', "application/json", param, function(data) {
                    Indicator.close();
                    if(data.statusCode == 200) {
                        if(data.data != null) {
                            _this.workPlaceDatas = data.data;
                        }else{
                            _this.workPlaceDatas = [];
                        }
                    } else {
                        Toast(data.message);//单行提示
                    }
                }, function(data) {
                    Indicator.close();
                    //console.log(data)
                });
            }
        }
    }
</script>

<style scoped>
    .commrepmainpanle {
        width: 100%;
    }
    .mint-navbar .mint-tab-item{
        padding: 10px 0;
    }
    th{
        padding: 5px;
        text-align: center;
        border: 1px solid #ccc;
    }
    tr{
        border: 1px solid #ccc;
    }
    td{
        border: 1px solid #ccc;
        text-align: right;
        padding: 5px;
    }
    
    .workplacetable th{
        padding-left: 5px;
        padding-right: 5px;
        text-align: center;
        border: 1px solid #ccc;
    }
    
    .workplacetable td{
        border: 1px solid #ccc;
        text-align: right;
        padding-left: 5px;
        padding-right: 5px;
    }
    .workplaceth11{
        word-break:keep-all;
        white-space:nowrap;
    }
    .table-thead{
        width:auto;
        font-size: 14px;
        background-color: #FFF;
        border: 1px solid #CFCFCF;
        border-collapse: collapse;
        border-spacing: 0px;
    }
</style>
<style>
    .commrepmainpanle .mint-tab-item-label{
        font-size: 0.35rem;
    }
</style>