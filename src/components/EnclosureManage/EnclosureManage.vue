<template>
    <div class="fjmainpanle">
      <!--导航栏区域-->
      <div ref="header">
        <navnar title="附件管理" left_text="返回" @clickLeft="clickLeft"/>
      </div>
        <template>
          <div style="width: 100%;">
            <div v-if="fujlist != null && fujlist.length > 0" v-for="(item, index) in fujlist"  style="width: 100%; height: 1rem; line-height: 1rem; padding-left: 0.4rem;background: #fff; border-bottom: 1px solid rgb(202,202,202);">
              <div  style="width: 80%; float: left">{{item.fileName.length <=24 ? item.fileName:item.fileName.toString().substring(0,24)+'...'}}</div>
              <div class="filedel" @click="deleteObj(item)">删除</div>
            </div>
          </div>
          <div class="uploadfile">
            上传附件
            <input class="selImgInput" type="file" id='fileElem' multiple="multiple" @change="handleFiles">
          </div>
        </template>
    </div>
</template>

<script>
    import { ajax, fetchData } from 'hr-utils';
    import { HrHeader } from 'hr-ui';
    import { Toast, Indicator } from 'mint-ui';
    import navnar from '../../navnar/navnar'
    export default {
        name: 'addressList',
        data() {
            return {
              fujlist: [],
              pk_psndoc: ''
            }
        },

        components: {
            HrHeader,navnar
        },
        mounted() {
          this.pk_psndoc = this.$route.query.pk_psndoc;
          this.qryData()
        },
        methods: {
          handleFiles: function(e) {
            let files = e.target.files || e.dataTransfer.files;
            this.renderImage(files);
          },
          renderImage: function(file) {
            let _this = this;
            let leng = file.length;
            for(let i = 0; i < leng; i++) {
              let name = file[i].name
              let reader = new FileReader();
              reader.readAsDataURL(file[i]);
              reader.onload = function(e) {
                let result = e.target.result;
                let imgObj = {
                  name: name,
                  data: result,
                }
                //调用上传接口上传附件
                _this.doSave(imgObj)
              };
            }
          },
          doSave(imgObj) {
            Indicator.open("上传中...");
            let _this = this;
            let params = {
              filePath: _this.pk_psndoc,
              imgInfo: imgObj,
              groupType: "psndocFuJian"
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
                _this.qryData();
              },
              error: function(error) {
                Indicator.close();
                Toast(error.message);
              }
            })
          },
          /**
           * 获取附件列表
           */
          qryData() {
            let _this = this;
            //debugger
            //alert("调用查询附件接口");
            let params = {
              filePath: _this.pk_psndoc,
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
           * 删除附件事件
           */
          deleteObj(obj) {
            Indicator.open();
            let arr = [];
            arr.push(obj.nodePath);
            let _this = this;
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
          clickLeft() {
              history.go(-1);
          }
        }
    }
</script>

<style scoped>
    .uploadfile{
        width: 100%;
        height: 1rem;
        line-height: 1rem;
        text-align: center;
        margin-top: 0.1rem;
        color: #FFF;
        background: #2479ED;
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
        color: #2479ED;
        border-top: 1px solid #ddd;
    }

    button {
        width: 100%;
        line-height: 1rem;
        height: 1rem;
        background: #2479ED;
        font-size: 16px;
        color: #FFF;
        letter-spacing: 0;
    }
    .filedel{
      float: left;
      width: 20%;
      text-align: center;
      color: #2479ED;
    }
</style>
