<template>
  <div>
    <!--导航栏区域-->
    <Header title="附件管理" @clickLeft="clickLeft"></Header>
    <div class="item_body" :style="{'height': currentHeight}">
      <div v-if="fileList.length != 0">
        <van-swipe-cell v-for="(file, index) in fileList" :key="index"  :disabled="disabled">
          <!-- 单元格-->
          <van-cell center :title-style="{'margin-left':'10px'}">
            <template #title>
              {{file.fileName}}
            </template>
            <!-- 单元格左侧图标-->
            <template #icon>
              <van-icon name="card" color="#2479ed" size="19"/>
            </template>
          </van-cell>
          <!-- 单元格滑动操作-->
          <template #right>
            <van-button square type="info" icon="eye-o" @click="lookFile(file)"/>
            <van-button square type="primary" icon="down" @click="downFile(file)"/>
            <van-button square type="danger" icon="delete" @click="deleteFile(file,index)"/>
          </template>
        </van-swipe-cell>
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
  import {getFileList, deleteFile, uploadFile} from '@/api/filemanager'
  import {Toast} from 'vant';
  import { Dialog } from 'vant';
  import { ImagePreview } from 'vant';
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
      Header,
      [ImagePreview.Component.name]: ImagePreview.Component
    },
    mounted() {
      this.currentHeight = (document.documentElement.clientHeight - 46 - 60) + 'px'
      this.uploadButtonWidth = (document.documentElement.clientWidth - 20) + 'px'
      this.filePath = this.$route.query.filePath
      if(this.$route.query.disabled == 1){
        this.disabled = true
      }
      this.queryFileList(this.$route.query.filePath, true)
    },
    methods: {
      /**
       * 下载附件
       */
      downFile(file){
        window.location.href = file.downloadUrl
      },
      /**
       * 查看附件
       */
      lookFile(file){
        ImagePreview({
          images: [
            file.viewUrl
          ],
          closeable: true
        });
      },
      /**
       * 上传附件
       */
      uploadFile(file) {
        console.log(file)
        let params = new FormData()
        params.append("filePath", this.filePath)
        params.append("fileName", file.file.name)
        params.append("file", file.file)
        Toast.loading({
          message: '上传中...',
          duration: 0
        })
        uploadFile(params).then(res => {
          Toast.success(res.message)
          this.queryFileList(this.filePath, false)
        })
      },
      /**
       * 获取附件列表
       */
      queryFileList(filePath, isToast) {
        if (isToast) {
          Toast.loading({
            message: '加载中...',
            duration: 0
          })
        }
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
      deleteFile(file, index) {
        Dialog.confirm({
          title: '删除附件',
          message: '确认要删除该附件吗?',
        }).then(() => {
          let params = []
          params.push(file.nodePath)
          deleteFile(params).then(res => {
            this.fileList.splice(index, 1)
            Toast.success(res.message)
          })
        }).catch(() => {
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
