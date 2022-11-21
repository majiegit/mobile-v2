<template>
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
  background: #2479ed;
  padding: 4%;
  color: #ffffff;
  border-radius: 15px;
  box-shadow: 0px 8px 15px 1px rgba(198, 198, 198, 0.3);
}
.item_col {
  height: 30px;
  font-size: 15px;
  line-height: 30px;
}
</style>


