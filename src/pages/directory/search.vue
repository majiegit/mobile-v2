<template>
  <div>
    <!-- 搜索框-->
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
    <div :style="{ 'height': currentHeight }" style="overflow-y: auto; background-color: #fff;">
      <div v-if="psndocList.length != 0">
        <p class="item_title">联系人</p>
        <!-- 组织架构-->
        <van-row type="flex" justify="end">
          <van-col span="24" v-for="(psndoc,index) in psndocList" :key="index" class="row_div">
            <van-cell :border="true" :to="{name : 'directoryDetail', params: { psndoc: psndoc}}">
              <!-- 使用 title 插槽来自定义标题 -->
              <template #title>
                <div style="width: 100%; height: 100%; padding-left: 10px; position:relative;">
                  <p style="font-size: 14px; margin: 0; position:relative;">{{psndoc.name}}</p>
                  <p
                    style="font-size: 12px; color: #c8c9cc;margin: 0; border-bottom: 1px solid #f7f8fa; padding-bottom: 3px;">
                    {{psndoc.dept_name}}</p>
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
      <div v-else>
        <van-empty description="搜索你想要的内容" image="search"/>
      </div>
    </div>
  </div>
</template>

<script>
  import {Toast} from 'vant';
  import Header from '@/components/Header/Index'
  import {USERINFO} from '@/utils/mutation-types'
  import {queryDirPsnInfoList} from '@/api/directory'

  export default {
    components: {
      Header
    },
    name: "Index",
    data() {
      return {
        title: '通讯录',
        currentHeight: '',
        psndocList: [],
        searchModel: ''
      }
    },
    mounted() {
      this.currentHeight = (document.documentElement.clientHeight - 54) + 'px'
    },
    methods: {

      search() {
        this.queryDirPsnInfoList()
      },
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
      /**
       * 返回事件
       */
      onCancel() {
        this.$router.go(-1)
      },
      queryDirPsnInfoList() {
        Toast.loading({
          message: '加载中...',
          duration: 0
        })
        let params = {
          like: this.searchModel
        }
        queryDirPsnInfoList(params).then(res => {
          Toast.clear()
          this.psndocList = res.data
        })
      }
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
