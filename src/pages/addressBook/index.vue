<template>
  <div>
    <!--导航栏区域-->
    <Header :title="title" @clickLeft="clickLeft"/>
    <div :style="{ 'height': currentHeight }" style="overflow-y: auto;">
      <!-- 搜索框-->
      <van-search
        disabled
        shape="round"
        background="#2479ed"
        placeholder="请输入姓名/电话/邮箱"
      />
      <!-- 组织架构-->
      <van-row type="flex" justify="end">
        <van-col span="24">
          <van-cell :border="false" icon="arrow" title="标题">
            <!-- 使用 title 插槽来自定义标题 -->
            <template #default>
              <van-badge :content="12" max="99" color="#2479ed"/>
            </template>
          </van-cell>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
  import Header from '@/components/Header/Index'

  export default {
    components: {
      Header
    },
    name: "Index",
    data() {
      return {
        title: '通讯录',
        currentHeight: '',
        orgStructureData: []
      }
    },
    mounted() {
      this.currentHeight = (document.documentElement.clientHeight - 46) + 'px'
    },
    methods: {
      /**
       * 返回事件
       */
      clickLeft() {
        this.$router.go(-1)
      },
    }
  }
</script>

<style scoped>
</style>
