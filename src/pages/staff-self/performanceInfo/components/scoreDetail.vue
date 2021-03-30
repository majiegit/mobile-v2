<template>
  <div class="target">
    <header id="target-header">
      <hr-header title='考核评分' v-on:lcallBack='goApp'>
      </hr-header>
    </header>
    <div id="target-body" style="'height:'+ bodyHeight_show">
      <section id="section">
        <figure>
          <!--<label>指标信息</label>-->
          <div class="items-bar">
            <div>
              <mt-cell title="指标类型" style="color: #999999">
                <span style="color:#333">{{targetData.inditypename}}</span>
              </mt-cell>
            </div>
          </div>
          <div class="items-bar">
            <div>
              <mt-cell title="指标名称" style="color: #999999">
                <span style="color:#333">{{targetData.target}}</span>
              </mt-cell>
            </div>
          </div>
          <div class="items-bar">
            <div>
              <mt-cell title="指标权重" style="color: #999999">
                <span style="color:#333">{{targetData.targetweights}}</span>
              </mt-cell>
            </div>
          </div>
          <div class="items-bar">
            <mt-cell title="评分标准" style="color: #999999">
            </mt-cell>
            <textarea v-model="targetData.standard" rows="5" maxLength='100' :readonly="true">
              </textarea>
          </div>
          <div class="items-bar">
            <mt-cell title="计划目标值" style="color: #999999">
            </mt-cell>
            <textarea v-model="targetData.planvalue" rows="5" maxLength='100' :readonly="true">
              </textarea>
          </div>
          <div class="items-bar">
            <mt-cell title="实际完成值" style="color: #999999">
            </mt-cell>
            <textarea placeholder="请输入实际完成值目标值（非必填）" v-model="targetData.actcompletevalue" rows="5" maxLength='100' :readonly="!this.isEdit">
              </textarea>
          </div>
          <div class="items-bar">
            <div>
              <mt-cell title="指标得分" style="color: #999999">
                <input type="number" style="font-size: 16px;text-align: right" v-model="targetData.targetscore" placeholder="请输入指标得分（必填）" :readonly="!this.isEdit"/>
              </mt-cell>
            </div>
          </div>
        </figure>
      </section>
    </div>
    <footer v-if='this.isEdit'>
      <span @click='save'>保存</span>
    </footer>
    <footer v-else style='background:#DEE6EA;'>
      <span >保存</span>
    </footer>
  </div>
</template>

<script>
    import { fetchData, emojiFilter } from 'hr-utils'
    import { HrHeader, hrScrollcustom , ImgPicker } from 'hr-ui'
    import { Toast, Cell, MessageBox, Indicator } from 'mint-ui';
    export default {
      name: 'scoreDetail',
      data() {
        return {
          targetData:{},
          pk_sch_eva: this.$route.query.pk_sch_eva,
          pk_evaobj: this.$route.query.pk_evaobj,
          pk_group: this.$route.query.pk_group,
          pk_org: this.$route.query.pk_org,
          isEdit: this.$route.query.isEdit,
          source: this.$route.query.sourceapp,
          turn: this.$route.query.turn,
          pk_eva_appraiser: this.$route.query.pk_eva_appraiser,
          bodyHeight_show: '',
          isover: this.$route.query.isover
        }
      },

      components: {
        HrHeader
      },

      mounted() {
        this.pk = this.$route.query.pk_indi
        this.initHeight();
        this.initData();
      },
      methods: {
        initHeight(){
          let height = document.body.scrollHeight;
          this.bodyHeight_show = height * 0.60 + 'px';
        },
        initData(){
          let _this = this
          Indicator.open()
          fetchData({
            url: 'hrssc/portal/peInfo/indiDetail',
            method: 'post',
            param: {
              pk_evaobject: this.$route.query.pk_evaobj,
              pk_gauge_indi: this.$route.query.pk_gauge_indi,
              source: 'scoreDetail',
              pk_eva_appraiser: this.pk_eva_appraiser
            },
            mock: false,
            contentType: "application/json",
            success: function(data) {
              Indicator.close()
              _this.targetData = data.data
              if(_this.targetData.targetscore == '无'){
                _this.targetData.targetscore = 0
              }
            },
            error: function(error) {
              Indicator.close()
              Toast(error.message)
            }
          })
        },
        goApp() {
          this.$router.push({
            name: this.source,
            query: {
              source: 'scoreDetail',
              pk_evaobj: this.pk_evaobj,
              pk_sch_eva: this.pk_sch_eva,
              pk_schemeperiod: this.$route.query.pk_schemeperiod,
              schemeperiodname: this.$route.query.schemeperiodname,
              turn: this.turn

            }
          })
        },

        scoreTip(){
          if(this.targetData.targetscore == 0 || this.targetData.targetscore == 0.00) {
            return false
          }
          return true
        },

        checkScore(){
          let score = this.targetData.targetscore;
          let reg=/(^[1-9][0-9]$|^[0-9]$|^100$)/;
          if(!reg.test(score)){
            Toast('分数请输入0-100的整数');
            return false
          }
          return true
        },

        save(){
          if(!this.checkScore()){
            return
          }
          if(this.isover){
            Toast('考核超期不允许保存')
            return
          }
          if(!this.scoreTip()){
            MessageBox.confirm('指标得分为0，确定保存？').then(action => {
              if(action === 'confirm'){
                this.saveScore()
              }
            }).catch(err => {
              if(err == 'cancel'){
                Toast('已取消')
              }else{
                Toast(err.message)
              }
            });
          }else{
            this.saveScore()
          }
        },

        saveScore() {
          let _this = this
          let param = {
            pk_evaobj : this.pk_evaobj,
            pk_sch_eva: this.pk_sch_eva,
            targetData: JSON.stringify(this.targetData),
            turn: this.turn,
            pk_eva_appraiser: this.pk_eva_appraiser
          }
          Indicator.open({
            text: '评分保存中，请稍等...',
            spinnerType: 'fading-circle'
          })
          fetchData({
            url: 'hrssc/portal/peInfo/saveScore',
            method: 'post',
            param: param,
            mock: false,
            contentType: "application/json",
            success: function(data) {
              Indicator.close()
              Toast('保存成功')
              // _this.$router.push({
              //   name: _this.$route.query.sourceapp,
              //   query: {
              //     source: 'scoreDetail',
              //     pk_evaobj: _this.pk_evaobj,
              //     pk_sch_e   va: _this.pk_sch_eva,
              //     pk_schemeperiod: _this.$route.query.pk_schemeperiod,
              //     schemeperiodname: _this.$route.query.schemeperiodname,
              //     turn: this.turn
              //   }
              // })
            },
            error: function(error) {
              Indicator.close()
              Toast(error.message)
            }
          })
        }
      }
    }
</script>

<style scoped>
.target #target-header{
position: fixed;
height: 6.6%;
width: 100%;
line-height: .88rem;
}
.target #target-body{
  height: 84%;
  margin-top: 1rem;
  overflow-y: auto;
}
.target #target-body #section {
height: calc(~ '100% - 2.7rem');
}
.target #target-body #section figure label{
display: block;
line-height: 1.5;
font-size: 0.33rem;
padding-left: 0.28rem;
}
.target #target-body #section figure .items-bar{
  background: white;
}
.target #target-body #section figure .items-bar textarea{
  width: 94%;
  margin-left: 3%;
  height: 60px;
}
.target #target-body #section figure .sp-ul1{
margin-top: .2rem;
padding: 0rem 0 .1rem 0;
background:#ffffff;
border-radius:4px;
}
.target #target-body #section figure .sp-ul1 li{
display:block;
width: 100%;
}
.target #target-body #section figure .sp-ul1 li div{
padding: 0.2rem 0.2rem 0;
border-bottom: 1px solid #E7E7E7;
  padding-bottom: .2rem;
}
.target #target-body #section figure .sp-ul1 li div span{
display:block;
font-size:0.3rem;
color:#888888;
letter-spacing:0;
text-align:left;
padding-left: 0.15rem;
border-left: 2.6px solid #26a2ff;
}
.target #target-body #section figure .sp-ul1 .content{
color: black;
padding-top: 8px;
padding-bottom: 8px;
padding-left: 20px;
border-left: none;
}
footer {
  position: fixed;
  width: 100%;
  height: 1rem;
  left: 0;
  bottom: 0;
  background: #0caef5;
  font-size: 18px;
  color: #ffffff;
  line-height: 1rem;
  letter-spacing: -0.39px;
  text-align: center;
span {
  display: inline-block;
  height: 100%;
  width: 100%;
}
}
</style>
