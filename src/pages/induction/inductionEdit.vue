<template>
  <div>
    <!--主内容区域-->
    <van-form colon label-width="100" input-align="right" ref="formData" :disabled="isCheck">
      <div v-for="(field,fieldIndex) in fieldDataEdit" :key="fieldIndex" v-if="field.showlistflag === 'Y'">
        <!-- 文本类型   0-->
        <van-field v-model="infoDataForm[field.code]" v-if="[0,17].includes(field.datatype)  && field.code !='id'" class="van_field_class"
                   :name="field.name"
                   :disabled="getFieldDisabled(field)"
                   :required="getFieldRequired(field)" :maxlength="field.maxlength"
                   :label="field.name" :placeholder="getFieldPlaceholder(field)" :rules="getFieldRules(field)"/>
         <!-- @input="getChangeDate(field,infoDataForm[field.code])"
                   @input="getChangeDate(field,infoDataForm[field.code])"
                   @blur="getChangeDate(field,infoDataForm[field.code])" -->
        <van-field v-model="infoDataForm[field.code]" v-if="field.code =='id'" class="van_field_class"
                   :name="field.name"
                   :disabled="getFieldDisabled(field)"
                   :required="getFieldRequired(field)" :maxlength="field.maxlength"
                   @change="getChangeDate(field,infoDataForm[field.code])"
                   @keyup.enter="getChangeDate(field,infoDataForm[field.code])"
                   :label="field.name" :placeholder="getFieldPlaceholder(field)" :rules="getFieldRules(field)"/>
         <!-- 整数类型   1 and  数量类型 2-->
        <van-field v-model="infoDataForm[field.code]" type="number" v-if="[1,2,18].includes(field.datatype)"
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
        <!-- <van-field v-if="field.datatype == 4" class="van_field_class" :required="getFieldRequired(field)"
                   :name="field.name"
                   :label="field.name" :placeholder="getFieldPlaceholder(field)"
                   :rules="getFieldRules(field)">
          <template #input>
            <div>
              <van-switch v-model="infoDataForm[field.code]"  size="20" active-value="Y" inactive-value="N"
                        :disabled="isCheck" @click="getSwitchData(field,infoDataForm[field.code])"/>
            </div>
          </template>
        </van-field> -->
         <!--下拉类型  6 -->
        <van-field v-model="infoDataForm[field.code+ '_name']" readonly v-if="[4].includes(field.datatype)"
                   :name="field.name"
                   class="van_field_class" right-icon="arrow" :maxlength="field.maxlength"
                   :required="getFieldRequired(field)" :label="field.name" :placeholder="getFieldPlaceholder(field)"
                   @click="getSelectDate(field, field.datatype)"
                   :rules="getFieldRules(field)"/>
      </div>
    </van-form>
    <Selector ref="selector" @selectOk="selectOk" @dateDataOk="dateDataOk" @selectDataOk="selectDataOk"></Selector>
  </div>
</template>

<script>
  import Selector from "./components/selector";
  import {Toast} from 'vant'
  import {queryEntryReference} from '@/api/inductionInfo'
  export default {
    name: "InductionEdit",
    components: {Selector},
    data() {
      return {
        loadingButton: false,
        // isCheck: false,
        type: '',
        loadingModel: true,
        currentHeight: '',
        fieldData: [],
        tempData: {},
        infoData: {},
        infoIndex: 0,
        backData: {}  // 传过来的备份数据
      }
    },
    props: {
      isCheck: {
        type: Boolean,
        default: false
      },
      fieldDataEdit: {
        type: Array,
        default: []
      },
      infoDataForm: {
        type: Object,
        default: {}
      }
    },
    mounted() {

    },
    created() {

    },
    methods: {

      getSwitchData(param, val){
        this.$set(this.infoDataForm, param.code, val)
        this.$forceUpdate();
      },

      // 下拉类型确认
      selectDataOk(param, val) {
        this.$set(this.infoDataForm, param.field.code, val[param.key])
        this.$set(this.infoDataForm, param.field.code + '_name', val[param.text])
        this.$forceUpdate();
      },
      // 下拉类型处理
      getSelectDate(field,datatype) {

        if (this.isCheck) {
          return
        }
        let selectorParam = {
          field: field,
          value: this.infoDataForm[field.code],
          text: 'title',
          key: 'value'
        }
        if(datatype == '4'){
          let body = [
            {
              title: "是",
              value: "Y"
            },
            {
              title: "否",
              value: "N"
            }
          ]
          selectorParam.data = body
          selectorParam.datatype ='select'
          this.$refs.selector.openComponent(selectorParam)
          return
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
        queryEntryReference(param).then(res => {
          selectorParam.data = res.data.body
          selectorParam.datatype = res.data.datatype
          Toast.clear()
          this.$refs.selector.openComponent(selectorParam)
        })
      },
      // 日期时间确认
      dateDataOk(param) {
        this.$set(this.infoDataForm, param.field.code, param.value)
      },
      // 日期类型处理
      getDate(field) {
        if (this.isCheck) {
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
        this.$set(this.infoDataForm, param.field.code, param.selectData.value)
        this.$set(this.infoDataForm, param.field.code + '_name', param.selectData.title)
        if(param.selectData.value == '1001Z01000000000AI36' || param.selectData.title =='身份证'){
          this.getChangeDate()
        }
      },
      //处理身份证选择zmj
      getChangeDate(field,value){
        var age = 0,yearBirth,monthBirth,dayBirth, org_birthday;
        let info  = this.infoDataForm
        let birthday, sex, feteday;
        let IdNO = this.infoDataForm.id
        let item = this.infoDataForm.id
        if(info.idtype == '1001Z01000000000AI36'){
            //获取当前年月日并计算年龄
            var myDate = new Date();
            var monthNow = myDate.getMonth() + 1;
            var dayNow = myDate.getDate();

            if (item && item.length==18) {
              birthday = item.substr(6,8);
              feteday =birthday.replace(/(.{4})(.{2})/,"$1-$2-")
              sex = IdNO.charAt(16)%2==0?"F":"M"//是男性,F是女性。
              //获取出生年月日
              yearBirth = item.substring(6,10);
              monthBirth = item.substring(10,12);
              dayBirth = item.substring(12,14);
              age = myDate.getFullYear() - yearBirth;
              if(monthNow < monthBirth || (monthNow == monthBirth && dayNow < dayBirth)){
                age--;
              }
              this.$set(this.infoDataForm, 'birthdate', feteday)
              if(sex == 'F'){
                this.$set(this.infoDataForm, 'sex', '2')
                this.$set(this.infoDataForm, 'sex' + '_name', '女')
              }else{
                this.$set(this.infoDataForm, 'sex', '1')
                this.$set(this.infoDataForm, 'sex' + '_name', '男')
              }
            }else if( item && item.length==15){
              birthday = "19"+ item.substr(6,6);
              feteday =birthday.replace(/(.{4})(.{2})/,"$1-$2-")
              sex =IdNO.charAt(14)%2==0?"F":"M"//是男性,F是女性。
               //获取出生年月日
              org_birthday = item.substring(6, 12);
              yearBirth = "19" + org_birthday.substring(0, 2);
              monthBirth = org_birthday.substring(2, 4);
              dayBirth = org_birthday.substring(4, 6);
              age = myDate.getFullYear() - yearBirth;
              if(monthNow < monthBirth || (monthNow == monthBirth && dayNow < dayBirth)){
                age--;
              }
              this.$set(this.infoDataForm, 'birthdate', feteday)
              if(sex == 'F'){
                this.$set(this.infoDataForm, 'sex', '2')
                this.$set(this.infoDataForm, 'sex' + '_name', '女')
              }else{
                this.$set(this.infoDataForm, 'sex', '1')
                this.$set(this.infoDataForm, 'sex' + '_name', '男')
              }
            }else{
              this.$set(this.infoDataForm, 'birthdate', '')
              this.$set(this.infoDataForm, 'sex', '')
              this.$set(this.infoDataForm, 'sex' + '_name', '')
            }

        }

      },
      // 参照类型处理
      getReference(field) {
        if (this.isCheck) {
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
        queryEntryReference(param).then(res => {
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
      // 获取字段是否不可填
      getFieldDisabled(field) {
        if (this.isCheck) {
          return true
        } else {
          return field.caneditflag === 'Y' ? false : true
        }
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
        if ([0, 1, 2, 9, 4, 14, 17, 18].includes(field.datatype)) {
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
        fetchData({
          url: 'hrssc/portal/psnbase/revokeLisn',
          method: 'POST',
          param: {tableCode: this.tempData.table_code},
          mock: false,
          contentType: "application/json",
          success: res => {
            Toast({message: '撤回成功', duration: 500})
            this.loadingButton = false
            setTimeout(res => {
              this.clickLeft()
            }, 500)
          }
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
          }

          this.loadingButton = true
          fetchData({
            url: 'hrssc/portal/psnbase/saveSubInfo',
            method: 'POST',
            param: {data: this.infoData},
            mock: false,
            contentType: "application/json",
            success: res => {
              this.loadingButton = false
              Toast({message: '提交成功', duration: 500})
              setTimeout(res => {
                this.clickLeft()
              }, 500)
            },
            error: res => {
              this.loadingButton = false
              Toast({message: res.message, duration: 1000})
            }
          })
        }).catch(() => {
          // Toast('校验不通过')
        })
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
        this.$router.push({name: 'personalNew'})
      },
    }
  }
</script>
