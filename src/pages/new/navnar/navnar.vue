<template>
      <van-nav-bar
      :title="title"
      :left-text="left_text"
      :right-text="right_text"
      left-arrow
      @click-left="clickLeft()"
      @click-right="clickRight()"
    />
</template>

<script>
  export default {
    name: "navnar",
    data() {
      return {}
    },
    props: {
      title: '',
      left_text: '',
      right_text: ''
    },
    methods: {
      clickLeft() {
        this.$emit("clickLeft")
      },
      clickRight(){
        this.$emit("clickRight")
      }
    }
  }
</script>

<style>
  .van-nav-bar__content {
    background: #2479ed;
  }

  .van-nav-bar__title {
    color: #fff;
  }
  .van-nav-bar__left > .van-icon-arrow-left{
    color: #fff;
  }
  .van-nav-bar__text {
    color: #fff;
  }
</style>
