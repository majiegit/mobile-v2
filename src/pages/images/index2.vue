<template>
  <div>
    <div class="myheader">
      <header>
        <hr-header
          title='数据可视化'
          v-on:lcallBack='goApp'
        >
        </hr-header>
      </header>
    </div>
    <div style="width: 100%; height: 100%; overflow-x: auto">
      <img src="../../../static/img/pages/images/2.png" style="width: 100%; zoom:1;"/>
    </div>
  </div>
</template>

<script>
  import { HrHeader } from 'hr-ui'
  export default {
    components: {
      HrHeader
    },
    data: function () {
      return {
       
      }
    },
    methods: {
      goApp() {
        this.$router.push('application')
      }
    },
    updated () {
    },
    created () {
    },
    mounted () {
    }
  }
</script>
<style>
  .myheader{
    height: .88rem;
    line-height: .88rem;
  }
</style>
