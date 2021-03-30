<template>
    <div class="fjmainpanle">
        <div ref="myheader">
            <div style="height: 0.88rem; line-height: 0.88rem;">
                <HrHeader title='附件管理' lIcon='hr-Arrow2' lText='' v-on:lcallBack='goReturn'>
                </HrHeader>
            </div>
        </div>
        <section>
            <template v-if="fujlist != null && fujlist.length > 0" v-for="(list, index) in fujlist">
                <div class="filelistdiv" key="index">
                    <div class="imglogodiv">
                        <div v-if="list.fileType == 'image'">
                            <img src="../../../../../../static/img/pages/fujlogo/imglogo.png" class="imglogo" />
                        </div>
                        <div v-else-if="list.fileType == 'word'">
                            <img src="../../../../../../static/img/pages/fujlogo/word.png" class="imglogo" />
                        </div>
                        <div v-else-if="list.fileType == 'excel'">
                            <img src="../../../../../../static/img/pages/fujlogo/excel.png" class="imglogo" />
                        </div>
                        <div v-else-if="list.fileType == 'pdf'">
                            <img src="../../../../../../static/img/pages/fujlogo/pdf.png" class="imglogo" />
                        </div>
                    </div>
                    <template v-if="list.fileType == 'image'">
                        <div class="filename" @click="viewImg(list)">{{ list.fileName }}</div>
                    </template>
                    <template v-else>
                        <div class="filename"">{{ list.fileName }}</div>
                    </template>
                    <template v-if="approve_state != null && approve_state == -1">
                        <div class="filedel" @click="deleteObj(list)">删除</div>
                    </template>
                    <template v-else>
                        &nbsp;
                    </template>
                </div>
            </template>
            <template v-if="fujlist != null && fujlist.length == 0 && approve_state != null && approve_state != -1">
                <div class="emptydiv">
                    <img src="../../../../../../static/img/pages/application/noData.svg">
                </div>
            </template>
            
            <div style="height: 0.2rem;"></div>
            
            <template v-if="approve_state != null && approve_state == -1">
                <div class="uploadfile">上传附件
                    <input class="selImgInput" type="file" id='fileElem' accept="image/*" multiple="multiple" @change="handleFiles">
                </div>
                <div class="uploadzs">注：仅支持图片上传、预览，单个文件大小不能超过15M</div>
            </template>
            
        </section>
        <div id="bigimgdiv" class="bigimgdiv" @click="closeBigImg()">
            <img :src="selimgurl" class="bigimg" id="bigimg" @load="aftload" @error="loadErr" />
        </div>
    </div>
</template>

<script>
    import { ajax, fetchData } from 'hr-utils';
    import { HrHeader, ImgPicker } from 'hr-ui';
    import { Toast, Indicator } from 'mint-ui';

    export default {
        name: 'addressList',
        data() {
            return {
                images: {},
                arr: {},
                billId: null,  //单据id
                approve_state: null,  //单据审批状态
                fujlist: [],
                selimgurl: '',
                parselImgUrl: ''
            }
        },

        components: {
            HrHeader
        },
        mounted() {
            this.billId = this.$route.query.billId;
            this.approve_state = this.$route.query.approve_state;
            //console.log("billId = " + this.billId);
            this.qryData();
        },
        methods: {
            goReturn() {
                history.go(-1);
            },
            getImgUrl(imgUrl) {
                this.images = imgUrl;
                //console.log(JSON.stringify(imgUrl))
            },
            /**
             * 获取附件列表
             */
            qryData() {
                let _this = this;
                //debugger
                //alert("调用查询附件接口");
                let params = {
                    filePath: _this.billId, //billId：单据id
                }
                fetchData({
                    url: 'hrssc/portal/fileManager/imgList',  //  hrssc/portal/fileManager/fileList(获取附件列表)   hrssc/portal/fileManager/imgList(获取图片列表)
                    method: 'get',
                    param: params,
                    mock: false,
                    contentType: "application/json",
                    success: function(data) {
                        //debugger
                        Indicator.close();
                        //设置图片（逻辑待过滤，支持 word、excel、pdf和图片）
                        _this.fujlist = data.data;
                    },
                    error: function(error) {
                        Indicator.close();
                        Toast(error.message);
                    }
                })
            },
            /**
             * 保存图片
             */
            doSave(imgObj) {
                Indicator.open("上传中...");
                //console.log(JSON.stringify(imgObj));
                let _this = this;
                //alert("调用保存附件接口");
                let billId = _this.$route.query.billId;
                let params = {
                    filePath: _this.billId, //billId：单据id
                    imgInfo: imgObj,
                    groupType: "shenqingdan"
                }
                //console.log(JSON.stringify(params));
                //return false;
                fetchData({
                    url: 'hrssc/portal/fileManager/imgUpload', //hrssc/portal/fileManager/imgUpload（图片上传）    hrssc/portal/fileManager/upload（附件上传）
                    method: 'post',
                    param: params,
                    mock: false,
                    contentType: "application/json",
                    success: function(data) {
                        Indicator.close();
                        Toast(data.message);
//                      if(data.data != null && JSON.parse(data.data) != null && JSON.parse(data.data).files != null){
//                          _this.fujlist = JSON.parse(data.data).files;
//                      }
                        _this.qryData();
                    },
                    error: function(error) {
                        Indicator.close();
                        Toast(error.message);
                    }
                })
            },
            handleFiles: function(e) {
                let files = e.target.files || e.dataTransfer.files;
                this.renderImage(files);
            },
            //获取图片
            renderImage: function(file) {
                let maxSize = 200 * 1024;
                let _this = this;
                let leng = file.length;
                if(leng > 3) {
                    Toast("一次最多上传3个文件！");
                    return false;
                }
                for(let i = 0; i < leng; i++) {
                    let name = file[i].name
                    //console.log(name + "; size = " + leng)
                    let reader = new FileReader();
                    reader.readAsDataURL(file[i]);
                    reader.onload = function(e) {
                        let result = e.target.result;
                        let img = new Image();
                        img.src = result;
                        img.onload = function() {
                            let w = img.naturalWidth,
                                h = img.naturalHeight
                            //压缩
                            result = (result.length > maxSize) ? _this.compress(img, w, h, 0.2) : _this.compress(img, w, h, 1)
                            let timestamp = Date.parse(new Date());
                            let namearr = name.split(".");
                            let newname = namearr[0] + timestamp + "." + namearr[1];
                            let imgObj = {
                                name: newname,
                                data: result,
                            }
                            //调用上传接口上传附件
                            _this.doSave(imgObj);
                        }
                    };
                }
            },
            //压缩图片
            compress: function(img, w, h, n) {
                //利用canvas进行绘图
                let canvas = document.createElement('canvas');
                canvas.width = w
                canvas.height = h
                let ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, w, h);
                //图片像素转为原图的0.2倍。 
                let data = canvas.toDataURL('image/jpeg', n); //data url的形式
                return data;
            },
            /**
             * 删除附件事件
             */
            deleteObj(obj) {
                Indicator.open();
                //debugger
                //console.log(obj.nodePath)
                let arr = [];
                arr.push(obj.nodePath);
                let _this = this;
                //alert("调用删除附件接口");
                let params = {
                    nodePaths: arr, //billId：单据id
                }
                //console.log(JSON.stringify(params));
                fetchData({
                    url: 'hrssc/portal/fileManager/delete',
                    method: 'post',
                    param: params,
                    mock: false,
                    contentType: "application/json",
                    success: function(data) {
                        Indicator.close();
                        Toast(data.message);
                        _this.qryData();
                    },
                    error: function(error) {
                        Indicator.close();
                        Toast(error.message);
                    }
                })
            },
            /**
             * 预览图片附件
             */
            viewImg(obj) {
                //console.log(obj.viewUrl);
                if(this.parselImgUrl == obj.viewUrl){
                    document.getElementById("bigimgdiv").style.display = 'block';
                }else{
                    Indicator.open("加载中...");
                    this.selimgurl = obj.viewUrl;
                    this.parselImgUrl = obj.viewUrl;
                }
            },
            /**
             * 加载图片完成后
             */
            aftload(){
                Indicator.close();
                document.getElementById("bigimgdiv").style.display = 'block';
                let w = document.getElementById("bigimg").width;
                let sjw = document.documentElement.clientWidth;
                let h = document.getElementById("bigimg").height;
                let ssh = parseInt((document.documentElement.clientHeight - h)/2);
                document.getElementById("bigimg").style.marginTop = ssh + 'px';
            },
            /**
             * 加载图片失败后
             */
            loadErr(){
                Indicator.close();
                document.getElementById("bigimgdiv").style.display = 'none';
            },
            /**
             * 关闭大图
             */
            closeBigImg: function(){
                document.getElementById("bigimgdiv").style.display = 'none';
            }
            
        }
    }
</script>

<style scoped>
    .mainpanle {
        width: 100%;
    }
    
    .picdiv {
        width: 100%;
        padding-left: 0.2rem;
        margin-bottom: 0.15rem;
        font-size: 0.3rem;
    }
    .filelistdiv{
        width: 100%;
        height: 1rem;
        line-height: 1rem;
        border-bottom: 1px solid #C3C3C3;
        background: #FFF;
    }
    .imglogodiv{
        float: left;
        width: 20%;
        height: 1rem;
        line-height: 1rem;
        text-align: center;
    }
    .imglogo{
        width:0.7rem;
        height: 0.7rem;
        margin: 0.15rem;
    }
    .filename{
        float: left;
        width: 60%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .filedel{
        float: left;
        width: 20%;
        text-align: center;
        color: #0CAEF5;
    }
    .uploadfile{
        width: 100%;
        height: 1rem;
        line-height: 1rem;
        text-align: center;
        color: #FFF;
        background: #108EE9;
        position: relative;
    }
    .selImgInput {
        width: 100%;
        opacity: 0;
        line-height: 1rem;
        position: absolute;
        display: block;
        top: 0;
    }
    .uploadzs{
        font-size: 0.2rem;
        line-height: 1rem;
        height: 1rem;
        padding-left: 0.2rem;
        color: #030303;
    }
    
    footer {
        position: fixed;
        height: 1rem;
        width: 100%;
        bottom: 0;
        left: 0;
        text-align: center;
        background: #fff;
        color: #0CAEF5;
        border-top: 1px solid #ddd;
    }
    
    button {
        width: 100%;
        line-height: 1rem;
        height: 1rem;
        background: #0CAEF5;
        font-size: 16px;
        color: #FFF;
        letter-spacing: 0;
    }
    
    .bigimgdiv{
        width: 100%;
        text-align: center;
        position: absolute;
        height: 100%;
        top:0px;
        background: #000;
        z-index:100;
        display: none;
    }
    .bigimg{
        width: 100%;
        /*height: 1.97rem;*/
       vertical-align: middle;
       /*margin: 20% auto;*/
    }
    .emptydiv{
        width: 100%; 
        text-align: center; 
        padding-top: 2rem; 
        /*display: none;*/
    }
</style>