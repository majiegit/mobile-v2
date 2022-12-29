<template>
  <div class="leaveoff_top">
    <div v-if="leaveList.length == 0">
      <van-empty description="暂无待销假数据"/>
    </div>
    <van-collapse is-link="false" v-model="activeNames" v-for="(item,index) in leaveList" :key="index">
      <van-collapse-item :name="index">
        <template #title>
          <div>
            <van-icon name="label-o"/>
            {{ item.applydate}} &nbsp; {{ item.leavetypename }}
          </div>
        </template>
        <div @click="toDetail(item)">
          <van-cell :title="'开始' + (item.minunit == '2' ? '日期': '时间')"
                    :value="(item.minunit == '2' ) ? item.begintime.substring(0,10) : item.begintime"/>
          <van-cell :title="'结束' + (item.minunit == '2' ? '日期': '时间')"
                    :value="(item.minunit == '2' ) ? item.endtime.substring(0,10) : item.endtime"/>
          <van-cell v-if="item.start_day_type" title="开始时间" :value="StartEndDayType[item.start_day_type]"/>
          <van-cell v-if="item.end_day_type" title="结束时间" :value="StartEndDayType[item.end_day_type]"/>
          <van-cell title="请假时长" :value="item.leaveday + HrkqMinUnit[item.minunit]"/>
          <van-cell title="请假说明" :value="item.leaveremark"/>
        </div>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
  import {queryLeaveIsRevoked} from '@/api/leaveoff'
  import {USERINFO} from '@/utils/mutation-types'
  import storage from 'store'
  import {StartEndDayType, HrkqMinUnit} from '@/utils/ConstantUtils'

  export default {
    data() {
      return {
        pk_psndoc: storage.get(USERINFO).pk_psndoc,
        StartEndDayType,
        HrkqMinUnit,
        activeNames: [],
        leaveList: []
      }
    },
    mounted() {
    },
    created() {
      this.queryLeaveIsRevoked()
    },
    watch: {
      leaveList(val) {
        for (let i = 0; i < val.length; i++) {
          this.activeNames.push(i)
        }
      }
    },
    methods: {
      /**
       * 查询待销假请假记录
       */
      queryLeaveIsRevoked() {
        let params = {
          pk_psndoc: this.pk_psndoc
        }
        queryLeaveIsRevoked(params).then(res => {
          this.leaveList = res.data
        })
      },
      /**
       * 将数据传给父组件
       * @param detail
       */
      toDetail(item) {
        this.$emit('getDetail', item)
      }
    }
  }
</script>

<style lang='less'>
  .leaveoff_top .van-collapse .van-collapse-item__wrapper .van-collapse-item__content .van-cell {
    color: #888888;
    font-size: 14px;
  }

  .leaveoff_top .van-collapse .van-collapse-item .van-collapse-item__title .van-cell__title, .van-cell__left-icon {
    font-size: 15px;
    color: #2479ed;
  }
</style>
