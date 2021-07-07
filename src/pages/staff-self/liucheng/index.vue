<template>
  <div>
    <mt-popup
      v-model="popupVisible"
      position="right"
      :modal ='false'
      style="width: 100%; height: 100%;"
      :closeOnClickModal="closeOnClickModal">
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
          <ul class="ul" ref="ul">
            <li v-for="(item,i) in topData" :key="i">
              <span><img src="../../../../static/img/pages/zhipai/user.png" style="width: 6%;"/></span>
              <span>{{item.label}}</span>
              <span style="position: absolute; right:7%;">
              <input type="checkbox" class="top_checkbox" @change="changeCheck($event,'top', i)"/>
            </span>
            </li>
          </ul>
        </div>
        <div  class="center_button">
          <button :disabled="bottomData.length === 0 ? 'true' : 'false'" :style="{ 'background': bottomData.length === 0 ? '#C0C0C0' : '#2692DD'}">上移</button>
          <button style="margin-left: 4%;">全部下移</button>
          <button style="margin-left: 4%;" :disabled="bottomData.length === 0 ? 'true' : 'false'" :style="{ 'background': bottomData.length === 0 ? '#C0C0C0' : '#2692DD'}">全部上移</button>
          <button style="margin-left: 4%;" v-on:click="bottomButton">下移</button>
        </div>
        <div  class="user user-two">
          <p class="user_title">
            <img src="../../../../static/img/pages/zhipai/user2.png" style="width: 6%;"/>
            <span>用户</span>
            <input type="text" class="search_title"/>
          </p>
          <ul class="ul">
            <li v-for="(item,i) in bottomData" :key="i">
              <span><img src="../../../../static/img/pages/zhipai/user.png" style="width: 6%;"/></span>
              <span>{{item.label}}</span>
              <span style="position: absolute; right:7%;">
              <input type="checkbox"  class="bottom_checkbox" @change="changeCheck($event,'bottom', i)"/>
            </span>
            </li>
          </ul>
        </div>
        <div class="user_foot">
          <button style="margin-left: 4%;">确认</button>
          <button style="margin-left: 4%;">取消</button>
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
  import { HrHeader } from 'hr-ui'
  import { fetchData, getStorage } from 'hr-utils'
  import { Toast, Indicator, MessageBox } from 'mint-ui'
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
        zhiPaiData: [],
        buttonDisblay: true,
        modal: false,
        closeOnClickModal: false,
        popupVisible: true,
        topData: generateData(),
        bottomData: [],
        topCheckData: [],
        bottomCheckData: []
      }
    },
    props: {
      submitType: '',
      popupVisible: {
        type: Boolean,
        default: true
      },
      leftValue: {
        type: Array,
        default () {
          return []
        }
      },
      rightValue: {
        type: Array,
        default () {
          return []
        }
      },
      pk_h: '',
      billtype: '',
      workflownotes: '',
      billactive: ''
    },
    methods: {
      // 上移按钮
      // 下移按钮
      bottomButton() {
        if(this.topCheckData.length === 0 ){
          Toast('请选择用户');
        }else {
          for(var i=0; i<this.topCheckData.length; i++) {
            for(var j= 0; j<this.topData.length; j++){
              if(this.topData[j].key === this.topCheckData[i]){
                this.bottomData.push(this.topData[j])
                this.topData.splice(j,1)
                break
              }
            }
          }
         var checkend = this.$refs.ul.getElementsByClassName('top_checkbox')
          for(var i=0; i<checkend.length; i++){
            checkend[i].checked = false
          }
        }
      },
      // 改变状态
      changeCheck(e,str,i) {
       var checked = e.target.checked
        if( str === 'top'){
          if(checked) {
            this.topCheckData.push(this.topData[i].key)
          } else{
            var index = this.topCheckData.indexOf(this.topData[i].key)
            if(index !== -1){
              this.topCheckData.splice(index,1)
            }
          }
          console.log(this.topCheckData)
        }else if( str === 'bottom'){
          if(this.bottomCheckData.indexOf(this.bottomData[i].key) === -1) {
            this.bottomCheckData.push(this.bottomData[i].key)
          } else{
            this.bottomCheckData.splice(i,1)
          }
        }
      },
      goApp() {
       this.popupVisible = false
      },
      selectIsZhiPai() {
        fetchData({
          url: 'hrssc/portal/wf/judgeAssign',
          method: 'post',
          param: {
            pk_h: '0001A71000000000HHJW',
           // billtype: this.$route.query.billtype,
            billtype: 'overtime',
            oprationtype: 'Commit'
          },
        }).then(res => {
          this.loading = false
          if (res.statusCode === 200) {
            if (res.data !== {}) {
              this.zhiPaiData = res.data.data
              if (this.zhiPaiData.isAssigned === 'true') {
                // 需要调用指派并提交
                this.zhiPaiDialogVisible = true
              } else {
                // 无需指派，直接提交
                this.submitForm()
              }
            } else {
              // 无需指派，直接提交
              this.submitForm()
            }
          }
        })
      }
    },
    updated () {
    },
    created () {
      this.selectIsZhiPai()
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
