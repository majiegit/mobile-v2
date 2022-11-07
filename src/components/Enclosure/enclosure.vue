<template>
  <div>
    <!--导航栏区域-->
    <Header title="附件管理" @clickLeft="clickLeft"></Header>
    <div class="item_body" :style="{'height': currentHeight}">
      <div v-if="fileList.length != 0">
        <van-cell v-for="(file, index) in fileList" :key="index"  center
                  :title-style="{'margin-left':'10px'}">
          <template #title>
            {{file.fileName}}
          </template>
          <template #icon>
            <van-icon name="card" color="#2479ed" size="19" v-if="!disabled"/>
          </template>
          <template #right-icon>
            <van-icon name="delete" color="#ee0a24" size="19" v-if="!disabled" @click="deleteFile(file,index)"/>
          </template>
        </van-cell>
      </div>
      <!--无数据-->
      <div v-else>
        <van-empty description="暂无附件"/>
      </div>
    </div>
    <!--上传附件-->
    <div class="button_bottom">
      <van-uploader :disabled="disabled" :after-read="uploadFile">
        <van-button round type="info" :style="{ 'width': uploadButtonWidth }">上传附件</van-button>
      </van-uploader>
    </div>
  </div>
</template>

<script>
  import Header from '@/components/Header/Index'
  import {getFileList,deleteFile,uploadFile} from '@/api/filemanager'
  import {Toast} from 'vant';

  export default {
    name: 'addressList',
    data() {
      return {
        currentHeight: '',
        uploadButtonWidth: '',
        fileList: [],
        filePath: '',
        disabled: false // 是否可上传、删除
      }
    },
    components: {
      Header
    },
    mounted() {
      this.currentHeight = (document.documentElement.clientHeight - 46 - 60) + 'px'
      this.uploadButtonWidth = (document.documentElement.clientWidth - 20) + 'px'
      this.filePath = this.$route.query.filePath;
      this.queryFileList(this.$route.query.filePath)
    },
    methods: {
      /**
       * 上传附件
       */
      uploadFile(file) {
        console.log(file)
        let params = new FormData()
        params.append("filePath", this.filePath)
        params.append("fileName", file.file.name)
        params.append("file", file.file)
        uploadFile(params).then(res => {
          Toast.success(res.message)
          this.queryFileList()
        })
      },
      handleFiles(files) {
      },
      renderImage: function (file) {
        let _this = this;
        let leng = file.length;
        for (let i = 0; i < leng; i++) {
          let name = file[i].name
          let reader = new FileReader();
          reader.readAsDataURL(file[i]);
          reader.onload = function (e) {
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
      },
      /**
       * 获取附件列表
       */
      queryFileList(filePath) {
        Toast.loading({
          message: '加载中...',
          duration: 0
        })
        let params = {
          filePath: filePath
        }
        getFileList(params).then(res => {
          this.fileList = res.data
          Toast.clear()
        })
      },
      /**
       * 删除附件事件
       */
      deleteFile(file,index) {
        let params = []
        params.push(file.nodePath)
        deleteFile(params).then(res => {
          this.fileList.splice(index, 1)
          Toast.success(res.message)
        })
      },
      clickLeft() {
        history.go(-1);
      }
    }
  }
</script>

<style scoped>
  .button_bottom {
    position: fixed;
    text-align: center;
    margin: 0 auto;
    width: 100%;
    height: 50px;
    padding: 5px 0px;
  }

  .uploadfile {
    width: 100%;
    text-align: center;
    color: #FFF;
    background: #2479ED;
    position: relative;
  }

  .selImgInput {
    width: 100%;
    opacity: 0;
    position: absolute;
    display: block;
    top: 0;
  }
</style>
