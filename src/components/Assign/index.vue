<template>
  <div>
    <!--    <Header title="离职申请" @clickLeft="clickLeft"></Header>-->
    <!-- 搜索框-->
    <van-popup v-model="AssignVisible" style="height: 100%;width: 100%">
      <Header title="指派人选择" @clickLeft="clickLeft"></Header>
      <van-search
        v-model="searchModel"
        shape="round"
        background="#2479ed"
        :clearable="false"
        placeholder="请输入姓名/电话/邮箱"
        @search="search"
      />
      <div class="zhi_radio" :style="{'height': currentHeight}">
        <van-checkbox-group v-model="AssignSelectUserData" @change="selector">
          <van-cell-group>
            <van-cell
              v-for="(item, index) in AssignUserData"
              clickable
              :key="index"
              :title="`复选框 ${item.username}`"
            >
              <template #right-icon>
                <van-checkbox :name="item"/>
              </template>
            </van-cell>
          </van-cell-group>
        </van-checkbox-group>
      </div>
      <div class="bottom_button" style="width: 80%;margin: 0px auto;">
        <van-button round block type="info" @click="AssignConfirm">确认</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
  import Header from '@/components/Header/Index'
  import {USERINFO} from '@/utils/mutation-types'
  import {queryDirPsnInfoList} from '@/api/directory'

  export default {
    components: {
      Header
    },
    name: 'Index',
    props: {
    },
    data() {
      return {
        searchModel: '',
        AssignSelectUserData: [],
        AssignVisible: false,
        AssignUserData: [], // 指派人列表
        currentHeight: ''
      }
    },
    mounted() {
      this.currentHeight = (document.documentElement.clientHeight - 100 - 54) + 'px'
    },
    methods: {
      search() {
      },
      // 选择指派人
      selector() {
        console.log(this.AssignSelectUserData)
      },
      AssignConfirm() {
        this.$emit('AssignConfirm', this.AssignSelectUserData)
      },
      AssignShow(AssignUserData){
        this.AssignVisible = true
        this.AssignUserData = AssignUserData
      },
      clickLeft() {
        this.AssignVisible = false
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
