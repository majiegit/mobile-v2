/* * Created by txx on 2018/03/7. * */
<template>
  <div>
    <header>
      <hr-header v-if="source == 'objectDetail'" title='指标填报' v-on:lcallBack='goApp'>
      </hr-header>
      <hr-header v-else title='指标审核' v-on:lcallBack='goApp'>
      </hr-header>
    </header>
    <section>
      <div v-if="!this.isEdit" class="items-bar">
        <div  @click="handleClick">
          <mt-cell title="指标类型" is-link style="color: #999999"><span style="color:#333">{{typename}}</span></mt-cell>
        </div>
      </div>

      <div v-else class="items-bar">
        <div>
          <mt-cell title="指标类型" style="color: #999999"><span style="color:#333">{{typename}}</span></mt-cell>
        </div>
      </div>

      <div v-if="!this.isEdit" class="items-bar">
        <div>
          <span style="color:#999999;padding-left: 10px;line-height: 1.2rem;min-height: 48px; font-size: 16px">指标名称</span>
          <label style="color:#999999;padding-right: 10px; float: right" @click="handleClick1"><i class="hrfont hr-reference" style="color:#999999;font-size: 24px"></i></label>
          <input type="text" style="font-size: 16px;text-align: right;float: right;display: inline;line-height: 1rem;min-height: 48px;" placeholder="必输" v-model="indiname" :readonly="this.isEdit"/>
        </div>
      </div>

      <div v-else class="items-bar">
        <div>
          <mt-cell title="指标名称" style="color: #999999"><span style="color:#333">{{indiname}}</span></mt-cell>
        </div>
      </div>

      <div class="items-bar" style="margin-bottom: 10px">
        <div>
          <mt-cell title="指标权重" style="color: #999999">
            <input type="number" style="font-size: 16px;text-align: right" v-model="indiweight" placeholder="请输入0-100" :readonly="this.isEdit"/>
            <span style="margin: 0 0 0 5px">%</span>
          </mt-cell>
        </div>
      </div>
      <label style="color: #999999;padding-left: 18px; font-size: 16px">计划目标值</label>
      <div class="trip-task" style="margin-bottom: 10px">
        <textarea placeholder="请输入计划目标值（非必填）" v-model="planvalue" rows="5" maxLength='100' :readonly="this.isEdit">
        </textarea>
      </div>
      <label style="color: #999999;padding-left: 18px; font-size: 16px">评分标准</label>
      <div class="trip-task">
        <textarea placeholder="无评分标准" v-model="scorerule" rows="5" maxLength='100' readonly="true">
        </textarea>
      </div>
    </section>
    <footer v-if='!this.isEdit'>
      <span @click='saveIndi'>保存</span>
    </footer>
    <footer v-else style='background:#DEE6EA;'>
      <span >保存</span>
    </footer>
    <div>
      <hrScrollcustom :scrolldata="typedata" v-on:increment="incrementTotal" ref="scrollpopup"></hrScrollcustom>
    </div>
    <div>
      <hrScrollcustom :scrolldata="indidata" v-on:increment="incrementTotal" ref="scrollpopup"></hrScrollcustom>
    </div>
  </div>
</template>

<script>
  import { fetchData, emojiFilter } from 'hr-utils'
  import { HrHeader, hrScrollcustom , ImgPicker } from 'hr-ui'
  import { Toast, Cell, MessageBox, Indicator } from 'mint-ui';
  export default {
    name: 'fillDetail',
    data() {
      return {
        typedata:{
          type:"blood",
          data:[]
        },
        types: [],
        indidata:{
          type:"blood",
          data:[]
        },
        indis: [],
        indiweight: '',
        planvalue: '',
        scorerule: '',
        weight: '',
        pk_type: '',
        pk_indi: '',
        typename: '',
        indiname: '',
        indiname_copy: '',
        pk_sch_eva: this.$route.query.pk_sch_eva,
        pk_evaobj: this.$route.query.pk_evaobj,
        pk_group: this.$route.query.pk_group,
        pk_org: this.$route.query.pk_org,
        pk: '',
        isEdit: this.$route.query.isEdit,
        source: this.$route.query.sourceapp
      }
    },

    components: {
      HrHeader,
      hrScrollcustom
    },

    watch: {
      pk_type(newValue, oldValue){
        if(newValue != ''){
          if(oldValue != ''){
            this.indiname = '';
            this.indiname_copy = '';
            this.pk_indi = '';
            this.scorerule = '';
          }
          this.queryIndis();
        }
      },
      indiname(){
        if(this.indiname != this.indiname_copy){
          this.pk_indi = ''
          this.scorerule = ''
        }
      },
      weight(){
        if(this.weight != ''){
          this.indiweight = this.weight * 100;
        }
      }
    },

    mounted() {
      if(this.$route.query.source == 'add'){

      }else{
        this.pk = this.$route.query.pk_indi
        this.queryEvaObjectData();
      }
      this.queryTypeList();
    },
    methods: {
      checkWeight(){
        let weight = this.indiweight;
        let reg=/(^[1-9][0-9]$|^[0-9]$|^100$)/;
        if(!reg.test(weight)){
          Toast('请输入0-100的整数');
          return false
        }
        return true
      },
      incrementTotal(data){//传递到子组件中的回调方法
        if(data.name=='pk_type'){
          this.pk_type=data.data.pk_type;
          this.typename=data.data.typename;
        }
        if(data.name=='pk_indi'){
          this.pk_indi=data.data.pk_indi;
          this.indiname_copy = data.data.indiname;
          this.indiname=data.data.indiname;
          this.scorerule = data.data.standard;
        }
      },
      queryTypeList(){
        let _this = this
        Indicator.open()
        fetchData({
          url: 'hrssc/portal/peInfo/queryTypeList',
          method: 'post',
          param: {
            pk_evaobj: this.$route.query.pk_evaobj,
          },
          mock: false,
          contentType: "application/json",
          success: function(data) {
            Indicator.close()
            _this.types = data.data
          },
          error: function(error) {
            Indicator.close()
            Toast(error.message)
          }
        })
      },
      queryIndis(){
        let _this = this
        Indicator.open()
        fetchData({
          url: 'hrssc/portal/peInfo/queryIndis',
          method: 'post',
          param: {
            pk_type: this.pk_type
          },
          mock: false,
          contentType: "application/json",
          success: function(data) {
            Indicator.close()
            _this.indis = data.data
          },
          error: function(error) {
            Indicator.close()
            Toast(error.message)
          }
        })
      },
      writeEditData(EditData) {
        this.pk_awayh = this.$route.query.pk_h
        // this.awaybs = EditData.awaybs
        this.unit = EditData.unit;
        this.ts = EditData.ts
        this.transtypeid = EditData.transtypeid
        this.typename = EditData.typename
        this.indiname = EditData.indiname
      },
      queryEvaObjectData() {
        let _this = this
        Indicator.open()
        fetchData({
          url: 'hrssc/portal/peInfo/queryIndi',
          method: 'post',
          param: {
            pk_sch_eva: this.$route.query.pk_sch_eva,
            pk_evaobj: this.$route.query.pk_evaobj,
            pk_indi: this.$route.query.pk_indi
          },
          mock: false,
          contentType: "application/json",
          success: function(data) {
            Indicator.close()
            _this.weight = data.data.indiweight
            _this.typename = data.data.typename
            _this.pk_type = data.data.pk_inditype
            _this.indiname = data.data.indiname
            _this.indiname_copy = data.data.indiname
            _this.pk_indi = data.data.pk_indi
            _this.planvalue = data.data.planvalue
            _this.scorerule = data.data.standard
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
            source: 'fillDetail',
            pk_evaobj: this.pk_evaobj,
            pk_sch_eva: this.pk_sch_eva,
            pk_schemeperiod: this.$route.query.pk_schemeperiod,
            schemeperiodname: this.$route.query.schemeperiodname

          }
        })
      },

      Validate(){
        if(this.indiname == '') {
          Toast('指标名称不能为空哦')
          return false
        }
        if(this.indiweight == '') {
          Toast('请输入指标权重')
          return false
        }
         return this.checkWeight()
      },

      save(){
        let _this = this
        let param = {
          pk : this.pk,
          pk_type: this.pk_type,
          indiname: this.indiname,
          pk_indi: this.pk_indi,
          weight : this.indiweight/100,
          planvalue: this.planvalue,
          pk_evaobj : this.pk_evaobj,
          pk_sch_eva: this.pk_sch_eva,
          pk_group: this.pk_group,
          pk_org: this.pk_org,
          standard: this.scorerule,
          source: this.source
        }
        Indicator.open({
          text: '指标保存中，请稍等...',
          spinnerType: 'fading-circle'
        })
        fetchData({
          url: 'hrssc/portal/peInfo/saveIndi',
          method: 'post',
          param: param,
          mock: false,
          contentType: "application/json",
          success: function(data) {
            Indicator.close()
            Toast('保存成功')
            _this.$router.push({
              name: _this.$route.query.sourceapp,
              query: {
                source: 'fillDetail',
                pk_evaobj: _this.pk_evaobj,
                pk_sch_eva: _this.pk_sch_eva,
                pk_schemeperiod: _this.$route.query.pk_schemeperiod,
                schemeperiodname: _this.$route.query.schemeperiodname
              }
            })
          },
          error: function(error) {
            Indicator.close()
            Toast(error.message)
          }
        })
      },

      saveIndi() {
        if(!this.Validate()){
          return
        }
        if(this.pk_type == ''){
          MessageBox.confirm('指标类型为空，确定保存？','').then(action =>{
            if(action == 'confirm'){
              this.save()
            }
          }).catch(err => {
            if(err == 'cancel'){
              Toast('已取消')
            }else{
              Toast(err.message)
            }
          });
        }else{
          this.save()
        }
      },
      handleClick(){
        this.typedata={
          type:"custom",
          data:this.types,
          name:"pk_type",
          mark:"typename"
        }
        //调用子组件的方法
        this.$refs.scrollpopup.openpopup();//子组件的方法
        this.$refs.scrollpopup.refresh(this.typedata);//子组件的方法
      },
      handleClick1(){
        if(this.pk_type == ''){
          Toast('请先选择指标类型或直接输入自定义指标')
          return
        }
        this.indidata={
          type:"custom",
          data:this.indis,
          name:"pk_indi",
          mark:"indiname"
        }
        //调用子组件的方法
        this.$refs.scrollpopup.openpopup();//子组件的方法
        this.$refs.scrollpopup.refresh(this.indidata);//子组件的方法
      },

    }
  }
</script>

<style lang='less' scoped>
  header {
    position: fixed;
    width: 100%;
    height: .88rem;
    line-height: .88rem;
    z-index: 2;
  }

  section {
    height: 85.9%;
    margin-top: .88rem;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    .items-bar {
      padding-left: .22rem;
      background: #fff;
      .items {
        padding: .1rem 0 .1rem;
        .item {
          display: inline-block;
          height: .6rem;
          min-width: 1.33rem;
          margin-right: .1rem;
          padding: 0 .2rem;
          margin: .2rem .1rem 0 0;
          background: #e3f6ff;
          border-radius: 2px;
          line-height: .6rem;
          font-size: 16px;
          color: #0caef5;
          letter-spacing: 0;
          text-align: center;
        }
      }
      label {
        /*display: block;*/
        height: .6rem;
        margin-top: .2rem;
        padding: 0 .2rem;
        font-size: 16px;
        color: #666666;
        /*letter-spacing: 0;*/
        text-align: left;
      }
    }
    .trip-task{
      position: relative;
      height: 1.64rem;
      background: #fff;
      margin-top: .1rem;
      padding: .24rem 0.2rem 0 0.4rem;
      border-top: 1px solid #e4e4e4;
      textarea{
        height: 100%;
        width: 100%;
        font-size: .3rem;
        color:#333333;
        letter-spacing:-0.34px;
        text-align:left;
        resize: none;
        font-family: PingFangSC-Regular;
      }
      textarea::-webkit-scrollbar{
        display: none;
      }
      .statistics{
        position: absolute;
        bottom: .24rem;
        right: .2rem;
        width: .8rem;
        padding: 0 .1rem;
        background:#d8d8d8;
        border-radius:33px;
        font-size:14px;
        color:#ffffff;
        letter-spacing:-0.32px;
        text-align:center;
        line-height: .44rem;
      }
    }
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

<style>

  .switch-bar .mint-switch-core {
    width: 45px;
    height: 25px;
  }

  .switch-bar .mint-switch-core::after {
    width: 23px;
    height: 23px;
  }
</style>
