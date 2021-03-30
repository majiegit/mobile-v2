/*
 * Created by yangyang11 on 2017/8/16.
 *
 */
<template>
  <div>
      <form enctype="multipart/form-data" method="post" name="fileinfo">
       上传文件：
       <input type="text" name="groupType" value='test'>
       <input type="text" name="filePath" value=''>
       <input type="file" name="files" multiple="multiple" >
      </form>
  </div>
</template>

<script>
  import imgPicker from '../../components/base/img-picker';
  import progressBar from '../../components/progressBar/progress-bar'
  import { fileloads } from '../../utils/upload';
  export default {
    name: 'test',
    data (){
      return {
        files: {}
      }
    },
    components: {
        imgPicker,
        progressBar
    },
    methods : {
      handleFiles: function (e) {
        this.files = e.target.files || e.dataTransfer.files;
      },
      fileload : function(){
        let file = new FormData(document.forms.namedItem("fileinfo" ));
         
        fileloads(file,function(data){
          },function(err){
          });
      },

    }
  }
</script>

<style lang='less' scoped>
.hrfont{
  font-size: 1rem;
}
</style>