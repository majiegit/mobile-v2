<template>
  <div>
    <hr-header
        :title=title
        v-on:lcallBack='goApp'
        >
    </hr-header>
  </div>
</template>
<script>
import { HrHeader } from 'hr-ui'
  export default {
    name: 'test',
    // 数据驱动的数据源
    data (){
      return {
        title: 'hello world',
        url: ''
      }
    },
    components: { HrHeader },
    
    // 实例创建的时候调用，一般在此处请求页面初始化时需要获取的后台数据
    created(){
    },

    // 组件挂载后调用
    mounted(){
    },

    methods : {
      // 自定义事件
      goApp() {
        this.$router.go(-1)
      },
    }
  }
</script>

<style lang='less' scoped>

</style>