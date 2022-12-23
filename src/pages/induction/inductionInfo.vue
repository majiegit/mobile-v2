<template>
  <div style="height: 100%; background: #fff;">
    <!--导航栏区域-->
    <Header title="信息填写"></Header>
    <div style="width: 100%; overflow-y: auto;" :style="{height:bodyHeight}">
      <div style="width: 100%;">
        <!--进度条-->
        <van-row class="steps">
          <van-col :span="1" style="max-width: 2.08%;"></van-col>
          <van-col :span="index % 2 == 0 ? '5': 4" v-for="(item,index) in steps" :key="index">
            <div v-if="index % 2 == 0">
              <van-row class="vant-row-height-1">
                <div class="vant-row-height-icon" :class="index <= stepsModel * 2 ? 'color_true': ''">
                  <van-icon :name="item.icon"/>
                </div>
              </van-row>
              <van-row class="vant-row-height-2" :class="index <= stepsModel * 2 ? 'color_true': ''">{{item.name}}
              </van-row>
            </div>
            <div v-else class="vant-row-height-1-line"
                 :class="index <= stepsModel * 2 ? 'background_color_true': ''"></div>
          </van-col>
        </van-row>
      </div>
      <!--实名信息填写->
      <!-- 图片-->
      <div v-if="stepsModel == 0 || stepsModel == 2">
        <!--<div class="body_image">-->
        <!--<div class="body_image_div">-->
        <!--<van-row type="flex" justify="center" style="height: 70%;">-->
        <!--<van-col :span="7" style="text-align: center; padding-top: 10px">-->
        <!--<van-uploader v-model="headerImg" max-count="1" upload-icon="manager" :disabled="disableIs"-->
        <!--:deletable="!disableIs"/>-->
        <!--</van-col>-->
        <!--</van-row>-->
        <!--<van-row type="flex" justify="center" style="height: 30%;">-->
        <!--<van-col :span="7" style="text-align: center; font-size: 16px; color: #fff; line-height: 45px;">-->
        <!--姓名：{{formData[0].value}}-->
        <!--</van-col>-->
        <!--</van-row>-->
        <!--</div>-->
        <!--</div>-->
        <!--表单内容-->
        <div class="body_form">
          <div>
            <van-collapse v-model="tempDataShowModel">
              <van-collapse-item v-for='(temp,index1) in tempData' :name="index1" :key="index1" :title="temp.name">
                 <div v-for="(form, formIndex) in formData[temp.infoset_code]" :key="formIndex">
                  <van-divider v-if="(formIndex != formData[temp.infoset_code].length) && temp.infoset_code != 'bd_psndoc'">
                    {{temp.name + (formIndex + 1)}}
                    <van-icon
                      name="delete"
                      style="float: right; margin-left: 20px; line-height: 25px;"
                      color="#2479ed"
                      size="20px"
                      @click="deleteForm(temp,formIndex)"/>
                  </van-divider>
                  <InductionEdit :fieldDataEdit="temp.tablefield" :infoDataForm="form"
                                 :isCheck="disableIs" :pk_org="pk_org"></InductionEdit>
                </div>
                <van-row>
                  <div style="padding: 10px 16px; width: 100%; textAlign: center;" v-if="temp.infoset_code != 'bd_psndoc' && !disableIs">
                    <van-icon
                      style="font-weight:700;"
                      size="24"
                      name="plus"
                      color="#2479ed"
                      @click="addForm(temp)"/>
                  </div>
                </van-row>
              </van-collapse-item>
            </van-collapse>
          </div>
        </div>
      </div>
      <!--上传-->
      <div v-show="stepsModel == 1" style="padding: 0 3%;">
        <!-- <van-row class="idcard_title"><span>上传身份证照片</span></van-row>
        <van-row justify="space-between" type="flex">
          <van-col :span="11" class="card_div">
            <div style="width: 100%; height: 70%;">
              <van-uploader v-model="cardPositiveImage" max-count="1" style="margin-top: 20px;"/>
            </div>
            <p style="width: 100%; height: 30%;">上传正面</p>
          </van-col>
          <van-col :span="11" class="card_div">
            <div style="width: 100%; height: 70%;">
              <van-uploader v-model="cardNegativeImage" max-count="1" style="margin-top: 20px;"/>
            </div>
            <p style="width: 100%; height: 30%;">上传背面</p>
          </van-col>
        </van-row>
        <van-row justify="space-between" type="flex" class="idcard_title">
          <van-col :span="11"><span>学位证书</span></van-col>
          <van-col :span="11"><span>学历证书</span></van-col>
        </van-row>
        <van-row justify="space-between" type="flex">
          <van-col :span="11" class="card_div">
            <div style="width: 100%; height: 70%;">
              <van-uploader v-model="eduImage" max-count="1" style="margin-top: 20px;"/>
            </div>
            <p style="width: 100%; height: 30%;">上传证书</p>
          </van-col>
          <van-col :span="11" class="card_div">
            <div style="width: 100%; height: 70%;">
              <van-uploader v-model="eduDegreeImage" max-count="1" style="margin-top: 20px;"/>
            </div>
            <p style="width: 100%; height: 30%;">上传证书</p>
          </van-col>
        </van-row> -->
        <van-row justify="space-between" type="flex" class="idcard_title">
          <van-col :span="11"><span>上传照片</span></van-col>
        </van-row>
        <van-row justify="center" type="flex">
          <van-col :span="11" class="card_div">
            <div style="width: 100%; height: 70%;">
              <van-uploader v-model="otherImage" max-count="1"    style="margin-top: 20px;"/>
            </div>
            <p style="width: 100%; height: 30%;">上传照片</p>
          </van-col>
        </van-row>
      </div>
      <div v-show="stepsModel == 3" style="padding: 0 3%; margin: 0 auto; text-align: center;">
        <img :src="submitImg" style="width: 40%; margin-top: 40%;">
        <p style="font-size: 18px; color: #E04F4F; font-weight: bold; width: 100%; height: 50px; line-height: 50px;">
          提交成功</p>
      </div>
    </div>
    <div id="div_footer_1">
      <van-row type="flex" justify="center" gutter="20" v-if="stepsModel !=3">
        <van-col :span="12" v-if="stepsModel != 0">
          <van-button round block color="#2479ed" native-type="button" @click="upStep">上一步</van-button>
        </van-col>
        <van-col :span="12" v-if="stepsModel != 2">
          <van-button round block color="#2479ed" native-type="button" @click="nextStep">下一步
          </van-button>
        </van-col>
        <van-col :span="12" v-if="stepsModel == 2">
          <van-button round block color="#2479ed" native-type="button" @click="submitButton">提交
          </van-button>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
  import InductionEdit from "./inductionEdit"
  import {Toast} from 'vant';
  import {validatorSex, validatorAgeNumber, validatorAge, validatorIdCard, validatorPhone} from './formDataValidator'
  import {queryEntryInfoTemp,saveEntryInfo,uploadPsnPhoto} from '@/api/inductionInfo'
  import Header from '@/components/Header/Index'
  export default {
    name: 'inductionInfo',
    data() {
      return {
        steps: [
          {
            name: '实名信息填写',
            icon: 'friends-o',
          },
          {},
          {
            name: '证件上传',
            icon: 'idcard',
          },
          {},
          {
            name: '信息提交',
            icon: 'sign',
          }
        ],
        cardPositiveImage: [], //身份证正面文件
        cardNegativeImage: [], //身份证反面文件
        eduImage: [], //学历文件
        eduDegreeImage: [], //学位文件
        otherImage: [], //学位文件
        cardPositive: [],
        disableIs: this.stepsModel == 2 ? true : false,
        submitImg: require('../../../static/img/inductionInfo/submit.png'), // ,
        headerImg: [],
        stepsModel: 0,
        bodyHeight: '',
        userInfo: {},
        pk_org: '',
        tempData: [],
        formData: {},
        tempDataShowModel: [0],
        pk_psndoc: ''
      }
    },

    components: {
      Header,
      InductionEdit
    },
    created() {
    },
    mounted() {
      this.bodyHeight = (document.documentElement.clientHeight - 46 - document.getElementById("div_footer_1").clientHeight) + 'px'
      this.pk_org = this.getUrlParams().pk_org
      this.formData.pk_org = this.pk_org
      this.getdata()
    },
    watch: {
      pk_psndoc(val){
        this.fujianSave(val)
      },
      stepsModel(val) {
        if (val == 2) {
          this.disableIs = true
        } else {
          this.disableIs = false
        }
      },
    },
    methods: {
      addForm(temp) {
        if(this.formData[temp.infoset_code] instanceof Array == false){
          this.formData[temp.infoset_code] = []
          this.formData[temp.infoset_code].push({})
        }else{
          this.formData[temp.infoset_code].push({})
        }
        if(temp.infoset_code == 'hi_psndoc_edu'){
          this.formData.hi_psndoc_edu[0].lasteducation = 'Y'
          this.formData.hi_psndoc_edu[0].lasteducation_name = '是'
          this.formData.hi_psndoc_edu[0].glbdef1 = 'Y'
          this.formData.hi_psndoc_edu[0].glbdef1_name = '是'
        }
        if(temp.infoset_code == 'hi_psndoc_family'){
          this.formData.hi_psndoc_family[0].glbdef4 = 'Y'
          this.formData.hi_psndoc_family[0].glbdef4_name = '是'
        }
      },
      deleteForm(temp, index) {
        this.formData[temp.infoset_code].splice(index, 1)
        if(temp.infoset_code == 'hi_psndoc_edu'){
          this.formData.hi_psndoc_edu[0].lasteducation = 'Y'
          this.formData.hi_psndoc_edu[0].lasteducation_name = '是'
          this.formData.hi_psndoc_edu[0].glbdef1 = 'Y'
          this.formData.hi_psndoc_edu[0].glbdef1_name = '是'
        }
        if(temp.infoset_code == 'hi_psndoc_family'){
          this.formData.hi_psndoc_family[0].glbdef4 = 'Y'
          this.formData.hi_psndoc_family[0].glbdef4_name = '是'
        }
      },
      getdata() {
        // 获取模板数据
        queryEntryInfoTemp({pk_org: this.pk_org}).then(res =>{
          let temps = []
          res.data.forEach(item => {
            let show = false
            for (var i = 0; i < item.tablefield.length; i++) {
              if (item.tablefield[i].showlistflag === 'Y') {
                show = true
                temps.push(item)
                break
              }
            }
          })
          this.tempData = temps
          this.setFormData(temps)
          this.setTempDataShowModel(temps)
        })
      },
      setFormData(data) {
        for (var i = 0; i < data.length; i++) {

          if(data[i].infoset_code ==='bd_psndoc'){
            this.$set(this.formData, data[i].infoset_code, [{}])
          }else{
            this.$set(this.formData, data[i].infoset_code, '')
          }
        }
      },
      setTempDataShowModel(data) {
        var length = []
        data.forEach((item, index) => {
          length.push(index)
        })
        this.tempDataShowModel = length
      },
      // 获取所有必填字段
      getFieldRequiredAll(data) {
        let fields, fieldsName = []
        fields = data.filter(field => field.mustflag === 'Y')
        fields.forEach(item => {
          fieldsName.push(item.name)
        })
        return fieldsName
      },
      // 下一步
      nextStep() {
        // 信息填写
        if(this.stepsModel == 0){
          // 校验数据
          for (var i = 0; i < this.tempData.length; i++) {
            let temp = this.tempData[i]
            for (var j = 0; j < temp.tablefield.length; j++) {
              let field = this.tempData[i].tablefield[j]
              if (field.mustflag == 'Y' && field.showlistflag == 'Y') {
                for (var a = 0; a < this.formData[temp.infoset_code].length; a++) {
                  let data = this.formData[temp.infoset_code][a]
                  let value = data[field.code];
                  if (value == undefined || value == null || value == '') {
                    Toast(temp.name + ' [' + field.name + '] 为必填项');
                    return
                  }
                  if(temp.infoset_code=='hi_psndoc_family'){
                    let glbdef2 = data.glbdef2;
                    if(glbdef2){
                      if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(glbdef2))) {
                        Toast(temp.name +'身份证号长度不正确或不符合规定！');
                        return;
                      }
                    }
                  }
                  if(temp.infoset_code=='bd_psndoc'){
                    if(data.idtype == '1001Z01000000000AI36' || data.idtype_name == '身份证' ){
                     let idCard = data.id;
                      if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(idCard))) {
                          Toast('身份证号长度不正确或不符合规定！');
                          return;
                      }
                    }
                    let mobile = data.mobile
                    if(mobile){
                      if(!(/^1[0-9]{10}$/).test(mobile)){
                        Toast(temp.name + '手机号长度不正确或不符合规定！');
                        return;
                      }
                    }
                    let glbdef11 = data.glbdef11;
                    if(glbdef11){
                      if(!(/^1[0-9]{10}$/).test(glbdef11)){
                        Toast(temp.name + ' 紧急联系人电话长度不正确或不符合规定！');
                        return;
                      }
                    }
                  }
                 }
              }
            }
          }
        }

        // 附件上传
        if (this.stepsModel == 1) {

          if (this.otherImage.length == 0) {
            Toast("请上传照片")
            return
          }
        }

        // 校验通过
        this.stepsModel++
      },

      // 上一步
      upStep() {
        this.stepsModel--
      },
      // 提交
      submitButton() {
        for(let key in this.formData){
          if(this.formData[key] ==''){
            this.formData[key] = []
            this.formData[key].push({})
          }
        }
        saveEntryInfo(this.formData).then(res => {
          Toast("提交成功")
          this.stepsModel++
          this.pk_psndoc = res.data.pk_psndoc
        })
        },
      // 附件上传
      fujianSave(pk_psndoc) {
        debugger
        if (this.otherImage.length !== 0) {
          var param = {
            pk_psndoc: pk_psndoc,
            photo: (this.otherImage[0].content.split(",")[1])
          }
          uploadPsnPhoto(param).then(res => {
          })
        }
      },

      renderImage(file, name, pk_psndoc) {
        var _this = this
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
          let result = e.target.result;
          let imgObj = {
            name: name,
            data: result,
          }
          //调用上传接口上传附件
          _this.doSave(imgObj, pk_psndoc)
        }
      },
      doSave(imgObj,pk_psndoc) {
        let params = {
          filePath: pk_psndoc,
          imgInfo: imgObj,
          groupType: "psndocFuJian"
        }
        fetchData({
          url: 'hrssc/portal/fileManager/imgUpload',
          method: 'post',
          param: params,
          mock: false,
          contentType: "application/json",
          success: function (data) {
          },
          error: function (error) {
          }
        })
      },

      //获取请求url中的参数
      getUrlParams() {
        var params = null;
        if (!!window.location.hash) {
          if (!!location.hash.split('?')) {
            params = location.hash.split('?')[1];
            if (!!params) {
              params = params.replace(/\=/g, '":"');
              params = params.replace(/\&/g, '","');
              params = '{"' + params + '"}';
              params = JSON.parse(params);
            }
          }
        }
        return params;
      }
    }
  }
</script>

<style lang="less">
  #div_footer_1 {
    position: fixed;
    bottom: 0px;
    width: 96%;
    padding: 2%;
  }

  .idcard_title_view {
    font-size: 15px;
    height: 30px;
    line-height: 30px;
    color: #646566;
  }

  .idcard_title {
    font-size: 15px;
    height: 30px;
    line-height: 30px;
    margin-top: 15px;
  }

  .card_div {
    text-align: center;
    height: 120px;
    border: 1px solid #8d8d8d;
    border-radius: 8px;
    font-size: 14px;
    color: #8d8d8d;
  }

  .card_div {
    .van-uploader__upload {
      width: 50px;
      height: 50px;
      border-radius: 25px;
      margin: 0 auto;
    }
    .van-uploader__preview-image {
      width: 100%;
      margin: 0 auto;
    }
    .van-uploader__preview {
      margin: 0;
    }
  }

  .body_form {
    width: 100%;
    // padding: 2%;
  }

  .steps {
    padding: 20px 0 0;
    height: 100px;
    background: #fff;
  }

  .steps .van-col {
    height: 100%;
  }

  .vant-row-height-1 {
    text-align: center;
    height: 70%;
  }

  .vant-row-height-2 {
    text-align: center;
    font-size: 12px;
    color: rgb(153, 153, 153);
    height: 30%;
  }

  .vant-row-height-1-line {
    width: 100%;
    height: 2px;
    background: #999999;
    position: relative;
    top: 35%;
  }

  .vant-row-height-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin: 0 auto;
    background: rgb(245, 245, 245);
    text-align: center;
    line-height: 50px;
    font-size: 35px;
    color: rgb(153, 153, 153);
  }

  .color_true {
    color: #2479ed;
  }

  .background_color_true {
    background: #2479ed;
  }

  .body_image {
    width: 100%;
    padding: 2%;
    min-height: 150px;
    max-height: 200px;
    background: #fff;
  }

  .body_image_div {
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #2479ed, #2479ed);
    border-radius: 12px;
  }

  .body_image_headimg {
    width: 100%;
    height: 100%;
    margin: 0 auto;
  }

  .body_image_div .van-uploader__upload {
    border-radius: 40px;
    margin: 0 auto;
  }

  .body_image_div .van-uploader__preview-image {
    border-radius: 40px;
    margin: 0 auto;
  }

  .body_image_div .van-uploader__preview {
    margin: 0;
  }

  .van-collapse-item__content {
    padding: 5px 0px 5px 5px;
  }
</style>
