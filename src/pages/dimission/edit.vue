<template>
  <div>
    <Header title="离职申请" @clickLeft="clickLeft"></Header>
    <div class="item_body" :style="{'height': currentHeight}">
      <van-form input-align="right" ref="billForm" colon label-width="120px">
        <!-- 离职类型 -->
        <van-field
          is-link
          readonly
          required
          name="pk_trnstype"
          :rules="formRules.pk_trnstype"
          :value="billInfo.pk_trnstype.display"
          @click="selectData(dimissionTypeList,'请选择离职业务类型','pk_trnstype', 'trnstypename', 'pk_trnstype', billInfo.pk_trnstype.value)"
          label="离职业务类型"
          placeholder="请选择离职业务类型"
        />
        <div v-if="formShow"> <!--先选择异动类型 在显示-->
          <!--离职原因-->
          <van-field
            is-link
            readonly
            required
            name="sreason"
            :rules="formRules.sreason"
            :value="billInfo.sreason.display"
            @click="selectData(dimissionSreasonList,'请选择离职原因','sreason', 'name', 'pk_defdoc', billInfo.sreason.value)"
            label="离职原因"
            placeholder="请选择离职原因"
          />
          <!--生效日期-->
          <van-field
            is-link
            readonly
            required
            :rules="formRules.effectdate"
            name="effectdate"
            v-model="billInfo.effectdate.value"
            @click="selectDate(billInfo.effectdate.value,'effectdate','生效日期', 'date')"
            label="生效日期"
            placeholder="请选择生效日期"
          />
          <!--离职说明-->
          <van-field
            v-model="billInfo.memo.value"
            rows="2"
            autosize
            label="离职说明"
            type="textarea"
            maxlength="50"
            placeholder="请填写离职说明"
            show-word-limit
          />

          <p class="item_body_title" v-if="oldItem.length != 0">离职前信息</p>
          <van-field :label="item.itemname" :value="billInfo[item.itemkey].display" readonly v-for="item in oldItem"
                     :key="item.pk_stbill_itemset"/>

          <p class="item_body_title" v-if="newItem.length != 0">离职后信息</p>
          <FieldEdit :billInfo="billInfo" :fieldData="newItem"/>

          <p class="item_body_title">离职后管理组织</p>
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
          <van-field label="停用离职人员" readonly>
            <template #input>
              <van-switch v-model="billInfo.isdisablepsn.value" size="20" active-value="Y" inactive-value="N"
                          @change="changeSwitch(billInfo.isdisablepsn)"/>
            </template>
          </van-field>
          <van-field label="加入黑名单" readonly>
            <template #input>
              <van-switch v-model="billInfo.ifaddblack.value" size="20" active-value="Y" inactive-value="N"
                          @change="changeSwitch(billInfo.ifaddblack)"/>
            </template>
          </van-field>
          <!--加入黑名单理由-->
          <van-field
            v-if="billInfo.ifaddblack.value == 'Y'"
            required
            v-model="billInfo.addreason.value"
            rows="2"
            autosize
            label="加入理由"
            type="textarea"
            maxlength="50"
            placeholder="请填写加入黑名单理由"
            show-word-limit
          />
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
  import {getDimissionBill, saveDimissionBill, queryDimissionType, queryDimissionSreason} from '@/api/dimission'
  import {quertHrOrgList} from '@/api/hrshRef'
  import {Toast} from 'vant';
  import {USERINFO} from '@/utils/mutation-types'
  import storage from 'store';


  export default {
    data() {
      return {
        checked: '',
        formRules,
        currentHeight: '',
        dimissionTypeList: [],
        dimissionSreasonList: [],
        formShow: false,
        billInfo: {
          pk_trnstype: {
            value: '',
            display: ''
          }
        },
        newItem: [],
        oldItem: [],
        hrOrgList: []
      }
    },
    components: {Header, Select, SelectDate, SaveButton, FieldEdit},
    mounted() {
      this.currentHeight = (document.documentElement.clientHeight - 46 - 60) + 'px'
      this.queryDimissionType()
      this.queryDimissionSreason()
      this.quertHrOrgList()
      // 判断是修改还是新增
      if (this.$route.query.pk_h) {
        this.queryBillInfo(this.$route.query.pk_h, null)
      }
    },
    created() {
    },
    watch: {},
    methods: {
      /**
       * 查询人力组织
       */
      quertHrOrgList(){
        quertHrOrgList().then(res => {
          this.hrOrgList = res.data
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
      /**
       * 查询离职原因
       */
      queryDimissionSreason() {
        queryDimissionSreason().then(res => {
          this.dimissionSreasonList = res.data
        })
      },
      /**
       * 查询离职类型
       */
      queryDimissionType() {
        Toast.loading({
          message: '加载中...',
          duration: 0
        })
        queryDimissionType().then(res => {
          this.dimissionTypeList = res.data
          Toast.clear()
        })
      },
      /**
       * 查询单据
       */
      queryBillInfo(pk_h, pk_trnstype) {
        Toast.loading({
          message: '加载中...',
          duration: 0
        })
        let params = {
          billid: pk_h,
          pk_trnstype: pk_trnstype
        }
        getDimissionBill(params).then(res => {
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
        // 离职类型
        if (selector.field == 'pk_trnstype') {
          this.queryBillInfo(null, this.billInfo.pk_trnstype.value)
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
          saveDimissionBill(params).then(res => {
            Toast.clear()
            this.$router.push({name: 'dimissionDetail', query: {pk_h: res.data.primaryKey}})
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
  // 表单校验规则
  const formRules = {
    pk_trnstype: [{
      required: true,
      message: ''
    }],
    sreason: [{
      required: true,
      message: ''
    }],
    effectdate: [{
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
