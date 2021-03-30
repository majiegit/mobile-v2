/*
 * Created by yangyang11 on 2017/11/7.
 *
 */
<template>
  <div class='user-list'>
    <header ref="myheader">
      <hr-header
        title='证明受理人'
        v-on:lcallBack='goApp'
        >
      </hr-header>
    </header>
    <section>
      <div class="search"  ref="mysearch">
        <input type="text" name="" placeholder="搜索姓名" v-model='searchText' @input='handleInput'>
        <i class="icon hrfont hr-magnifier" v-show='searchIconShow'></i>
      </div>
      <div class="wrap" ref="mywrap" :style="{ 'height': wrapHeight + 'px'}">
        <div class="select-wrap">
          <ul>
            <li v-for='(item, index) in selectedUserList' :key=index>
              <span @click='deleteselectedUser(item, index)'> {{ item.psn_name }} </span>
            </li>
          </ul>
          <label>已选 <font>{{ selectedUserList.length }} </font>人</label>
        </div>
        <div class="user-wrap defaultList" v-if='listSwitch == "default"'>
          <mt-loadmore 
            :autoFill='autoFill' 
            :bottom-method="loadBottom" 
            :bottom-all-loaded="allLoaded" 
            ref="loadmore">
            <ul>
              <li v-for='(item, index) in userList' :key=index @click='handleDefaultListClick(item, index)' >
                <!-- <div class="selectIcon">
                  <div class="disActive" v-if='!item.isSelected'>
                    
                  </div>
                  <div class="active" v-else>
                     <i class="icon hrfont hr-check-mark"></i>
                  </div>
                </div> -->
                <img src="" class="photo" v-if='item.photo'>
                <div v-else class="photo" v-bind:style="{background :item.bgc }">
                  {{ item.psn_name.slice(-2) }}
                </div>
                <div class="content">
                  <div class="content-top">
                    <span class="name">
                      {{ item.psn_name }}
                    </span>
                    <span class="title">
                      {{ item.post_name }}
                    </span>
                  </div>
                  <div class="content-middle">{{ item.dept_name }}</div>
                  <div class="content-bottom">{{ item.org_name }}</div>
                </div>
              </li>
            </ul>
          </mt-loadmore>
        </div>
        <div class="user-wrap searchList" v-else>
          <mt-loadmore 
            :autoFill='autoFill' 
            :bottom-method="loadBottom" 
            :bottom-all-loaded="allLoaded" 
            ref="loadmore">
            <ul>
              <li v-for='(item, index) in userList' :key=index  @click='handleSearchListClick(item, index)'>
                <!-- <div class="selectIcon">
                  <div class="disActive" v-if='!item.isSelected'>
                    
                  </div>
                  <div class="active" v-else>
                     <i class="icon hrfont hr-check-mark"></i>
                  </div>
                </div> -->
                <img src="" class="photo" v-if='item.photo'>
                <div v-else class="photo" v-bind:style="{background :item.bgc }">
                  {{ item.psn_name.slice(-2) }}
                </div>
                <div class="content">
                  <div class="content-top">
                    <span class="name">
                      {{ item.psn_name }}
                    </span>
                    <span class="title">
                      {{ item.post_name }}
                    </span>
                  </div>
                  <div class="content-middle">{{ item.dept_name }}</div>
                  <div class="content-bottom">{{ item.org_name }}</div>
                </div>
              </li>
            </ul>
          </mt-loadmore>
        </div>
      </div>
    </section>
    <!-- <footer id="btn" :style="{ 'margin-top': currentHeight + 'px'}">
      <span @click='submitLeave'>提交</span>
    </footer> -->
  </div>
</template>

<script>
  import { fetchData, setPhotoColorByName } from 'hr-utils'
  import { HrHeader } from 'hr-ui'
  import { Toast, Loadmore, Indicator } from 'mint-ui';
  export default {
    name: 'approverList',
    data (){
      return {
        currentHeight: this.height,
        wrapHeight: this.height,
        searchText: '',
        searchIconShow: true,
        userList:[],
        selectedUserList: [],
        pageno: 0,
        allLoaded: true,  // 去分页
        autoFill : false,
        listSwitch: 'default',  // 控制 显示默认用户 or  搜索出来的用户列表
        params: {}
      }
    },
    components: {
       HrHeader
    },

    watch:{
      height(val) {
          if (val) {
              this.currentHeight = val;
          }
      },
      height(val) {
          if (val) {
              this.wrapHeight = val;
          }
      },
      searchText(){
        this.searchIconShow = this.searchText ? false : true
        // searchText为空 显示默认用户列表面板  否则显示搜索用户面板
        if(this.searchText){
          this.listSwitch = 'searchUserList'
        }else{
          this.listSwitch = 'default'
        }
      },
    },

    created(){
      this.queryApproverList()
      // this.userList = this.$route.query.node.operators
      this.params = this.$route.params
    },
    mounted(){
        this.currentHeight = document.documentElement.clientHeight - this.$refs.myheader.offsetHeight - this.$refs.mysearch.offsetHeight;
        this.wrapHeight = document.documentElement.clientHeight - this.$refs.myheader.offsetHeight - this.$refs.mysearch.offsetHeight;
    },
    methods : {
      queryApproverList() {
        Indicator.close()
        fetchData({
          url : 'hrssc/portal/attest/getApplyer',
          method : 'post',
          param : {
            //pk_node: this.$route.query.pk_node,
            value: this.searchText,
            pageno: this.pageno,
            pagesize: 50
          },
          mock : false,  
          contentType : "application/json",
          success : res=> {
            Indicator.close()
            if(res.data.content.length < 1){
              this.$refs.loadmore.onBottomLoaded()  
              this.allLoaded = true
              // Toast('已经没有更多了！')
            }
            this.userList = this.pretreatment(res.data.content)
          },
          error : error=> {
            Indicator.close()
            Toast(error.message)
          }
        })
      },

      pretreatment(data){
        for(let i=0; i<data.length;i++){
          data[i].bgc = setPhotoColorByName(data[i].psn_name)
          data[i].isSelected = false
        }
        return data
      },

      handleInput() {
        let searchval = this.searchText;
        let specialKey = "[`~!#$^&*()=|{}':;',\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘’";//Specific Key list
        if(searchval != null && searchval != "" && searchval.trim().length > 0){
            //var realkey = String.fromCharCode(searchval);
            var flg = false;
            flg = (specialKey.indexOf(searchval) >= 0);
            if (flg) {
                Toast('请勿输入特殊字符: ' + searchval);//单行提示
                return false;
            }
        }
        if(searchval == "" || searchval.trim().length == 0){
            return false;
        }
        this.queryApproverList()
      },

      handleSearchListClick(user, index) {
        this.params.provename = user.psn_name
        this.params.subdata.applyUser = user.cuserid
        this.$router.push({
          name: 'prove',
          params: {
            params: this.params
          },
          query: {
            isEdit: true
          }
        })
        // this.selectUserFromListWithClick(user, index)
        // let s = this.selectedUserList,
        //   us = this.userList,
        //   flag = false
     
        // for(let i = 0; i< s.length; i++) {
        //   if(user.user_id == s[i].user_id){
        //     flag = true
        //     break
        //   }
        // }

        // //  搜索出来人已被选中  再次点击  视为删除
        // if(flag) {
        //    this.deleteselectedUser(user)
        // }else{
        //   // 未被选中  直接选中
        //   this.selectedUserList.push(user)
        //   for(let i = 0; i< us.length; i++) {
        //     if(user.user_id == us[i].user_id){
        //       this.userList[i].isSelected = true
        //       break
        //     }
        //   }
        // }
        // this.listSwitch = 'default'
        // this.searchText = '' // 选定离手
      },

      handleDefaultListClick(user, index){
        // 避免重复选择
        // let s = this.selectedUserList,
        //   flag = true

        // for (var i = 0; i< s.length; i++){
        //   if(user.user_id == s[i].user_id){
        //     flag = false
        //     break
        //   }
        // }
        
        // if(flag){
        //   this.userList[index].isSelected = true
        //   this.selectedUserList.push(user)
        // }else{
        //   this.deleteselectedUser(user)
        // }
        this.params.provename = user.psn_name
        this.params.subdata.applyUser = user.cuserid
        this.$router.push({
          name: 'prove',
          params: {
            params: this.params
          },
          query: {
            isEdit: true
          }
        })
      },

      deleteselectedUser(selectedUser) {
        let s = this.selectedUserList,
          us = this.userList

        for (let i = 0; i< s.length; i++){
          if(selectedUser.user_id == s[i].user_id)
            this.selectedUserList.splice(i, 1)
        }

        for(let i = 0; i< us.length; i++) {
          if(selectedUser.user_id == us[i].user_id)
            this.userList[i].isSelected = false
        }
      },
      //返回首页
      goApp() {
        this.$router.push({
          name: 'prove',
          params: {
            params: this.params,
            approverUser: 'aaaaaa'
          },
          query: {
            isEdit: true
          }
        })
      },

      submitLeave() {
        Indicator.open({
          text: '单据提交中，请稍等...',
          spinnerType: 'fading-circle'
        })
        
        let selectedUserIds = "";
        if(this.selectedUserList != null && this.selectedUserList.length > 0){
            for(let i=0;i<this.selectedUserList.length;i++){
                selectedUserIds += this.selectedUserList[i].user_id + ",";
            }
            selectedUserIds = selectedUserIds.substring(0, selectedUserIds.length-1);
        }
        fetchData({
          url : 'hrssc/portal/tbmquery/submitBill',
          method : 'post',
          param : {
            pk_h: this.$route.query.pk_h,
            billtype: this.$route.query.billtype,  //单据类型
            operatorId: selectedUserIds,  //审批人id，以逗号'，'分隔
            nodeId: this.$route.query.nodeId,  // 节点id
            flowId: this.$route.query.flowId  // 流程id
          },
          mock : false,
          contentType : "application/json",
          success : res=>{
            this.ApplyList = res.data
            Indicator.close()
            this.$router.push({
                name: 'myApply',
                query: {
                    
                }
            })
          },
          error : error=> {
            Indicator.close()
            Toast(error.message)
          }
        })
      },

      loadBottom(){
        this.pageno ++ 
        this.queryApproverList()
      },
      hasFocus(){ // @focusin="hasFocus" @focusout="outFocus"
          var btn = document.querySelector('#btn');
          btn.style.display = 'none';
      },
      outFocus(){
          var btn = document.querySelector('#btn');
          setTimeout(function(){
              btn.style.display = 'block';
          }, 1000);
      }
    },
  }
</script>

<style lang='less' scoped>
.user-list{
  header{
    position: fixed;
    width: 100%;
    height: .88rem;
    line-height: .88rem;
  }
  section{
  margin-top: .88rem;
  .search{
    position: fixed;
    top: .88rem;
    width: 100%;
    height: .88rem;
    line-height: .88rem;
    color: #CCCCCC;
    letter-spacing: -0.41px;
    font-family: PingFangSC-Regular;
    /*margin-bottom: .1rem;*/
    input{
      text-align: center;
      height: 100%;
      width: 100%;
      font-size: 0.3rem;
    }
    i{
      position: absolute;
      display: block;
      top: 6%;
      left: 36%;
      font-size: .4rem;
    }
  }
  .wrap{
    position: fixed;
    width: 100%;
    height: 78%;
    overflow-y: scroll;
    margin-top: .96rem;
    .select-wrap{
      padding: .15rem .22rem;
      background: #fff;
      ul{
        white-space: nowrap;
        overflow-x: scroll;
        li{
            display: inline-block;
            height: .6rem;
            min-width: 1.33rem;
            margin: 0.1rem;
            padding: 0 .2rem;
            background: #e3f6ff;
            border-radius:2px;
            line-height: 0.6rem;
            font-size: 0.32rem;
            color: #0CAEF5;
            letter-spacing:0;
            text-align:center;
        }
      }
      ul::-webkit-scrollbar{  
        display: none; 
      }
      label{
        display: block;
        font-size: 0.24rem;
        color: #666666;
        font{
          color: red;
        }
      }
    }
    .user-wrap{
      ul{
        background: #fff;
        border-top: 1px solid #ddd;
        li{
          height: 1.6rem;
          padding: 0 0 0 .3rem;
          margin-top: .2rem;
          list-style: none;
          .selectIcon{
            position: relative;
            float: left;
            width: 13%;
            height: 100%;
            div{
              position: absolute;
              height: .44rem;
              width: .44rem;
              top: 23%;
              left: 6%;
              border-radius: 50%;
            }
            .disActive{
              border: 1px solid #d5d5d5;
            }
            .active{
              background: #0CAEF5;
              .hrfont{
                color: #fff;
                font-size: .4rem;
              }
            }
          }
          .photo{
            float: left;
            width: 16%;
            height: 1.2rem;
            border-radius: 50%;
            /*background: red;*/
            line-height: 1.2rem;
            text-align: center;
            font-family: PingFangSC-Regular;
            font-size: 0.38rem;
            color: #FFFFFF;
            letter-spacing: 0;
          }
          .content{
            float: right;
            height: 100%;
            width: 78%;
            padding-bottom: .2rem;
            padding-right: .2rem;
            border-bottom: 1px solid #ddd;
            .content-top{
              .name{
                font-size: 0.34rem;
                color: #333333;
                letter-spacing: 0;
              }
              .title{
                float: right;
                font-size: 0.3rem;
                color: #88A3AF;
                letter-spacing: 0;
              }
            }
            .content-middle{
              font-size: 14px;
              color: #999999;
              letter-spacing: 0;
            }
            .content-bottom{
              font-size: 0.28rem;
              color: #999999;
              letter-spacing: 0;
            }
          }
        }
      }
    }
    .searchList {
      .content{
        width: 78%;
      }
    }
    .defaultList{
      .content{
        width: 68%;
      }
    }
  }
}
}


// footer{
//   /*position: fixed;*/
//   width: 100%;
//   height: 50px;
//   left: 0;
//   bottom: 0;
//   background: #0caef5;
//   font-size:0.38rem;
//   color:#ffffff;
//   line-height: 50px;
//   letter-spacing:-0.39px;
//   text-align:center;
//   span{
//     float: left;
//     height: 100%;
//     width: 100%;
    
//   }
// }
</style>