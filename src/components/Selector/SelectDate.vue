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
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  export default {
    name: "SelectDate",
    data() {
      return {
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
          field: ''
        },
      }
    },
    methods: {
      // 时间日期选择确认事件
      dateDataConfirm(val) {
        this.dateData.show = false
        // 处理选择时间格式
        if (this.dateData.type == 'date') {
          this.dateData.value = dayjs(val.getTime()).format("YYYY-MM-DD")
        } else if (this.dateData.type == 'datetime') {
          this.dateData.value = dayjs(val.getTime()).format("YYYY-MM-DD HH:mm:ss")
        }
        this.$emit('dateOk', this.dateData)
      },
      // 时间日期选择取消事件
      dateDataCancel() {
        this.dateData.show = false
      },
      // 启动选择器
      openSelect(selector) {
        this.dateData = {
          show: true,
          type: selector.type,
          field: selector.field,
          title: selector.title,
          value: selector.value ? new Date(selector.value) : new Date()
        }
      }
    }
  }
</script>

<style scoped>

</style>
