<template>

  <div style="
     height: 100%;
    overflow: auto;">
    <div class="myheader">
      <hr-header
        title='问卷管理'
        v-on:lcallBack='goApp'
      >
      </hr-header>
    </div>
    <div class="questList_div" v-bind:style="{height: windowHeight}">
      <div v-for="item in questList " class="questList_item">
        <ul>
          <li class="questList_item_frist"> 问卷名称:</li>
          <li class="questList_item_two">{{item.name}}</li>
        </ul>
        <ul>
          <li class="questList_item_frist"> 问卷状态:</li>
          <li class="questList_item_two">
            <span v-if="item.status === '1' " style="color: red;">未发布</span>
            <span v-if="item.status === '2' " style="color: green;">收集中</span>
            <span v-if="item.status === '3' " style="color: #999999;">已结束</span>
          </li>
        </ul>
        <ul>
          <li class="questList_item_frist"> 填写状态:</li>
          <li class="questList_item_two">
            <span v-if="item.isWrite === 1 " style="color: green;">已填写</span>
            <span v-if="item.isWrite === 0 && item.status === '3'" style="color: #999999;">未填写</span>
            <button v-if="item.isWrite === 0 && item.status !== '3'"
                    style=" width: 50px; height: 30px; background: #0CAEF5; color: #fff; border-radius: 5px;"
                    @click="goWriteQuest(item)">去填写
            </button>
          </li>
        </ul>
        <ul>
          <li class="questList_item_frist"> 问卷说明:</li>
          <li class="questList_item_frist" style="width: 75%" v-html="item.describe">
          </li>
        </ul>
      </div>
    </div>
  </div>

</template>


<script>
  import {HrHeader} from 'hr-ui'
  import {getStorage, questRequest} from 'hr-utils'
  export default {
    name: 'salary',
    components: {
      HrHeader
    },
    data() {
      return {
        windowHeight: window.innerWidth,
        questList: [],
        userId: getStorage("userID")
      }
    },
    mounted() {
      this.getQuestList()
    },
    methods: {
      goApp() {
        this.$router.push('application')
      },
      goWriteQuest(item) {
        var url = 'http://8.140.136.205:8999/s/' + item.questionnaireId + '?userId='+ this.userId
        window.open(url, '_self')
      },
      getQuestList() {
        var _this = this
        questRequest('tduck-api/an/busQuestionnaireUser/getListByUserId',
          'get',
          'application/json',
          {
            userId: _this.userId
          },
          function (res) {
            _this.questList = res.data
          })
      }
    }
  }
</script>


<style lang='less' scoped>
  .myheader {
    height: .88rem;
    line-height: .88rem;
  }
  .questList_div {
    padding: 0px 2%;
    float: left;
  }
  .questList_item {
    border-radius: 12px;
    margin-top: 2%;
    padding: 0 2%;
    width: 100%;
    background: #ffffff;
    float: left;
  }
  .questList_item ul {
    width: 100%;
    background: rebeccapurple;
    list-style: none;
  }
  .questList_item_frist {
    width: 25%;
    line-height: 30px;
    float: left;
    font-size: 13px;
  }
  .questList_item_two {
    width: 70%;
    height: 30px;
    line-height: 30px;
    float: left;
    font-size: 13px;
  }
</style>
