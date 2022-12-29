<template>
  <div>
    <Header title="我的申请" @clickLeft="clickLeft"></Header>
    <div class="applyListClass">
      <div class="applyListClass_item" v-for="(billtype,index) in billTypeList" :key="index"
           @click="clickApply(billtype,index)"
           :style="{'color': index == billTypeModel ? '#2479ED': ''}">
        {{billtype.billtypename}}
      </div>
    </div>
    <div class="item_body" :style="{'height': currentHeight}">
      <!--内容区域-->
      <div class="item" v-for="(item, index) in ApplyList" :key="index"
           :style="'margin-top: 15px'">
        <div class="item_left" :style="{background: approveStateColorList[item.approvestatus]}"/>
        <div class="item_right" @click="toApply(item)">
          <van-row type="flex" style="height: 30px; padding-top: 10px;">
            <van-col span="11" offset="1">
                  <span>{{item.billtypename}}
                  <span v-if="item.typename">-</span>
                    {{item.typename}}
                  </span>
            </van-col>
            <van-col span="11">
              <span style="float: right;">{{item.applydate}}</span>
            </van-col>
          </van-row>
          <van-row type="flex" style="height: 30px; padding-top: 10px;">
            <van-col span="23" offset="1">
              <span
                :style="{color: approveStateColorList[item.approvestatus]}">{{approveStateName[item.approvestatus]}}</span>
            </van-col>
          </van-row>
        </div>
      </div>
      <div v-if="ApplyList.length == 0">
        <van-empty description="暂无数据"/>
      </div>
    </div>

    <!-- 去申请区域-->
    <div>
      <van-row type="flex" justify="space-around" class="button_bottom">
        <van-col :span="23">
          <van-button round block type="info" @click="toApplyEdit()" :disabled="billTypeModel == 0">去申请</van-button>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
  import Header from '@/components/Header/Index'
  import {Toast} from 'vant';
  import {getMyApplication} from '@/api/my-apply'
  import {USERINFO} from '@/utils/mutation-types'
  import storage from 'store'
  import {approveStateName, approveStateColorList, BillTypeList, BillTypeMap} from '@/utils/ConstantUtils'

  export default {
    watch: {
      billTypeModel(val) {
        console.log(val)
        let billType = this.billTypeList[val]
        if (val === 0) {
          this.ApplyList = this.ApplyListAll
        } else {
          this.ApplyList = this.ApplyListAll.filter(apply => billType.billtype === apply.billtype)
        }
      }
    },
    mounted() {
      this.currentHeight = (document.documentElement.clientHeight - 46 - 60 - 50) + 'px'
    },
    data() {
      return {
        pk_psndoc: storage.get(USERINFO).pk_psndoc,
        currentHeight: '',
        billTypeModel: '',
        billTypeList: BillTypeList,
        ApplyList: [],
        ApplyListAll: [],
        approveStateName: approveStateName,
        approveStateColorList: approveStateColorList
      }
    },

    components: {Header},

    created() {
      this.queryMyApplication()
    },

    methods: {
      // 去申请
      toApplyEdit() {
        let billType = this.billTypeList[this.billTypeModel]
        this.$router.push({
          name: BillTypeMap[billType.billtype].routerEditPath,
        })
      },
      // 点击单据
      clickApply(billtype, index) {
        this.billTypeModel = index
      },
      // 跳转单据
      toApply(item) {
        this.$router.push({
          name: BillTypeMap[item.billtype].routerDetailPath,
          query: {
            pk_h: item.pk_h,
            billtype: item.billtype
          }
        })
      },
      // 查询我的申请
      queryMyApplication() {
        Toast.loading({
          message: '加载中...',
          duration: 0
        })
        // 查询我的申请数据
        let params = {
          pk_psndoc: this.pk_psndoc
        }
        getMyApplication(params).then(res => {
          this.ApplyList = res.data
          this.ApplyListAll = res.data
          Toast.clear()
        })
      },
      clickLeft() {
        this.$router.push({name: 'application'})
      }
    }
  }
</script>

<style lang='less' scoped>
  .item_body {
    width: 96%;
    padding: 0 2%;
    overflow-y: auto;
  }

  .item {
    margin-top: 10px;
    width: 100%;
    height: 80px;
    background: #FFFFFF;
    box-shadow: 7px 5px 15px 0px rgba(36, 121, 237, 0.2);
    border-radius: 8px;
    &_left {
      width: 2%;
      height: 100%;
      float: left;
      background: #2479ED;
      border-bottom-left-radius: 8px;
      border-top-left-radius: 8px;
    }
    &_right {
      width: 98%;
      height: 100%;
      float: left;
      background: #fff;
      border-bottom-right-radius: 8px;
      border-top-right-radius: 8px;
      span {
        font-size: 13px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #666666;
      }
    }
  }

  .applyListClass {
    width: 100%;
    overflow-y: hidden;
    height: 50px;
    overflow-x: auto;
    scrollbar-width: none; /* firefox */
    -ms-overflow-style: none; /* IE 10+ */
    background: #fff;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    font-size: 15px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #999999;
    &::-webkit-scrollbar {
      display: none;
    }
    &_item {
      width: 25%;
      height: 100%;
      white-space: nowrap;
      display: inline-block;
      line-height: 50px;
      text-align: center;
    }
  }

  .button_bottom {
    position: fixed;
    bottom: 0px;
    width: 100%;
    height: 50px;
    padding: 5px 0px;
  }
</style>
