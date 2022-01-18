<template>
  <div>
    <div class="um-header">
      <a class="um-back"  @click="onClickLeft()"></a>
      <h3 style="color: #ffffff">员工问询</h3>
    </div>
    <div :style="{'height': domHeight}" style="overflow-y: auto; padding: 0 14px 10px 14px;" id="bodyDiv">
      <div style="width: 100%;margin-top: 10px;float: left;" v-for="(item,index) in arr">
        <div style="width:40px; height: 100%;" :class="item.className">
          <div style="width: 40px; height: 40px; border-radius: 25px;">
            <img :src="item.headerImg" style="width: 100%; height: 100%;border-radius: 25px;"/>
          </div>
        </div>
        <div
          :style="item.className === 'left' ? 'margin-left: 10px': 'margin-right: 10px'"
          :class="item.className"
          style="width:60%;min-height: 40px; background: #3b73f8; padding: 10px 10px 10px 10px; border-radius: 10px; color: #fff; line-height: 20px; font-size: 14px;">
          <span v-if="item.type == 'content'">{{item.content}}</span>
          <div v-if="item.type == 'list'">
            <span>{{item.content}}</span>
            <ul v-for="(li, index) in item.ulList">
              <a @click="aClick(li)" style="color: #fff;">{{index+1}}、{{li.name}}</a>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div
      style="width: 100%;background: #fff;height: 40px;line-height: 40px;display: flex;position: absolute; bottom: 0px;">
      <van-field
        v-model="message"
        left-icon="smile-o"
        placeholder="请输入内容"
        @blur="getFocus"
      />
      <div style="width: 30%; float: left;">
        <button @click.keyup.enter="btnsub" style="position: relative; left: 10%;">发送</button>
      </div>
    </div>
  </div>

</template>

<script>
  import {Toast} from 'vant';
  import {proveRequest} from '../../../utils/util'
  import { getStorage } from 'hr-utils'
  export default {
    name: "chatBox",
    data() {
      return {
        domHeight: window.screen.availHeight - 85 + 'px',
        headImg: './static/img/pages/chatbox/touxiang.png',
        jiQiImg: './static/img/pages/chatbox/c-i1.png',
        bqImg: './static/img/pages/chatbox/bq.png',
        message: "",
        arr: [
          {
            className: "left",
            content: '您好，我是智能小助手，请问有什么需要帮助的吗？',
            headerImg: './static/img/pages/chatbox/touxiang.png',
            type: "content",
          }
        ],
        userPhoto: getStorage('userinfo').photo
      }
    },
    watch: {
      arr() {
       this.bodyJump()
      }
    },
    mounted() {
      console.log(this.$route.query.arr)
      if(this.$route.query.arr != null || this.$route.query.arr != undefined) {
        this.arr = this.$route.query.arr
      } else{
        this.arr =[
          {
            className: "left",
            content: '您好，我是智能小助手，请问有什么需要帮助的吗？',
            headerImg: './static/img/pages/chatbox/touxiang.png',
            type: "content",
          }
        ]
      }
      // window.onresize = () => {
      //   return (() => {
      //     this.showHeight = this.domHeight - 100//这里需要注意一下可视区高度。
      //   })()
      // }
    },
    methods: {
      aClick(item){
        this.$router.push({name:'employeeInquiryDetail',query:{id:item.id, arr: this.arr}})
      },
      onClickLeft() {
        this.$router.push({name:'application'})
      },
      getFocus() {
        this.domHeight = window.screen.availHeight - 85 + 'px'
        this.bodyJump()
      },
      bodyJump(){
        var div = document.getElementById('bodyDiv')
        setTimeout(function () {
          div.scrollTop = div.scrollHeight
        },100)
      },
      btnsub() {
        if (this.message.trim() == '' || this.message.trim() == 'null') {
          this.message = ''
          return
        }
        // 发送内容
        var sendContent = {
          className: "right",
          content: this.message,
          headerImg: this.userPhoto,
          type: "content",
        }
        this.arr.push(sendContent)
        proveRequest({
          url: 'prove/seProblem/get?',
          method: 'POST',
          mock: false,
          param: { params: this.message },
          contentType: "application/json; charset=utf-8",
          success: (data) => {
            if(data.data.type == 'list') {
              var param = {
                className: "left",
                ulList: data.data.list,
                headerImg: './static/img/pages/chatbox/touxiang.png',
                type:  data.data.type,
                content: '帮您查到了' + this.message + '相关的信息'
              }
              this.arr.push(param)
            }else {
              var param = {
                className: "left",
                content: data.data.data,
                headerImg: './static/img/pages/chatbox/touxiang.png',
                type: "content",
              }
              this.arr.push(param)
            }
            this.message = ''
          }
        })
      },
    }
  }
</script>

<style>
  .left {
    float: left;
  }
  .right{
    float: right;
  }
  .content_left{
    margin-left: 10px;
  }
  .content_right{
    margin-right: 10px;
  }
    button {
    position: absolute;
    right: 40px;
    margin-top: 5px;
    width: 70px;
    border-radius: 30px;
    background: #3b73f8;
    text-align: center;
    height: 30px;
    line-height: 30px;
    color: white;
  }
  .um-header {
    width:100%;
    position: relative;
    height: 45px;
    background: #2479ED;
    z-index: 5;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    border-bottom: 1px solid #ececec;
  }
  .um-back, .um-header-left {
    height:40px;
    line-height: 40px;
    min-width: 40px;
    padding-top: 4px;
    left: 15px;
    position: absolute;
    top: 0px;
    font-weight: 500;
    color: #ffffff;
    text-decoration: none;
  }
  .um-back:before {
    content: "";
    display: inline-block;
    width: 12px;
    height: 12px;
    border-left: 2px solid #ffffff;
    border-bottom: 2px solid #ffffff;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    margin: 0px -3px 0px 0px;
  }
  .um-header h3 {
    font-size: 17px;
    text-align: center;
    display: block;
    margin: 0;
    box-sizing: border-box;
    width: 6.5rem;
    margin: 0 auto;
    height: 44px;
    line-height: 44px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
    pointer-events: none;
    color: #333333;
    font-weight: 500;
  }
</style>
