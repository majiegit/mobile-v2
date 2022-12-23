<template>
  <div>
    <!--导航栏区域-->
    <Header :title="tempData.name" leftText="返回" @clickLeft="clickLeft"></Header>
    <!--主内容区域-->
    <div :style="{ 'height': currentHeight }" style="overflow-y: auto;">
      <van-form colon label-width="100" input-align="right" ref="formData" :disabled="isCheck ">
        <div v-for="(field,fieldIndex) in fieldDataEdit" :key="fieldIndex">
          <!-- 文本类型   0-->
          <van-field v-model="infoDataForm[field.code]" v-if="[0,100].includes(field.datatype)" class="van_field_class"
                     :name="field.name"
                     :disabled="getFieldDisabled(field)"
                     :required="getFieldRequired(field)" :maxlength="field.maxlength"
                     :label="field.name" :placeholder="getFieldPlaceholder(field)" :rules="getFieldRules(field)"/>
          <!-- 整数类型   1 and  数量类型 2-->
          <van-field v-model="infoDataForm[field.code]" type="number" v-if="[1,2].includes(field.datatype)"
                     class="van_field_class" :maxlength="field.maxlength"
                     :disabled="getFieldDisabled(field)"
                     :required="getFieldRequired(field)" :label="field.name" :placeholder="getFieldPlaceholder(field)"
                     :name="field.name"
                     :rules="getFieldRules(field)"/>
          <!--日期类型  3 || 20-->
          <van-field v-model="infoDataForm[field.code]" readonly v-if="[20,3,8].includes(field.datatype)"
                     :name="field.name"
                     class="van_field_class" right-icon="arrow" :maxlength="field.maxlength"
                     :disabled="getFieldDisabled(field)"
                     :required="getFieldRequired(field)" :label="field.name" :placeholder="getFieldPlaceholder(field)"
                     @click="getDate(field)"
                     :rules="getFieldRules(field)"/>
          <!--下拉类型  6 -->
          <van-field v-model="infoDataForm[field.code+ '_name']" readonly v-if="[6].includes(field.datatype)"
                     :name="field.name"
                     class="van_field_class" right-icon="arrow" :maxlength="field.maxlength"
                     :required="getFieldRequired(field)" :label="field.name" :placeholder="getFieldPlaceholder(field)"
                     @click="getSelectDate(field)"
                     :disabled="getFieldDisabled(field)"
                     :rules="getFieldRules(field)"/>
          <!-- 参数类型  5-->
          <van-field v-model="infoDataForm[field.code+ '_name']" readonly v-if="field.datatype == 5"
                     :name="field.name"
                     class="van_field_class" right-icon="arrow" :maxlength="field.maxlength"
                     :disabled="getFieldDisabled(field)"
                     :required="getFieldRequired(field)" :label="field.name" :placeholder="getFieldPlaceholder(field)"
                     @click="getReference(field)"
                     :rules="getFieldRules(field)"/>
          <!--大文本类型 9-->
          <van-field v-model="infoDataForm[field.code]" type="textarea" v-if="field.datatype == 9" autosize
                     :name="field.name"
                     class="van_field_class" :maxlength="field.maxlength"
                     :disabled="getFieldDisabled(field)"
                     :required="getFieldRequired(field)" :label="field.name" :placeholder="getFieldPlaceholder(field)"
                     :rules="getFieldRules(field)"/>
          <!-- 是否开关 -->
          <van-field v-if="field.datatype == 4" class="van_field_class" :required="getFieldRequired(field)"
                     :name="field.name"
                     :disabled="getFieldDisabled(field)"
                     :label="field.name" :placeholder="getFieldPlaceholder(field)"
                     :rules="getFieldRules(field)">
            <template #input>
              <van-switch v-model="infoDataForm[field.code]" size="20" active-value="Y" inactive-value="N"
                          :disabled="getFieldDisabled(field)"/>
            </template>
          </van-field>
        </div>
      </van-form>
      <Selector ref="selector" @selectOk="selectOk" @dateDataOk="dateDataOk" @selectDataOk="selectDataOk"></Selector>
    </div>
    <div ref="footer">
      <van-button type="info" block v-if="!isCheck" @click="submitData" :loading="loadingButton" loading-text="提交中...">提
        交
      </van-button>
      <van-button type="info" block v-else @click="rollbackData" :loading="loadingButton" loading-text="撤回中...">撤 回
      </van-button>
    </div>
  </div>
</template>

<script>
  import Selector from "./components/selector";
  import Header from '@/components/Header/Index'
  import {Toast, Dialog} from 'vant'
  import {queryReferencePsn, saveSubInfo, revokeLisn} from '@/api/psndoc'

  export default {
    name: "edit",
    components: {Header, Selector},
    data() {
      return {
        loadingButton: false,
        isCheck: false,
        type: '',
        loadingModel: true,
        infoDataForm: {},
        currentHeight: '',
        fieldData: [],
        fieldDataEdit: [],
        tempData: {},
        infoData: {},
        infoIndex: 0,
        backData: {}  // 传过来的备份数据
      }
    },
    mounted() {
      this.currentHeight = (document.documentElement.clientHeight - 46 - this.$refs.footer.offsetHeight) + 'px'
    },
    created() {
      if (this.$route.params.tempData) {
        // 子集传过来的数据
        this.tempData = this.$route.params.tempData   // 模板数据
        this.fieldData = this.$route.params.fieldData  // 显示字段数据
        let fieldEditData = []
        fieldEditData = this.tempData.tablefield
        this.fieldDataEdit = fieldEditData.filter(item => item.showflag == 'Y')   // 可见可编辑字段,也就是表单显示字段
        this.infoData = this.$route.params.infoData
        this.infoIndex = this.$route.params.infoIndex
        this.isCheck = this.$route.params.isCheck
        // 赋值
        this.$set(this.infoData[this.infoIndex], 'table_code', this.tempData.table_code)
        this.$set(this.infoData[this.infoIndex], 'optype', 'edit')
        this.$set(this.infoData[this.infoIndex], 'pkfilecode', this.infoData[this.infoIndex].pk_psndoc)
        this.infoDataForm = this.infoData[this.infoIndex]
        console.log(this.tempData)
        console.log(this.fieldData)
        console.log(this.infoData)
        console.log(this.infoIndex)
        console.log(this.isCheck)
        console.log(this.infoDataForm)
        // 备份表单数据 用于校验
        this.backData.infoDataForm = JSON.parse(JSON.stringify(this.infoDataForm))
      } else {
        this.clickLeft()
      }
    },
    methods: {
      // 下拉类型确认
      selectDataOk(param, val) {
        console.log(param)
        console.log(val)
        this.$set(this.infoDataForm, param.field.code, val[param.key])
        this.$set(this.infoDataForm, param.field.code + '_name', val[param.text])
      },
      // 下拉类型处理
      getSelectDate(field) {
        if (this.getFieldDisabled(field)) {
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
        queryReferencePsn(param).then(res => {
          selectorParam.data = res.data.body
          selectorParam.datatype = res.data.datatype
          Toast.clear()
          this.$refs.selector.openComponent(selectorParam)
        })
      },
      // 日期时间确认
      dateDataOk(param) {
        console.log(param)
        this.$set(this.infoDataForm, param.field.code, param.value)
      },
      // 日期类型处理
      getDate(field) {
        if (this.getFieldDisabled(field)) {
          return
        }
        let selectorParam = {
          field: field,
          type: field.datatype == 8 ? 'datetime' : 'date',
          value: this.infoDataForm[field.code]
        }
        this.$refs.selector.openComponent(selectorParam)
      },
      // 参照类型字段选择成功,回调事件
      selectOk(param) {
        console.log(param)
        this.$set(this.infoDataForm, param.field.code, param.selectData.value)
        this.$set(this.infoDataForm, param.field.code + '_name', param.selectData.title)
      },
      // 参照类型处理
      getReference(field) {
        console.log(field)
        if (this.getFieldDisabled(field)) {
          return
        }
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
        queryReferencePsn(param).then(res => {
          selectorParam.data = res.data.body
          selectorParam.datatype = res.data.datatype
          Toast.clear()
          this.$refs.selector.openComponent(selectorParam)
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
      // 获取字段是否禁用
      getFieldDisabled(field) {
        let disabled = false
        if (field.caneditflag === 'N') {  // 必填属性
          disabled = true
        }
        if(this.isCheck){
          disabled = true
        }

        return disabled
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
        if ([0, 1, 2, 9, 4, 14, 18].includes(field.datatype)) {
          message = '请填写' + field.name
        } else if ([5, 3, 20, 101, 102, 6, 8].includes(field.datatype)) {
          message = '请选择' + field.name
        }
        return message
      },
      // 头部右上角点击事件
      clickRight() {
      },
      // 撤回
      rollbackData() {
        this.loadingButton = true
        let params = {
          tableCode: this.tempData.table_code
        }
        revokeLisn(params).then(res => {
          Toast({message: '撤回成功', duration: 500})
          this.loadingButton = false
          setTimeout(res => {
            this.clickLeft()
          }, 500)
        })
      },
      // 提交
      submitData() {
        // 校验必填数据
        let fieldNames = this.getFieldRequiredAll(this.fieldDataEdit)
        this.$refs.formData.validate(fieldNames).then(() => {
          const infoDataForm = this.infoDataForm
          const infoDataFormBack = this.backData.infoDataForm
          const keys = Object.keys(infoDataForm)
          const data = keys.filter(key => infoDataForm[key] !== infoDataFormBack[key])
          if (data.length == 0) {
            Toast("没有修改过的数据")
            return
          } else {
            console.log('data', data)
            console.log('fieldData', this.fieldData)
            let str = this.judgmentReview(data, this.fieldData)
            if (str !== '') {
              Dialog.confirm({
                title: '以下信息需要审核通过才能生效',
                message: str,
              }).then(() => {
                this.checkSubmit()
              }).catch(() => {
                // on cancel
              });
            } else {
              Dialog.confirm({
                title: '是否确认提交',
                message: '',
              }).then(() => {
                this.checkSubmit()
              }).catch(() => {
                // on cancel
              });
            }
          }
        }).catch(() => {
          // Toast('校验不通过')
        })
      },
      // 提交保存
      checkSubmit() {
        this.loadingButton = true
        let params = {
          data: this.infoData
        }
        saveSubInfo(params).then(res => {
          this.loadingButton = false
          Toast({message: '提交成功', duration: 500})
          setTimeout(res => {
            this.clickLeft()
          }, 500)
        }).catch(res => {
          this.loadingButton = false
          Toast({message: res.message, duration: 1000})
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
        if (str !== '') {
          str = str.substring(0, str.length - 1)
        }
        return str
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
      clickLeft() {
        this.$router.push({name: 'personal'})
      },
    }
  }
</script>

<style scoped>
  .van_field_class {
    border-bottom: 1px solid #ebedf0;
  }
</style>
