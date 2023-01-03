<template>
  <div>
    <!--导航栏区域-->
    <Header :title="title" :rightText="right_text"
            @clickLeft="clickLeft"
            @clickRight="clickRight"/>
    <div :style="{ 'height': currentHeight }" style="overflow-y: auto;">
      <div v-if="!show">
        <!--已选择数据区域-->
        <van-cell v-if="selectTreeData.length != 0" style="color: #2479ed">
          <template #title>
            <span v-for="(tree, index) in selectTreeData" :key="index">
              <span @click="selectTreeDataClick(tree)">{{tree.name}}</span>
              <van-icon name="arrow" v-if="index !== selectTreeData.length - 1"/>
            </span>
          </template>
        </van-cell>
        <!--带选择数据区域-->
        <van-cell v-for="(item,index) in waitSelectData" :key="index">
          <template #title>
            <div style="width: 100%;" @click="clickWait(item)">
              <span :style="item.select ? 'color: #2479ed' : ''">{{item.name}}</span>
            </div>
          </template>
          <template #right-icon>
            <van-icon name="success" color="#2479ed" v-if="item.select" class="select_right_icon"/>
            <van-icon name="arrow" class="select_right_icon"
                      @click="getCascadeData(item)"/>
          </template>
        </van-cell>
      </div>
    </div>
  </div>
</template>

<script>

  import {Toast} from 'vant'
  import Header from '@/components/Header/Index'

  export default {
    components: {
      Header
    },
    name: "orgstructure",
    data() {
      return {
        title: '选择组织',
        right_text: '完成',
        selectData: {},
        selectTreeData: [],
        currentHeight: '',
        waitSelectData: [],
        orgData: [],
        show: false,
        downloadData: {
          url: '',  //需要转化成二维码的网址
          icon: require('./../../../static/img/inductionInfo/org.png')  //二维码中间的图片,可以不设置
        }
      }
    },
    mounted() {
      this.currentHeight = (document.documentElement.clientHeight - 46 - 50) + 'px'
      this.getOrgs()
    },
    methods: {
      //点击保存
      toSave() {
        html2canvas(document.getElementById("imageWrapper")).then(canvas => {
          let saveUrl = canvas.toDataURL('image/png')
          let aLink = document.createElement('a')
          let blob = this.base64ToBlob(saveUrl)
          let evt = document.createEvent('HTMLEvents')
          evt.initEvent('click', true, true)
          aLink.download = '二维码.jpg'
          aLink.href = URL.createObjectURL(blob)
          aLink.click()
        });
      },
      //这里把图片转base64
      base64ToBlob(code) {
        let parts = code.split(';base64,')
        let contentType = parts[0].split(':')[1]
        let raw = window.atob(parts[1])
        let rawLength = raw.length
        let uInt8Array = new Uint8Array(rawLength)
        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i)
        }
        return new Blob([uInt8Array], {type: contentType})
      },
      clickLeft() {
        if (this.right_text === '') {
          this.right_text = '完成'
          this.title = '选择组织'
          this.show = false
        } else {
          this.$router.go(-1)
        }
      },
      // 完成事件
      clickRight() {
        if (this.selectData.pk_org == undefined) {
          Toast("请先选择入职组织")
          return
        }
        if (this.right_text === '完成') {
          console.log(this.selectData)
          this.show = true
          this.downloadData.url = window.location.href.replace('qrCode', 'inductionInfo') + '?pk_org=' + this.selectData.pk_org
          this.right_text = ''
          this.title = '入职登记'
        }
      },
      // 查询组织数据
      getOrgs() {
        queryOrgForScanQRCode({}).then(res => {
          this.orgData = res.data
          this.getWaitSelectData()
        })
      },
      // 选择好的数据点击
      selectTreeDataClick(item) {
        let arr = []
        this.getTreeDataClick(item, arr)
        this.selectTreeData = JSON.parse(JSON.stringify(arr))
        let data = this.getTreeData(item.pk_org, this.orgData)
        if (data.length !== 0) {
          this.waitSelectData = data
        }
      },
      // 获取下一级数据
      getCascadeData(item) {
        // 获取下一级数据 并将当前列设为已选择的数据
        // debugger
        let data = this.getTreeData(item.pk_org, this.orgData)
        this.waitSelectData.forEach(i => {
          this.$set(i, 'select', false)
        })
        this.$set(item, 'select', true)
        this.selectData = item
        // 判断下一级数据是否为空，不为空
        if (data.length !== 0) {
          this.waitSelectData = data
          let arr = []
          this.getTreeDataClick(item, arr)
          this.selectTreeData = JSON.parse(JSON.stringify(arr))
        } else {
          Toast('已经到底了')
        }
      },
      // 选择数据
      clickWait(item) {
        this.waitSelectData.forEach(i => {
          this.$set(i, 'select', false)
        })
        this.$set(item, 'select', true)
        this.selectData = item
        let arr = []
        this.getTreeDataClick(item, arr)
        this.selectTreeData = JSON.parse(JSON.stringify(arr))
      },
      // 获取待选择数据
      getWaitSelectData() {
        // 树形数据
        this.waitSelectData = this.getTreeData(undefined, this.orgData)
        console.log(this.waitSelectData)
      },
      // 获取树形数据
      getTreeData(pid, data) {
        return data.filter(item => item.pid == pid)
      },
      // 获取点击树形数据
      getTreeDataClick(item, arr) {
        if (item.pid) {
          let data = JSON.parse(JSON.stringify(this.orgData))
          for (var i = 0; i < data.length; i++) {
            if (item.pid === data[i].pk_org) {
              this.getTreeDataClick(data[i], arr)
            }
          }
        }
        arr.push(item)
      },
    }
  }
</script>

<style scoped>
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .block {
    width: 100%;
    height: 100%;
    background: #fff;
    overflow-y: auto;
  }
</style>
