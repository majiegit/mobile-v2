<template>
  <div>
    <!--    <Header title="离职申请" @clickLeft="clickLeft"></Header>-->
    <!-- 搜索框-->
    <van-popup v-model="isShowAssign" style="height: 100%;width: 100%">
      <Header title="指派人选择" @clickLeft="clickLeft"></Header>
      <van-search
        v-model="searchModel"
        shape="round"
        background="#fff"
        show-action
        :clearable="false"
        placeholder="请输入姓名/电话/邮箱"
        @search="search"
        @cancel="onCancel"
      />
      <div class="zhi_radio" :style="{'height': currentHeight}">
<!--        <van-radio-group v-model="chooseChecked">-->
<!--          <van-cell-group inset v-for="(item,index) in checkedData" :key="index">-->
<!--            <van-cell :title="item.username" clickable @click="choose(item)">-->
<!--              <template #right-icon>-->
<!--                <van-radio :name="index" shape="square"/>-->
<!--              </template>-->
<!--            </van-cell>-->
<!--          </van-cell-group>-->
<!--        </van-radio-group>-->



        <van-checkbox-group v-model="chooseChecked">
          <van-cell-group>
            <van-cell
              v-for="(item, index) in checkedData"
              clickable
              :key="index"
              :title="`复选框 ${item.username}`"
              @click="choose(item)"
            >
              <template #right-icon>
                <van-checkbox :name="item" ref="checkboxes" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-checkbox-group>
      </div>
      <div class="bottom_button" style="width: 70%;margin: 0px auto;">
        <van-button round block type="info" @click="zhipaiOk">确认</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Toast } from 'vant'
import Header from '@/components/Header/Index'
import { USERINFO } from '@/utils/mutation-types'
import { queryDirPsnInfoList } from '@/api/directory'

export default {
  components: {
    Header
  },
  name: 'Index',
  props:{
    isShowAssign: {
      type: Boolean,
      default: false,
    }
  },
  data () {
    return {
      chooseChecked: [],
      muplityWithOutAssgin: false, // 是否需要指派
      zhiPaiVisible: false,
      checkedData: [
        {
          username: '你好'
        },
        {
          username: '不好'
        }
      ], // 指派人列表
      content: {}, // 指派人
      activitydefid: '',
      desc: '',
      zhiPaiData: {},
      show: true,
      currentHeight: '',
      psndocList: [],
      searchModel: ''
    }
  },
  mounted () {
    this.currentHeight = (document.documentElement.clientHeight -100 - 54) + 'px'
  },
  methods: {

    search () {
      this.queryDirPsnInfoList()
    },
    // 选择指派人
    choose(index) {
      console.log(index)
      this.$refs.checkboxes[index].toggle();
      console.log(this.chooseChecked)
      // this.content = item
      // console.log('item', item)
    },
    zhipaiOk() {

    },
    /**
     * 返回事件
     */
    onCancel () {
      this.$router.go(-1)
    },
    clickLeft () {
      this.$router.go(-1)
    },

  }
}
</script>

<style scoped lang="less">

.item_title {
  font-size: 12px;
  line-height: 12px;
  margin: 10px 0;
  padding-left: 10px;
  color: #999;
}

.head_img {
  width: 30px;
  height: 30px;
  margin-top: 7px;
  text-align: center;
}

.head_text {
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  margin-top: 7px;
  background-color: #0c89f1;
  color: #fff;
  border-radius: 20%;
}

.row_div {
  padding: 5px 0px;
  background-color: #fff;
}

.row_div .van-cell {
  padding: 0 16px;
  line-height: 20px;
}
</style>
