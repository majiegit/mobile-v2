/*
 * Created by yangyang11 on 2017/8/16.
 *
 */
<template>
  <div class="imgPicker">

  <!-- 上面是相机图标 下面是选好的图片 -->
    <div class="imgUpload" v-if="type == 'btn-img'">
      <div class="i-top">
          <label>
            图片
          </label>
          <div class='upload'>
            <i class="icon hrfont hr-camera"></i>
            <input type="file" id='fileElem' accept="image/*" multiple="multiple" @change = "handleFiles">
          </div>
      </div>
      <figure >
         <template v-for='img in image.imginfo'>
         <img :src="img.data" />
         </template>
      </figure>
    </div>

    <!-- 只有相机图标 -->
    <div class='btnOnly' v-if="type == 'btn-only'">
        <i class="icon hrfont hr-camera"></i>
        <input type="file" id='fileElem' accept="image/*" multiple="multiple" @change = "handleFiles">
    </div>

    <!-- 只有一张图片 支持图片替换 -->
    <div class='imgReplace' v-if="type == 'img-replace'">
        <img ref='imgReplace' :src='baseSrc'  />
        <input type="file" id='fileElem'  @change = "handleFiles">
    </div>

    <!-- 没有相机图标，点击图片区域的加号上传多张图片 -->
    <div class='imgOnly' v-if="type == 'img-only'">
        <ul>
          <li v-for='img in image.imginfo'>
            <img :src="img.data" />
            <i class="icon hrfont hr-close02" @click='deleteImg(img)'></i>
          </li>
          <li>
            <div v-if='image.imginfo.length < maxSize'>
              <i class="icon hrfont hr-plus02"></i>
              <span>可上传{{ maxSize-image.imginfo.length }}张</span>
            </div>
            <input type="file" id='fileElem' accept="image/*" multiple="multiple" @change = "handleFiles">
          </li>
        </ul>
    </div>
  </div>
</template>

<script>

 /*
 * Created by yangyang11 on 2017/09/21.
 * <imgPicker 
          type='img-replace' 
          baseSrc='../../../static/img/components/img-picker/camera.png'
          v-on:oneImgUrl='getImgUrl' //只有当type=img-replace时使用oneImgUrl ，其余使用
          >
    </imgPicker>
 * 
 * @param {string} type  类型
 * @param {string} baseSrc  需要替换前的图片路径
 * @param {string} getImgUrl  获取当前选择的图片
 * 
 * 
 *
 */
  import { Progress, Toast } from 'mint-ui';
  import util from '../../utils/util';
  import { imguploads } from '../../utils/upload';
  export default {
    props: ["type","maxSize",'baseSrc'],
    name: 'imgPicker',
    data (){
      return {
        imgIndex : 0,
        image: {
          imginfo:[
          ],
        }
      }
    },
    components: {

    },
    methods : {

      handleFiles: function (e) {
        let files = e.target.files || e.dataTransfer.files;
        this.renderImage(files);
      },

      //获取图片
      renderImage : function (file){
        //允许上传的图片最大为200KB，否则压缩
        //let fileName = file
        // console.log(this.image.imginfo.length)
        // if ( this.image.imginfo.length > this.maxSize){
        //   Toast('最多可上传10张图片')
        //   return 
        // }
        if( (file.length+this.image.imginfo.length) > this.maxSize){
          Toast('最多可上传10张图片')
          return 
        }
        let maxSize = 200 * 1024;

        let _this = this;
        let leng=file.length;
        for( let i=0;i<leng;i++ ){
            let name = file[i].name
            let size = file[i].size
            let reader = new FileReader();
            reader.readAsDataURL(file[i]); 
            reader.onload =function(e){
              let result = e.target.result;
              let img = new Image();
              img.src = result;
              img.onload = function(){
                let w = img.naturalWidth,
                    h = img.naturalHeight
                //压缩
                result = (result.length > maxSize)?_this.compress(img,w,h,0.2) : _this.compress(img,w,h,1)
                let imgObj = {
                    name : name,
                    size: size,
                    data : result,
                  }
                console.log(imgObj)
                if ( _this.type == 'img-replace' ){
                  _this.$refs.imgReplace.src = imgObj.data
                  _this.$emit('oneImgUrl',imgObj);
                }else{
                  _this.image.imginfo.push(imgObj);
                  _this.$emit('imgUrl',_this.image); 
                }
              }
            };   
                    
        }
      },
      //压缩图片
      compress : function(img,w,h,n){
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

      //上传图片
      imgUpload : function(success, err){
        let imgparam = {
          imgInfo : this.image.imginfo,
          groupType : '1xsy'
        }
        if(imgparam.imgInfo.length == 0){
          success(null)
        }else{
          let url =''
          imguploads(imgparam,function(data){
            if ( data.statusCode == 200 ){
              success(data.data)
            }else{
              err(data)
            }
            },function(data){
              err(data)
            });
          return url
        }
      },

      deleteImg : function(img){
        let arr = []
        for (let i=0; i<this.image.imginfo.length; i++){
          if ( this.image.imginfo[i] !== img)
          arr.push(this.image.imginfo[i])
        }
        this.image ={
          imginfo:arr
        }
      }
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
.imgPicker{
  height: 100%;
  width: 100%;
}
  .imgUpload{
    background: #fff;
    .i-top{
      padding: 0.1rem .3rem;
      width: 100%;
      label{
        float: left;
        font-size: 0.4rem;
        color: #808080;
        margin-top: 0.1rem
      }
      .upload{
        float: right;
        img{
          float: left;
          width: 0.8rem;
          height: 0.8rem;
          margin-right: -1rem;
        }
        input {
          width: 0.8rem;
          height: 0.8rem;
          opacity: 0;
        }
      }
    }
    figure{
      clear: both;
      padding: 0 0.1rem 0 0.3rem;
      img{
        height: 1.5rem;
        width: 1.5rem;
        margin: 0.2rem 0.25rem 0.2rem 0;
      }
    }
  }
 .btnOnly{
    i{
      font-size: 1rem;
      float: left;
      margin-right: -1rem;
      color: #0caef5;
    }
    input {
      width: 1rem;
      height: 0.8rem;
      opacity: 0;
    }
  }
  .imgReplace{
    height: 100%;
    width: 100%;
    img{
      display: block;
      height: 100%;
      width: 100%;
    }
    input{
          display: block;
          height: 100%;
          width: 100%;
          margin-top: -100%;
          opacity: 0;
     }
  }
  .imgOnly{
    height: 2.2rem;
    width: 100%;
    ul{
      padding-left: 0.28rem;
      padding-top: 0.32rem;
      background: #fff;
      overflow: hidden;
      li{
        float: left;
        width: 22.1%;
        height: 1.6rem;
        margin-right: 0.2rem;
        margin-bottom: 0.2rem;
        list-style:none;
        img{
          position: relative;
          display: block;
          height: 100%;
          width: 100%;
          z-index: 0;
        }
        .hr-close02{
          position: relative;
          display: block;
          margin-top: calc(~"-100% - 6px");
          margin-left: calc(~"100% - 7px");
          font-size: 15px;
          height: 15px;
          width: 15px;
          color: #fff;
          background: red;
          border-radius: 50%;
          z-index: 1;
        }
        .iconarea{
          display: block;
          margin-top: -108%;
          margin-left: 90%;
          height: .3rem;
          width: .3rem;
          background: red;
          border-radius: 50%;
          text-align: center;
          z-index: 5;
          .hr-close02{
            font-size: .3rem;
            color: #000;
          }
        }
        div{
          height: 100%;
          width: 100%;
          border: 1px solid #D5D5D5;
          text-align: center;
          i{
            display: block;
            margin-top: 24%;
            font-size: 0.4rem;
            color: #D5D5D5;
          }
          span{
            font-size: 12px;
            color: #C3C3C3;
            letter-spacing: -0.43px;
          }
        }
        input{
          display: block;
          height: 100%;
          width: 100%;
          margin-top: -100%;
          opacity: 0;
        }
      }
    }
  }
</style>