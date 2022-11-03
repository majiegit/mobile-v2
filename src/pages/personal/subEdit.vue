<template>
  <div>
    <!--导航栏区域-->
    <div ref="header">
      <navnar :title="tempData.name"
              left_text="返回"
              right_text=""
              @clickRight="clickRight"
              @clickLeft="clickLeft"
      />
    </div>
    <!--主内容区域-->
    <div :style="{ 'height': currentHeight }" style="overflow-y: auto;">
      <van-form colon label-width="100" input-align="right" ref="formData">
        <div v-for="(field,fieldIndex) in fetchDataEdit" :key="fieldIndex">
          <!-- 文本类型   0-->
          <van-field v-model="infoDataForm[field.code]" v-if="field.datatype == 0" class="van_field_class"
                     :name="field.name"
                     :required="getFieldRequired(field)" :maxlength="field.maxlength"
                     :label="field.name" :placeholder="getFieldPlaceholder(field)" :rules="getFieldRules(field)"/>
          <!-- 整数类型   1 and  数量类型 2-->
          <van-field v-model="infoDataForm[field.code]" type="number" v-if="[1,2].includes(field.datatype)"
                     class="van_field_class" :maxlength="field.maxlength"
                     :required="getFieldRequired(field)" :label="field.name" :placeholder="getFieldPlaceholder(field)"
                     :name="field.name"
                     :rules="getFieldRules(field)"/>
          <!--日期类型  3 || 20-->
          <van-field v-model="infoDataForm[field.code]" readonly v-if="[20,3,8].includes(field.datatype)"
                     :name="field.name"
                     class="van_field_class" right-icon="arrow" :maxlength="field.maxlength"
                     :required="getFieldRequired(field)" :label="field.name" :placeholder="getFieldPlaceholder(field)"
                     @click="getDate(field)"
                     :rules="getFieldRules(field)"/>
          <!--下拉类型  6 -->
          <van-field v-model="infoDataForm[field.code+ '_name']" readonly v-if="[6].includes(field.datatype)"
                     :name="field.name"
                     class="van_field_class" right-icon="arrow" :maxlength="field.maxlength"
                     :required="getFieldRequired(field)" :label="field.name" :placeholder="getFieldPlaceholder(field)"
                     @click="getSelectDate(field)"
                     :rules="getFieldRules(field)"/>
          <!-- 参数类型  5-->
          <van-field v-model="infoDataForm[field.code+ '_name']" readonly v-if="field.datatype == 5"
                     :name="field.name"
                     class="van_field_class" right-icon="arrow" :maxlength="field.maxlength"
                     :required="getFieldRequired(field)" :label="field.name" :placeholder="getFieldPlaceholder(field)"
                     @click="getReference(field)"
                     :rules="getFieldRules(field)"/>
          <!--大文本类型 9-->
          <van-field v-model="infoDataForm[field.code]" type="textarea" v-if="field.datatype == 9" autosize
                     :name="field.name"
                     class="van_field_class" :maxlength="field.maxlength"
                     :required="getFieldRequired(field)" :label="field.name" :placeholder="getFieldPlaceholder(field)"
                     :rules="getFieldRules(field)"/>
          <!-- 是否开关 -->
          <van-field v-if="field.datatype == 4" class="van_field_class" :required="getFieldRequired(field)"
                     :name="field.name"
                     :label="field.name" :placeholder="getFieldPlaceholder(field)"
                     :rules="getFieldRules(field)">
            <template #input>
              <van-switch v-model="infoDataForm[field.code]" size="20" active-value="Y" inactive-value="N"/>
            </template>
          </van-field>
        </div>
      </van-form>
      <Selector ref="selector" @selectOk="selectOk" @dateDataOk="dateDataOk" @selectDataOk="selectDataOk"></Selector>
    </div>
    <div ref="footer">
      <van-button type="info" block @click="okData">确 定</van-button>
    </div>
  </div>
</template>

<script>
  import Navnar from "../navnar/navnar";
  import Selector from "./components/selector";
  import {fetchData} from 'hr-utils'
  import {Dialog, Toast} from 'vant'
  export default {
    name: "edit",
    components: {Navnar, Selector},
    data() {
      return {
        type: '',
        loadingModel: true,
        infoDataForm: {},
        currentHeight: '',
        fieldData: [],
        fetchDataEdit: [],
        tempData: {},
        infoData: {},
        infoIndex: 0,
        backData: {}  // 传过来的备份数据
      }
    },
    mounted() {
      this.currentHeight = (document.documentElement.clientHeight - this.$refs.header.offsetHeight - this.$refs.footer.offsetHeight) + 'px'
    },
    created() {
      // 子集传过来的数据
      this.tempData = this.$route.params.tempData   // 模板数据
      this.fieldData = this.$route.params.fieldData  // 显示字段数据
      let fieldEditData = []
      fieldEditData = this.tempData.tablefield
      this.fetchDataEdit = fieldEditData.filter(item => item.showflag == 'Y')   // 可见可编辑字段,也就是表单显示字段
      this.infoData = this.$route.params.infoData
      this.infoIndex = this.$route.params.infoIndex
      this.infoDataForm = this.infoData[this.infoIndex]
      this.type = this.$route.params.type
      // 备份数据 用于返回
      // 子集传过来的数据
      this.backData.tempData = JSON.parse(JSON.stringify(this.$route.params.tempData))
      this.backData.fieldData = JSON.parse(JSON.stringify(this.$route.params.fieldData))
      this.backData.infoData = JSON.parse(JSON.stringify(this.$route.params.infoData))
    },
    methods: {
      // 下拉类型确认
      selectDataOk(param,val){
        // console.log(param)
        // console.log(val)
        this.$set(this.infoDataForm, param.field.code, val[param.key])
        this.$set(this.infoDataForm, param.field.code + '_name', val[param.text])
      },
      // 下拉类型处理
      getSelectDate(field) {
        if(this.isCheck){
          return
        }
        let selectorParam = {
          field: field,
          value: this.infoDataForm[field.code],
          text: 'title',
          key: 'value'
        }
        //请求参数
        var param = {
          dataType: field.datatype,
          pk_refinfo: field.pk_refinfo,
          refModel: field.refmodel
        }
        Toast.loading({
          message: '加载中...',
          duration: 0
        })
        fetchData({
          url: 'hrssc/portal/psnbase/queryReferencePsn',
          method: 'POST',
          param: param,
          mock: false,
          contentType: "application/json",
          success: res => {
            selectorParam.data = res.data.body
            selectorParam.datatype = res.data.datatype
            Toast.clear()
            this.$refs.selector.openComponent(selectorParam)
          },
          error: res => {
            console.log(res)
          }
        })
      },
      // 日期时间确认
      dateDataOk(param) {
        // console.log(param)
        this.$set(this.infoDataForm, param.field.code, param.value)
      },
      // 日期类型处理
      getDate(field) {
        let selectorParam = {
          field: field,
          type: field.datatype == 8 ? 'datetime' : 'date',
          value: this.infoDataForm[field.code]
        }
        this.$refs.selector.openComponent(selectorParam)
      },
      // 参照类型字段选择成功,回调事件
      selectOk(param) {
        // console.log(param)
        this.$set(this.infoDataForm, param.field.code, param.selectData.value)
        this.$set(this.infoDataForm, param.field.code + '_name', param.selectData.title)
      },
      // 参照类型处理
      getReference(field) {
        //请求参数
        var param = {
          // refType:code
          dataType: field.datatype,
          pk_refinfo: field.pk_refinfo,
          refModel: field.refmodel
        }
        let selectorParam = {
          field: field,
          infoDataForm: this.infoDataForm
        }
        Toast.loading({
          message: '加载中...',
          duration: 0
        })
        fetchData({
          url: 'hrssc/portal/psnbase/queryReferencePsn',
          method: 'POST',
          param: param,
          mock: false,
          contentType: "application/json",
          success: res => {
            selectorParam.data = res.data.body
            selectorParam.datatype = res.data.datatype
            Toast.clear()
            this.$refs.selector.openComponent(selectorParam)
          },
          error: res => {
            console.log(res)
          }
        })
      },
      // 获取字段规则
      getFieldRules(field) {
        let required = this.getFieldRequired(field)
        // let message = this.getFieldPlaceholder(field)
        let message = ''
        let rule = {required: required, message: message}
        let rules = []
        rules.push(rule)
        return rules
      },
      // 获取所有必填字段
      getFieldRequiredAll(data) {
        let fields,fieldsName = []
        fields = data.filter(field => field.mustflag === 'Y')
        fields.forEach(item =>{
          fieldsName.push(item.name)
        })
        return fieldsName
      },
      // 获取字段是否必填
      getFieldRequired(field) {
        let required = false
        if (field.mustflag === 'Y') {  // 必填属性
          required = true
        }
        return required
      },
      // 获取字段说明
      getFieldPlaceholder(field) {
        let message = ''
        if([0,1,2,9,4,14,18].includes(field.datatype)){
          message = '请填写' + field.name
        }else if([5,3,20,101,102,6,8].includes(field.datatype)){
          message = '请选择' + field.name
        }
        return message
      },
      // 头部右上角点击事件
      clickRight() {
      },
      //确定数据
      okData() {
        // 校验必填数据
        let fieldNames = this.getFieldRequiredAll(this.fetchDataEdit)
        const infoDataForm = this.infoDataForm
        const infoDataFormBack = this.backData.infoData[this.infoIndex]
        const keys = Object.keys(infoDataForm)
        const data = keys.filter(key => infoDataForm[key] !== infoDataFormBack[key])
        let str = this.judgmentReview(data, this.fetchDataEdit)
        if (str !== '') {
          Dialog.confirm({
            title: '以下信息需要审核通过才能生效',
            message: str,
          }).then(() => {
            this.jumpPush(fieldNames)
          })
        } else {
          this.jumpPush(fieldNames)
        }
      },
      jumpPush(fieldNames) {
        this.$refs.formData.validate(fieldNames).then(() => {
          // 返回子集信息
          this.$router.push({
            name: 'personalSubList',
            params: {tempData: this.tempData, infoData: this.infoData, fieldData: this.fieldData}
          })
        }).catch(() => {
          // Toast('校验不通过')
        })
      },
      // 判断需要审核的字段信息
      judgmentReview(templateData, formData) {
        let str = ''
        templateData.forEach(key => {
          formData.forEach(item => {
            if (key === item.code) {
              if (item.checkflag === 'Y') {
                str += item.name + ','
              }
            }
          })
        })
        if(str !== '') {
          str = str.substring(0, str.length - 1)
        }
        return str
      },
      clickLeft() {
        // 返回子集信息
        let infoData = []
        infoData = this.backData.infoData
        // console.log(this.type)
        if (this.type == 'add') {
          infoData.splice(this.infoIndex, 1)
        }
        this.$router.push({
          name: 'personalSubList',
          params: {
            tempData: this.backData.tempData,
            infoData: infoData,
            fieldData: this.backData.fieldData
          }
        })
      },
    }
  }
</script>

<style scoped>
  .van_field_class {
    border-bottom: 1px solid #ebedf0;
  }
</style>
