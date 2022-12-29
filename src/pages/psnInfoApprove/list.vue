<template>
  <div>
    <Header :title="title" @clickLeft="clickLeft"></Header>
    <van-tabs v-model="approveStatus" color="#2479ED" title-active-color="#2479ED" title-inactive-color="#000">
      <van-tab :title="status.text" v-for="status in PsnInfoApproveList" :name="status.value" :key="status.value"/>
    </van-tabs>
    <div style="padding: 10px;" :style="{ 'height': currentHeight}">
      <van-empty v-if="approveList.length == 0" description="暂无数据"/>
      <div class="user-box" v-for="(item,index) in approveList" :key="index" @click="toUserDetail(item)">
        <van-row justify="space-between" style="padding: 5px 0;">
          <van-col span="12">变更人：{{item.psndocname}}</van-col>
          <van-col span="12">变更日期：{{item.applydate}}</van-col>
          <van-col span="12">信息集：{{item.infoset_name}}</van-col>
          <van-col span="12">所属部门：{{item.pk_psnjob_dept_name}}</van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>

<script>
  import {Toast} from 'vant';
  import Header from '@/components/Header/Index'
  import {queryPsnInfoApproveList} from '@/api/psnInfoApprove'
  import {PsnInfoApproveStatus, PsnInfoApproveList} from '@/utils/ConstantUtils'
  import {USERINFO} from '@/utils/mutation-types'
  import storage from 'store'
  export default {
    name: 'userCheck',
    components: {
      Header
    },
    data() {
      return {
        title: '员工信息审核',
        currentHeight: '',
        approveStatus: 0,
        PsnInfoApproveStatus,
        PsnInfoApproveList,
        approveList: [],
        pk_org: storage.get(USERINFO).pk_org
      }
    },
    watch: {
      approveStatus() {
        this.queryPsnInfoApproveData()
      }
    },
    computed: {},
    mounted() {
      this.currentHeight = (document.documentElement.clientHeight - 110) + 'px';
      this.queryPsnInfoApproveData()
    },
    methods: {
      // 返回上一层
      clickLeft() {
        this.$router.go(-1)
      },
      // 跳转详情页
      toUserDetail(item) {
        this.$router.push({
          name: 'psnInfoApproveDetail',
          query: {pk_psninfoapprove: item.pk_psninfoapprove}
        })
      },
      // 根据状态查询
      queryPsnInfoApproveData() {
        Toast.loading({
          message: '加载中...',
          duration: 0
        })
        let params = {
          pk_org: this.pk_org,
          checkstatus: this.approveStatus
        }
        queryPsnInfoApproveList(params).then(res => {
          this.approveList = res.data
          Toast.clear()
        })
      }
    }
  }
</script>
<style>
  .user-box {
    width: 96%;
    min-height: 70px;
    background: #fff;
    margin-bottom: 10px;
    border-radius: 10px;
    line-height: 35px;
    padding: 0 2%;
    font-size: 14px;
  }
</style>
<style lang="less" scoped>
  table.gridtable {
    font-family: verdana, arial, sans-serif;
    font-size: 11px;
    color: #333333;
    border-width: 1px;
    border-color: #666666;
    border-collapse: collapse;
    margin-top: 20px;
  }

  table.gridtable th {
    border-width: 1px;
    padding: 8px;
    text-align: center;
    background-color: #E4E8F1;
    display: inline-block;
    position: relative;
    width: 100px;
  }

  table.gridtable td {
    border-width: 1px;
    padding: 8px;
    text-align: center;
    background-color: #ffffff;
    display: inline-block;
    position: relative;
  }

  tr > td {
    word-break: break-all;
  }

  .aaa {
    &::-webkit-scrollbar {
      display: none;
    }
  }

  #box {
    width: 200px;
    height: 50px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.35s;
  }

  #box ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  #box ul li {
    width: 198px;
    height: 48px;
    line-height: 50px;
    text-align: center;
    border: 1px red solid;
    background: #000000;
    color: white;
  }

  .bodyDiv {
    height: 80px;
    margin: 10px;
    border-radius: 10px;
    background-color: #fff;
    padding: 0px 15px 0px 10px;
    font-size: 12px;
    position: relative;
    &_child {
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      text-align: left;
    }
  }

  .selectImg {
    position: absolute;
    left: 15px;
    top: 33px;
    width: 15px;
    height: 15px;
  }

  .bottomButtonDiv {
    position: fixed;
    left: 15px;
    right: 15px;
    bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #fff;
    &_left {
      width: 48%;
      font-size: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #E04F4F;
      height: 40px;
      border-radius: 20px;
    }
    &_right {
      width: 48%;
      font-size: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #20D462;
      height: 40px;
      border-radius: 20px;
    }
  }
</style>
