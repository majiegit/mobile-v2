<template>
  <div>
    <!--导航栏区域-->
    <Header :title="title" @clickLeft="clickLeft"/>
    <!-- 搜索框-->
    <div style="width: 100%; height: 54px;">
      <van-search
        style="position: fixed; top: 46px; width: 100%; z-index: 1;"
        disabled
        shape="round"
        background="#2479ed"
        placeholder="请输入姓名/电话/邮箱"
        @click="searchClick"
      />
    </div>
    <div :style="{ 'height': currentHeight }" style="overflow-y: auto;">
      <div v-if="orgData">
        <!-- 已选择组织架构数据-->
        <van-cell v-if="orgDataSelect.length != 0" style="color: #2479ed">
          <template #title>
            <span v-for="(org, index) in orgDataSelect" :key="index">
              <span @click="selectOrgDataClick(org)">{{org.name}}</span>
              <van-icon name="arrow" v-if="index !== orgDataSelect.length - 1"/>
            </span>
          </template>
        </van-cell>
        <p class="item_title">组织架构</p>
        <!-- 组织架构-->
        <van-row type="flex" justify="end" class="org">
          <van-col span="24" v-for="(org,index) in orgData" :key="index">
            <van-cell :border="false" :title="org.name" icon="cluster" @click="orgClick(org)"/>
          </van-col>
        </van-row>
      </div>
      <div v-else>
        <van-empty description="暂无权限内数据"/>
      </div>
    </div>
  </div>
</template>

<script>
  import {Toast} from 'vant';
  import Header from '@/components/Header/Index'
  import {queryCompanyStructure} from '@/api/directory'
  import storage from 'store';

  export default {
    components: {
      Header
    },
    name: "orgstructure",
    data() {
      return {
        title: '通讯录',
        currentHeight: '',
        orgData: [],
        orgModel: {},
        orgDataSelect: []
      }
    },
    mounted() {
      this.currentHeight = (document.documentElement.clientHeight - 46) + 'px'
      let storageOrgDataSelect = storage.get('DirectoryOrgDataSelectKey')
      if (storageOrgDataSelect) {
        for (let i = 0; i < storageOrgDataSelect.length; i++) {
          if (i != storageOrgDataSelect.length - 1) {
            this.orgDataSelect.push(storageOrgDataSelect[i])
          }
        }
        if (this.orgDataSelect.length != 0) {
          this.queryCompanyStructure(this.orgDataSelect[this.orgDataSelect.length - 1].id, this.orgDataSelect[this.orgDataSelect.length - 1].isbusinessunit)
        } else {
          this.queryCompanyStructure('', 'Y')
        }
      } else {
        this.queryCompanyStructure('', 'Y')
      }
    },
    watch: {
      orgData(val) {
        if (this.orgData.length == 0) {
          // 查询人员
          this.$router.push({
            name: 'directoryList',
            query: {
              id: this.orgModel.id,
              isleaf: this.orgModel.isleaf,
              isbusinessunit: this.orgModel.isbusinessunit,
              orgtype1: this.orgModel.orgtype1
            }
          })
        }
      }
    },
    methods: {
      // 选择已选择组织
      selectOrgDataClick(org) {
        this.queryCompanyStructure(org.id, org.isbusinessunit)
      },
      // 选择下级组织
      orgClick(org) {
        this.orgModel = org
        this.orgDataSelect.push(this.orgModel)
        storage.set('DirectoryOrgDataSelectKey', this.orgDataSelect)
        this.queryCompanyStructure(org.id, org.isbusinessunit)
      },
      // 头部左上角点击事件
      clickLeft() {
        storage.remove('DirectoryOrgDataSelectKey')
        this.$router.go(-1)
      },
      searchClick(){
        this.$router.push("directorySearch")
      },
      // 查询组织架构
      queryCompanyStructure(id, isbusinessunit) {
        Toast.loading({
          message: '加载中...',
          duration: 0
        })
        let params = {
          id: id,
          isbusinessunit: isbusinessunit
        }
        queryCompanyStructure(params).then(res => {
          Toast.clear()
          this.orgData = res.data
        })
      },
    }
  }
</script>

<style scoped>
  .org .van-cell__left-icon {
    color: #2479ed;
  }

  .item_title {
    font-size: 14px;
    line-height: 14px;
    padding-left: 10px;
    color: #999;
  }
</style>
