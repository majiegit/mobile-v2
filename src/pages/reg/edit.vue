<template>
  <div>
    <Header title="转正申请" @clickLeft="clickLeft"></Header>
    <div class="item_body" :style="{'height': currentHeight}">
      <van-form input-align="right" ref="billForm" colon label-width="120px">
        <!-- 试用类型 -->
        <van-field
          is-link
          readonly
          required
          name="probation_type"
          :rules="formRules.probation_type"
          :value="billInfo.probation_type.display"
          @click="selectData(regTypeList,'请选择试用类型','probation_type', 'name', 'probation_type', billInfo.probation_type.value)"
          label="试用类型"
          placeholder="请选择试用类型"
        />
        <!--先选择试用类型 再显示以下内容-->
        <div v-if="formShow">
          <!--试用开始日期-->
          <van-field
            is-link
            readonly
            required
            :rules="formRules.begin_date"
            name="begin_date"
            v-model="billInfo.begin_date.value"
            label="试用开始日期"
            placeholder="请选择试用开始日期"
          />
          <!--试用结束日期-->
          <van-field
            is-link
            readonly
            required
            :rules="formRules.end_date"
            name="end_date"
            v-model="billInfo.end_date.value"
            @click="selectDate(billInfo.end_date.value,'end_date','试用结束日期', 'date')"
            label="试用结束日期"
            placeholder="请选择试用结束日期"
          />
          <!--生效日期-->
          <van-field
            is-link
            readonly
            required
            :rules="formRules.regulardate"
            name="regulardate"
            v-model="billInfo.regulardate.value"
            @click="selectDate(billInfo.regulardate.value,'regulardate','生效日期', 'date')"
            label="生效日期"
            placeholder="请选择生效日期"
          />
          <!--试用结果-->
          <van-field
            is-link
            readonly
            required
            :rules="formRules.trialresult"
            name="trialresult"
            v-model="billInfo.trialresult.display"
            @click="selectData(regResultList,'请选择试用结果','trialresult', 'name', 'trialresult', billInfo.trialresult.value)"
            label="试用结果"
            placeholder="请选择试用结果"
          />
          <!--延期转正日期-->
          <van-field
            v-if="billInfo.trialresult.value == 2"
            is-link
            readonly
            required
            :rules="formRules.trialdelaydate"
            name="trialdelaydate"
            v-model="billInfo.trialdelaydate.value"
            @click="selectDate(billInfo.trialdelaydate.value,'trialdelaydate','延期转正日期', 'date')"
            label="延期转正日期"
            placeholder="请选择延期转正日期"
          />
          <!--转正说明-->
          <van-field
            v-model="billInfo.memo.value"
            rows="2"
            autosize
            label="转正说明"
            type="textarea"
            maxlength="50"
            placeholder="请填写转正说明"
            show-word-limit
          />

          <p class="item_body_title" v-if="oldItem.length != 0">转正前信息</p>
          <van-field :label="item.itemname" :value="billInfo[item.itemkey].display" readonly v-for="item in oldItem"
                     :key="item.pk_stbill_itemset"/>

          <p class="item_body_title" v-if="newItem.length != 0">转正后信息</p>
          <FieldEdit :billInfo="billInfo" :fieldData="newItem"/>


          <p class="item_body_title">执行信息</p>
          <van-field label="同步工作履历" readonly>
            <template #input>
              <van-switch v-model="billInfo.ifsynwork.value" size="20" active-value="Y" inactive-value="N"
                          @change="changeSwitch(billInfo.ifsynwork)"/>
            </template>
          </van-field>
        </div>
      </van-form>
    </div>
    <!--保存按钮-->
    <SaveButton @save="saveBillInfo"/>
    <!-- 日期选择器-->
    <SelectDate ref="selectorDate" @dateOk="dateOk"/>
    <!--   下拉选择器   -->
    <Select ref="selector" @selectOk="selectOk"/>
  </div>
</template>

<script>
  import Header from '@/components/Header/Index'
  import Select from '@/components/Selector/Select'
  import SelectDate from '@/components/Selector/SelectDate'
  import SaveButton from '@/components/Button/SaveButton'
  import FieldEdit from '@/components/HrtrnFieldEdit/FieldEdit'
  import {getRegBill, saveRegBill, queryRegType, queryRegSreason} from '@/api/reg'
  import {Toast} from 'vant';
  import {USERINFO} from '@/utils/mutation-types'
  import storage from 'store';


  export default {
    data() {
      return {
        checked: '',
        formRules,
        regTypeList,
        regResultList,
        currentHeight: '',
        formShow: false,
        billInfo: {
          probation_type: {
            value: '',
            display: ''
          }
        },
        newItem: [],
        oldItem: []
      }
    },
    components: {Header, Select, SelectDate, SaveButton, FieldEdit},
    mounted() {
      this.currentHeight = (document.documentElement.clientHeight - 46 - 60) + 'px'
      // 判断是修改还是新增
      if (this.$route.query.pk_h) {
        this.queryBillInfo(this.$route.query.pk_h, null)
      }
    },
    created() {
    },
    watch: {},
    methods: {
      changeSwitch(field) {
        if (field.value === 'Y') {
          field.display = '是'
        } else {
          field.display = '否'
        }
        console.log(field)
      },

      /**
       * 查询单据
       */
      queryBillInfo(pk_h, probation_type) {
        Toast.loading({
          message: '加载中...',
          duration: 0
        })
        let params = {
          billid: pk_h,
          probation_type: probation_type
        }
        getRegBill(params).then(res => {
          this.billInfo = res.data.billInfo
          this.newItem = res.data.newItem
          this.oldItem = res.data.oldItem
          this.formShow = true
          Toast.clear()
        })
      },
      /**
       *  下来框选择事件
       */
      selectData(data, title, field, text, key, value) {
        let selector = {
          data: data,
          title: title,
          field: field,
          text: text,
          key: key,
          value: value
        }
        this.$refs.selector.openSelect(selector)
      },
      /**
       * 选择器确认回调
       * @param selector
       * @param item
       */
      selectOk(selector, item) {
        console.log(selector, item)
        this.$set(this.billInfo[selector.field], 'value', item[selector.key])
        this.$set(this.billInfo[selector.field], 'display', item[selector.text])
        console.log(this.billInfo)
        // 转正类型
        if (selector.field == 'probation_type') {
          this.queryBillInfo(null, this.billInfo.probation_type.value)
        }
      },
      /**
       * 时间选择器确认回调
       * @param selector
       * @param item
       */
      dateOk(selector) {
        this.$set(this.billInfo[selector.field], 'value', selector.value)
        console.log(this.billInfo)
      },
      /**
       * 选择时间
       */
      selectDate(value, field, title, type) {
        let selector = {
          title: title,
          field: field,
          value: value,
          type: type
        }
        this.$refs.selectorDate.openSelect(selector)
      },
      clickLeft() {
        this.$router.go(-1)
      },
      /**
       * 保存单据
       */
      saveBillInfo() {
        let params = {
          billInfo: this.billInfo
        }
        console.log(this.billInfo)
        this.$refs.billForm.validate(Object.keys(formRules)).then(() => {
          Toast.loading({
            message: '保存中...',
            duration: 0
          })
          saveRegBill(params).then(res => {
            Toast.clear()
            this.$router.push({name: 'regDetail', query: {pk_h: res.data.primaryKey}})
          })
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
    }
  }

  // 试用结果
  const regResultList = [
    {
      trialresult: 1,
      name: '转正'
    }, {
      trialresult: 2,
      name: '延长试用期'
    }, {
      trialresult: 3,
      name: '未通过试用'
    }
  ]

  // 转类型数据
  const regTypeList = [
    {
      probation_type: 1,
      name: '入职试用'
    },
    {
      probation_type: 2,
      name: '转岗试用'
    }
  ]

  // 表单校验规则
  const formRules = {
    probation_type: [{
      required: true,
      message: ''
    }],
    begin_date: [{
      required: true,
      message: ''
    }],
    end_date: [{
      required: true,
      message: ''
    }],
    regulardate: [{
      required: true,
      message: ''
    }],
    trialdelaydate: [{
      required: true,
      message: ''
    }]

  }
</script>

<style lang='less' scoped>
  .item_body {
    width: 100%;
    overflow-y: auto;
    &_title {
      font-size: 14px;
      line-height: 14px;
      padding-left: 10px;
      color: #999;
    }
  }

</style>
