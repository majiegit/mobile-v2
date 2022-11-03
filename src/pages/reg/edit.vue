<template>
  <div>
    <Header title="转正申请" @clickLeft="clickLeft"></Header>
    <div>
      <!--转正类型-->
      <van-row type="flex" justify="space-around" class="regTypeRow">
        <van-col :span="11" v-for="(type,index) in regTypeList" :key="index">
          <van-button class="regType" :type="regData.regTypeValue == type.value ? 'info' : 'default' ">{{type.name}}
          </van-button>
        </van-col>
      </van-row>
      <div class="item_body">
        <!-- 基本信息-->
        <p>基本信息</p>
        <van-form input-align="right" ref="regForm">
          <van-field
            is-link
            required
            readonly
            v-model="regData.transtypename"
            @click="queryRegTransType(regData.transtypeid, 'transtypeid')"
            label="流程类型"
            placeholder="请选择流程类型"
            :rules="baseInfoRule"
          />
          <van-field
            is-link
            required
            readonly
            v-model="regData.user_name"
            label="转正人"
            placeholder="请选择转正人"
          />
          <van-field
            is-link
            required
            readonly
            v-model="regData.regularresultname"
            @click="selectRegResult(regData.regularresult, 'regularresult')"
            label="试用结果"
            placeholder="请选择试用结果"
            :rules="baseInfoRule"
          />
          <van-field
            is-link
            required
            readonly
            v-model="regData.overdate"
            @click="selectDate(regData.overdate, 'overdate','试用结束日期')"
            label="试用结束日期"
            placeholder="请选择试用结束日期"
            :rules="baseInfoRule"
          />
          <van-field
            is-link
            required
            readonly
            v-model="regData.regulardate"
            @click="selectDate(regData.regulardate, 'regulardate', '生效日期')"
            label="生效日期"
            placeholder="请选择生效日期"
            :rules="baseInfoRule"
          />
          <van-field
            v-model="regData.memo"
            re
            rows="2"
            autosize
            label="说明"
            type="textarea"
            placeholder="请填写说明"
          />

          <!-- 转正前数据-->
          <p>转正前信息</p>
          <van-field
            v-for="(item,index) in oldData" :key="item.itemKey"
            v-model="item.displayname"
            :required="item.isrequired"
            :label="item.itemName"
          />

          <!-- 转正后数据-->
          <p>转正后信息</p>
          <van-field
            v-for="(item,index) in newData" :key="item.itemKey"
            v-model="item.displayname"
            is-link
            :required="item.isrequired"
            :label="item.itemName"
            :placeholder="'请填写'+ item.itemName"
            :rules="[{required: true, message: ''}]"
            @click="selectRegNewData(item)"
          />
          <div style="margin: 16px;">
            <van-button round block type="info" @click="saveBillInfo">保 存</van-button>
          </div>
        </van-form>
      </div>
    </div>

    <!-- 下拉选择器-->
    <div>
      <Select ref="selector" @selectOk="selectOk"/>
      <SelectDate ref="selectorDate" @dateOk="dateOk"/>
    </div>
  </div>
</template>

<script>
  import Header from '@/components/Header/Index'
  import Select from '@/components/Selector/Select'
  import SelectDate from '@/components/Selector/SelectDate'
  // import {fetchData, getStorage} from 'hr-utils'
  import {Toast} from 'vant';

  export default {
    data() {
      return {
        regResultList, // 试用结果数据
        baseInfoRule, // 基本信息字段rules
        regData: {
          user_name: getStorage('userName'),
          regTypeValue: ''
        }, // 转正基本信息数据
        newData: [],    // 转正前数据
        oldData: [],   // 转正后数据
        pk_h: '',     // 转正单PK
        regTypeValue: '',  // 转正类型值
        regTypeList
      }
    },

    components: {Header, Select, SelectDate},

    created() {
      // 修改单据
      // if (this.$route.query.pk_h) {
      //   this.pk_h = this.$route.query.pk_h
      //   this.queryRegBillInfo(this.$route.query.pk_h)
      // } else {
      //   // 新增单据
      //   this.queryNewRegData()
      // }
      // this.queryMyApplication()
    },

    methods: {
      // 查询转正单据
      queryRegBillInfo(pk_h) {
        Toast.loading({
          message: '加载中...',
          duration: 0
        })
        fetchData({
          url: 'hrssc/portal/tbmquery/getBillInfo',
          method: 'post',
          param: {
            billtype: 'psnreg',
            pk_h: pk_h
          },
          mock: false,
          contentType: "application/json",
          success: res => {
            this.regData = res.data
            this.newData = res.data.data.newdata
            this.oldData = res.data.data.olddata
            Toast.clear()
          },
          error: error => {
          }
        })
      },
      // 查询新的转正单据数据
      queryNewRegData(pk_h) {
        Toast.loading({
          message: '加载中...',
          duration: 0
        })
        fetchData({
          url: 'hrssc/portal/regmng/getNewReg',
          method: 'post',
          param: {
            billtype: 'psnreg',
            pk_hi_regapply: 'new'
          },
          mock: false,
          contentType: "application/json",
          success: res => {
            this.regData.trial_type = res.data.trial_type
            this.newData = res.data.newdata
            this.oldData = res.data.olddata
            Toast.clear()
          },
          error: error => {
          }
        })
      },
      clickLeft() {
        this.$router.push({name: 'application'})
      },
      /**
       * 查询转正流程类型
       */
      queryRegTransType(value, field) {
        fetchData({
          url: 'hrssc/portal/tbmquery/queryTranstype',
          method: 'post',
          param: {
            billtype: 'psnreg'
          },
          mock: false,
          contentType: "application/json",
          success: res => {
            let selector = {
              data: res.data,
              title: '流程类型',
              field: field,
              value: value,
              text: 'transtypename',
              key: 'transtypeid'
            }
            this.$refs.selector.openSelect(selector)
          },
          error: error => {
          }
        })
      },
      /**
       * 选择试用结果
       */
      selectRegResult(val, field) {
        let selector = {
          data: this.regResultList,
          title: '试用结果',
          field: field,
          value: val,
          text: 'title',
          key: 'key'
        }
        this.$refs.selector.openSelect(selector)
      },

      /**
       * 选择器确认回调
       */
      selectOk(selector, item) {
        console.log(selector)
        console.log(item)
        if (selector.field === 'transtypeid') {
          // 流程类型
          this.$set(this.regData, selector.field, item[selector.key])
          this.$set(this.regData, 'transtypename', item[selector.text])
        } else if (selector.field === 'regularresult') {
          // 试用结果
          this.$set(this.regData, selector.field, item[selector.key])
          this.$set(this.regData, 'regularresultname', item[selector.text])
        } else {
          // 转正后字段  设置
          let index = this.getItemIndex(this.newData, selector.field);
          this.$set(this.newData[index], 'displayname', item[selector.text])
          this.$set(this.newData[index], 'value', item[selector.key])

        }
      },
      /**
       * 选择时间
       */
      selectDate(value, field, title) {
        let selector = {
          title: title,
          field: field,
          value: value,
          type: 'date'
        }
        this.$refs.selectorDate.openSelect(selector)
      },
      /**
       * 时间选择器确认回调
       * @param selector
       * @param item
       */
      dateOk(selector) {
        this.$set(this.regData, selector.field, selector.value)
      },
      /**
       * 转正后数据选择
       */
      selectRegNewData(item) {
        let pk_org, pk_dept, newseries
        if (item.itemKey === 'newpk_dept') {
          let index = this.getItemIndex(this.newData, 'newpk_org')
          let value = this.newData[index].value
          if (value) {
            pk_org = value
            console.log(pk_org)
          }
        }
        this.queryRegNewData(item, pk_org, pk_dept, newseries)
      },
      /**
       * 查询转正后参照数据
       * @param item
       * @param pk_org
       * @param pk_dept
       * @param newseries
       */
      queryRegNewData(item, pk_org, pk_dept, newseries) {
        fetchData({
          url: 'hrssc/portal/regmng/queryRefList',
          method: 'post',
          param: {
            refType: item.itemKey,
            newpk_org: pk_org,
            pk_dept: pk_dept,
            newseries: newseries
          },
          mock: false,
          contentType: "application/json",
          success: res => {
            let selector = {
              data: res.data,
              title: item.itemName,
              field: item.itemKey,
              value: item.value,
              text: 'name',
              key: 'pk'
            }
            this.$refs.selector.openSelect(selector)
          },
          error: error => {
          }
        })
      },
      /**
       * 获取符合数据 条件 的单条数据
       */
      getItemIndex(data, itemKey) {
        let index
        for (let i = 0; i < data.length; i++) {
          if (data[i].itemKey === itemKey) {
            index = i
            break
          }
        }
        return index
      },
      /**
       * 保存单据 事件
       */
      saveBillInfo() {
        this.$refs.regForm.validate().then(() => {
          this.save()
        }).catch(() => {
        })
      },
      // 调用保存接口
      save() {
        let param = {
          regMap: {
            memo: this.regData.memo,
            overdate: this.regData.overdate,
            regulardate: this.regData.regulardate,
            regularresult: this.regData.regularresult,
            trial_type: this.regData.trial_type,
            transtypeid: this.regData.transtypeid,
            synchronized: true
          },
          newdata: this.newData
        }

        Toast.loading({
          message: '保存中...',
          duration: 0
        })

        fetchData({
          url: 'hrssc/portal/regmng/savePsnReg',
          method: 'post',
          param: param,
          mock: false,
          contentType: "application/json",
          success: res => {
            this.$router.push({name: 'regDetail',query: {'pk_h': res.data.pk_hi_regapply}})
            Toast.clear()
          },
          error: error => {
            Toast.clear()
            Toast(error.message)
          }
        })
      }
    }
  }
  // 基本校验规则
  const baseInfoRule = [{required: true, message: ''}]
  // 试用结果
  const regResultList = [
    {
      key: '1',
      title: '转正'
    }, {
      key: '2',
      title: '延长试用期'
    }, {
      key: '3',
      title: '未通过试用'
    }
  ]
  // 转类型数据
  const regTypeList = [
    {
      value: 1,
      name: '入职试用'
    },
    {
      value: 2,
      name: '转岗试用'
    }
  ]
</script>

<style lang='less' scoped>
  .regTypeRow {
    background: #fff;
    padding: 2%;
  }

  .regType {
    width: 100%;
    height: 35px;
  }

  .item_body {
    width: 100%;

    p {
      font-size: 14px;
      line-height: 14px;
      padding-left: 10px;
      color: #999;
    }
  }
</style>
