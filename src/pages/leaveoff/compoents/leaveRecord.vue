<template>
  <div class="leaveoff_top">
    <van-collapse is-link="false" v-model="activeNames" v-for="(item,index) in laeveData" :key="index">
      <van-collapse-item :name="index">
        <template #title>
          <div>
            <van-icon name="label-o"/>
            {{ item.applydate}} {{ item.leavetypename }}
          </div>
        </template>
        <div @click="toDetail(item)">
          <van-cell title="开始日期：" :value="item.leavebegintime"/>
          <van-cell title="结束日期：" :value="item.leaveendtime"/>
          <van-cell title="请假时长：" :value="item.leaveday"/>
          <van-cell title="请假说明：" :value="item.remark"/>
        </div>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>

export default {
  props: {
    laeveData: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      activeNames: [0, 1],
    }
  },
  mounted() {
  },
  created() {
  },
  methods: {
    /**
     * 将数据传给父组件
     * @param detail
     */
    toDetail(detail) {
      this.$emit('getDetail', detail, false)
    }
  }
}
</script>

<style lang='less'>
.leaveoff_top .van-collapse .van-collapse-item__wrapper .van-collapse-item__content {
  padding: 12px 4px;
  color: #888888;
  font-size: 17px;
  line-height: 1.5;
  background-color: #fff;
}

.leaveoff_top .van-collapse .van-collapse-item__wrapper .van-collapse-item__content .van-cell {
  color: #888888;
  font-size: 18px;
}

.leaveoff_top .van-collapse .van-collapse-item .van-collapse-item__title .van-cell__title, .van-cell__left-icon {
  font-size: 17px;
  color: #0eaef5;
}
</style>
