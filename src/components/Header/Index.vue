<template>
  <van-nav-bar
    :border="border"
    :fixed="true"
    :placeholder="placeholder"
    @click-left="clickLeft()"
    @click-right="clickRight()"
  >
    <template #title>
      <span class="title">{{title}}</span>
    </template>
    <template #left>
      <span class="leftText">
        <van-icon :name="leftIcon" color="#fff" size="18"/>
      </span>
      <span class="leftText">{{leftText}}</span>
    </template>
    <template #right>
       <span class="leftText">
        <van-icon :name="rightIcon" color="#fff"/>
      </span>
      <span class="rightText">{{rightText}}</span>
    </template>
  </van-nav-bar>
</template>

<script>
  export default {
    name: "Header",
    data() {
      return {
        placeholder: true
      }
    },
    props: {
      title: {
        type: String,
        default: ''
      },
      border: {
        type: Boolean,
        default: false
      },
      leftIcon: {
        type: String,
        default: 'arrow-left'
      },
      leftText: {
        type: String,
        default: ''
      },
      rightIcon: {
        type: String,
        default: ''
      },
      rightText: {
        type: String,
        default: ''
      },
    },
    methods: {
      clickLeft() {
        this.$emit("clickLeft")
      },
      clickRight() {
        this.$emit("clickRight")
      }
    }
  }
</script>

<style scoped>
  .title {
    color: #fff;
  }

  .leftText {
    color: #fff;
  }

  .rightText {
    color: #fff;
  }
</style>
<style>
  .van-nav-bar__content {
    background: #2479ed;
  }
</style>
