<template>
  <div>
    <!--合计项目-->
    <van-row type="flex">
      <van-col :span="24" class="salary_username">
        <span>查询合计</span>
      </van-col>
    </van-row>
    <div class="salary_total_div" @click="salaryContentClick">
      <van-row type="flex">
        <van-col :span="12" class="item_col" v-for="(item,index) in summarizing" :key=index>
          <span>{{ item.title }} : </span>
          <span>{{ salaryData.summarySalary[item.field] }}</span>
        </van-col>
      </van-row>
    </div>
    <!--薪资合计明细弹框-->
    <van-popup
      v-model="salaryDetailShow"
      lock-scroll
      closeable
      :style="{ height: '100%', width: '100%', background: 'white'}"
    >
      <div style="padding: 15% 2%;">
        <!-- 数据内容-->
        <van-row style="font-size: 14px; padding: 0 20px;" v-for="(row, index) in salaryData.summarySalaryItems"
                 :key="index">
          <van-divider :style="{ borderColor: 'grey'}"
                       dashed></van-divider>
          <van-col span="12">
                <span>{{ row.name }}
              </span>
          </van-col>
          <van-col span="12">
            <span style="float: right;">{{ row.value }}</span>
          </van-col>
        </van-row>
      </div>
    </van-popup>
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
      summarizing: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        salaryDetailShow: false,
      }
    },
    created() {
    },
    methods: {
      salaryContentClick() {
        if (this.salaryData.summarySalaryItems) {
          this.salaryDetailShow = true
        }
      }
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


