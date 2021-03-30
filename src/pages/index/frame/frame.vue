<template>
  <div>
   <header>
      <hr-header
        :title=title
        v-on:lcallBack='goApp'
        >
      </hr-header>
    </header>
    <section>
      <iframe :src='url'></iframe>
    </section>
  </div>
</template>

<script>
import { HrHeader } from 'hr-ui'
  export default {
    name: 'frame',
    data (){
      return {
        title: '暂定',
        url: ''
      }
    },
    components: {
      HrHeader
    },
    created(){
      // TODO 获取url
      this.url = decodeURIComponent(this.$route.query.url)
    },
    methods : {
     goApp() {
        this.$router.go(-1)
      },
    }
  }
</script>

<style lang='less' scoped>
header{
  position: fixed;
  width: 100%;
  height: .88rem;
  line-height: .88rem;
  .um-h-middle{
    width: 50%;
  }
}
section{
  position: fixed;
  width: 100%;
  top: .88rem;
  left: 0;
  height: 90%;
  height: calc(~'100% - 0.88rem');
  overflow: scroll;
  iframe{
    height: 100%;
    width: 100%;
    overflow: scroll;
  }
}
</style>