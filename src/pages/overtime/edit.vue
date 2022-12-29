<template>
  <div>
    <Header title="加班申请" @clickLeft="clickLeft"></Header>
    <div class="item_body" :style="{'height': currentHeight}">
      <van-form input-align="right" ref="billForm" colon>
        <van-field
          is-link
          readonly
          required
          :rules="formRules.overtimebegintime"
          name="overtimebegintime"
          v-model="billInfo.overtimebegintime"
          @click="selectDate(billInfo.overtimebegintime,'overtimebegintime','开始时间', 'datetime')"
          label="开始时间"
          placeholder="请选择开始时间"
        />
        <van-field
          is-link
          required
          readonly
          :rules="formRules.overtimeendtime"
          name="overtimeendtime"
          v-model="billInfo.overtimeendtime"
          @click="selectDate(billInfo.overtimeendtime,'overtimeendtime','结束时间', 'datetime')"
          label="结束时间"
          placeholder="请选择结束时间"
        />
        <van-field label="通宵加班" v-if="!isSame">
          <van-switch v-model="billInfo.isallnight" slot="right-icon" size="20" active-value="Y" inactive-value="N"/>
        </van-field>
        <van-field
          v-model="billInfo.remark"
          rows="2"
          autosize
          label="说明"
          type="textarea"
          placeholder="请填写加班说明"
        />
        <van-field label="加班时长" :value="billInfo.otapplylength ? billInfo.otapplylength + ' 小时': billInfo.otapplylength"
                   readonly/>
      </van-form>
    </div>
    <!--保存按钮-->
    <SaveButton @save="saveBillInfo"/>
    <!-- 日期选择器-->
    <SelectDate ref="selectorDate" @dateOk="dateOk"/>
  </div>
</template>

<script>
  import Header from '@/components/Header/Index'
  import Select from '@/components/Selector/Select'
  import SelectDate from '@/components/Selector/SelectDate'
  import SaveButton from '@/components/Button/SaveButton'
  import {getOvertimeBill, saveOvertimeBill, queryOvertimeLength} from '@/api/overtime'
  import {Toast} from 'vant';
  import {USERINFO} from '@/utils/mutation-types'
  import storage from 'store';
  import {beginGtEndTime, beginEndSameDay} from '@/utils/DateTimeUtils'

  export default {
    data() {
      return {
        formRules,
        currentHeight: '',
        isSame: true, // 开始结束时间是否同一天
        billInfo: {
          isallnight: 'N',
          billmaker: storage.get(USERINFO).pk_psndoc,
          pk_psndoc: storage.get(USERINFO).pk_psndoc,
          otapplylength: ''
        }
      }
    },
    components: {Header, Select, SelectDate, SaveButton},
    mounted() {
      this.currentHeight = (document.documentElement.clientHeight - 46 - 54) + 'px'
      // 判断是修改还是新增
      if (this.$route.query.pk_h) {
        this.queryBillInfo(this.$route.query.pk_h)
      }
    },
    created() {
    },
    watch: {
      // 开始时间
      "billInfo.overtimebegintime"() {
        this.beginGtEndTime()
      },
      // 结束时间
      "billInfo.overtimeendtime"() {
        this.beginGtEndTime()
      }
    },
    methods: {
      /**
       * 计算加班时长
       */
      getOvertimeLength() {
        let params = {
          overtimebegintime: this.billInfo.overtimebegintime,
          overtimeendtime: this.billInfo.overtimeendtime,
          isallnight: this.billInfo.isallnight
        }
        Toast.loading({
          message: '计算加班时长中...',
          duration: 0
        })
        queryOvertimeLength(params).then(res => {
          Toast.clear()
          this.billInfo.otapplylength = String(res.data)
        })
      },
      /**
       * 校验开始结束时间
       */
      beginGtEndTime() {
        if (this.billInfo.overtimebegintime && this.billInfo.overtimeendtime) {
          // 校验开始时间是否 > 结束时间
          let isGt = beginGtEndTime(this.billInfo.overtimebegintime, this.billInfo.overtimeendtime)
          if (isGt) {
            Toast("开始时间不能大于结束时间")
            this.billInfo.overtimeendtime = ''
            return
          }
          // 校验开始时间结束时间是否同一天
          this.isSame = beginEndSameDay(this.billInfo.overtimebegintime, this.billInfo.overtimeendtime)
          this.getOvertimeLength()
        }
      },
      /**
       * 查询单据
       */
      queryBillInfo(pk_h) {
        Toast.loading({
          message: '加载中...',
          duration: 0
        })
        let params = {
          billid: pk_h
        }
        getOvertimeBill(params).then(res => {
          this.billInfo = res.data
          Toast.clear()
        })
      },
      /**
       * 时间选择器确认回调
       * @param selector
       * @param item
       */
      dateOk(selector) {
        console.log(selector)
        this.$set(this.billInfo, selector.field, selector.value)
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
        this.$refs.billForm.validate(Object.keys(formRules)).then(() => {
          // 校验保存数据
          if (this.billInfo.otapplylength == '0' || this.billInfo.otapplylength == '') {
            Toast("加班时长不能为0")
            return
          }
          Toast.loading({
            message: '保存中...',
            duration: 0
          })
          saveOvertimeBill(this.billInfo).then(res => {
            Toast.clear()
            this.$router.push({name: 'overtimeDetail', query: {pk_h: res.data.pk_overtime}})
          })
        })
      }
    }
  }
  // 表单校验规则
  const formRules = {
    overtimebegintime: [{
      required: true,
      message: ''
    }],
    overtimeendtime: [{
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
