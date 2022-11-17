<template>
  <div class="button_bottom">
    <van-uploader  :after-read="uploadFile">
      <van-button round type="info">上传附件</van-button>
    </van-uploader>
  </div>
</template>

<script>
import {getFileList, uploadFile} from '@/api/filemanager'
import {Toast} from "vant";
export default {
  name: "uploadButtom",
  date(){
    return {
      fileList: [],
      filePath: '',
      // uploadButtonWidth: ''
    }
  },
  mounted() {
    // this.queryFileList(this.$route.query.filePath, true)
    // this.uploadButtonWidth = (document.documentElement.clientWidth - 20) + 'px'
  },
  methods:{
    beforeRead (file) {
      // console.log('前', file)
      // if (file instanceof Array) {
      //   //判断是否是数组
      //   return false
      // }
      // return true
      // this.$emit('beforeupload', file)
    },
    /**
     * 上传附件
     */
    uploadFile(file) {
      // console.log(file)
      this.$emit('uoload', file)
      // let params = new FormData()
      // params.append("filePath", file.filePath)
      // params.append("fileName", file.file.name)
      // params.append("file", file.file)

      // uploadFile(params).then(res => {
      //   console.log('res', res)
      //   Toast.success(res.message)
      //   this.queryFileList(this.filePath, false)
      // })
    },
    // /**
    //  * 获取附件列表
    //  */
    // queryFileList(filePath, isToast) {
    //   if (isToast) {
    //     Toast.loading({
    //       message: '加载中...',
    //       duration: 0
    //     })
    //   }
    //   let params = {
    //     filePath: filePath
    //   }
    //   getFileList(params).then(res => {
    //     this.fileList = res.data
    //     if (isToast) {
    //       Toast.clear()
    //     }
    //   })
    // },
  }
}
</script>

<style scoped>
.button_bottom {
  padding: 10px 1px;
  background: #fff;
  /*position: fixed;*/
  /*text-align: center;*/
  /*margin: 0 auto;*/
  /*width: 100%;*/
  /*height: 50px;*/
  /*padding: 5px 0px;*/
}
.button_bottom .van-uploader .van-uploader__wrapper .van-uploader__input-wrapper .van-button--info{
  color: #2479ed;
  background-color: #fff;
  border: 1px solid #fff;
}
</style>
