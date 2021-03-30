<template>
  <div class="objectDetail">
    <header id="objectDetail-header">
      <hr-header title='指标填报' v-on:lcallBack='goback'>
      </hr-header>
    </header>
    <div id="objectDetail-body">
      <section id="section2">
        <figure>
          <div class="items-bar">
            <div class="items">
              <mt-cell title="考核对象" :value="evaobjectData.eva_obj_name"></mt-cell>
              <mt-cell title="绩效方案" :value="evaobjectData.schname"></mt-cell>
              <mt-cell title="绩效期间" :value="evaobjectData.periodname"></mt-cell>
              <mt-cell title="考核状态" :value="evaobjectData.status"></mt-cell>
              <mt-cell title="指标总权重" :value="weight"></mt-cell>
            </div>
          </div>
          <label style="color:#0CAEF5;">考核指标</label>
          <mt-button type="primary" style="float: right;font-size: 10px;height: 25px;margin-right: 22px"
            @click="toEdit()" v-if="(evaobjectData.pe_status == 2 || evaobjectData.pe_status == 3) && flagedit">编辑</mt-button>
          <mt-button type="primary" style="float: right;font-size: 10px;height: 25px;margin-right: 22px"
            @click="cancel()" v-if="(evaobjectData.pe_status == 2 || evaobjectData.pe_status == 3) && !flagedit">取消</mt-button>
          <mt-button type="primary" style="float: right;font-size: 10px;height: 25px;margin-right: 2px"
            @click="unEdit()" v-if="(evaobjectData.pe_status == 2 || evaobjectData.pe_status == 3) && !flagedit">保存</mt-button>
          <ul class="sp-ul1" :style="'border-radius: 0;height:'+ bodyHeight_show ">
            <div class="sp-scheme" v-for="(type, index1) in evaobjectData.typelist">
              <li>
                <div @click="showIndi(type)">
                  <span style="float:left; display: block;color:#0CAEF5;">
                    <i class="hrfont hr-list" style="font-size: 18px;"></i>
                    类型：{{type.typename == '' ? '无' : type.typename}}
                  </span>
                  <label style="text-align: right;display: block;color:#0CAEF5; font-size: .2rem">{{type.typeweight}}&nbsp;&nbsp;<i v-if="!type.isshow" class="hrfont hr-drop-down02"></i></label>
                </div>
                <ul  class="sp-ul2" v-if="type.isshow">
                  <li v-for="(indi, index2) in type.indis">
                    <span class="indispan" style="float:left;" @click="indiDetail(indi)">
                      &nbsp;{{indi.indiname}}&nbsp;<i v-if="!editFlag && !flagsub" class="hrfont hr-edit2" style="font-size: 18px; float: left;color: #888888;"></i><i v-else class="hrfont hr-book" style="font-size: 18px; color: #888888; float: left"></i>
                    </span>
                    <span style="text-align: right;display: block;color: #888888;padding-right: 20px;font-size: .2rem;">{{indi.weight}}
                      <i class="hrfont hr-minus" style="color: #26a2ff;font-size: 21px;" v-if="!flagedit" @click="deleteIndi(indi,type, index1, index2)"></i>
                    </span>
                  </li>
                </ul>
              </li>
            </div>
          </ul>
        </figure>
      </section>
    </div>
    <footer v-if="this.evaobjectData.typelist" style="height: 6.8%">
      <span v-if="!editFlag && !flagsub" @click="doSubmit('submit')">提交</span>
      <span v-if="!editFlag && flagsub" style="background:#DEE6EA">提交</span>
      <span v-if="!editFlag && !flagback" @click="doSubmit('callback')">收回</span>
      <span v-if="!editFlag && flagback" style="background:#DEE6EA">收回</span>
      <span v-if="editFlag" @click="addIndi" style="width: 100%;"><i class="hrfont hr-plus02" style="color:#ffffff;font-size: 30px; "></i></span>
    </footer>
  </div>
</template>

<script>
  import { fetchData, emojiFilter } from 'hr-utils'
  import { HrHeader, hrScrollcustom , ImgPicker } from 'hr-ui'
  import { Toast, Cell, MessageBox, Indicator } from 'mint-ui';

    export default {
      name: "objectDetail",
      data(){
        return{
          evaobjectData: {
          },
          pk_sch_eva: this.$route.query.pk_sch_eva,
          pk_evaobj: this.$route.query.pk_evaobj,
          bodyHeight_show:'',
          editFlag: false,
          flagedit: true,
          flagsub: false,
          flagback: false,
          delIndiPk: '',
          weight: ''
        }
      },
      mounted(){
        this.initHeight();
        if(this.$route.query.source == 'fillDetail'){
          this.pk_sch_eva = this.$route.query.pk_sch_eva
          this.pk_evaobj = this.$route.query.pk_evaobj
        }
        this.initevaobject();
      },
      components:{
        HrHeader: HrHeader,
      },
      methods:{
        initevaobject(){
          let _this = this
          Indicator.open()
          fetchData({
            url: 'hrssc/portal/peInfo/queryEvaobject',
            method: 'post',
            param: {
              pk_sch_eva: this.pk_sch_eva,
              pk_evaobj: this.pk_evaobj,
              source: 'indexFill'
            },
            mock: false,
            contentType: "application/json",
            success: function(data) {
              Indicator.close()
              _this.evaobjectData = data.data
              _this.weight = Number(data.data.weight*100).toFixed(0) + '%'
              if(data.data.scheva_status != 2 && data.data.scheva_status != 3 && data.data.scheva_status != 4){
                _this.flagsub = true
                _this.flagback = true
              }else if(data.data.pe_status == 2 || data.data.pe_status == 3){
                _this.flagedit = true
                _this.flagsub = false
                _this.flagback = true
              }else if(data.data.pe_status==4){
                _this.flagsub = true
                _this.flagback = false
              }else if(data.data.pe_status==7 && data.data.aprgauname==''){
                _this.flagsub = true
                _this.flagback = false
              }else{
                _this.flagsub = true
                _this.flagback = true
              }
            },
            error: function(error) {
              Indicator.close()
              Toast(error.message)
            }
          })
        },
        toEdit(){
          this.editFlag = !this.editFlag
          this.flagedit = !this.flagedit
        },
        unEdit(){
          if(this.delIndiPk != ''){
            this.doDelete()
          }else{
            this.editFlag = !this.editFlag
            this.flagedit = !this.flagedit
          }
        },
        cancel() {
          // window.location.reload()
          this.editFlag = !this.editFlag
          this.flagedit = !this.flagedit
          this.initevaobject()
        },
        addIndi(){
          this.$router.push({
            name: 'fillDetail',
            query: {
              pk_sch_eva: this.$route.query.pk_sch_eva,
              pk_evaobj: this.$route.query.pk_evaobj,
              pk_group: this.evaobjectData.pk_group,
              pk_org: this.evaobjectData.pk_org,
              source: 'add',
              isEdit: false,
              sourceapp: 'objectDetail',
              pk_schemeperiod: this.$route.query.pk_schemeperiod,
              schemeperiodname: this.$route.query.schemeperiodname
            }
          })
        },
        deleteIndi(indi, type, index1, index2){
          let pk_indi = indi.pk_indi
          this.delIndiPk += '-' + pk_indi
          this.evaobjectData.weight = this.evaobjectData.weight - indi.indiweight
          this.weight = Number(this.evaobjectData.weight*100).toFixed(0) + '%'
          if(type.indis.length > 1){
            this.evaobjectData.typelist[index1].indis.splice(index2,1)
          }else{
            this.evaobjectData.typelist[index1].indis.splice(index2,1)
            this.evaobjectData.typelist.splice(index1,1)
          }
        },
        doDelete() {
          let _this = this
          let lastNum = this.evaobjectData.typelist.length
          fetchData({
            url: 'hrssc/portal/peInfo/deleteIndi',
            method: 'post',
            param: {
              pk_sch_eva: this.pk_sch_eva,
              pk_evaobj: this.pk_evaobj,
              pk_indis: this.delIndiPk,
              lastNum: lastNum
            },
            mock: false,
            contentType: "application/json",
            success: function(data) {
              Indicator.close()
              _this.delIndiPk = ''
              _this.editFlag = false
              _this.flagedit = true
              _this.flagsub = false
              _this.flagback = false
              _this.initevaobject()
            },
            error: function(error) {
              Indicator.close()
              Toast(error.message)
              _this.delIndiPk = ''
              _this.editFlag = false
              _this.flagedit = true
              _this.flagsub = false
              _this.flagback = false
              _this.initevaobject()
            }
          })
        },
        checkWeight(){
          let weight = this.evaobjectData.weight
          if(parseFloat(weight) != parseFloat(1) || this.weight != '100%'){
            return false
          }
          return true
        },
        doSubmit(option){
          let msg = option === 'submit' ? '提交' : '收回'
          if(option === 'submit' && this.evaobjectData.pe_status != 3){
            Toast('考核对象状态不允许提交')
            return
          }else if(option === 'submit' && (this.evaobjectData.typelist == undefined || this.evaobjectData.typelist == '')){
            Toast('量表指标为空，不允许提交')
            return
          }else if(option === 'submit' && !this.checkWeight()){
              msg = '指标权重之和不等于100，是否继续提交？';
          }else{
            msg = `确定${msg}指标?`
          }
          MessageBox.confirm(msg).then(action => {
            if(action === 'confirm'){
              this[option]()
            }
          }).catch(err => {
            if(err == 'cancel'){
              Toast('已取消')
            }else{
              Toast(err.message)
            }
          });
        },
        submit(){
          let _this = this
          Indicator.open({
            text: '提交中，请稍等...',
            spinnerType: 'fading-circle'
          })
          fetchData({
            url: 'hrssc/portal/peInfo/submitScheme',
            method: 'post',
            param: {
              aprgauname: this.evaobjectData.aprgauname,
              pk_evaobj: this.pk_evaobj
            },
            mock: false,
            contentType: "application/json",
            success: function(data) {
              Indicator.close()
              Toast('操作成功')
              _this.initevaobject()
            },
            error: function(error) {
              Indicator.close()
              Toast(error.message)
            }
          })
        },
        callback(){
          let _this = this
          Indicator.open({
            text: '收回中，请稍等...',
            spinnerType: 'fading-circle'
          })
          fetchData({
            url: 'hrssc/portal/peInfo/callbackScheme',
            method: 'post',
            param: {
              pk_sch_eva: this.pk_sch_eva,
              pk_evaobj: this.pk_evaobj
            },
            mock: false,
            contentType: "application/json",
            success: function(data) {
              Indicator.close()
              Toast('操作成功')
              _this.initevaobject()
            },
            error: function(error) {
              Indicator.close()
              Toast(error.message)
            }
          })
        },
        indiDetail(indi){
          this.$router.push({
            name: 'fillDetail',
            query: {
              pk_sch_eva: this.$route.query.pk_sch_eva,
              pk_evaobj: this.$route.query.pk_evaobj,
              pk_indi: indi.pk_indi,
              pk_group: this.evaobjectData.pk_group,
              pk_org: this.evaobjectData.pk_org,
              source: 'edit',
              isEdit: this.flagsub,
              sourceapp: 'objectDetail',
              pk_schemeperiod: this.$route.query.pk_schemeperiod,
              schemeperiodname: this.$route.query.schemeperiodname
            }
          })
        },
        showIndi(type){
          if(typeof type.isshow == 'undefined'){
            this.$set(type,'isshow',true);
          }else {
            type.isshow = !type.isshow;
          }
        },
        initHeight(){
          let height = document.body.scrollHeight;
          this.bodyHeight = height * 0.54;
          this.bodyHeight_show = this.bodyHeight + 'px';
        },
        goback(){
          this.$router.push({
            name: 'indexFill',
            query: {
              pk_schemeperiod: this.$route.query.pk_schemeperiod,
              source: 'objectDetail',
              schemeperiodname: this.$route.query.schemeperiodname
            }
          })
        }
      }
    }
</script>

<style lang="less" scoped>
  html{
    header{
      position: fixed;
      height: 6.6%;
      width: 100%;
      line-height: .88rem;
    }
    .objectDetail{
      #objectDetail-body{
        height: 85%;
        margin-top: 1rem;
      }
      div{
        section{
          margin-top: 1.2rem;
          padding: 0 .22rem;
          height: calc(~'100% - 2.7rem');
          figure {
            .items-bar{
              margin-bottom: .2rem;
              padding: .2rem 0;
              border-bottom: 1px solid #0CAEF5;
              border-top: 1px solid #0CAEF5;
              .mint-cell {
                min-height: 28px;
              }
              .mint-cell-title {
                color: #666666;
              }
            }
            label{
              /*display: block;*/
              line-height: 1.5;
              font-size: 0.33rem;
              padding-left: 0.28rem;
            }
            .sp-ul1{
              margin-top: .2rem;
              box-shadow:10px 10px 20px #CCCCCC;
            }
            ul{
              padding: 0rem 0 .1rem 0;
              background:#ffffff;
              border-radius:4px;
              overflow-y: auto;
              div{
                li{
                  display:block;
                  height:23.4%;
                  width: 100%;
                  /*margin-left: 0.1rem;*/
                  margin-bottom: .1rem;
                  div{
                    padding: .2rem;
                    border-bottom: 1px solid #E7E7E7;
                    span{
                      display:block;
                      font-size:0.3rem;
                      color:#888888;
                      letter-spacing:0;
                      text-align:left;
                      padding-left: 0.15rem;
                      label{
                        float: right;
                      }
                    }
                  }
                  .sp-ul2{
                    margin-top: .1rem;
                    padding-left: .5rem;
                    li{
                      border-bottom: 1px solid #E7E7E7;
                      margin-top: .2rem;
                      padding-bottom: .1rem;
                      .indispan{
                        display:block;
                        font-size:0.28rem;
                        color:#888888;
                        letter-spacing:0;
                        text-align:left;
                        /*padding-left: 0.15rem;*/
                        margin-left: .2rem;
                        label{
                          float: right;
                        }
                        i{
                          color:#26a2ff;
                          float: right;
                        }
                      }
                    }
                  }
                }
              }
              .clear{
                clear: both;
              }
            }
          }
        }
      }
    }
    footer{
      position: fixed;
      width: 100%;
      height: 1rem;
      left: 0;
      bottom: 0;
      background: #0caef5;
      font-size: 0.38rem;
      color:#ffffff;
      line-height: 1rem;
      letter-spacing:-0.39px;
      text-align:center;
      span{
        float: left;
        height: 100%;
        width: 50%;
      }
      span:first-child{
        border-right: 1px solid #fff;
      }
    }
  }
</style>
