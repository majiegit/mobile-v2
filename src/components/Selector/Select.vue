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
  </div>
</template>

<script>
  export default {
    name: "Select",
    data() {
      return {
        selector: {    // 选择器对象
          defaultIndex:  0, // 默认选择索引
          show: false,  // 是否显示选择器
          title: '',  // 选择器标题
          data: [],   // 选择器待选数据
          text: 'title', // 选择器中文字段
          value: '',  // 选择器 默认值
          field: '',  // 选择器 字段
          key: ''  // 选择器 字段
        }
      }
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
    }
  }
</script>

<style scoped>

</style>
