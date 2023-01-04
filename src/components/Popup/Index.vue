<template>
  <div>
    <BirthdayPopup/>
    <StaffZhouNianQing/>
    <GroupZhouNianQing/>
    <yeJian/>
  </div>
</template>

<script>
  import BirthdayPopup from './BirthdayPopup'
  import StaffZhouNianQing from './StaffZhouNianQing'
  import GroupZhouNianQing from './GroupZhouNianQing'
  import yeJian from './yeJian'

  export default {
    name: 'popup',
    components: {
      BirthdayPopup, StaffZhouNianQing,GroupZhouNianQing, yeJian
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
