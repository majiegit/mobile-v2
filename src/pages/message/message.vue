<template>
  <div class="message">
    <Header title="消息中心" @clickLeft="clickLeft" @clickRight="clickRight" rightIcon="bars"></Header>
    <van-tabs v-model="messageType" color="#2479ED" title-active-color="#2479ED" title-inactive-color="#000">
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
                    :is-link="approve.isread === 'N' ? true: false">
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
          <van-button size="mini" type="info">全部</van-button>
          <van-button size="mini">加班单</van-button>
          <van-button size="mini">请假单</van-button>
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
  import {userInfoUserId} from '@/utils/storageUtils'
  import {Toast} from 'vant';

  export default {
    name: 'message',
    components: {Header},
    data() {
      return {
        show: false,
        isread: '',
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
        approveMessageList: []
      }
    },
    mounted() {
      this.queryNotiveMessage()
      this.queryApproveMessage()
    },
    methods: {
      /**
       * 标记为已读
       */
      isreadActionClick(message) {
        let params = {
          pk_message: message.pk_message,
          isread: message.isread === 'Y' ? 'N': 'Y'
        }
        updateNoticeMessageIsRead(params).then(res => {
          message.isread = message.isread === 'Y' ? 'N': 'Y'
        })
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
          Toast.clear()
        })
      },
      clickLeft() {
        this.$router.push({name: 'application'})
      },
      clickRight() {
        this.show = true
      },
      isreadClick(item) {
        this.isread = item.isread
      },
      okButton() {
        if (this.messageType === 'notice') {
          this.queryNotiveMessage()
        } else {
          this.queryApproveMessage()
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
