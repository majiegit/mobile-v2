<template>
  <div>
    <!--导航栏区域-->
    <div ref="header">
      <Header title="个人信息" @clickLeft="clickLeft" rightText="附件管理" @clickRight="clickRight"/>
    </div>
    <!--主内容区域-->
    <div :style="{ 'height': currentHeight }" style="overflow-y: auto;">
      <!--个人头像信息区域-->
      <div style="width: 96%; padding: 2%; background: #fff;">
        <div style="height: 80px; width: 96%; padding: 20px 2%; border-radius: 10px; background: #2479ed;">
          <van-row type="flex" justify="space-around">
            <van-col :span="6">
              <div style="float: left; height: 80px; width: 80px;">
                <van-image
                  @click="photoShow = true"
                  round
                  width="80px"
                  height="80px"
                  :src="userdata.photo"
                />
              </div>
            </van-col>
            <van-col :span="17">
              <p style="font-size: 15px; color: #fff;">{{userdata.name}}</p>
              <p style="font-size: 15px; color: #fff;">{{userdata.deptname}}</p>
            </van-col>
          </van-row>
        </div>
      </div>
      <!--信息子集区域-->
      <div style="width: 100%; margin-top: 10px;">
        <van-collapse v-model="activeNames">
          <van-collapse-item
            icon="wap-nav"
            title-class="left_title_class"
            :name="tempIndex"
            v-for="(temp, tempIndex) in templateData"
            :key="tempIndex"
          >
            <template #title>
              <div>
                {{temp.name}}
                <van-tag plain type="primary"
                         v-if="(infoData.aprlist && infoData.aprlist[temp.table_code]) "
                         style="margin-left: 5px;">信息待审批
                </van-tag>
                <van-icon
                  name="edit"
                  v-if="temp.caneditflag== 'Y'"
                  style="float: right; line-height: 25px; margin-right: 10px;"
                  color="#2479ed"
                  size="20px"
                  @click="edit(temp)"/>
              </div>
            </template>
            <!-- 信息块儿-->
            <div v-for="(info, infoIndex) in infoData[temp.table_code]" :key="infoIndex"
                 v-if="infoData[temp.table_code]">
              <!--字段-->
              <van-row type="flex" justify="space-around" style="line-height: 30px;"
                       v-for="(field, fieldIndex) in temp.tablefield" v-if="field.showlistflag == 'Y'"
                       :key="fieldIndex">
                <!-- 标题-->
                <van-col span="8" offset="1">
                  <span>{{field.name}}</span>
                </van-col>
                <!--内容-->
                <van-col span="14" offset="1">
                  <!--根据不同的类型获取对应的值-->
                  <span style="float: right;"
                        :class="(infoData.aprlist && infoData.aprlist[field.code]) ? 'font_color': ''">{{getFieldValue(field,info)}}</span>
                </van-col>
              </van-row>
              <!--下划线-->
              <van-divider v-if="infoIndex != infoData[temp.table_code].length - 1"/>
            </div>
          </van-collapse-item>
        </van-collapse>
      </div>
    </div>
    <van-overlay :show="photoShow" @click="photoShow = false">
      <div class="wrapper">
        <van-image
          :src="userdata.photo"
        />
      </div>
    </van-overlay>
  </div>
</template>
<script>
  import Header from '@/components/Header/Index'
  import {Toast} from 'vant'
  import {queryPsndocTemp, getSubInfoVO} from '@/api/psndoc'
  import {USERINFO} from '@/utils/mutation-types'
  import storage from 'store'
  export default {
    name: 'personal',
    components: {
      Header
    },
    data() {
      return {
        pk_psndoc: storage.get(USERINFO).pk_psndoc,
        photoShow: false,
        activeNames: [0],
        isWater: false,
        currentHeight: '',
        templateData: '',//模板
        infoData: '',//数据
        userdata: storage.get(USERINFO)
      }
    },
    watch: {},
    updated() {
    },
    mounted() {
      this.currentHeight = (document.documentElement.clientHeight - this.$refs.header.offsetHeight) + 'px'
      console.log(this.userdata)
      this.getdata()
    },
    methods: {
      // 头部左上角点击事件
      clickLeft() {
        this.$router.push("application")
      },
      // 头部右上角点击事件
      clickRight() {
        // this.$router.push({name: 'enclosure', query: {filePath: this.pk_h, disabled: disabled}})
        this.$router.push({
          name: 'enclosure',
          query: {
            filePath: this.pk_psndoc,
            disabled: 0
          }
        })
      },
      // 修改
      edit(temp) {
        // 显示字段
        let fieldData = temp.tablefield.filter(item => item.showlistflag == 'Y')
        // 是否需要审核
        let isCheck = false
        if (this.infoData.aprlist && this.infoData.aprlist[temp.table_code]) {
          isCheck = true
        }
        if (temp.table_code == 'bd_psndoc') {
          this.$router.push({
            name: 'personalEdit',
            params: {
              tempData: temp,
              infoData: this.infoData[temp.table_code],
              infoIndex: 0,
              isCheck: isCheck,
              fieldData: fieldData
            }
          })
        } else {
          this.$router.push({
            name: 'personalSubList',
            params: {tempData: temp, infoData: this.infoData[temp.table_code], isCheck: isCheck, fieldData: fieldData}
          })
        }

      },
      // 获取字段值
      getFieldValue(field, info) {
        let datatype = field.datatype
        let value = ''
        switch (datatype) {
          // 字符
          case 0:
            value = info[field.code]
            break
          // 整数
          case 1:
            value = info[field.code]
            break
          // 数量
          case 2:
            value = info[field.code]
            break
          // 日期
          case 3:
            value = info[field.code]
            break
          // 逻辑
          case 4:
            value = info[field.code] == 'Y' ? '是' : (info[field.code] == 'N' ? '否' : '')
            break
          // 参照
          case 5:
            value = info[field.code + '_name']
            break
          // 下拉
          case 6:
            value = info[field.code + '_name']
            break
          // 时间
          case 8:
            value = info[field.code]
            break
          // 大文本
          case 9:
            value = info[field.code]
            break
          // 图片
          case 10:
            value = info[field.code]
            break
          // 邮件地址
          case 14:
            value = info[field.code]
            break
          // 时间戳
          case 15:
            value = info[field.code]
            break
          // 自定义项
          case 16:
            value = info[field.code]
            break
          // 多语言
          case 17:
            value = info[field.code]
            break
          // 金额
          case 18:
            value = info[field.code]
            break
          // 日期
          case 20:
            value = info[field.code]
            break
          // 日期公式
          case 100:
            value = info[field.code]
            break
          // 开始日期
          case 101:
            value = info[field.code]
            break
          // 结束日期
          case 102:
            value = info[field.code]
            break
        }
        return value
      },
      getdata() {
        Toast.loading({
          message: '加载中...',
          duration: 0
        })
        let param = {
          pk_psndoc: this.pk_psndoc
        }
        // 查询个人信息数据
        getSubInfoVO(param).then(res => {
          this.infoData = res.data
          Toast.clear()
        })
        // 查询模板
        queryPsndocTemp(param).then(res => {
          this.templateData = res.data
        })
      }
    },
    beforeDestroy() {
    }
  };
</script>

<style>

</style>
<style lang='less' scoped>
  .van-nav-bar {
    background: #2479ed;
    // 因为style标签上有 lang='less'  所以.van-nav-bar__title 可以嵌套到.van-nav-bar里面
    /* /deep/ 就是把data-v-hash值选择器写到类名的前面 */
    /deep/ .van-nav-bar__title {
      color: #fff;
    }
  }

  .font_color {
    color: #2479ed;
  }

  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    /*text-align: center;*/
  }
</style>
