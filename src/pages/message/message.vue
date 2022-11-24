<template>
  <div class="message">
    <Header title="消息中心" @clickLeft="clickLeft" @clickRight="clickRight" rightIcon="bars"></Header>
    <van-tabs v-model="messageType" color="#2479ED" title-active-color="#2479ED" title-inactive-color="#000"
              @change="changeTab">
      <!--通知消息-->
      <van-tab title="通知消息" name="notice">
        <van-cell-group>
          <van-cell v-for="(notice,index) in noticeMessageList" :key="index">
            <template #title>
              <van-icon name="volume-o"/>
              <span>{{notice.subject}}</span>
              <van-tag plain :type="notice.isread === 'Y' ? 'primary' : 'warning'">{{notice.isread === 'Y' ? '已读' :
                '未读'}}
              </van-tag>
            </template>
            <template #label>
              <p class="custom-title">{{notice.content}}</p>
              <span>发送时间：{{notice.sendtime}}</span>
              <span :class="notice.isread === 'Y' ? 'isreadClass' : 'isreadNotClass'"
                    @click="isreadActionClick(notice)">{{notice.isread === 'Y' ? '标记为未读' : '标记为已读'}}</span>
            </template>
          </van-cell>
        </van-cell-group>
        <div v-if="noticeMessageList.length == 0">
          <van-empty description="暂无数据"/>
        </div>
      </van-tab>

      <!--工作任务-->
      <van-tab title="工作任务" name="approve">
        <van-cell-group>
          <van-cell v-for="(approve,index) in approveMessageList" :key="index"
                    :to="{ name: BillTypeMap[approve.billtype].routerApprovePath, query: { pk_h: approve.billid, billtype: approve.billtype}}"
                    is-link>
            <template #title>
              <van-icon name="records"/>
              <span>{{approve.subject}}</span>
              <van-tag plain :type="approve.isread === 'Y' ? 'primary' : 'warning'">{{approve.isread === 'Y' ?
                '已审批':'未审批'}}
              </van-tag>
            </template>
            <template #label>
              <p class="custom-title">{{approve.content}}</p>
              <span>发送时间：{{approve.sendtime}}</span>
            </template>
          </van-cell>
        </van-cell-group>
        <div v-if="approveMessageList.length == 0">
          <van-empty description="暂无数据"/>
        </div>
      </van-tab>
    </van-tabs>

    <!--操作区域-->
    <van-popup v-model="show" position="top">
      <van-field label="处理状态：">
        <template #input>
          <van-button size="mini" :type="item.isread === isread ? 'info' : 'default'"
                      v-for="(item,index) in (messageType === 'notice' ? noticeIsreadList : approveIsreadList)"
                      :key="index" @click="isreadClick(item)">{{item.name}}
          </van-button>
        </template>
      </van-field>
      <van-field label="单据类型：" v-if="messageType === 'approve'">
        <template #input>
          <van-button size="mini" :type="item.type === billtype ? 'info' : 'default'"
                      v-for="(item,index) in approveTypeList"
                      :key="index" @click="billtypeClick(item)" >{{item.name}}</van-button>
        </template>
      </van-field>
      <van-row type="flex" justify="center">
        <van-col span="22" style="padding: 5px 0px;">
          <van-button type="info" block round @click="okButton">确定</van-button>
        </van-col>
      </van-row>
    </van-popup>
  </div>
</template>
<script>
  import Header from '@/components/Header/Index'
  import {queryNoticeMessageList, queryApproveMessageList, updateNoticeMessageIsRead} from '@/api/message'
  import {approveStateName, approveStateColorList, BillTypeList, BillTypeMap} from '@/utils/ConstantUtils'
  import {userInfoUserId} from '@/utils/storageUtils'
  import {Toast} from 'vant';

  export default {
    name: 'message',
    components: {Header},
    data() {
      return {
        show: false,
        isread: '',
        billtype: '',
        noticeIsreadList: [
          {
            name: '全部',
            isread: ''
          },
          {
            name: '已读',
            isread: 'Y'
          },
          {
            name: '未读',
            isread: 'N'
          }
        ],
        approveTypeList: [],
        approveIsreadList: [
          {
            name: '全部',
            isread: ''
          },
          {
            name: '已审批',
            isread: 'Y'
          },
          {
            name: '未审批',
            isread: 'N'
          }
        ],
        messageType: 'notice',
        noticeMessageList: [],
        noticeMessageListBak: [],
        approveMessageList: [],
        approveMessageListBak: [],
        BillTypeMap
      }
    },
    created() {
    },
    mounted() {
      this.queryNotiveMessage()
      this.queryApproveMessage()
    },
    methods: {
      // 改变标签事件
      changeTab(name) {
        // console.log(name)
        // storage.set(MESSAGETYPE, name)
      },
      /**
       * 标记为已读
       */
      isreadActionClick(message) {
        let params = {
          pk_message: message.pk_message,
          isread: message.isread === 'Y' ? 'N' : 'Y'
        }
        updateNoticeMessageIsRead(params).then(res => {
          message.isread = message.isread === 'Y' ? 'N' : 'Y'
        })
      },
      /**
       * 获取审批通知消息单据类型
       */
      getApproveBillType(messageList) {
        let arr = []
        let item = {
          name: '全部',
          type: '',
        }
        arr.push(item)

        for (let i = 0; i < messageList.length; i++) {
          let filter = arr.filter(item => item.type === messageList[i].billtype)
          if (filter.length === 0) {
            arr.push({
              name: messageList[i].billtypename,
              type: messageList[i].billtype
            })
          }
        }
        this.approveTypeList = arr
      },
      /**
       * 查询通知消息
       */
      queryApproveMessage() {
        let params = {
          userId: userInfoUserId
        }
        if (this.isread) {
          params.isread = this.isread
        }
        Toast.loading({
          message: '加载中...',
          duration: 0
        })
        queryApproveMessageList(params).then(res => {
          this.approveMessageList = res.data
          this.approveMessageListBak = res.data
          this.getApproveBillType(this.approveMessageList)
          Toast.clear()
        })
      },
      /**
       * 查询通知消息
       */
      queryNotiveMessage() {
        let params = {
          userId: userInfoUserId
        }
        if (this.isread) {
          params.isread = this.isread
        }
        Toast.loading({
          message: '加载中...',
          duration: 0
        })
        queryNoticeMessageList(params).then(res => {
          this.noticeMessageList = res.data
          this.noticeMessageListBak = res.data
          Toast.clear()
        })
      },
      clickLeft() {
        this.$router.push({name: 'application'})
      },
      clickRight() {
        this.show = true
      },
      billtypeClick(item){
        this.billtype = item.type
      },
      isreadClick(item) {
        this.isread = item.isread
      },
      okButton() {
        if (this.messageType === 'notice') {
          this.noticeMessageList = this.noticeMessageListBak.filter(item => item.isread === this.isread)
        } else {
          if(this.isread && this.billtype){
            this.approveMessageList = this.approveMessageListBak.filter(item => (item.isread === this.isread && item.billtype === this.billtype))
          }else {
            if(this.isread){
              this.approveMessageList = this.approveMessageListBak.filter(item => item.isread === this.isread)
            }
            if(this.billtype){
              this.approveMessageList = this.approveMessageListBak.filter(item => item.billtype === this.billtype)
            }
          }
        }
        this.show = false
      }
    }
  }
</script>

<style lang='less'>
  .isreadClass {
    float: right;
    color: #2479ed;
  }

  .isreadNotClass {
    float: right;
    color: #ff976a;
  }
</style>
