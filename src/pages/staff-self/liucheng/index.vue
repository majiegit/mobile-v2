<template>
  <div>
    <div class="myheader">
      <hr-header
        title='流程指派'
        v-on:lcallBack='goApp'
      >
      </hr-header>
    </div>

    <div style='width: 100%; height: 95%;  overflow: auto; position: relative; background: #fff; padding: 0 2%;'>
      <div class="user user-top">
        <p class="user_title">
          <img src="../../../../static/img/pages/zhipai/user2.png" style="width: 6%;"/>
          <span>用户</span>
          <input type="text" class="search_title"/>
        </p>
        <ul class="ul">
          <li v-for="(item,i) in topData" :key="i">
            <span><img src="../../../../static/img/pages/zhipai/user.png" style="width: 6%;"/></span>
            <span>{{item.label}}</span>
            <span style="position: absolute; right:7%;">
              <input type="checkbox" value="Bike" />
            </span>
          </li>
        </ul>
      </div>
      <div  class="center_button">
        <button>上移</button>
        <button style="margin-left: 4%;">全部上移</button>
        <button style="margin-left: 4%;">下移</button>
        <button style="margin-left: 4%;">全部下移</button>
      </div>
      <div  class="user user-two">
        <p class="user_title">
          <img src="../../../../static/img/pages/zhipai/user2.png" style="width: 6%;"/>
          <span>用户</span>
          <input type="text" class="search_title"/>
        </p>
        <ul class="ul">
          <li v-for="(item,i) in topData" :key="i">
            <span><img src="../../../../static/img/pages/zhipai/user.png" style="width: 6%;"/></span>
            <span>{{item.label}}</span>
            <span style="position: absolute; right:7%;">
              <input type="checkbox" value="Bike" />
            </span>
          </li>
        </ul>
      </div>
      <div class="user_foot">
        <button style="margin-left: 4%;">确认</button>
        <button style="margin-left: 4%;">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
  import { HrHeader } from 'hr-ui'
  export default {
    components: {
      HrHeader
    },
    data: function (){
      const generateData = _ => {
        const data = []
        for (let i = 1; i <= 15; i++) {
          data.push({
            key: i,
            label: '备选项' + i,
            disabled: i % 4 === 0
          })
        }
        return data
      }
      return {
        topData: generateData()

      }
    },
    methods: {
      goApp() {
        this.$router.push('application')
      }
    },
    updated () {
    },
    created () {
    },
    mounted () {
    }
  }
</script>
<style>
  .myheader{
    height: .88rem;
    line-height: .88rem;
  }
  .search_title{
    width: 30%;
    height: 50%;
    background: #fff;
    position: absolute;
    right: 7%;
    padding-left: 2%;
    border-radius: 25px;
  }
  .ul{
    position: relative;
    width: 100%;
  }
  .ul li{
    width: 100%;
    height: 0.55rem;
    flex-direction:row;
    padding: 0px 0px 1% 6%;
  }
  .ul img{
    position: relative;
    top: 12%;
  }
  .center_button{
    width: 100%;
    height:10%;
    background: #fff;
  }
  .center_button button{
    position: relative;
    top: 25%;
    background: #2692DD;
    width: 21%;
    height: 50%;
    color: #FFFFFF;
    border-radius: 7px;
  }
  .user{
    width: 100%;
    height:35%;
    background: rgb(245,245,245);
    border-radius: 5px;
    border:  1px solid #0B0306;
    overflow: auto;
  }
  .user-top{
    margin-top: 2%;
  }
  .user_title{
    width: 100%;
    height: 15%;
    padding: 2% 2%;
    position: relative;
  }
  .user_title span{
    font-size: 0.3rem;
    position: relative;
    top: -20.5%;
  }
  .user_foot{
    width: 100%; height:18%; background: #fff;
    text-align: center;
  }
  .user_foot button{
    position: relative;
    top: 45%;
    background: #2692DD;
    width: 30%;
    height: 31%;
    color: #FFFFFF;
    border-radius: 7px;
  }
</style>
