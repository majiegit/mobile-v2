<template xmlns="http://www.w3.org/1999/html">
  <div>
    <!--合计项目-->
    <van-row type="flex">
      <van-col :span="24" class="salary_username">
        <span>查询合计</span>
      </van-col>
    </van-row>
    <div class="salary_total_div">
      <van-row type="flex">
        <van-col :span="12" class="item_col" v-for="(item,index) in summarizing" :key=index>
          <span>{{ item.title }} : </span>
          <span>{{ salaryData.summarySalary[item.field] }}</span>
        </van-col>
      </van-row>
      <br />
    </div>
  </div>
</template>

<script>

export default {
  name: "salaryContent",
  props: {
    salaryData: {
      type: Object,
      default: {}
    },
    summarizing:{
      type: Array,
      default: []
    }
  },
  data() {
    return {
    }
  },
  created(){
  },
  methods: {

  }
}
</script>

<style scoped>
.salary_username {
  line-height: 40px;
  font-size: 16px;
}
.salary_total_div {
  width: 92%;
  min-height: 60px;
  background: #2479ed;
  padding: 4%;
  color: #ffffff;
  border-radius: 15px;
  box-shadow: 0px 8px 15px 1px rgba(198, 198, 198, 0.3);
}
.button_bottom {
  width: 100%;
  height: 50px;
  padding: 5px 0px;
}
.button_bottom .van-col .van-dropdown-menu .van-dropdown-menu__bar{
  border-radius: 25px;
  background: #1989fa;
}
.button_bottom .van-col .van-dropdown-menu .van-dropdown-menu__bar .van-dropdown-menu__item .van-dropdown-menu__title .van-ellipsis {
  color: #fff;
}
</style>


