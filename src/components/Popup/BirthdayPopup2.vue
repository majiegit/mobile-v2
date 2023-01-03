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
        style="width: 300px; height: 350px; background-image: url('./../static/img/popup/shengri.png'); background-size: 100% 100%;">
        <div
          style="width: 80%; height: 150px; padding: 0 10%; font-size: 14px; color: #323233; position: absolute; top: 30%; ">
          <p>亲爱的{{username}}</p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;今天是您的生日,在这个特别的日子里,衷心的祝愿你生日快乐！</p>
          <p style="float: right; color: #999999">{{birthdate}}</p>
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
        username: storage.get(USERINFO).name,
        birthdate: dayjs(new Date().getTime()).format("YYYY-MM-DD"),
        key: '2222212222'
      }
    },
    created() {
      this.init()
    },
    mounted() {
    },
    watch: {},
    methods: {
      init(){
        let birthdate = storage.get(USERINFO).birthdate
        if( birthdate){
          let date =  birthdate.substring(birthdate.length - 5)
          if(date == this.birthdate.substring(this.birthdate.length - 5)) {
            this.query()
          }
        }
      },
      query(){
        let params = {
          key: this.key,
          user_id: storage.get(USERINFO).user_id
        }
        queryPopupList(params).then(res => {
          if(res.data.length == 0){
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
