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
        style="width: 300px; height: 350px; background-image: url('./../static/img/popup/zhounianqing.png'); background-size: 100% 100%;">
        <div
          style="width: 80%; height: 150px; padding: 0 10%; font-size: 14px; color: #323233; position: absolute; top: 30%; text-align: center;">
          <p style="margin: 0px; font-size: 12px;">恭喜{{username}}入职{{orgname}}{{joinsysdateNumber}}周年</p>
          <p style="font-size: 45px; font-weight: bolder; color: #f3bb7b; line-height: 20px;">{{joinsysdateNumber}}</p>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script>
  import dayjs from 'dayjs'
  import storage from 'store'
  import {USERINFO} from '@/utils/mutation-types'
  import {queryPopupList, savePopupList} from '@/api/popup'

  export default {
    name: 'BirthdayPopup',
    data() {
      return {
        show: false,
        joinsysdateNumber: '',
        username: storage.get(USERINFO).name,
        orgname: storage.get(USERINFO).orgname,
        newdate: dayjs(new Date().getTime()).format("YYYY-MM-DD"),
        key: this.newdate + '_staffzhounianqing'
      }
    },
    created() {
      this.init()
    },
    mounted() {
    },
    watch: {},
    methods: {
      init() {
        let joinsysdate = storage.get(USERINFO).joinsysdate
        if (joinsysdate) {
          let date = joinsysdate.substring(joinsysdate.length - 5)
          if (date == this.newdate.substring(this.newdate.length - 5)) {
            this.joinsysdateNumber = this.newdate.substring(0, 4) - joinsysdate.substring(0, 4)
            this.query()
          }
        }
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
