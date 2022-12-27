<template>
  <div>
    <!--导航栏区域-->
    <Header :title="tempData.name" @clickLeft="clickLeft"  :rightText="right_text" @clickRight="clickRight"/>
    <!--主内容区域-->
    <div :style="{ 'height': currentHeight }" style="overflow-y: auto; padding: 0px 10px;">
      <div class="info_class"
           v-for="(info,infoIndex) in infoData" :key="infoIndex" v-if="info.optype !== 'del'">
        <p style="line-height: 30px; padding-left: 96%" v-if="isDeleteStatus">
          <van-icon name="delete-o" color="red" @click="deleteInfo(infoIndex)"/>
        </p>
        <van-row type="flex" style="line-height: 30px; font-size: 14px; color: #323233;" justify="space-around"
                 @click="editInfo(infoIndex)"
                 v-for="(field,fieldIndex) in fieldData" :key="fieldIndex">
          <van-col span="12">
            <span>{{field.name}}:</span>
          </van-col>
          <van-col span="12">
            <span style="float: right">{{getFieldValue(field,info)}}</span>
          </van-col>
        </van-row>
      </div>
      <!--新增区域-->
      <div type="flex" justify="center" v-if="isShowAddButton && (tempData.caneditflag == 'Y' || tempData.addflag == 'Y')"
           class="add_button" @click="addSubData">
        <div>
          <van-icon name="add-o" color="#2479ed" size="20"/>
          <span>新增{{tempData.name}}</span>
        </div>
      </div>
    </div>
    <div ref="footer">
      <van-button type="info" block v-if="!isCheck" @click="submitData" :loading="loadingButton" loading-text="提交中...">提 交</van-button>
      <van-button type="info" block v-else @click="rollbackData" :loading="loadingButton" loading-text="撤回中...">撤 回</van-button>
    </div>
  </div>
</template>

<script>
  import Header from '@/components/Header/Index'
  import {Toast} from 'vant'
  import {saveSubInfo, revokeLisn} from '@/api/psndoc'

  export default {
    name: "edit",
    components: {Header},
    data() {
      return {
        loadingButton: false,
        deleteBackData: [],
        isShowAddButton: true,
        isCheck: false,
        right_text: '删除',
        isDeleteStatus: false,
        currentHeight: '',
        fieldData: [],
        tempData: {},
        infoData: []
      }
    },
    watch: {},
    mounted() {
      this.currentHeight = (document.documentElement.clientHeight - 46 - this.$refs.footer.offsetHeight) + 'px'
    },
    created() {
      // 完整的模板数据
      if (!this.$route.params.tempData) {
        this.clickLeft()
      } else {
        this.tempData = this.$route.params.tempData
        this.infoData = this.$route.params.infoData ? this.$route.params.infoData : []
        this.fieldData = this.$route.params.fieldData
        this.isCheck = this.$route.params.isCheck
        console.log(this.infoData)
        console.log(this.tempData)
        console.log(this.fieldData)
        console.log(this.isCheck)
        if (this.isCheck) {
          // 待审核数据
          this.right_text = ''  // 删除按钮为空
          this.isShowAddButton = false // 新增按钮不显示
        }
      }
    },
    methods: {
      // 添加子集信息
      addSubData() {
        // 如果是已提交，则不让添加 需要先撤回
        if (this.isCheck) {
          return
        }
        let form = {}
        let table_code = this.tempData.table_code
        this.$set(form, 'optype', 'add')
        this.$set(form, 'table_code', table_code)
        this.fieldData.forEach(field => {
          this.$set(form, field.code, '')
        })
        this.infoData.push(form)
        this.$router.push({
          name: 'personalSubEdit',
          params: {
            infoData: this.infoData,
            infoIndex: this.infoData.length - 1,
            tempData: this.tempData,
            fieldData: this.fieldData,
            type: 'add'
          }
        })
      },

      // 修改子集信息
      editInfo(infoIndex) {
        // 如果是已提交，则不让修改 需要先撤回
        if (this.isCheck) {
          Toast('请先撤回再修改')
          return
        }
        if(this.tempData.caneditflag == 'N'){
          Toast('当前子集不允许修改')
          return
        }
        // 处理子集提交数据
        let table_code = this.tempData.table_code
        this.$set(this.infoData[infoIndex], 'table_code', table_code)
        this.$set(this.infoData[infoIndex], 'optype', 'edit')
        this.$set(this.infoData[infoIndex], 'pkfilecode', this.infoData[infoIndex].pk_psndoc_sub)

        console.log(this.infoData)
        this.$router.push({
          name: 'personalSubEdit',
          params: {
            infoData: this.infoData,
            infoIndex: infoIndex,
            tempData: this.tempData,
            fieldData: this.fieldData,
            type: 'edit'
          }
        })
      },
      // 撤回
      rollbackData() {
        this.loadingButton = true
        let params = {
          tableCode: this.tempData.table_code
        }
        revokeLisn(params).then(res => {
          this.loadingButton = false
          Toast({message: '撤回成功', duration: 500})
          setTimeout(res => {
            this.clickLeft()
          }, 500)
        })
      },
      // 提交
      submitData() {
        let data = this.infoData.filter(item => item.optype)
        console.log(data)
        if(data.length == 0 ){
          Toast("没有修改过的数据")
          return
        }
        this.loadingButton = true
        let params = {
          data: data
        }
        saveSubInfo(params).then(res => {
          this.loadingButton = false
          Toast({message: '提交成功', duration: 500})
          setTimeout(res => {
            this.clickLeft()
          }, 500)
        }).catch(res => {
          this.loadingButton = false
          Toast({message: res.message, duration: 1000})
        })
      },
      // 删除
      deleteInfo(index) {
        let table_code = this.tempData.table_code
        this.$set(this.infoData[index], 'optype', 'del')
        this.$set(this.infoData[index], 'table_code', table_code)
        this.$set(this.infoData[index], 'pkfilecode', this.infoData[index].pk_psndoc_sub)

      },
      // 头部右上角点击事件
      clickRight() {
        if (this.isDeleteStatus) {
          this.isDeleteStatus = false
          this.right_text = '删除'
          this.isShowAddButton = true
        } else {
          this.isShowAddButton = false
          this.isDeleteStatus = true
          this.right_text = '取消'
        }
      },
      // 头部左上角点击事件
      clickLeft() {
        this.$router.push({name: 'personal'})
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
    }
  }
</script>

<style scoped>
  .info_class {
    width: 96%;
    border-radius: 6px;
    background: #fff;
    margin-top: 10px;
    margin-bottom: 10px;
    padding: 0px 2%;
  }

  .add_button {
    margin-bottom: 10px;
    text-align: center;
    font-family: 微软雅黑;
    width: 96%;
    background: #fff;
    margin-top: 10px;
    padding: 10px 2%;
    color: #0276fd;
    border-radius: 5px;
    font-weight: bold;
  }
</style>
