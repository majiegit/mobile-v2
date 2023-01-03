<template>
  <div>
    <BirthdayPopup/>
    <StaffZhouNianQing/>
    <GroupZhouNianQing/>
  </div>
</template>

<script>
  import BirthdayPopup from './BirthdayPopup'
  import StaffZhouNianQing from './StaffZhouNianQing'
  import GroupZhouNianQing from './GroupZhouNianQing'

  export default {
    name: 'popup',
    components: {
      BirthdayPopup, StaffZhouNianQing,GroupZhouNianQing
    },
    data() {
      return {}
    },
    created() {

    },
    mounted() {
    },
    watch: {},
    methods: {}

  }
</script>
<style lang="less" scoped>
</style>
