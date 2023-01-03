<template>
  <div>
    <BirthdayPopup/>
    <BirthdayPopup2/>
  </div>
</template>

<script>
  import BirthdayPopup from './BirthdayPopup'
  import BirthdayPopup2 from './BirthdayPopup2'

  export default {
    name: 'popup',
    components: {
      BirthdayPopup, BirthdayPopup2
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
