<template>
  <div>
    <!--日期、 时间选择器-->
    <van-popup v-model="dateData.show" position="bottom">
      <van-datetime-picker
        v-model="dateData.value"
        :type="dateData.type"
        :title="dateData.title"
        @confirm="dateDataConfirm"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="dateDataCancel"
      />
    </van-popup>

    <!--下拉选择器-->
    <van-popup v-model="selectData.show" round position="bottom">
      <van-picker
        :title="selectData.title"
        show-toolbar
        :value-key="selectData.text"
        :columns="selectData.data"
        @confirm="selectDataConfirm"
        @cancel="selectDataCancel"
      />
    </van-popup>

    <!-- 级联选择器-->
    <van-popup v-model="cascade.show" position="top" :close-on-click-overlay="close_on_click_overlay">
      <!--导航栏区域-->
      <div ref="header">
        <Header :title="cascade.title" rightText="确定" @clickRight="clickRight" @clickLeft="clickLeft"/>
      </div>
      <div :style="{ 'height': currentHeight }" style="overflow-y: auto;">
        <!-- 已选择数据区域-->
        <van-cell v-if="selectTreeData.length != 0" style="color: #2479ed">
          <template #title>
            <span v-for="(tree, index) in selectTreeData" :key="index">
              <span @click="selectTreeDataClick(tree)">{{tree.title}}</span>
              <van-icon name="arrow" v-if="index !== selectTreeData.length - 1"/>
            </span>
          </template>
        </van-cell>
        <!-- 带选择数据区域-->
        <van-cell v-for="(item,index) in cascade.waitSelectData" :key="index">
          <template #title>
            <div style="width: 100%;" @click="clickWait(item)">
              <span :style="item.select ? 'color: #2479ed' : ''">{{item.title}}</span>
            </div>
          </template>
          <template #right-icon>
            <van-icon name="success" color="#2479ed" v-if="item.select" class="select_right_icon"/>
            <van-icon name="arrow" v-if="cascade.datatype == 'tree' && !item.select" class="select_right_icon"
                      @click="getCascadeData(item)"/>
          </template>
        </van-cell>
      </div>
    </van-popup>

  </div>
</template>

<script>
  import Header from '@/components/Header/Index'
  import dayjs from 'dayjs'
  import {Dialog} from 'vant'
  import {Toast} from 'vant'

  export default {
    name: "selector",
    components: {
      Header,
      [Dialog.Component.name]: Dialog.Component
    },
    data() {
      return {
        currentHeight: '',
        selectData: {
          show: false,
          field: '',
          title: '',
          datatype: '',
          key: 'value',
          text: 'title',
          value: '',
          data: []
        },
        /**
         * 以下是选择类型相关数据
         */
        minDate: new Date('1900/01/01'),
        maxDate: new Date('2300/01/01'),
        dateData: {
          show: false,
          type: '',
          title: '',
          value: '',
          field: {}
        },
        /**
         * 以下是时间类型相关数据
         */
        minDate: new Date('1900/01/01'),
        maxDate: new Date('2300/01/01'),
        dateData: {
          show: false,
          type: '',
          title: '',
          value: '',
          field: {}
        },

        /**
         * 以下是参照类型相关数据
         */
        close_on_click_overlay: false,
        cascade: {
          show: false, // 显示遮罩层
          field: '', // 修改的字段
          title: '', // 修改的标题
          data: [],   // 所有数据
          datatype: '', // 数据类型，tree 树结构 list 数据类型
          waitSelectData: [], // 待选择数据
          selectData: {}   // 已选择数据
        },
        selectTreeData: [] // 已选择树形数据
      }
    },
    methods: {
      /**
       *
       * 以下是下拉选择方法
       * */
      // 下拉选择确认方法
      selectDataConfirm(val) {
        this.selectData.value = val[this.selectData.key]
        this.selectData.show = false
        this.$emit('selectDataOk', this.selectData, val)
      },
      // 下拉选择取消方法
      selectDataCancel() {
        this.selectData.show = false
      },


      /**
       * 以下是日期类型相关方法
       */
      // 时间日期选择确认事件
      dateDataConfirm(val) {
        this.dateData.show = false
        // 处理选择时间格式
        if (this.dateData.type == 'date') {
          this.dateData.value = dayjs(val.getTime()).format("YYYY-MM-DD")
        } else if (this.dateData.type == 'datetime') {
          this.dateData.value = dayjs(val.getTime()).format("YYYY-MM-DD HH:mm:ss")
        }
        this.$emit('dateDataOk', this.dateData)
      },
      // 时间日期选择取消事件
      dateDataCancel() {
        this.dateData.show = false
      },
      /**
       * 以下是参照类型相关方法
       */
      // 级联选择完成事件
      clickRight() {
        if (this.cascade.datatype == 'tree') {
          if (this.selectTreeData.length == 0) {
            Toast({message: '请先选择' + this.cascade.field.name, className: 'toast_class'})
          } else {
            this.selectTreeData = []
            this.cascade.show = false
            this.$emit('selectOk', this.cascade)
          }
        } else if (this.cascade.datatype == 'list') {
          if (this.cascade.selectData) {
            this.cascade.show = false
            this.$emit('selectOk', this.cascade)
          } else {
            Toast({message: '请先选择' + this.cascade.field.name, className: 'toast_class'})
          }
        }
      },
      // 级联返回事件
      clickLeft() {
        this.selectTreeData = []
        this.cascade.show = false
      },
      // 选择好的数据点击
      selectTreeDataClick(item) {
        let arr = []
        this.getTreeDataClick(item, arr)
        this.selectTreeData = JSON.parse(JSON.stringify(arr))
        let data = this.getTreeData(item.tid, this.cascade.data)
        if (data.length !== 0) {
          this.cascade.waitSelectData = data
        }
      },
      // 获取下一级数据
      getCascadeData(item) {
        // 获取下一级数据 并将当前列设为已选择的数据
        let data = this.getTreeData(item.tid, this.cascade.data)
        this.cascade.waitSelectData.forEach(i => {
          this.$set(i, 'select', false)
        })
        this.$set(item, 'select', true)
        this.cascade.selectData = item
        // 判断下一级数据是否为空，不为空
        if (data.length !== 0) {
          this.cascade.waitSelectData = data
          let arr = []
          this.getTreeDataClick(item, arr)
          this.selectTreeData = JSON.parse(JSON.stringify(arr))
        } else {
          Toast('已经到底了')
        }
      },
      // 选择数据
      clickWait(item) {
        this.cascade.waitSelectData.forEach(i => {
          this.$set(i, 'select', false)
        })
        this.$set(item, 'select', true)
        this.cascade.selectData = item
        // 树类型
        if (this.cascade.datatype == 'tree') {
          let arr = []
          this.getTreeDataClick(item, arr)
          this.selectTreeData = JSON.parse(JSON.stringify(arr))
          // 数组类型点击
        }
        // else if (this.cascade.datatype == 'list') {
        //   this.selectTreeData = []
        //   this.selectTreeData.push(item)
        // }
      },
      // 获取待选择数据
      getWaitSelectData(param) {
        if (param.datatype == 'list') {
          // 数组数据
          return param.data
        } else if (param.datatype == 'tree') {
          // 树形数据
          return this.getTreeData(undefined, param.data)
        }
      },
      // 获取树形数据
      getTreeData(pid, data) {
        return data.filter(item => item.pid == pid)
      },
      // 获取点击树形数据
      getTreeDataClick(item, arr) {
        if (item.pid) {
          let data = JSON.parse(JSON.stringify(this.cascade.data))
          for (var i = 0; i < data.length; i++) {
            if (item.pid === data[i].tid) {
              this.getTreeDataClick(data[i], arr)
            }
          }
        }
        arr.push(item)
      },
      /**
       * 以下是调用组件值
       */
      openComponent(param) {
        console.log(param)
        let fieldtype = param.field.datatype
        /**
         * 参照类型组件初始化
         * */
        if ([5].includes(fieldtype)) {
          // 参照类型
          this.cascade = {
            show: true,
            field: param.field,
            title: '请选择' + param.field.name,
            data: JSON.parse(JSON.stringify(param.data)),
            waitSelectData: this.getWaitSelectData(param),
            datatype: param.datatype,
            infoDataForm: param.infoDataForm
          }
          // 初始化已选择数据
          if (this.cascade.datatype == 'tree') {
            let tid = this.cascade.infoDataForm[this.cascade.field.code]
            console.log(tid)
            if (tid) {
              let selecd = this.cascade.data.find(item => item.tid == tid)
              this.clickWait(selecd)
            }
          }
        }
        /**
         * 日期类型组件初始化
         * */
        if ([20, 3, 8].includes(fieldtype)) {
          this.dateData = {
            show: true,
            type: param.type,
            field: param.field,
            title: '请选择' + param.field.name,
            value: param.value ? new Date(param.value) : new Date()
          }
        }
        /**
         * 下拉类型组件初始化
         * */
        if ([6].includes(fieldtype)) {
          this.selectData = {
            show: true,
            field: param.field,
            title: '请选择' + param.field.name,
            datatype: param.datatype,
            key: param.key,
            text: param.text,
            value: param.value ? param.value : '',
            data: param.data
          }
        }
      }
    },
    mounted() {
      this.currentHeight = (document.documentElement.clientHeight - 46) + 'px'
    },
    created() {
    }
  }
</script>

<style scoped>
  .select_right_icon {
    padding: 5px 0px;
  }

  .toast_class {
    z-index: 10000 !important;
  }
</style>
