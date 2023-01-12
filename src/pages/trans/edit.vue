<template>
  <div>
    <Header title="调配申请" @clickLeft="clickLeft"></Header>
    <div class="item_body" :style="{'height': currentHeight}">
      <van-form input-align="right" ref="billForm" colon label-width="120px">
        <!-- 调配方式 -->
        <van-field
          is-link
          readonly
          required
          name="stapply_mode"
          :rules="formRules.stapply_mode"
          :value="billInfo.stapply_mode.display"
          @click="selectData(stapplyModeList,'请选择调配方式','stapply_mode', 'text', 'value', billInfo.stapply_mode.value)"
          label="调配方式"
          placeholder="请选择调配方式"
        />
        <!-- 调配类型 -->
        <van-field
          is-link
          readonly
          required
          name="pk_trnstype"
          :rules="formRules.pk_trnstype"
          :value="billInfo.pk_trnstype.display"
          @click="selectData(transTypeList,'请选择调配类型','pk_trnstype', 'trnstypename', 'pk_trnstype', billInfo.pk_trnstype.value)"
          label="调配类型"
          placeholder="请选择调配类型"
        />
        <!-- 选择调配方式类型后显示 -->
        <div v-if="formShow">
          <van-cell title="调配人员" :value="billInfo.pk_psndoc.display"/>
          <!--离职原因-->
          <van-field
            is-link
            readonly
            required
            name="sreason"
            :rules="formRules.sreason"
            :value="billInfo.sreason.display"
            @click="selectData(transSreasonList,'请选择调配原因','sreason', 'name', 'pk_defdoc', billInfo.sreason.value)"
            label="调配原因"
            placeholder="请选择调配原因"
          />
          <!--生效日期-->
          <van-field
            is-link
            readonly
            required
            name="effectdate"
            :rules="formRules.effectdate"
            v-model="billInfo.effectdate.value"
            @click="selectDate(billInfo.effectdate.value,'effectdate','生效日期', 'date')"
            label="生效日期"
            placeholder="请选择生效日期"
          />
          <!--试用-->
          <van-field label="试用" readonly>
            <template #input>
              <van-switch v-model="billInfo.trial_flag.value" size="20" active-value="Y" inactive-value="N"
                          @change="changeSwitch(billInfo.trial_flag)"/>
            </template>
          </van-field>
          <div v-if="billInfo.trial_flag.value === 'Y'">
            <van-field v-model="billInfo.trialdays.value" type="digit" label="岗位试用期限" :rules="formRules.trialdays"
                       required
                       placeholder="请填写岗位试用期限"/>
            <van-field v-model="billInfo.trial_unit.display" label="岗位试用期限单位" :rules="formRules.trial_unit" required
                       readonly
                       @click="selectData(trialUnitList,'请选择岗位试用期限单位','trial_unit', 'text', 'value', billInfo.trial_unit.value)"
                       is-link placeholder="请选择岗位试用期限单位"/>
            <van-field v-model="billInfo.trialbegindate.value" label="试用开始日期" :rules="formRules.trialbegindate" required
                       readonly
                       @click="selectDate(billInfo.trialbegindate.value,'trialbegindate','请选择试用开始日期', 'date')"
                       is-link placeholder="请选择试用开始日期"/>
            <van-field v-model="billInfo.trialenddate.value" label="试用结束日期" :rules="formRules.trialenddate" required
                       readonly
                       @click="selectDate(billInfo.trialenddate.value,'trialenddate','请选择试用结束日期', 'date')"
                       is-link placeholder="请选择试用结束日期"/>
          </div>


          <!--调配说明-->
          <van-field
            v-model="billInfo.memo.value"
            re
            rows="2"
            autosize
            label="调配说明"
            type="textarea"
            placeholder="请填写调配说明"
          />
          <!-- 调配前 -->
          <p class="item_body_title" v-if="oldItem.length != 0">调配前信息</p>
          <van-field :label="item.itemname" :value="billInfo[item.itemkey].display" readonly v-for="item in oldItem"
                     :key="item.pk_stbill_itemset"/>
          <!-- 调配后  -->
          <p class="item_body_title" v-if="newItem.length != 0">调配后信息</p>
          <FieldEdit :billInfo="billInfo" :fieldData="newItem"/>

          <p class="item_body_title">调配后管理组织</p>
          <van-field
            label="原人员信息组织"
            placeholder="请选择原人员信息组织"
            :value="billInfo.pk_old_hi_org.display"
            is-link
            @click="selectData(hrOrgList,'请选择原人员信息组织','pk_old_hi_org', 'name', 'pk_hrorg', billInfo.pk_old_hi_org.value)"
            readonly/>
          <van-field
            label="新人员信息组织"
            placeholder="请选择新人员信息组织"
            :value="billInfo.pk_hi_org.display"
            is-link
            @click="selectData(hrOrgList,'请选择新人员信息组织','pk_hi_org', 'name', 'pk_hrorg', billInfo.pk_hi_org.value)"
            readonly/>
          <p class="item_body_title">合同管理组织</p>
          <van-field
            label="原合同管理组织"
            placeholder="请选择原合同管理组织"
            :value="billInfo.pk_old_hrcm_org.display"
            is-link
            @click="selectData(hrOrgList,'请选择原合同管理组织','pk_old_hrcm_org', 'name', 'pk_hrorg', billInfo.pk_old_hrcm_org.value)"
            readonly/>
          <van-field
            label="新合同管理组织"
            placeholder="请选择新合同管理组织"
            :value="billInfo.pk_hrcm_org.display"
            is-link
            @click="selectData(hrOrgList,'请选择新合同管理组织','pk_hrcm_org', 'name', 'pk_hrorg', billInfo.pk_hrcm_org.value)"
            readonly/>
          <van-field label="解除" readonly>
            <template #input>
              <van-switch v-model="billInfo.isrelease.value" size="20" active-value="Y" inactive-value="N"
                          @change="changeSwitch(billInfo.isrelease)"/>
            </template>
          </van-field>
          <van-field label="终止" readonly>
            <template #input>
              <van-switch v-model="billInfo.isend.value" size="20" active-value="Y" inactive-value="N"
                          @change="changeSwitch(billInfo.isend)"/>
            </template>
          </van-field>
          <p class="item_body_title">执行信息</p>
          <van-field label="结束兼职" readonly>
            <template #input>
              <van-switch v-model="billInfo.ifendpart.value" size="20" active-value="Y" inactive-value="N"
                          @change="changeSwitch(billInfo.ifendpart)"/>
            </template>
          </van-field>
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
  import FieldEdit from '@/components/HrtrnFieldEdit/FieldEdit'
  import SaveButton from '@/components/Button/SaveButton'

  import {quertHrOrgList} from '@/api/hrshRef'
  import {getTransBill, saveTransBill, queryTransType, queryTransStapplyMode, queryTransSreason} from '@/api/trans'
  import {Toast} from 'vant'

  export default {
    components: {Header, Select, SelectDate, FieldEdit, SaveButton},
    data() {
      return {
        formRules,
        stapplyModeList: [],
        trialUnitList,
        newItem: [], // 调配模板
        oldItem: [], // 调配模板
        formShow: false,
        currentHeight: '',
        transSreasonList: [],
        transTypeList: [],
        billInfo: {
          stapply_mode: {
            value: '',
            display: ''
          },
          pk_trnstype: {
            value: '',
            display: ''
          }
        }
      }
    },
    mounted() {
      this.currentHeight = (document.documentElement.clientHeight - 46 - 60) + 'px'
      this.queryTransType()
      this.queryTransStapplyMode()
      this.queryTransSreason()
      this.quertHrOrgList()
      // 判断是修改还是新增
      if (this.$route.query.pk_h) {
        this.queryBillInfo(this.$route.query.pk_h, null)
      }
    },
    created() {
    },
    methods: {
      clickLeft() {
        this.$router.push({name: 'application'})
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
        // console.log('selector', selector)
        // console.log('item', item)
        this.$set(this.billInfo[selector.field], 'value', item[selector.key])
        this.$set(this.billInfo[selector.field], 'display', item[selector.text])
        console.log('billInfo', this.billInfo)
        // 选择调配类型和调配方式获取添加单据数据
        if ((selector.field == 'pk_trnstype' || selector.field == 'stapply_mode') && (this.billInfo.stapply_mode.value && this.billInfo.pk_trnstype.value)) {
          this.queryBillInfo(null, this.billInfo.pk_trnstype.value, this.billInfo.stapply_mode.value)
        }
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
       * 查询人力组织
       */
      quertHrOrgList() {
        quertHrOrgList().then(res => {
          this.hrOrgList = res.data
        })
      },
      /**
       * 查询离职原因
       */
      queryTransSreason() {
        queryTransSreason().then(res => {
          this.transSreasonList = res.data
        })
      },
      /**
       * 查询调配类型
       */
      queryTransType() {
        queryTransType().then(res => {
          this.transTypeList = res.data
        })
      },
      /**
       * 查询调配类型
       */
      queryTransStapplyMode() {
        queryTransStapplyMode().then(res => {
          this.stapplyModeList = res.data
        })
      },
      /**
       * 查询单据
       */
      queryBillInfo(pk_h, pk_trnstype, stapply_mode) {
        Toast.loading({
          message: '加载中...',
          duration: 0
        })
        let params = {
          billid: pk_h,
          pk_trnstype: pk_trnstype,
          stapply_mode: stapply_mode
        }
        getTransBill(params).then(res => {
          this.formShow = true
          this.billInfo = res.data.billInfo
          this.newItem = res.data.newItem
          this.oldItem = res.data.oldItem
          Toast.clear()
        })
      },
      changeSwitch(field) {
        if (field.value === 'Y') {
          field.display = '是'
        } else {
          field.display = '否'
        }
        console.log(field)
      },
      // 验证是否存在返回数据
      checkQueryData () {
        let flag = true
        if (this.billInfo.sreason) {
          flag = false
        }
        return flag
      },
      /**
       * 保存单据
       */
      saveBillInfo() {
        if (this.checkQueryData()) {
          return
        }
        let params = {
          billInfo: this.billInfo
        }
        console.log(this.billInfo)
        this.$refs.billForm.validate(Object.keys(formRules)).then(() => {
          Toast.loading({
            message: '保存中...',
            duration: 0
          })
          saveTransBill(params).then(res => {
            Toast.clear()
            this.$router.push({name: 'transDetail', query: {pk_h: res.data.primaryKey}})
          })
        })
      },
    }
  }
  // 表单校验规则
  const formRules = {
    stapply_mode: [{
      required: true,
      message: ''
    }],
    sreason: [{
      required: true,
      message: ''
    }],
    pk_trnstype: [{
      required: true,
      message: ''
    }],
    effectdate: [{
      required: true,
      message: ''
    }],
    trialdays: [{
      required: true,
      message: ''
    }],
    trial_unit: [{
      required: true,
      message: ''
    }],
    trialbegindate: [{
      required: true,
      message: ''
    }],
    trialenddate: [{
      required: true,
      message: ''
    }]
  }
  const trialUnitList = [
    {
      text: '年',
      value: '1'
    },
    {
      text: '月',
      value: '2'
    },
    {
      text: '天',
      value: '3'
    }
  ]
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
