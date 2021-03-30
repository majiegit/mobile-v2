<template>
  <div class="objectDetail-approve">
    <header id="objectDetail-approve-header">
      <hr-header title='指标审核' v-on:lcallBack='goback'>
      </hr-header>
    </header>
    <div id="objectDetail-approve-body">
      <section id="section2">
        <figure>
          <div class="items-bar">
            <div class="items">
              <mt-cell title="考核对象" :value="evaobjectData.eva_obj_name"></mt-cell>
              <mt-cell title="绩效方案" :value="evaobjectData.schname"></mt-cell>
              <mt-cell title="绩效期间" :value="evaobjectData.periodname"></mt-cell>
              <mt-cell title="审核状态" :value="evaobjectData.status"></mt-cell>
              <mt-cell title="指标总权重" :value="weight"></mt-cell>
            </div>
          </div>
          <label style="color:#0CAEF5;">考核指标</label>
          <mt-button type="primary" style="float: right;font-size: 10px;height: 25px;margin-right: 22px"
                     @click="toEdit()" v-if="(evaobjectData.pe_status == 4 || evaobjectData.pe_status == 5) && flagedit && !editFlag && !flagsub">编辑</mt-button>
          <mt-button type="primary" style="float: right;font-size: 10px;height: 25px;margin-right: 22px"
                     @click="cancel()" v-if="(evaobjectData.pe_status == 4 || evaobjectData.pe_status == 5) && !flagedit">取消</mt-button>
          <mt-button type="primary" style="float: right;font-size: 10px;height: 25px;margin-right: 2px"
                     @click="unEdit()" v-if="(evaobjectData.pe_status == 4 || evaobjectData.pe_status == 5) && !flagedit">保存</mt-button>
          <ul class="sp-ul1" :style="'border-radius: 0;height:'+ bodyHeight_show">
            <div class="sp-scheme" v-for="(type, index1) in evaobjectData.typelist">
              <li>
                <div @click="showIndi(type)">
                  <span style="float:left; display: block;color:#0CAEF5;">
                    <i class="hrfont hr-list" style="font-size: 18px;"></i>
                    类型：{{type.typename == '' ? '无' : type.typename}}
                  </span>
                  <label style="text-align: right;display: block;color:#0CAEF5;font-size: .2rem">{{type.typeweight}}&nbsp;&nbsp;<i v-if="!type.isshow" class="hrfont hr-drop-down02"></i></label>
                </div>
                <ul  class="sp-ul2" v-if="type.isshow" >
                  <li v-for="(indi, index2) in type.indis">
                    <span class="indispan" style="float:left;" @click="indiDetail(indi)">
                      &nbsp;{{indi.indiname}}&nbsp;<i v-if="!editFlag && !flagsub" class="hrfont hr-edit2" style="font-size: 18px; float: left;color: #888888;"></i><i v-else class="hrfont hr-book" style="font-size: 18px; color: #888888; float: left"></i>
                    </span>
                    <span style="text-align: right;display: block;color: #888888;padding-right: 20px;font-size: .2rem">{{indi.weight}}
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
      <span v-if="!editFlag && !flagsub" @click="doSubmit('audit')">审核</span>
      <span v-if="!editFlag && flagsub" style="background:#DEE6EA">审核</span>
      <span v-if="flagsub && !flagback" @click="doSubmit('abandonment')">弃审</span>
      <span v-if="flagsub && flagback" style="background:#DEE6EA">弃审</span>
      <span v-if="!flagsub && !editFlag && !flagsub" @click="doSubmit('rejected')">驳回</span>
      <span v-if="!flagsub && !editFlag && flagsub" style="background:#DEE6EA">驳回</span>
      <span v-if="editFlag" @click="addIndi" style="width: 100%;"><i class="hrfont hr-plus02" style="color:#ffffff;font-size: 30px; "></i></span>
    </footer>
  </div>
</template>

<script>
  import { fetchData, emojiFilter } from 'hr-utils'
  import { HrHeader, hrScrollcustom , ImgPicker } from 'hr-ui'
  import { Toast, Cell, MessageBox, Indicator } from 'mint-ui';

  export default {
    name: "objectDetailapprove",
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
            source: 'fillApprove'
          },
          mock: false,
          contentType: "application/json",
          success: function(data) {
            Indicator.close()
            _this.evaobjectData = data.data
            _this.weight = Number(data.data.weight*100).toFixed(0) + '%'
            if (data.data.scheva_status != 3 && data.data.scheva_status != 4){
              _this.flagsub = true
              _this.flagback = true
            }else if((data.data.pe_status == 4 || data.data.pe_status == 5)
              &&(data.data.aprgau_status==1 || data.data.aprgau_status==2)
              &&(data.data.cur_turn_aprgau == data.data.turn)){
              _this.flagedit = true
              _this.flagsub = false
              _this.flagback = true
            }else if((data.data.aprgau_status==3)
              &&(data.data.cur_turn_aprgau == data.data.turn +1)
              &&(data.data.pe_status != 6)){
              _this.flagsub = true
              _this.flagback = false
            }else if(data.data.pe_status==6 && data.data.cur_turn_aprgau == data.data.turn){
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
            sourceapp: 'objectDetailapprove',
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
        fetchData({
          url: 'hrssc/portal/peInfo/deleteIndi',
          method: 'post',
          param: {
            pk_sch_eva: this.pk_sch_eva,
            pk_evaobj: this.pk_evaobj,
            pk_indis: this.delIndiPk,
            lastNum: 1
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
        let msg = option === 'audit' ? '审核' : option === 'rejected'? '驳回' : '弃审'
        if(option === 'submit' && (this.evaobjectData.typelist == undefined || this.evaobjectData.typelist == '')){
          Toast('量表指标为空，不允许提交')
          return
        }else if(option ==='abandonment'){
          MessageBox.confirm(`确定${msg}指标?`).then(action => {
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
        }else {
          msg = `请输入${msg}意见`
          let plholder=''
          if(!this.checkWeight()){
            plholder = '注意：当前指标权重之和不等于100';
          }
          MessageBox.prompt(msg,'',{inputPlaceholder:plholder}).then(({ value, action }) => {
            if(action === 'confirm'){
              if(option === 'audit'){
                this.audit(value)
              }else{
                this.rejected(value)
              }
            }
          }).catch(err => {
            if(err == 'cancel'){
              Toast('已取消')
            }else{
              Toast(err.message)
            }
          });
        }
      },
      audit(opinion){
        let _this = this
        Indicator.open({
          text: '审核中，请稍等...',
          spinnerType: 'fading-circle'
        })
        fetchData({
          url: 'hrssc/portal/peInfo/auditIndi',
          method: 'post',
          param: {
            pk_evaobj: this.pk_evaobj,
            opinion: opinion,
            pk_sch_eva : this.pk_sch_eva
          },
          mock: false,
          contentType: "application/json",
          success: function(data) {
            Indicator.close()
            if(data.data.msg == undefined || data.data.msg == ''){
              Toast('操作成功')
            }else{
              Toast(data.data.msg)
            }
            _this.initevaobject()
          },
          error: function(error) {
            Indicator.close()
            Toast(error.message)
          }
        })
      },
      abandonment(){
        let _this = this
        Indicator.open({
          text: '弃审中，请稍等...',
          spinnerType: 'fading-circle'
        })
        fetchData({
          url: 'hrssc/portal/peInfo/abandonmentIndi',
          method: 'post',
          param: {
            pk_evaobj: this.pk_evaobj,
            pk_sch_eva : this.pk_sch_eva
          },
          mock: false,
          contentType: "application/json",
          success: function(data) {
            Indicator.close()
            if(data.data.msg == undefined || data.data.msg == ''){
              Toast('操作成功')
            }else{
              Toast(data.data.msg)
            }
            _this.initevaobject()
          },
          error: function(error) {
            Indicator.close()
            Toast(error.message)
          }
        })
      },
      rejected(opinion){
        let _this = this
        Indicator.open({
          text: '驳回中，请稍等...',
          spinnerType: 'fading-circle'
        })
        fetchData({
          url: 'hrssc/portal/peInfo/rejectedIndi',
          method: 'post',
          param: {
            pk_evaobj: this.pk_evaobj,
            opinion: opinion,
            pk_sch_eva : this.pk_sch_eva
          },
          mock: false,
          contentType: "application/json",
          success: function(data) {
            Indicator.close()
            if(data.data.msg == undefined || data.data.msg == ''){
              Toast('操作成功')
              _this.$router.push({
                name: 'fillApprove',
                query: {
                  pk_schemeperiod: _this.$route.query.pk_schemeperiod,
                  source: 'objectDetailapprove',
                  schemeperiodname: _this.$route.query.schemeperiodname
                }
              })
            }else{
              Toast(data.data.msg)
              _this.initevaobject()
            }

            // _this.initevaobject()
            // _this.evaobjectData.status = '指标填报中'
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
            sourceapp: 'objectDetailapprove',
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
          name: 'fillApprove',
          query: {
            pk_schemeperiod: this.$route.query.pk_schemeperiod,
            source: 'objectDetailapprove',
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
    .objectDetail-approve{
      #objectDetail-approve-body{
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
                  /*margin-left: 0.1rem;*/
                  margin-bottom: .1rem;
                  div{
                    /*background: #B6E3FB;*/
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
                    li {
                      border-bottom: 1px solid #E7E7E7;
                      margin-top: .2rem;
                      padding-bottom: .1rem;
                      .indispan {
                        display: block;
                        font-size: 0.28rem;
                        color: #888888;
                        letter-spacing: 0;
                        text-align: left;
                        /*padding-left: 0.15rem;*/
                        margin-left: .2rem;
                        label {
                          float: right;
                        }
                        i {
                          color: #26a2ff;
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
