<template>
  <div>
    <!--导航栏区域-->
    <Header :title="title" @clickLeft="clickLeft"/>
    <div :style="{ 'height': currentHeight }" style="overflow-y: auto; background-color: rgb(245,248,255)">
      <div style="width: 100%; text-align: center;" v-if="userInfo">
        <div>
          <van-image
            v-if="userInfo.photo"
            style="margin-top: 20px; "
            round
            width="100px"
            height="100px"
            :src="userInfo.photo"
          />
          <div class="head_text" v-else>
            <span style="font-size: 16px; -webkit-transform: scale(0.5)">{{getName(userInfo.name)}}</span>
          </div>
        </div>
        <div>
          <p style="font-size: 18px; line-height: 18px; margin: 10px;">{{ userInfo.name }}</p>
          <p style="font-size: 14px; line-height: 14px; margin: 10px; color: #999999;">{{ userInfo.orgname }}</p>
        </div>
      </div>
      <van-row type="flex" justify="center">
        <van-col span="22" v-for="(item,index) in detailItemList" :key="index" style="margin-top:10px; ">
          <div class="detail">
            <div class="detail_left">
              <van-icon :name="item.icon" size="30"/>
            </div>
            <div class="detail_right">
              {{item.name}}: {{userInfo[item.value]}}
            </div>
          </div>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
  import Header from '@/components/Header/Index'
  import {queryPsndocInfo} from '@/api/addressBook'

  export default {
    components: {
      Header
    },
    name: "Index",
    data() {
      return {
        title: '通讯录',
        currentHeight: '',
        userInfo: '',
        detailItemList: [
          {
            name: '电话',
            value: 'mobile',
            icon: 'phone-o'
          },
          {
            name: '邮箱',
            value: 'mobile',
            icon: 'envelop-o'
          },
          {
            name: '部门',
            value: 'deptname',
            icon: 'idcard'
          }, {
            name: '机构',
            value: 'orgname',
            icon: 'wap-home-o'
          }
        ]
      }
    },
    mounted() {
      this.currentHeight = (document.documentElement.clientHeight - 46) + 'px'
      this.getPsndocInfo(this.$route.query.pk_psndoc)
    },
    methods: {
      /**
       * 获取名字
       */
      getName(psndocname) {
        console.log(psndocname)
        let name = ''
        if (psndocname.length == 2) {
          name = psndocname
        } else if (psndocname.length == 3) {
          name = psndocname.substring(1)
        } else {
          name = psndocname.substring(0, 2)
        }
        return name
      },
      /**
       * 返回事件
       */
      clickLeft() {
        this.$router.go(-1)
      },
      /**
       * 查询员工基本信息
       */
      getPsndocInfo(pk_psndoc) {
        let params = {
          pk_psndoc: pk_psndoc
        }
        queryPsndocInfo(params).then(res => {
          this.userInfo = res.data
        })
      },
    }
  }
</script>

<style scoped lang="less">

  .detail {
    width: 100%;
    height: 80px;
    background-color: #fff;
    border-radius: 10px;
    color: #2479ed;
    &_left {
      width: 30px;
      height: 30px;
      padding: 15px;
      margin: 10px;
      border-radius: 50%;
      background: rgb(219, 234, 255);
      float: left;
      text-align: center;
    }
    &_right {
      width: 240px;
      height: 60px;
      margin: 10px;
      float: left;
      font-size: 18px;
      font-weight: bolder;
      font-family: 黑体;
      line-height: 60px;
    }
  }

  .head_text {
    width: 100px;
    height: 100px;
    line-height: 100px;
    margin: 0 auto;
    text-align: center;
    background-color: #0c89f1;
    margin-top: 20px;
    color: #fff;
    border-radius: 50%;
  }
</style>
