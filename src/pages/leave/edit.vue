<template>
  <div>
    <Header title="请假申请" @clickLeft="clickLeft"></Header>
    <div class="item_body" :style="{'height': currentHeight}">
      <div class="item_body">
        <van-form input-align="right" ref="regForm">
          <!--   请假类型     -->
          <van-field
            is-link
            required
            readonly
            v-model="leaveData.leavetype"
            @click="selectLeaveType('leavetype','请选择请假类型')"
            label="请假类型"
            placeholder="请选择请假类型"
          />
<!--          <label> 年假 剩余<font>小时</font></label>-->
          <van-field v-if="leaveData.leavetype" v-model="value" :label="leaveData.leavetype + '额度剩余'" />
          <p class="item_body_title">请假明细</p>
          <van-field
            v-if="dateShow"
            is-link
            required
            readonly
            v-model="leaveData.begindate"
            @click="selectDate(leaveData.begindate,'begindate','请选择开始日期', 'date')"
            label="开始日期"
            placeholder="请选择开始时间"
          />
          <van-field
            v-if="timeShow"
            is-link
            required
            readonly
            v-model="leaveData.begintime"
            @click="selectDate(leaveData.begintime,'begintime','请选择开始时间', 'datetime')"
            label="开始时间"
            placeholder="请选择开始时间"
          />
          <van-field
            v-if="longTimeShow"
            readonly
            clickable
            right-icon="arrow"
            :value="leaveData.start_day_type == 1 ? '上午': (leaveData.start_day_type == 2 ? '下午': '')"
            label="开始时间"
            placeholder="点击选择开始时间"
            @click="selectLongTime(leaveData.start_day_type, '选择上下午', 'start_day_type')"
          />
          <van-field
            v-if="dateShow"
            is-link
            required
            readonly
            v-model="leaveData.enddate"
            @click="selectDate(leaveData.enddate,'enddate','请选择结束日期', 'date')"
            label="结束日期"
            placeholder="请选择结束时间"
          />
          <van-field
            v-if="timeShow"
            is-link
            required
            readonly
            v-model="leaveData.endtime"
            @click="selectDate(leaveData.endtime,'endtime','请选择结束时间', 'datetime')"
            label="结束时间"
            placeholder="请选择结束时间"
          />
          <van-field
            v-if="longTimeShow"
            readonly
            clickable
            right-icon="arrow"
            :value="leaveData.end_day_type == 1 ? '上午': (leaveData.end_day_type == 2 ? '下午': '')"
            label="结束时间"
            placeholder="点击选择结束时间"
            @click="selectLongTime(leaveData.end_day_type, '选择上下午', 'end_day_type')"
          />
          <van-field label="请假时长" :value="leaveData.length" disabled/>
          <van-field
            v-model="leaveData.mark"
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
          <div style="position: fixed; width: 90%;bottom: 20px; height: 50px; padding: 5px 5%;">
            <van-button round block type="info" @click="saveBillInfo">保 存</van-button>
          </div>
        </van-form>
      </div>
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
import uploadButtom from '@/components/Enclosure/uploadButtom'
import { savebillInfo } from '@/api/leave'
import {getFileList, uploadFile} from '@/api/filemanager'
import {Toast} from "vant";


export default {
  name: "edit",
  data() {
    return {
      currentHeight: '',
      value: '2天',
      dateShow: false, // 日期类型
      timeShow: true, // 时间类型
      longTimeShow: false, // 时间类型(上下午)
      initDate: new Date(),
      leaveData: {},
      leaveupload: [],
      uoloadList: []
    }
  },
  mounted() {
    this.currentHeight = (document.documentElement.clientHeight - 46 - 60) + 'px'
  },
  components: {Header, Select, SelectDate, uploadButtom},
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
      this.$set(this.leaveData, selector.field, item.value)
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
      this.$set(this.leaveData, selector.field, item.text)
      // console.log(this.leaveData)
      this.chooseleaveType(this.leaveData.leavetype)
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
      // console.log(selector)
      this.$set(this.leaveData, selector.field, selector.value)
      this.checkValue()
    },
    // 校验值是否存在
    checkValue() {
      console.log(this.mapList)
      for (let i = 0; i < this.mapList.length; i++) {
        if (!this.leaveData[this.mapList[i]]) {
          return
        }
      }
      this.leaveData.length = '2小时 假'
      console.log('计算时长')
    },
    // 保存
    saveBillInfo() {
      let param = JSON.parse(JSON.stringify( this.leaveData ))
      // return
      if(this.leaveData.leavetype == undefined) {
        Toast('请选择请假类型')
        return
      }
      // else if (param.leavetype === '婚假' && !filedata) {
      //   Toast(this.leaveData.leavetype + '必须上传附件')
      //   return
      // }
      this.uploadFile()
      return;
      savebillInfo(param).then(res => {
        this.uploadFile(res.data.pk_h)
      })
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
