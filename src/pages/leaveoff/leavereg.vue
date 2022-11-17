<template>
  <div>
    <Header title="请假记录选择" @clickLeft="clickLeft"></Header>
    <div>
      <van-collapse v-model="activeNames">
        <van-collapse-item title="请假记录" name="1">
          <van-cell-group v-for="(item,index) in billInfo" :key="index">
            <van-cell title="请假类别：" :value="item.leavetypename"/>
            <van-cell title="申请人：" :value="item.psndocname"/>
            <van-cell title="申请时间：" :value="item.applydate"/>
            <van-cell title="开始日期：" :value="item.begintime"/>
            <van-cell title="结束日期：" :value="item.endtime"/>
<!--            <van-cell v-if="billInfo.start_day_type" title="开始时间：" :value="LastAfter[billInfo.start_day_type]"/>-->
<!--            <van-cell v-if="billInfo.end_day_type" title="结婚时间：" :value="LastAfter[billInfo.end_day_type]"/>-->
            <van-cell title="请假时长：" :value="item.leaveday"/>
          </van-cell-group>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header/Index'
import {userInfoPkPsndoc} from '@/utils/storageUtils'
import {getBillInfo} from '@/api/my-apply'
import {Toast} from "vant";

export default {
  data() {
    return {
      activeNames: ['1'],
      billInfo: {}
    }
  },
  mounted() {
  },
  components: {Header},
  created() {
    this.queryBillInfo()
  },
  methods: {
    /**
     * 查询单据
     */
    queryBillInfo(pk_h, billtype) {
      Toast.loading({
        message: '加载中...',
        duration: 0
      })
      let params = {
        billid: '0001A910000000001MB6',
        billtype: 'leave'
      }
      getBillInfo(params).then(res => {
        this.billInfo = res.data
        Toast.clear()
      })
    },
    clickLeft() {
      this.$router.push({name: 'application'})
    },
  }
}
</script>

<style lang='less'>
// 所有考勤统一样式
.item_body {
  width: 100%;
  overflow-y: auto;

  &_title {
    font-size: 14px;
    line-height: 14px;
    padding-left: 10px;
    color: #999;
  }
}
</style>
