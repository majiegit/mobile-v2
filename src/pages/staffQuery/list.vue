<template>
  <div>
    <!--导航栏区域-->
    <Header :title="title" @clickLeft="clickLeft"/>
    <div :style="{ 'height': currentHeight }" style="overflow-y: auto;">
      <!-- 搜索框-->
      <van-search
        v-model="searchModel"
        shape="round"
        background="#2479ed"
        :clearable="false"
        placeholder="请输入姓名/电话/邮箱"
        @input="search"
      />
      <van-row type="flex" justify="end"  v-if="psndocList.length != 0">
        <van-col span="24" v-for="(psndoc,index) in psndocList" :key="index">
          <van-cell :border="false" :to="{name : 'staffQueryDetail', query: { pk_psndoc: psndoc.pk_psndoc}}">
            <!-- 使用 title 插槽来自定义标题 -->
            <template #title>
              <div style="width: 100%; height: 100%; line-height: 30px;">
                <span style="margin-left: 15px;">{{psndoc.name}}</span>
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
      <div v-else>
        <van-empty description="暂无人员数据"/>
      </div>
    </div>
  </div>
</template>

<script>
  import Header from '@/components/Header/Index'
  import {USERINFO} from '@/utils/mutation-types'
  import {queryPsnInfoList} from '@/api/staffQuery'
  import {Toast} from 'vant';

  export default {
    components: {
      Header
    },
    name: "Index",
    data() {
      return {
        title: '员工查询',
        currentHeight: '',
        psndocList: [],
        psndocListAll: [],
        searchModel: ''
      }
    },
    mounted() {
      this.currentHeight = (document.documentElement.clientHeight - 46) + 'px'
      this.queryPsndocList(this.$route.query.id, this.$route.query.isleaf, this.$route.query.isbusinessunit, this.$route.query.orgtype1)
      this.title = this.$route.query.title
    },
    methods: {

      search(value) {
        console.log(value)
        if (value) {
          let arr = []
          for (let i = 0; i < this.psndocListAll.length; i++) {
            if (
              (this.psndocListAll[i].name && this.psndocListAll[i].name.indexOf(value) != -1) ||    // 姓名
              (this.psndocListAll[i].mobile && this.psndocListAll[i].mobile.indexOf(value) != -1) ||  // 电话
              (this.psndocListAll[i].email && this.psndocListAll[i].email.indexOf(value) != -1) ||   // 工作邮箱
              (this.psndocListAll[i].secret_email && this.psndocListAll[i].secret_email.indexOf(value) != -1)     // 私人邮箱
            ) {
              arr.push(this.psndocListAll[i])
            }
          }
          this.psndocList = arr
        } else {
          this.psndocList = this.psndocListAll
        }
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
      clickLeft() {
        this.$router.go(-1)
      },
      queryPsndocList(id, isleaf, isbusinessunit,orgtype1) {
        Toast.loading({
          message: '加载中...',
          duration: 0
        })
        let params = {
          id: id,
          isleaf: isleaf,
          isbusinessunit: isbusinessunit,
          orgtype1: orgtype1,

        }
        queryPsnInfoList(params).then(res => {
          this.psndocList = res.data
          this.psndocListAll = res.data
          Toast.clear()
        })
      },
    }
  }
</script>

<style scoped lang="less">
  .head_text {
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background-color: #0c89f1;
    color: #fff;
    border-radius: 20%;
  }
</style>
