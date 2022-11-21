<template>
  <div>
    <Header title="签卡申请" @clickLeft="clickLeft"></Header>
    <div>
      <div class="item_body">

      </div>
    </div>
    <!--    保存按钮-->
    <SaveButton @save="saveBillInfo"></SaveButton>
    <!--    日期选择-->
    <SelectDate ref="selectorDate" @select="dateOk"></SelectDate>
  </div>
</template>

<script>
import Header from '@/components/Header/Index'
import Select from '@/components/Selector/Select'
import SelectDate from '@/components/Selector/SelectDate'
import SaveButton from "../../components/Button/SaveButton";

export default {
  data() {
    return {
      billInfo: {}
    }
  },
  components: {Header, Select, SelectDate, SaveButton},
  created() {
  },
  methods: {
    clickLeft() {
      this.$router.push({name: 'application'})
    },
    /**
     *
     * @param field
     * @param item
     */
    dateOk(field, item) {

    },
    //
    saveBillInfo() {
    }
  }
}
</script>

<style lang='less' scoped>
</style>
