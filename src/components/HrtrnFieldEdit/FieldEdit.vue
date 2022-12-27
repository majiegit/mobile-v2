<template>
  <div>
    <div v-for="(field,fieldIndex) in fieldData" :key="fieldIndex">
      <!-- 文本类型   0-->
      <van-field v-model="billInfo[field.itemkey].value" v-if="[0,100].includes(field.data_type)"
                 class="van_field_class"
                 :name="field.itemname"
                 :required="getFieldRequired(field)"
                 :disabled="getFieldDisabled(field)"
                 :maxlength="field.max_length"
                 :label="field.itemname"
                 :placeholder="getFieldPlaceholder(field)"
                 :rules="getFieldRules(field)"/>
      <!-- 整数类型   1 and  数量类型 2-->
      <van-field v-model="billInfo[field.itemkey].value" type="number" v-if="[1,2].includes(field.data_type)"
                 class="van_field_class" :maxlength="field.max_length"
                 :disabled="getFieldDisabled(field)"
                 :required="getFieldRequired(field)" :label="field.itemname" :placeholder="getFieldPlaceholder(field)"
                 :name="field.itemname"
                 :rules="getFieldRules(field)"/>
      <!--日期类型  3 || 20-->
      <van-field v-model="billInfo[field.itemkey].value" readonly v-if="[20,3,8].includes(field.data_type)"
                 :name="field.itemname"
                 is-link
                 class="van_field_class" right-icon="arrow" :maxlength="field.max_length"
                 :disabled="getFieldDisabled(field)"
                 :required="getFieldRequired(field)" :label="field.itemname" :placeholder="getFieldPlaceholder(field)"
                 @click="getDate(field)"
                 :rules="getFieldRules(field)"/>
      <!--下拉类型  6 -->
      <van-field v-model="billInfo[field.itemkey].display" readonly v-if="[6].includes(field.data_type)"
                 :name="field.itemname"
                 class="van_field_class" right-icon="arrow" :maxlength="field.max_length"
                 :disabled="getFieldDisabled(field)"
                 :required="getFieldRequired(field)" :label="field.itemname" :placeholder="getFieldPlaceholder(field)"
                 @click="getSelectDate(field)"
                 :rules="getFieldRules(field)"/>
      <!-- 参数类型  5-->
      <van-field v-model="billInfo[field.itemkey].display" readonly v-if="field.data_type == 5"
                 :name="field.itemname"
                 class="van_field_class" right-icon="arrow" :maxlength="field.max_length"
                 :disabled="getFieldDisabled(field)"
                 :required="getFieldRequired(field)" :label="field.itemname" :placeholder="getFieldPlaceholder(field)"
                 @click="getReference(field)"
                 :rules="getFieldRules(field)"/>
      <!--大文本类型 9-->
      <van-field v-model="billInfo[field.itemkey].value" type="textarea" v-if="field.data_type == 9" autosize
                 :name="field.itemname"
                 class="van_field_class" :maxlength="field.max_length"
                 :disabled="getFieldDisabled(field)"
                 :required="getFieldRequired(field)" :label="field.itemname" :placeholder="getFieldPlaceholder(field)"
                 :rules="getFieldRules(field)"/>
      <!-- 是否开关 -->
      <van-field v-if="field.data_type == 4" class="van_field_class"
                 :required="getFieldRequired(field)"
                 :name="field.itemname"
                 :disabled="getFieldDisabled(field)"
                 :label="field.itemname"
                 :placeholder="getFieldPlaceholder(field)"
                 :rules="getFieldRules(field)">
        <template #input>
          <van-switch v-model="billInfo[field.itemkey].value" size="20" active-value="Y" inactive-value="N"
                      :disabled="getFieldDisabled(field)"/>
        </template>
      </van-field>
    </div>
    <Select ref="selector" @selectOk="selectOk" @dateDataOk="dateDataOk" @selectDataOk="selectDataOk"></Select>
  </div>
</template>

<script>
  import Select from '@/components/Selector/Select'
  import {Toast} from 'vant'
  import {queryReferencePsn, saveSubInfo, revokeLisn} from '@/api/psndoc'

  export default {
    name: "edit",
    components: {Select},
    props: {
      fieldData: {
        type: Array,
        default: []
      },
      billInfo: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
      }
    },
    mounted() {
      console.log(this.fieldData)
    },
    created() {
    },
    methods: {
      // 下拉类型确认
      selectDataOk(param, val) {
        console.log(param,'param')
        console.log(val)
        this.$set(this.billInfo, param.field.code, val[param.key])
        this.$set(this.billInfo, param.field.code + '_name', val[param.text])
      },
      // 下拉类型处理
      getSelectDate(field) {
        let selectorParam = {
          field: field,
          value: this.billInfo[field.itemkey].display,
          text: 'title',
          key: 'value'
        }
        //请求参数
        var param = {
          dataType: field.data_type,
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
        this.$set(this.billInfo, param.field.code, param.value)
      },
      // 日期类型处理
      getDate(field) {
        let selectorParam = {
          field: field,
          type: field.data_type == 8 ? 'datetime' : 'date',
          value: this.billInfo[field.itemkey].display
        }
        this.$refs.selector.openComponent(selectorParam)
      },
      // 参照类型字段选择成功,回调事件
      selectOk(param) {
        console.log(param)
        this.$set(this.billInfo[param.field.itemkey], 'value', param.selectData.value)
        this.$set(this.billInfo[param.field.itemkey], 'display', param.selectData.title)
      },
      // 参照类型处理
      getReference(field) {
        console.log(field)
        //请求参数
        var param = {
          // refType:code
          dataType: field.data_type,
          pk_refinfo: field.pk_refinfo,
          refModel: field.refclass
        }
        let selectorParam = {
          field: field,
          infoDataForm: this.billInfo
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
      // 获取字段是否必填
      getFieldRequired(field) {
        let required = false
        if (field.ismustnotnull === 'Y') {  // 必填属性
          required = true
        }
        return required
      },
      // 获取字段是否禁用
      getFieldDisabled(field) {
        let disabled = false
        if (field.isedit === 'N') {  // 必填属性
          disabled = true
        }
        return disabled
      },
      // 获取字段说明
      getFieldPlaceholder(field) {
        let message = ''
        if ([0, 1, 2, 9, 4, 14, 18].includes(field.data_type)) {
          message = '请填写' + field.itemname
        } else if ([5, 3, 20, 101, 102, 6, 8].includes(field.data_type)) {
          message = '请选择' + field.itemname
        }
        return message
      }
    }
  }
</script>

<style scoped>
  .van_field_class {
    border-bottom: 1px solid #ebedf0;
  }
</style>
