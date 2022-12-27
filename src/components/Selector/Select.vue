<template>
  <div>
    <!-- 通用选择器-->
    <van-popup v-model="selector.show" round position="bottom">
      <van-picker
        :value="selector.value"
        :title="selector.title"
        show-toolbar
        :default-index="selector.defaultIndex"
        :value-key="selector.text"
        :columns="selector.data"
        @confirm="selectorConfirm"
        @cancel="selectorCancel"
      />
    </van-popup>

    <!-- 级联选择器-->
    <van-popup v-model="cascade.show" position="top" :close-on-click-overlay="close_on_click_overlay">
      <!--导航栏区域-->
      <div ref="header">
        <Header :title="cascade.title"  rightText="确定" @clickRight="clickRight" @clickLeft="clickLeft"/>
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
        <div v-if="cascade.waitSelectData.length !=0">
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
        <div v-else>
          <van-empty description="暂无可选数据"/>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  import {Toast} from 'vant';
  import Header from '@/components/Header/Index'
  export default {
    name: "Select",
    components:{Header},
    data() {
      return {
        currentHeight: '',
        selector: {    // 选择器对象
          defaultIndex:  0, // 默认选择索引
          show: false,  // 是否显示选择器
          title: '',  // 选择器标题
          data: [],   // 选择器待选数据
          text: 'title', // 选择器中文字段
          value: '',  // 选择器 默认值
          field: '',  // 选择器 字段
          key: ''  // 选择器 字段
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
    mounted(){
      this.currentHeight = (document.documentElement.clientHeight - 46) + 'px'
    },
    methods: {
      // 下拉选择确认方法
      selectorConfirm(item) {
        this.selector.show = false
        this.$emit('selectOk', this.selector, item)
      },
      // 下拉选择取消方法
      selectorCancel() {
        this.selector.show = false
      },
      // 启动选择器
      openSelect(selector) {
        this.selector.show = true
        this.selector.data = selector.data
        this.selector.title = selector.title
        this.selector.field = selector.field
        this.selector.text = selector.text
        this.selector.key = selector.key
        this.selector.defaultIndex = this.getIndex(selector.data,selector.value, selector.key)
      },
      // 获取默认值对应的数据索引,设置选项为默认选中数据
      getIndex(data, value, key){
        let index = 0
        for (let i = 0; i < data.length; i++) {
          if(data[i][key] === value){
            index = i
            break
          }
        }
        return  index
      },
      /**
       * 以下是参照类型相关方法
       */
      // 级联选择完成事件
      clickRight() {
        if (this.cascade.datatype == 'tree') {
          if (this.selectTreeData.length == 0) {
            Toast({message: '请先选择' + this.cascade.field.itemname, className: 'toast_class'})
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
            Toast({message: '请先选择' + this.cascade.field.itemname, className: 'toast_class'})
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
        let fieldtype = param.field.data_type
        /**
         * 参照类型组件初始化
         * */
        if ([5].includes(fieldtype)) {
          // 参照类型
          this.cascade = {
            show: true,
            field: param.field,
            title: '请选择' + param.field.itemname,
            data: JSON.parse(JSON.stringify(param.data)),
            waitSelectData: this.getWaitSelectData(param),
            datatype: param.datatype,
            infoDataForm: param.infoDataForm
          }
          // 初始化已选择数据
          if (this.cascade.datatype == 'tree') {
            let tid = this.cascade.infoDataForm[this.cascade.field.itemkey].value
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
            title: '请选择' + param.field.itemname,
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
            title: '请选择' + param.field.itemname,
            datatype: param.datatype,
            key: param.key,
            text: param.text,
            value: param.value ? param.value : '',
            data: param.data
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
