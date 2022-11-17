<template>
  <div>
    <!-- 按钮区域-->
    <van-row type="flex" justify="space-around" class="button_bottom">
      <van-col :span="23">
        <van-button round block type="info" @click="saveBillInfo">保 存</van-button>
      </van-col>
    </van-row>
  </div>
</template>

<script>
  export default {
    name: "SaveButton",
    data() {
      return {
      }
    },
    created() {
    },
    methods: {
      /**
       * 保存单据
       */
      saveBillInfo() {
        this.$emit("save")
      },
    }
  }
</script>

<style scoped>

  .button_bottom {
    width: 100%;
    height: 50px;
    padding: 5px 0px;
  }
</style>
