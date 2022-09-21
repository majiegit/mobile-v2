<template>
      <van-nav-bar
      :title="title"
      :left-text="leftText"
      :right-text="rightText"
      left-arrow
      @click-left="clickLeft()"
      @click-right="clickRight()"
    />
</template>

<script>
  export default {
    name: "Header",
    data() {
      return {}
    },
    props: {
      title: '',
      leftText: '',
      rightText: ''
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
