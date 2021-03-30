<template>
  <div class="scoreEvaObject">
    <header id="scoreEvaObject-header">
      <hr-header title='考核评分' v-on:lcallBack='goback'>
      </hr-header>
    </header>
    <div id="scoreEvaObject-body">
      <section id="section2">
        <figure>
          <div class="items-bar">
            <div class="items">
              <mt-cell title="考核对象" :value="evaobjectData.eva_obj_name"></mt-cell>
              <mt-cell title="绩效方案" :value="evaobjectData.schname"></mt-cell>
              <mt-cell title="绩效期间" :value="evaobjectData.periodname"></mt-cell>
              <mt-cell title="我的评分" :value="evaobjectData.score == null ? '0.00' : evaobjectData.score"></mt-cell>
              <mt-cell title="考核等级" :value="evaobjectData.pe_gradeitemname"></mt-cell>
              <mt-cell title="考核状态" :value="evaobjectData.pe_status"></mt-cell>
            </div>
          </div>
          <label style="color:#0CAEF5;">考核指标</label>
          <ul class="sp-ul1" :style="'border-radius: 0;height:'+ bodyHeight_show">
            <div class="sp-scheme" v-for="(type, index1) in evaobjectData.typelist">
              <li>
                <div @click="showIndi(type)">
                  <span style="float:left; display: block;color:#0CAEF5;">
                    <i class="hrfont hr-list" style="font-size: 18px;"></i>
                    类型：{{type.typename == '' ? '无' : type.typename}}
                  </span>
                  <label v-if="type.isshow" style="text-align: right;display: block;color: #0CAEF5;">···</label>
                  <label v-else style="text-align: right;display: block;color: #0CAEF5;"><i class="hrfont hr-drop-down02"></i></label>
                </div>
                <ul  class="sp-ul2" v-if="type.isshow" >
                  <li v-for="(indi, index2) in type.indis" @click="indiDetail(indi)">
                    <span class="indispan" style="float:left;">
                      &nbsp;{{indi.indiname}}<i v-if="!editFlag && !flagsub" class="hrfont hr-edit2" style="font-size: 18px; float: left"></i><i v-else class="hrfont hr-book" style="font-size: 18px; color: #888888; float: left"></i>
                    </span>
                    <span style="text-align: right;display: block;color: #888888;padding-right: 10px;font-size: .2rem">{{indi.score == null ? 0 : indi.score == '' ? 0 : indi.score}}分
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
      <span v-if="!editFlag && !flagback && this.evaobjectData.status == 3" @click="doSubmit('callback')">收回</span>
      <span v-if="!editFlag && (flagback || (!flagback && this.evaobjectData.status != 3))" style="background:#DEE6EA">收回</span>
    </footer>
  </div>
</template>

<script>
    import { fetchData, emojiFilter } from 'hr-utils'
    import { HrHeader, hrScrollcustom , ImgPicker } from 'hr-ui'
    import { Toast, Cell, MessageBox, Indicator } from 'mint-ui';

    export default {
      name: "scoreEvaObject",
      data(){
        return{
          evaobjectData: {
          },
          pk_sch_eva: this.$route.query.pk_sch_eva,
          pk_evaobj: this.$route.query.pk_evaobj,
          turn: this.$route.query.turn,
          bodyHeight_show:'',
          editFlag: false,
          flagedit: true,
          flagsub: false,
          flagback: false,
          delIndiPk: '',
          isover: false
        }
      },
      mounted(){
        this.initHeight();
        if(this.$route.query.source == 'assessmentScore'
          || this.$route.query.source == 'scoreDetail'){
          this.pk_sch_eva = this.$route.query.pk_sch_eva
          this.pk_evaobj = this.$route.query.pk_evaobj
          this.turn = this.$route.query.turn
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
              turn: this.turn,
              source: 'assessmentScore'
            },
            mock: false,
            contentType: "application/json",
            success: function(data) {
              Indicator.close()
              _this.evaobjectData = data.data
              if((data.data.evaobj_status == 8 || data.data.evaobj_status == 9) && (data.data.status == 1 || data.data.status == 2||data.data.status == 4)){
                _this.flagedit = true
                _this.flagsub = false
                _this.flagback = true
              }else if((data.data.evaobj_status == 9 ||data.data.evaobj_status==10) && data.data.status == 3){
                _this.flagsub = true
                _this.flagback = false
              }else if(data.data.evaobj_status == 13 && data.data.status == 3 && (data.data.pk_eva_aprrst == undefined || data.data.pk_eva_aprrst == '')){
                _this.flagsub = true
                _this.flagback = false
              }else{
                _this.flagsub = true
                _this.flagback = true
              }
              var curDate = new Date();
              if(data.data.enddate != undefined && data.data.enddate != null && data.data.enddate != ''){
                var enddate = new Date(data.data.enddate);
                if(curDate > enddate){
                  _this.isover = true
                }
              }
            },
            error: function(error) {
              Indicator.close()
              Toast(error.message)
            }
          })
        },
        checkWeight(){
          // let weight = this.evaobjectData.weight
          // if(parseFloat(weight) != parseFloat(1)){
          //   return false
          // }
          return true
        },
        doSubmit(option){
          let msg = option === 'submit' ? '提交' : '收回'
          if(this.evaobjectData.status == 1){
            Toast('未考核不允许提交')
            return
          }
          if(this.isover){
            Toast('考核超期不允许提交')
            return
          }
          if(option === 'submit'){
            msg = `考核分数${this.evaobjectData.score},确定${msg}指标?`
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
            url: 'hrssc/portal/peInfo/submitScore',
            method: 'post',
            param: {
              pk_evaobj: this.pk_evaobj,
              pk_sch_eva: this.pk_sch_eva,
              pk_psndoc: this.evaobjectData.pk_psndoc,
              pk_eva_appraiser: this.evaobjectData.pk_eva_appraiser,
              pk_eva_aprrst: this.evaobjectData.pk_eva_aprrst,
              turn: this.turn
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
            url: 'hrssc/portal/peInfo/callbackScore',
            method: 'post',
            param: {
              pk_evaobj: this.pk_evaobj,
              pk_sch_eva: this.pk_sch_eva,
              pk_psndoc: this.evaobjectData.pk_psndoc,
              turn: this.turn
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
            name: 'scoreDetail',
            query: {
              pk_sch_eva: this.$route.query.pk_sch_eva,
              pk_evaobj: this.$route.query.pk_evaobj,
              pk_indi: indi.pk_indi,
              pk_gauge_indi: indi.pk_gauge_indi,
              pk_group: this.evaobjectData.pk_group,
              pk_org: this.evaobjectData.pk_org,
              pk_eva_appraiser: this.evaobjectData.pk_eva_appraiser,
              source: 'edit',
              isEdit: !this.editFlag && !this.flagsub,
              turn: this.turn,
              sourceapp: 'scoreEvaObject',
              pk_schemeperiod: this.$route.query.pk_schemeperiod,
              schemeperiodname: this.$route.query.schemeperiodname,
              isover: this.isover
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
          this.bodyHeight = height * 0.44;
          this.bodyHeight_show = this.bodyHeight + 'px';
        },
        goback(){
          this.$router.push({
            name: 'assessmentScore',
            query: {
              pk_schemeperiod: this.$route.query.pk_schemeperiod,
              source: 'scoreEvaObject',
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
    .scoreEvaObject{
      #scoreEvaObject-body{
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
                  margin-bottom: .1rem;
                  div{
                    /*background: #B6E3FB;*/
                    border-bottom: 1px solid #E7E7E7;
                    padding: .2rem;
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
                    margin-top: .2rem;
                    padding-left: .4rem;
                    li{
                      border-bottom: 1px solid #E7E7E7;
                      padding-bottom: .1rem;
                      margin-bottom: .2rem;
                      .indispan{
                        display:block;
                        font-size:0.28rem;
                        color:#888888;
                        letter-spacing:0;
                        text-align:left;
                        padding-left: 0.15rem;
                        margin-left: .3rem;
                        margin-bottom: .1rem;
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
