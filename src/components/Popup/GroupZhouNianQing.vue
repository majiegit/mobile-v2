<template>
  <van-popup
    v-model="show"
    :close-on-click-overlay="false"
    :closeable="true"
    close-icon="close"
    close-icon-position="bottom-left"
    @click-close-icon="close"
    id="BirthdayPopup"
  >
    <!-- 最外层Div-->
    <div style="width: 300px; height: 400px;">
      <!-- 图片区域-->
      <div
        style="width: 300px; height: 350px; background-image: url('./../static/img/popup/groupzhounianqing.png'); background-size: 100% 100%;">
        <div
          style="width: 80%; height: 150px; padding: 0 10%; font-size: 14px; color: #323233; position: absolute; top: 30%; text-align: center;">
          <p style="font-size: 45px; font-weight: bolder; color: #f3bb7b; line-height: 40px; margin-right: 35px;">
            {{groupcreatedateNumber}}</p>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script>
  import dayjs from 'dayjs'
  import storage from 'store'
  import {USERINFO} from '@/utils/mutation-types'
  import {queryPopupList, savePopupList, queryGroupCreateTime} from '@/api/popup'

  export default {
    name: 'GroupZhouNianQing',
    data() {
      return {
        show: false,
        groupcreatedateNumber: '',
        newdate: dayjs(new Date().getTime()).format("YYYY-MM-DD"),
        username: storage.get(USERINFO).name,
        orgname: storage.get(USERINFO).orgname,
        key: this.newdate + '_groupzhounianqing'
      }
    },
    created() {
      this.init()
    },
    watch: {},
    mounted() {
    },
    watch: {},
    methods: {
      init() {
        let parmas = {
          pk_psndoc: storage.get(USERINFO).pk_psndoc
        }
        queryGroupCreateTime(parmas).then(res => {
          let groupcreatedate = res.data
          if (groupcreatedate) {
            groupcreatedate = res.data.substring(0, 10)
            let olddate = groupcreatedate.substring(groupcreatedate.length - 5)
            let newdate = this.newdate.substring(this.newdate.length - 5)
            if (newdate == olddate) {
              this.groupcreatedateNumber = this.newdate.substring(0, 4) - groupcreatedate.substring(0, 4)
              this.query()
            }
          }
        })
      },
      query() {
        let params = {
          key: this.key,
          user_id: storage.get(USERINFO).user_id
        }
        queryPopupList(params).then(res => {
          if (res.data.length == 0) {
            this.show = true
          }
        })
      },
      close() {
        let params = {
          key: this.key,
          user_id: storage.get(USERINFO).user_id
        }
        savePopupList(params).then(res => {
          this.show = false
        })
      }
    }

  }
</script>
<style>

  #BirthdayPopup {
    background-color: transparent !important;
  }

  #BirthdayPopup .van-popup__close-icon {
    left: 50% !important;
    transform: translateX(-50%);
  }
</style>
