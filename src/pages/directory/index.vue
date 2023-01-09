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
      <!-- 已选择组织架构数据-->
      <van-cell v-if="orgDataSelect.length != 0" style="color: #2479ed">
        <template #title>
            <span v-for="(org, index) in orgDataSelect" :key="index">
              <span @click="selectOrgDataClick(org,index)">{{org.name}}</span>
              <van-icon name="arrow" v-if="index !== orgDataSelect.length - 1"/>
            </span>
        </template>
      </van-cell>
      <div v-if="orgData.length != 0">
        <p class="item_title">组织架构</p>
        <!-- 组织架构-->
        <van-row type="flex" justify="end" class="org">
          <van-col span="24" v-for="(org,index) in orgData" :key="index">
            <van-cell :border="false" :title="org.name" icon="cluster" @click="orgClick(org)">
              <template #default>
                <van-badge :content="org.count" v-if="org.count != 0" color="#2479ed"/>
              </template>
            </van-cell>
          </van-col>
        </van-row>
      </div>
      <div v-if="psndocList.length != 0">
        <!-- 人员列表-->
        <p class="item_title">组织成员</p>
        <van-row type="flex" justify="end">
          <van-col span="24" v-for="(psndoc,index) in psndocList" :key="index" class="row_div">
            <van-cell :border="true" :to="{name : 'directoryDetail', params: { psndoc: psndoc}}">
              <!-- 使用 title 插槽来自定义标题 -->
              <template #title>
                <div style="width: 100%; height: 100%; line-height: 30px; padding-left: 10px; font-size: 12px">
                  <span>{{psndoc.name}}</span>
                </div>
              </template>
              <template #icon>
                <div class="head_img" v-if="psndoc.photo">
                  <van-image
                    radius="20%"
                    width="30px"
                    height="30px"
                    :src="psndoc.photo"
                  />
                </div>
                <div class="head_text" v-else>
                  <span style="font-size: 5px; -webkit-transform: scale(0.5)">{{getName(psndoc.name)}}</span>
                </div>
              </template>
            </van-cell>
          </van-col>
        </van-row>
      </div>
      <!-- 没数据-->
      <div v-if="orgData.length == 0 && psndocList.length == 0">
        <van-empty description="暂无数据"/>
      </div>
    </div>
  </div>
</template>

<script>
  import {Toast} from 'vant';
  import Header from '@/components/Header/Index'
  import {queryCompanyStructure,queryDirPsnInfoList } from '@/api/directory'
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
        orgDataSelect: [],
        psndocList: []
      }
    },
    mounted() {
      this.currentHeight = (document.documentElement.clientHeight - 46 - 54) + 'px'
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
          this.queryCompanyStructure()
        }
      } else {
        this.queryCompanyStructure()
      }
    },
    watch: {
    },
    methods: {
      /**
       * 获取名字
       */
      getName(psndocname) {
        let name = ''
        if (psndocname.length == 2) {
          name = psndocname
        } else if (psndocname.length == 3) {
          name = psndocname.substring(1)
        } else {
          name = psndocname.substring(0, 2)
        }
        return name
      },
      // 选择已选择组织
      selectOrgDataClick(org,index) {
        this.orgDataSelect.splice(index + 1, this.orgDataSelect.length - (index + 1))
        this.queryCompanyStructure(org.id, org.isbusinessunit)
        this.queryDirPsnInfoList(org.id, org.isbusinessunit)
      },
      // 选择下级组织
      orgClick(org) {
        this.orgModel = org
        this.orgDataSelect.push(this.orgModel)
        storage.set('DirectoryOrgDataSelectKey', this.orgDataSelect)
        this.queryCompanyStructure(org.id, org.isbusinessunit)
        this.queryDirPsnInfoList(org.id, org.isbusinessunit)
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
      // 查询当前组织人员数据
      queryDirPsnInfoList(id, isbusinessunit) {
        Toast.loading({
          message: '加载中...',
          duration: 0
        })
        let params = {
          id: id,
          isbusinessunit: isbusinessunit,
          like: this.searchModel
        }
        queryDirPsnInfoList(params).then(res => {
          this.psndocList = res.data
          Toast.clear()
        })
      },
    }
  }
</script>

<style scoped>
  .org .van-cell__left-icon {
    color: #2479ed;
  }
  .org .an-badge{
    height: 16px;
    margin-top: 5px;
  }

  .head_img {
    width: 30px;
    height: 30px;
  }

  .head_text {
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background-color: #0c89f1;
    color: #fff;
    border-radius: 20%;
  }

  .row_div {
    padding: 7px 0px;
    background-color: #fff;
  }

  .row_div .van-cell {
    padding: 0 16px;
  }

  .item_title {
    font-size: 12px;
    line-height: 12px;
    margin: 10px 0;
    padding-left: 10px;
    color: #999;
  }
</style>
