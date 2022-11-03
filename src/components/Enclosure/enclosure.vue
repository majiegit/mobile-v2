<template>
  <div>
    <!--导航栏区域-->
    <Header title="附件管理" @clickLeft="clickLeft"></Header>
    <div class="item_body" :style="{'height': currentHeight}">
      <div v-if="fileList.length != 0">
      <van-swipe-cell v-for="(file, index) in fileList" :key="index" >
        <van-cell :border="false" :title="file.fileName" :value="file.fileType"/>
        <template #right>
          <van-button square type="danger" text="删除" @click="deleteObj(file)"/>
        </template>
      </van-swipe-cell>
      </div>
      <!--无数据-->
      <div v-else>
        <van-empty description="暂无附件"/>
      </div>
    </div>
    <!--上传附件-->
    <van-row type="flex" justify="space-around" class="button_bottom">
      <van-col :span="23">
        <van-button round block type="info">上传附件 </van-button>
      </van-col>
    </van-row>
  </div>
</template>

<script>
  import Header from '@/components/Header/Index'
  import {getFileList} from '@/api/filemanager'
  export default {
    name: 'addressList',
    data() {
      return {
        currentHeight: '',
        rightIcon: 'back-top',
        rightText: '上传附件',
        fileList: [
          {
            fileName: '我的文件名',
            fileType: '我的文件名',
          }
        ],
        filePath: ''
      }
    },
    components: {
      Header
    },
    mounted() {
      this.currentHeight = (document.documentElement.clientHeight - 46 - 60) + 'px'
      this.pk_psndoc = this.$route.query.pk_psndoc;
    },
    methods: {
      handleFiles: function (e) {
        let files = e.target.files || e.dataTransfer.files;
        this.renderImage(files);
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
      qryData() {
      },
      /**
       * 删除附件事件
       */
      deleteObj(obj) {
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
    width: 100%;
    height: 50px;
    padding: 5px 0px;
  }
</style>
