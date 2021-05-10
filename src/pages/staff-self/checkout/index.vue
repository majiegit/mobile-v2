<template>
  <div id="checkIndex">
    <mt-tabbar v-model="selected" fixed>
      <mt-tab-item id="1">
        <i class="hrfont hr-sign" style="display: block;padding-bottom: 0.05rem;font-size: 26px;"></i>
        签到
      </mt-tab-item>
      <mt-tab-item id="2">
        <i class="hrfont hr-calendar02" style="display: block;padding-bottom: 0.05rem;font-size: 26px;"></i>
        我的外勤
      </mt-tab-item>
      <mt-tab-item id="3">
        <i class="hrfont hr-examination-and-approval" style="display: block;padding-bottom: 0.05rem;font-size: 26px;"></i>
        外勤审批
      </mt-tab-item>
    </mt-tabbar>

    <div class="page-wrap" style="height: 92%">
      <mt-tab-container class="page-tabbar-container" v-model="selected">
        <mt-tab-container-item id="1">
          <checkout></checkout>
        </mt-tab-container-item>
        <mt-tab-container-item id="2">
          <myField></myField>
        </mt-tab-container-item>
        <mt-tab-container-item id="3">
          <fieldApprove></fieldApprove>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
  </div>
</template>

<script>
  import checkout from './components/checkout'
  import myField from './components/myField'
  import fieldApprove from './components/fieldApprove'

  export default {
    data() {
      return {
        selected: null
      }
    },
    created() {
      this.setSelected()
    },
    mounted() {
      this.setHeight()
    },
    methods: {
      setSelected() {
        let select = this.$route.query.select
        if (select == undefined) {
          this.selected = '1'
        } else {
          this.selected = select
        }
      },
      setHeight() {
        let el = document.getElementsByClassName("mint-tab-container-wrap")
        el[0].style.height = '100%'
      }
    },
    components: {
      checkout,
      myField,
      fieldApprove
    }
  }

</script>

<style scoped>
  #checkIndex .mint-tab-container {
    height: 100%;
  }
  #checkIndex .mint-tabbar.is-fixed {
    border-top: 1px solid #ececec;
    height: 8%;
    min-height: 47px;
  }
  #checkIndex .mint-tab-item.is-selected {
    color: #26a2ff;
  }
  #checkIndex .mint-tab-item {
    background: white;
    color: #999999;
  }
  #checkIndex .mint-tabbar > .mint-tab-item.is-selected {
    background: white;
  }
</style>
