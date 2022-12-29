<template>
  <div class="tripoff_top">
    <div v-if="tripList.length == 0">
      <van-empty description="暂无待销差数据"/>
    </div>
    <van-collapse is-link="false" v-model="activeNames" v-for="(item,index) in tripList" :key="index">
      <van-collapse-item :name="index">
        <template #title>
          <div>
            <van-icon name="label-o"/>
            {{ item.applydate}} &nbsp; {{ item.triptypename }}
          </div>
        </template>
        <div @click="toDetail(item)">
          <van-cell title="开始时间" :value="item.tripbegintime"/>
          <van-cell title="结束时间" :value="item.tripendtime"/>
          <van-cell title="出差时长" :value="item.tripday + HrkqMinUnit[item.minunit]"/>
          <van-cell title="出差说明" :value="item.remark"/>
        </div>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
  import {queryTripIsRevoked} from '@/api/tripoff'
  import {USERINFO} from '@/utils/mutation-types'
  import storage from 'store'
  import {StartEndDayType, HrkqMinUnit} from '@/utils/ConstantUtils'

  export default {
    data() {
      return {
        StartEndDayType,
        HrkqMinUnit,
        activeNames: [],
        tripList: []
      }
    },
    mounted() {
    },
    created() {
      this.queryTripIsRevoked()
    },
    watch: {
      tripList(val) {
        for (let i = 0; i < val.length; i++) {
          this.activeNames.push(i)
        }
      }
    },
    methods: {
      /**
       * 查询待销差出差记录
       */
      queryTripIsRevoked() {
        let params = {
          pk_psndoc: storage.get(USERINFO).pk_psndoc
        }
        queryTripIsRevoked(params).then(res => {
          this.tripList = res.data
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
  .tripoff_top .van-collapse .van-collapse-item__wrapper .van-collapse-item__content .van-cell {
    color: #888888;
    font-size: 14px;
  }

  .tripoff_top .van-collapse .van-collapse-item .van-collapse-item__title .van-cell__title, .van-cell__left-icon {
    font-size: 15px;
    color: #2479ed;
  }
</style>
