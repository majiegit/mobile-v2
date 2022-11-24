<template>
  <div class="checkouut_body">
    <Header title="移动打卡" leftText="" @clickLeft="goHome()" rightText="设置" @clickRight="set()"></Header>
    <div :style="{height: currentHeight}">
      <!--顶部个人信息-->
      <div class="checkout_top">
        <div class="checkout_top_one">
          <van-row type="flex" justify="space-around">
            <van-col :span="6">
              <div class="checkout_top_two">
                <van-image round width="80px" height="80px" :src="img"/>
              </div>
            </van-col>
            <van-col :span="17" class="font_size16">
              <p style="font-size: 15px;">
                <span>一枝</span>
                <span style="float: right">2016.5.12 <van-icon name="arrow-down"/></span>
              </p>
              <p class="blue_color font_size16">考勤组: 通用考勤组
                <van-icon name="arrow"/>
              </p>
            </van-col>
          </van-row>
        </div>
        <!--打卡信息-->
        <div class="checkout_content" :style="{height: currentHeight}">
          <div style="padding: 0 20px">
            <p>当前位置 (距打卡位置0.6km)</p>
            <p>北京市</p>
          </div>
          <div class="font_size16">
            <van-icon name="arrow-left"/>
            <span class="blue_color">外勤上报</span>
            <span style="margin-left: 25px;font-size: 18px">已进入考勤区域: SSPPSAS</span>
          </div>
          <div class="checkout_c1">
            <van-steps active-icon="circle" inactive-icon="circle" active-color="#f2ac2b" direction="vertical"
                       :active="0">
              <van-step>
                <div>迟到打卡</div>
                <p>
                  <van-icon color="#666666" size="18px" name="clock"/>
                  9:00
                </p>
                <p>
                  <van-icon color="#666666" size="18px" name="location"/>
                  北京市北京区北京村
                </p>
                <p>
                  <van-icon color="#666666" size="18px" name="bell"/>
                  joinuteam
                </p>
              </van-step>
              <van-step>
                <div>17:30 下班打卡</div>
              </van-step>
            </van-steps>
          </div>
          <van-tabbar v-model="active"
                      @change="selectTab(active)"
          >
            <van-tabbar-item icon="home-o">
              <span> 考勤</span>
              <!--              <template #icon="props">-->
              <!--                <img :src="kq1" style="width: 30px;height: 30px"/>-->
              <!--              </template>-->
            </van-tabbar-item>
            <van-tabbar-item icon="cluster">
              <span>我的外勤</span>
            </van-tabbar-item>
            <van-tabbar-item icon="column">
              <span>外勤审核</span>
            </van-tabbar-item>
          </van-tabbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header/Index'

export default {
  data() {
    return {
      active: 0,
      currentHeight: '',
      img: 'static/img/checkout/img.png',
    }
  },
  components: {Header},
  mounted() {
    this.currentHeight = (document.documentElement.clientHeight - 276) + 'px'
  },
  created() {
  },
  methods: {
    selectTab(value) {
      alert(value)
      if (value = 0) {
      }
    },
    // 返回
    goHome() {
      console.log(1111)
      this.$router.go(-1)
    },
    set() {
      alert('设置')
    }
  }
}
</script>


<style>
.font_size16 {
  font-size: 16px;
}

.blue_color {
  color: #2479ed
}

.checkout_top {
  width: 100%;
  background: #2479ed;
  height: 200px;
  padding: 0 3%
}

.checkout_top_one {
  height: 80px;
  width: 94%;
  padding: 20px 0;
  border-radius: 10px;
  background: #fff;
}

.checkout_top_two {
  float: left;
  height: 80px;
  width: 80px;
}

.checkout_content {
  width: 94%;
  padding: 20px 0;
  border-radius: 10px;
  background: #fff;
  margin-top: 20px;
}

.checkout_c1 {
  margin-top: 30px;
}

.checkout_c1 .van-steps--vertical {
  padding: 0 0 0 50px
}

.checkout_c1 .van-steps--vertical .van-steps__items .van-hairline .van-step__title div {
  font-size: 18px;
  color: #000;
}

.checkout_c1 .van-steps--vertical .van-steps__items .van-hairline .van-step__title p {
  font-size: 16px;
  color: #000;
}

.checkout_c1 .van-steps--vertical .van-steps__items .van-hairline .van-icon-circle {
  color: #000;
}

</style>
