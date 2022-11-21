<template>
  <div>
    <Header title="请假申请" @clickLeft="clickLeft"></Header>
    <div class="item_body" :style="{'height': currentHeight}">
      <div class="item_body">
<!--        <p class="item_body_title">请假明细</p>-->
        <van-form input-align="right" ref="billForm">
          <van-field
            is-link
            required
            name="leavetype"
            :rules="formRules.leavetype"
            v-model="billInfo.leavetype"
            @click="selectLeaveType('leavetype','请选择请假类型')"
            label="请假类型"
            placeholder="请选择请假类型"
          />
          <van-field v-if="billInfo.leavetype" v-model="value" :label="billInfo.leavetype + '额度剩余'" />
          <van-field
            v-if="dateShow"
            is-link
            required
            name="leavebegintime"
            :rules="formRules.leavebegindate"
            v-model="billInfo.leavebegindate"
            @click="selectDate(billInfo.leavebegindate,'leavebegindate','请选择开始日期', 'date')"
            label="开始日期"
            placeholder="请选择开始时间"
          />
          <van-field
            v-if="timeShow"
            is-link
            required
            name="leavebegintime"
            :rules="formRules.leavebegintime"
            v-model="billInfo.leavebegintime"
            @click="selectDate(billInfo.leavebegintime,'leavebegintime','请选择开始时间', 'datetime')"
            label="开始时间"
            placeholder="请选择开始时间"
          />
          <van-field
            v-if="longTimeShow"
            clickable
            :value="billInfo.start_day_type == 1 ? '上午': (billInfo.start_day_type == 2 ? '下午': '')"
            label="开始时间"
            placeholder="点击选择开始时间"
            @click="selectLongTime(billInfo.start_day_type, '选择上下午', 'start_day_type')"
          />
          <van-field
            v-if="dateShow"
            is-link
            required
            name="leavebegindate"
            :rules="formRules.leavebegindate"
            v-model="billInfo.leavebegindate"
            @click="selectDate(billInfo.leavebegindate,'leavebegindate','请选择结束日期', 'date')"
            label="结束日期"
            placeholder="请选择结束时间"
          />
          <van-field
            v-if="timeShow"
            is-link
            required
            name="leaveendtime"
            :rules="formRules.leaveendtime"
            v-model="billInfo.leaveendtime"
            @click="selectDate(billInfo.leaveendtime,'leaveendtime','请选择结束时间', 'datetime')"
            label="结束时间"
            placeholder="请选择结束时间"
          />
          <van-field
            v-if="longTimeShow"
            clickable
            :value="billInfo.end_day_type == 1 ? '上午': (billInfo.end_day_type == 2 ? '下午': '')"
            label="结束时间"
            placeholder="点击选择结束时间"
            @click="selectLongTime(billInfo.end_day_type, '选择上下午', 'end_day_type')"
          />
          <van-field label="请假时长" :value="billInfo.length"             readonly/>
          <van-field
            v-model="billInfo.mark"
            rows="2"
            autosize
            label="请假说明"
            type="textarea"
            maxlength="50"
            placeholder="请输入请假说明"
            show-word-limit
          />
          <uploadButtom @uoload="uploadImg"></uploadButtom>
          <!--    附件上传      -->
        </van-form>
      </div>
      <SaveButton @save="saveBillInfo"></SaveButton>
      <!-- 日期选择器-->
      <SelectDate ref="selectorDate" @dateOk="dateOk"/>
      <!--   下拉选择器   -->
      <Select ref="selector" @selectOk="selectOk"/>
      <Select ref="selectorlong" @selectOk="selectOk2"/>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header/Index'
import Select from '@/components/Selector/Select'
import SelectDate from '@/components/Selector/SelectDate'
import SaveButton from "../../components/Button/SaveButton";
import uploadButtom from '@/components/Enclosure/uploadButtom'
import { savebillInfo } from '@/api/leave'
import {getFileList, uploadFile} from '@/api/filemanager'
import {Toast} from "vant";

const formRules = {
  leavetype: [{
    required: true,
    message: ''
  }],
  leavebegintime :[{
    required: true,
    message: ''
  }],
  leaveendtime :[{
    required: true,
    message: ''
  }],
  leavebegindate :[{
    required: true,
    message: ''
  }],
  leaveenddate :[{
    required: true,
    message: ''
  }],

}

export default {
  name: "edit",
  data() {
    return {
      formRules,
      currentHeight: '',
      value: '2天',
      dateShow: false, // 日期类型
      timeShow: true, // 时间类型
      longTimeShow: false, // 时间类型(上下午)
      initDate: new Date(),
      billInfo: {},
      leaveupload: [],
      uoloadList: []
    }
  },
  mounted() {
    this.currentHeight = (document.documentElement.clientHeight - 46 - 60) + 'px'
  },
  components: {Header, Select, SelectDate, uploadButtom, SaveButton},
  created() {
  },
  methods: {
    /**
     * 数据初始化
     */
    init(){
      this.dateShow = false
      this.timeShow = false
      this.longTimeShow = false
    },
    /**
     * 确认请假类型判断日期时间显示
     * @param
     */
    chooseleaveType(value) {
      this.init()
      let leaveMap = [
        {
          leavetype: '事假',
          min: '1',
          type: '1'
        },
        {
          leavetype: '婚假',
          min: '2',
          type: '2'
        },
        {
          leavetype: '病假',
          min: '1',
          type: '2'
        }
      ]
      this.mapList = []
      let obj = leaveMap.filter(res => res.leavetype === value)[0]
      if (obj.type === '2' && obj.min === '1') {
        this.dateShow = true
        this.longTimeShow = true
        this.mapList.push('begindate', 'enddate','start_day_type', 'end_day_type')
      } else if (obj.type === '2' && obj.min === '2') {
        this.dateShow = true
        this.mapList.push('begindate', 'enddate')
      } else if (obj.type === '1' && obj.min === '1') {
        this.timeShow = true
        this.mapList.push('begintime', 'endtime')
      }
      console.log('obj', this.mapList)
    },
    /**
     * 上下午确认回调
     * @param selector
     * @param item
     */
    selectOk2(selector, item) {
      this.$set(this.billInfo, selector.field, item.value)
    },
    /**
     *  选择上下午
     */
    selectLongTime(data, title, filed) {
      let datas =[
        {
          text: '上午',
          value: '1'
        },
        {
          text: '下午',
          value: '2'
        }
      ]
      let selector = {
        data: datas,
        title: title,
        field: filed,
        text: 'text',
        key: 'value',
        value: '1'
      }
      this.$refs.selectorlong.openSelect(selector)
    },
    /**
     * 请假类型确认回调
     * @param selector
     * @param item
     */
    selectOk(selector,item) {
      this.$set(this.billInfo, selector.field, item.text)
      // console.log(this.billInfo)
      this.chooseleaveType(this.billInfo.leavetype)
    },
    /**
     *  选择请假类型
     */
    selectLeaveType(data, title, field, text, key) {
      let datas =[
        {
          text: '事假',
          value: '1'
        },
        {
          text: '婚假',
          value: '2'
        },
        {
          text: '病假',
          value: '2'
        }
      ]
      let selector = {
        data: datas,
        title: title,
        field: 'leavetype',
        text: 'text',
        key: 'value',
        value: '2'
      }
      this.$refs.selector.openSelect(selector)
    },
    /**
     * 选择请假时间
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
      this.$set(this.billInfo, selector.field, selector.value)
    },
    // 校验值是否存在
    checkValue() {
      console.log(this.mapList)
      for (let i = 0; i < this.mapList.length; i++) {
        if (!this.billInfo[this.mapList[i]]) {
          return
        }
      }
      this.billInfo.length = '2小时 假'
      console.log('计算时长')
    },
    // 保存
    saveBillInfo() {
      this.$refs.billForm.validate(Object.keys(this.formRules)).then(() => {
        Toast.loading({
          message: '保存中...',
          duration: 0
        })
      })
      // savebillInfo(param).then(res => {
      //   this.uploadFile(res.data.pk_h)
      // })
      // this.$router.push({name: 'leaveDetail'})
    },
    // 实现上传文件
    uploadFile(pk_h) {
      for (let i = 0; i < this.leaveupload.length; i++) {
        let params = new FormData()
        console.log(this.leaveupload[i].file.name)
        params.append("filePath", pk_h)
        params.append("fileName", this.leaveupload[i].file.name)
        params.append("file", this.leaveupload[i].file)
        console.log(params)
        uploadFile(params).then(res => {
        console.log('res', res)
        Toast.success(res.message)
        this.queryFileList(this.filePath, false)
        })
      }
    },
    // 附件上传回调
    uploadImg(file) {
      this.leaveupload.push(file)
    },
    /**
     * 获取附件列表
     */
    queryFileList(filePath, isToast) {
      if (isToast) {
        Toast.loading({
          message: '加载中...',
          duration: 0
        })
      }
      let params = {
        filePath: filePath
      }
      getFileList(params).then(res => {
        this.fileList = res.data
        if (isToast) {
          Toast.clear()
        }
      })
    },
    clickLeft() {
      this.$router.push({name: 'application'})
    },
  }
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
