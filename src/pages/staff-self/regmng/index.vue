/*
* Created by tianxx5 on 2019/01/08.
*
*/
<template>
  <div>
    <header>
      <hr-header
        title='转正申请'
        v-on:lcallBack='goApp'
      >
      </hr-header>
    </header>
    <section>
      <div class="items-bar">
        <div class="items">
          <div>
            <span class="item"
                  v-for='(item, index) in RegTypeList'
                  v-bind:key = index
                  :id = 'item.pk'>
                {{ item.name}}
              </span>
          </div>
        </div>
      </div>
      <div class="items-bar" style="margin-bottom: .1rem">
        <div  @click="handleClick()">
          <mt-cell title="流程类型" is-link style="color: #999999"><span style="color:#333">{{transtypename}}</span></mt-cell>
        </div>
      </div>
      <div class="model time">
        <div class="index" @click="showflag1 = !showflag1">基本信息</div>
        <div class="viewDiv" v-if="showflag1">
          <ul class="view">
            <li class="list clearfix" @click='openTimePicker("over")'>
              <p class="txt">试用结束日期</p>
              <div class="fr">
                <input name="over" id="over" type="text" class="scroller-date" v-model='overdate' placeholder='请选择'disabled=true/>
                <i class="icon hrfont hr-Arrow1"></i>
              </div>
            </li>
            <li class="list clearfix" @click='openTimePicker("regular")'>
              <p class="txt">生效日期</p>
              <div class="fr">
                <input name="regular" id="regular" type="text" class="scroller-date" v-model='regulardate' placeholder='必填' disabled=true/>
                <i class="icon hrfont hr-Arrow1"></i>
              </div>
            </li>
            <li class="list clearfix" @click="handleClickref('regularresult')">
              <p class="txt">试用结果</p>
              <div class="fr">
                <input name="end" id="end" type="text" class="scroller-date" v-model='regularresultname' placeholder='必填' disabled=true/>
                <i class="icon hrfont hr-Arrow1"></i>
              </div>
            </li>
            <li class="list clearfix" @click='openTimePicker("yanqi")' v-if="regularresult==2">
              <p class="txt">延期转正日期</p>
              <div class="fr">
                <input name="yanqi" id="yanqi" type="text" class="scroller-date" v-model='yanqidate' placeholder='必填' disabled=true/>
                <i class="icon hrfont hr-Arrow1"></i>
              </div>
            </li>
            <li class="list clearfix">
              <p class="txt">同步工作履历</p>
              <div style="display: inline-block;float: right;padding: .1rem .2rem 0 0;">
                <mt-switch v-model="synchronized"></mt-switch>
              </div>
            </li>
          </ul>
          <div class="trip-area" v-if="showflag1">
          <textarea placeholder="说明（非必填）" rows="5" maxLength='100' v-model="memo" @input="handleInput1">
          </textarea>
            <div class="statistics">{{ 100- contentNum1}}</div>
          </div>
        </div>
      </div>
      <div class="model time">
        <div class="index" @click="showflag2 = !showflag2">转正后信息</div>
        <div class="viewDiv" v-if="showflag2">
          <ul class="view" v-if="newdata">
            <li class="list clearfix" v-for='(item, index) in newdata' @click="handleClickref(item.itemKey)">
              <p class="txt">{{item.itemName}}</p>
              <div class="fr" v-if="(item.datatype==5 || item.datatype==0)">
                <input type="text" v-model='item.displayname' placeholder='请选择' disabled=true v-if="!item.isrequired && item.datatype==5"/>
                <input type="text" v-model='item.displayname' placeholder='请输入' disabled=true v-if="!item.isrequired && item.datatype==0"/>
                <input type="text" v-model='item.displayname' placeholder='必填' disabled=true v-if="item.isrequired"/>
                <i class="icon hrfont hr-Arrow1" v-if="item.datatype==5"></i>
              </div>
              <div class="fr" v-if="item.datatype==4">
                <div style="display: inline-block;float: right;padding: .1rem .2rem 0 0;">
                  <mt-switch v-model="item.value"></mt-switch>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
    <footer v-if='crossValiDate'>
      <span @click='savePsnreg' >保存</span>
    </footer>
    <footer v-else style='background:#DEE6EA'>
      <span >保存</span>
    </footer>
    <div class="time-picker">
      <mt-datetime-picker
        ref="regular"
        v-model="regularVisible"
        type="date"
        @confirm="chooseRegularDate"
        confirmText = '确定'
      >
      </mt-datetime-picker>
    </div>
    <div class="time-picker">
      <mt-datetime-picker
        ref="over"
        v-model="overVisible"
        type="date"
        @confirm="chooseOverDate"
        confirmText = '确定'
      >
      </mt-datetime-picker>
    </div>
    <div class="time-picker">
      <mt-datetime-picker
        ref="yanqi"
        v-model="yanqiVisible"
        type="date"
        @confirm="chooseYanqiDate"
        confirmText = '确定'
      >
      </mt-datetime-picker>
    </div>
    <div>
      <hrScrollcustom :scrolldata="refdata" v-on:increment="incrementTotal" ref="scrollpopup"></hrScrollcustom>
    </div>
  </div>
</template>

<script>
  import { Toast, Indicator, Cell, MessageBox, Spinner, DatetimePicker } from 'mint-ui';
  import { fetchData, emojiFilter } from 'hr-utils'
  import { HrHeader, hrScrollcustom, ImgPicker} from 'hr-ui'
  import MtPopup from "mint-ui/packages/popup/src/popup";

  export default {
    data(){
      return{
        pk_hi_regapply: '',
        RegTypeList:[
          {
            pk:'1',
            name:'入职试用'
          },{
            pk:'2',
            name:'转岗试用'
          }
        ],//试用期类型
        selectedRegType: '', // 当前选择的试用期类型
        trial_type: '',
        transtypes:[],
        transtypeid: '',
        transtypename: '请选择',
        regularVisible : new Date(),
        overVisible : new Date(),
        yanqiVisible : new Date(),
        contentNum1: 0,
        newpk_psncl: '',
        newpk_dept: '',
        newpk_org: '',
        newpk_orgdatas:[],
        newpk_psncldatas:[],
        newpk_deptdatas:[],
        olddata : [],
        newdata : [],
        orgdeptname:{
          pk_org: '',
          orgname: '',
          pk_dept: '',
          deptname: '',
          pk_psncl: '',
          psnclname: ''
        },
        errorMessage: '',
        refsource:'',
        refsource_copy:'',
        refdata:{
          type:"blood",
          data:[]
        },
        refdatas:[],
        RegResultList:[
            {
              pk:'1',
              name:'转正'
            },{
              pk:'2',
              name:'延长试用期'
            },{
              pk:'3',
              name:'未通过试用'
            }
          ],//试用结果
        regulardate:'',
        overdate:'',
        yanqidate:'',
        regularresult:'',
        regularresultname:'',
        memo:'',
        synchronized: false,
        showflag1: true,
        showflag2: true,
        ts: null
      }
    },
    computed: {
      // 提交按钮是否置灰
      crossValiDate : function() {
        let flag = true
        //基本信息必填项校验
        if ( !this.regulardate || !this.regularresult) {
          flag = false
        } else if(this.regularresult===2
          && !this.yanqidate) {
          flag = false
        }
        //动态项目必填项校验
        for(var i=0; i<this.newdata.length; i++){
          let data = this.newdata[i]
          if(data.isrequired && !data.value){
            flag = false
          }
        }
        return flag
      }
    },
    components: {
      MtPopup,
      HrHeader, ImgPicker, hrScrollcustom, DatetimePicker},
    mounted(){
      // 编辑态
      if (this.$route.query.isEdit) {
        this.pk_hi_regapply = this.$route.query.pk_h
        this.getEditData()
      }else {
        this.getNew();
      }
    },

    watch: {
      trial_type() {
        if (this.trial_type) {
          this.setRegType()
        }
      },
      transtypes() {
        if (this.transtypes && this.transtypes.length > 0) {
          this.handleClick()
        }
      },
      newpk_orgdatas() {
        if (this.newpk_orgdatas && this.newpk_orgdatas.length > 0) {
          this.handleClickref('newpk_org')
        }
      },
      newpk_org(newvalue, oldvalue) {
        if (oldvalue && newvalue) {
          this.newpk_dept = ''
          for (var i = 2; i < this.newdata.length; i++) {
            this.newdata[i].value = ''
            this.newdata[i].displayname = ''
          }
        }
      },
      newpk_dept(newvalue, oldvalue) {
        if (oldvalue && newvalue) {
          for (var i = 3; i < this.newdata.length; i++) {
            this.newdata[i].value = ''
            this.newdata[i].displayname = ''
          }
        }
      },
      newpk_psncldatas() {
        if (this.newpk_psncldatas && this.newpk_psncldatas.length > 0) {
          this.handleClickref('newpk_psncl')
        }
      },
      newpk_deptdatas() {
        if (this.newpk_deptdatas && this.newpk_deptdatas.length > 0) {
          this.handleClickref('newpk_dept')
        }
      },
      refsource_copy() {
        if (this.refdatas && this.refdatas.length > 0) {
          this.handleClickref(this.refsource_copy)
        }
      },
    },

    methods: {
      getEditData() {
        Indicator.open()
        let _this = this
        fetchData({
          url: 'hrssc/portal/tbmquery/getBillInfo',
          method: 'post',
          param: {
            pk_h: this.$route.query.pk_h,
            billtype: 'psnreg'
          },
          mock: false,
          contentType: "application/json",
          success : res=>{
            Indicator.close()
            // this.billInfo = res.data
            _this.pk_hi_regapply = res.data.pk_hi_regapply
            _this.trial_type = res.data.trial_type
            _this.transtypeid = res.data.transtypeid
            _this.transtypename = res.data.transtypename
            _this.olddata = res.data.data.olddata
            _this.newdata = res.data.data.newdata
            for(var i=0; i<res.data.data.newdata.length; i++){
              if(res.data.data.newdata[i].itemKey === 'newpk_org'
                || res.data.data.newdata[i].itemKey === 'newpk_dept'){
                _this[res.data.data.newdata[i].itemKey] = res.data.data.newdata[i].value
              }
            }
            _this.regulardate = res.data.regulardate
            _this.overdate = res.data.overdate

            _this.yanqidate = res.data.yanqidate
            _this.regularresult = res.data.regularresult
            _this.regularresultname = res.data.regularresultname
            _this.memo = res.data.memo
            _this.synchronized = res.data.synchronized
            _this.ts = res.data.ts
          },
          error : err=> {
            Indicator.close()
            Toast(err.message)
          }
        })
      },
      queryTranstypeList(){
        let _this = this
        Indicator.open()
        fetchData({
          url: 'hrssc/portal/tbmquery/queryTranstype',
          method: 'post',
          param: {
            billtype: 'psnreg'
          },
          mock: false,
          contentType: "application/json",
          success: function(data) {
            Indicator.close()
            _this.transtypes = data.data
          },
          error: function(error) {
            Indicator.close()
            Toast(error.message)
          }
        })
      },
      incrementTotal(data){//传递到子组件中的回调方法
        if(data.name=='transtypeid'){
          this.transtypeid = data.data.transtypeid
          this.transtypename = data.data.transtypename
        }
        if(data.name=='pk'){
          let refpk = this.refsource
          let refname = this.refsource+'name'
          if(refpk === 'regularresult' && data.data.pk !==2){
            this.yanqidate = ''
          }
          if(refpk === 'regularresult'){
            this[refpk] =  data.data.pk
            this[refname] =  data.data.name
          }
          if(refpk === 'newpk_org' || refpk === 'newpk_dept'
            || refpk === 'newpk_psncl'){
            this[refpk] =  data.data.pk
          }
          for(var i=0; i<this.newdata.length; i++){
            if(this.newdata[i].itemKey === refpk){
              this.newdata[i].displayname = data.data.name
              this.newdata[i].value = data.data.pk
            }
          }
          if(refpk === 'newpk_post'){
            for(var i=0; i<this.newdata.length; i++){
              if(this.newdata[i].itemKey === 'newpk_postseries'){
                this.newdata[i].displayname = data.data.postseriesname
                this.newdata[i].value = data.data.pk_postseries
              }
            }
          }
          if(refpk === 'newseries'){
            for(var i=0; i<this.newdata.length; i++){
              if(this.newdata[i].itemKey === 'newpk_job'){
                this.newdata[i].displayname = ''
                this.newdata[i].value = ''
              }
            }
          }
        }
      },
      openTimePicker(type) {//打开时间遮罩
        if(this.errorMessage){
          Toast(this.errorMessage)
          return
        }
        if(!this.trial_type){
          Toast('试用期类型不能为空！')
          return
        }
        this.$refs[type].open();
      },
      chooseRegularDate(regular){
        this.regulardate = this.format(regular)
      },
      chooseOverDate(over){
        this.overdate = this.format(over)
      },
      chooseYanqiDate(yanqi){
        this.yanqidate = this.format(yanqi)
      },
      format(timeStamp) {
        let t =  timeStamp.getFullYear()
          + '-' + (((timeStamp.getMonth()+1) < 10) ? ('0' + (timeStamp.getMonth()+1)) : (timeStamp.getMonth()+1))
          + '-' + ((timeStamp.getDate() < 10 ) ? ('0' + timeStamp.getDate())  : timeStamp.getDate())
        return t
      },
      handleClick(){
        if(this.errorMessage&&!this.trial_type){
          return
        }
        if(!this.transtypes || this.transtypes.length === 0){
          this.queryTranstypeList()
        }else{
          this.refdata={
            type:"custom",
            data: this.transtypes,
            name:"transtypeid",
            mark:"transtypename"
          }
          //调用子组件的方法
          this.$refs.scrollpopup.openpopup();//子组件的方法
          this.$refs.scrollpopup.refresh(this.refdata);//子组件的方法
        }
      },
      handleClickref(source){
        if(this.errorMessage&&!this.trial_type){
          return
        }
        this.refsource=source
        let data
        if(source === 'regularresult'){
          data = this.RegResultList
        }else if(source === 'newpk_org'&&
          this.newpk_orgdatas
          && this.newpk_orgdatas.length > 0){
          data = this.newpk_orgdatas
        }else if(source === 'newpk_dept'&&
          this.newpk_deptdatas
          && this.newpk_deptdatas.length > 0){
          data = this.newpk_deptdatas
        }else if(source === 'newpk_psncl'&&
          this.newpk_psncldatas
          && this.newpk_psncldatas.length > 0){
          data = this.newpk_psncldatas
        } else if(this.refsource_copy === this.refsource){
          data = this.refdatas
        }else{
          if(this.refsource === 'newpk_postseries'){
            for(var i=0; i<this.newdata.length; i++){
              if((this.newdata[i].itemKey ==='newpk_post')
                && this.newdata[i].value){
                return
              }
            }
          }
          this.queryRefList(source)
        }
        if(data && data.length>0){
          this.refdata={
            type:"custom",
            data: data,
            name:"pk",
            mark:"name"
          }
          //调用子组件的方法
          this.$refs.scrollpopup.openpopup();//子组件的方法
          this.$refs.scrollpopup.refresh(this.refdata);//子组件的方法
        }
      },
      getNew(){
        let _this = this
        Indicator.open()
        fetchData({
          url: 'hrssc/portal/regmng/getNewReg',
          method: 'post',
          param: {
            billtype: 'psnreg',
            pk_hi_regapply: this.$route.query.pk_h?this.$route.query.pk_h:'new'
          },
          mock: false,
          contentType: "application/json",
          success: function(data) {
            Indicator.close()
            _this.trial_type = data.data.trial_type
            _this.olddata = data.data.olddata
            _this.newdata = data.data.newdata
            _this.orgdeptname = data.data.orgdeptname
            _this.newpk_org = data.data.orgdeptname.pk_org
            _this.newpk_dept = data.data.orgdeptname.pk_dept
            // _this.newpk_psncl = data.data.orgdeptname.pk_psncl
            _this.begindate = data.data.trialdata.begindate
            _this.overdate = data.data.trialdata.enddate
            _this.regulardate = data.data.trialdata.regulardate
          },
          error: function(error) {
            Indicator.close()
            _this.errorMessage = error.message
            Toast(error.message)
          }
        })
      },

      queryRefList(type){
        let _this = this
        Indicator.open()
        let newseries = ''
        if(type === 'newpk_job'){
          for(var i=0; i<this.newdata.length; i++){
            if(this.newdata[i].itemKey === 'newseries'){
              newseries = this.newdata[i].value
            }
          }
          if(!newseries){
            Toast('请先选择职务类别！')
            return
          }
        }
        let newpk_org
        for(var i=0; i<this.newdata.length; i++){
          if(this.newdata[i].itemKey === 'newpk_org'){
            newpk_org = this.newdata[i].value
          }
        }
        fetchData({
          url: 'hrssc/portal/regmng/queryRefList',
          method: 'post',
          param: {
            refType: type,
            newpk_org: newpk_org,
            pk_dept:this.newpk_dept,
            newseries:newseries
          },
          mock: false,
          contentType: "application/json",
          success: function(data) {
            Indicator.close()
            if(type === 'newpk_org'){
              _this.newpk_orgdatas = data.data
            }else if(type === 'newpk_dept'){
              _this.newpk_deptdatas = data.data
            }else if(type === 'newpk_psncl'){
              _this.newpk_psncldatas = data.data
            }else{
              _this.refdatas = data.data
              _this.refsource_copy = type
            }
          },
          error: function(error) {
            Indicator.close()
            Toast(error.message)
          }
        })
      },
      // 自动选定编辑态传过来的请假类型
      setRegType() {
        let list = this.RegTypeList
        for (let i in list) {
          if (this.trial_type == list[i].pk) {
            this.selectRegTypeIfChoosed(list[i])
            break
          }
        }
      },
      // 选择请假类型  写入数据，重获请假时长，剩余额度  修改样式
      selectRegTypeIfChoosed(obj, e) {
        if (this.selectedRegType) {
          this.changeRegTypeStyle('disActive')
        }
        this.selectedRegType = obj
        this.changeRegTypeStyle('active')
      },
      // 选中某一请假类型时   改变其背景色
      changeRegTypeStyle(status) {
        let r = this.selectedRegType.pk,
          dom = document.getElementById(r),
          wbac = '#e3f6ff',
          blueFont = '#0caef5',
          bbac = '#0caef5',
          whiteFont = '#fff'

        if (dom != null && status == 'disActive') {
          dom.style.background = wbac
          dom.style.color = blueFont
        } else if (dom != null && status == 'active') {
          dom.style.background = bbac
          dom.style.color = whiteFont
        }
      },
      handleInput1(e) {
        e.target.value = emojiFilter(e.target.value)
        let v = e.target.value

        if (v.length > 100) {
          this.contentNum1 = 100
          this.memo = e.target.value.substr(0,99)
        } else {
          this.contentNum1 = v.length
        }

        if (this.contentNum1 < 0) {
          this.contentNum1 = 0
        }
      },
      //返回首页
      goApp() {
        this.$router.go(-1)
      },

      // getleaveReamrk(leavememo,index){
      //   this.leavebs[index].leavememo = leavememo
      // },


      savePsnreg() {
        let _this = this
        let param = {
          regMap: {
            pk_hi_regapply: _this.pk_hi_regapply,
            trial_type: _this.trial_type,
            transtypeid: _this.transtypeid,
            regulardate: _this.regulardate,
            overdate: _this.overdate,
            yanqidate: _this.yanqidate,
            regularresult: _this.regularresult,
            memo: _this.memo,
            synchronized: _this.synchronized,
            ts: _this.ts
          },
          newdata : _this.newdata,
        }
        if (this.NonNullCheck()) {
          Indicator.open({
            text: '单据保存中，请稍等...',
            spinnerType: 'fading-circle'
          });
          fetchData({
            url: 'hrssc/portal/regmng/savePsnReg',
            method: 'post',
            param: param,
            mock: false,
            contentType: "application/json",
            success: function(data) {
              Indicator.close()
              Toast('保存成功，请预览')
              _this.$router.push({
                name: 'apply-detail',
                query: {
                  approve_state: -1,
                  pk_h: data.data.pk_hi_regapply,
                  billtype: 'psnreg',
                  tbm_h_name: '转正',
                  bill_code: data.data.bill_code,
                  ts: data.data.ts
                }
              })
            },
            error: function(error) {
              Indicator.close()
              Toast(error.message)
            }
          })
        }
      },

      NonNullCheck() {
        //基本信息必填项校验
        if ( !this.regulardate || !this.regularresult) {
          Toast('必填项不能为空')
          return false
        } else if(this.regularresult===2
          && !this.yanqidate) {
            Toast('延期转正日期不能为空')
            return false
        }
        //动态项目必填项校验
        for(var i=0; i<this.newdata.length; i++){
          let data = this.newdata[i]
          if(data.isrequired && !data.value){
            Toast('必填项不能为空')
            return false
          }
        }
        return true
      }
    }
  }
</script>

<style lang='less' scoped>
  header{
    position: fixed;
    width: 100%;
    height: .88rem;
    line-height: .88rem;
    z-index: 2;
  }
  section{
    height: 85.9%;
    margin-top: .88rem;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    .items-bar{
      padding-left: .22rem;
      background: #fff;
      .items{
        padding-bottom: .2rem;
        .item{
          display: inline-block;
          height: .6rem;
          min-width: 1.33rem;
          width: 48%;
          /*margin-right: .1rem;*/
          padding: 0 .2rem;
          margin: .2rem .1rem 0 0;
          background: #e3f6ff;
          border-radius:2px;
          line-height: .6rem;
          font-size:16px;
          color:#0caef5;
          letter-spacing:0;
          text-align:center;
        }
      }
      label{
        display: block;
        height: .6rem;
        padding: .1rem 0;
        font-size:12px;
        color:#666666;
        letter-spacing:0;
        text-align:left;
        font{
          color: #ff7263;
        }
      }
      .itemdef{
        position: relative;
        .view{
          padding-left:0.4rem;
          .list{
            height:0.93rem;
            border-bottom:1px solid #dddddd;
            // background:url(../../image/public/right.png) no-repeat 95% center;
            background-size:0.17rem 0.3rem;
            line-height:0.93rem;
            overflow: hidden;
            list-style-type:none;
            .txt{
              float: left;
              color:#8c8d8e;
              font-size: .3rem;
            }
            .fr{
              position:relative;
              float: right;
              height: 100%;
              margin-right:0.2rem;
              input{
                display:block;
                float: left;
                width: 3.6rem;
                height: 0.9rem;
                line-height:0.9rem;
                border: none;
                outline: none;
                text-align: right;
                background: #fff;
                color: #000;
                font-size: 0.3rem;
              }
              i{
                color: #ccc;
                font-size: 0.4rem;
              }
            }
          }
        }
      }
    }
    .model{
      position:relative;
      background:#fff;
      // height: 2.12rem;
      margin-bottom:0.1rem;
      animation: showModel .8s linear;
      border-bottom: 1px solid #dddddd;
      .index{
        height: .54rem;
        padding-left: .26rem;
        background: #F5F5F5;
        line-height: .54rem;
        font-size: 0.25rem;
        color: #999999;
        letter-spacing: 0;
      }
      .label{
        position: relative;
        display: block;
        height: .88rem;
        line-height: .88rem;
        font-size: 0.3rem;
        color:#333333;
        letter-spacing:0;
        text-align:left;
        margin-left: .22rem;
        border-bottom:1px solid #dddddd;
        font-family:PingFang-SC-Medium;
        span{
          .spinner{
            position: absolute;
            top: 50%;
            left: 15%;
            transform: translateY(-50%);
          }
        }
        i{
          float: right;
          width: 20%;
          text-align: right;
          margin-right: .2rem;
          font-size: .4rem;
          color: #c5c5c5;
        }
      }
      .viewDiv{
        position: relative;
        .view{
          padding-left:0.3rem;
          .list{
            border-bottom:1px solid #dddddd;
            height:0.93rem;
            // background:url(../../image/public/right.png) no-repeat 95% center;
            background-size:0.17rem 0.3rem;
            line-height:0.93rem;
            overflow: hidden;
            list-style-type:none;
            .txt{
              float: left;
              color:#8c8d8e;
              font-size: .3rem;
            }
            .fr{
              position:relative;
              float: right;
              height: 100%;
              margin-right:0.2rem;
              input{
                display:block;
                float: left;
                width: 3.6rem;
                height: 0.9rem;
                line-height:0.9rem;
                border: none;
                outline: none;
                text-align: right;
                background: #fff;
                color: #000;
                font-size: 0.3rem;
              }
              i{
                color: #ccc;
                font-size: 0.4rem;
              }
            }
          }
          .list:last-child{
            border-bottom:0;
          }
        }
        .icon-posi{
          position:absolute;
          top:0;
          left:0;
          width:0.8rem;
          height:100%;
          .s-icon{
            position:absolute;
            left:0.25rem;
            top:0.32rem;
            width:0.3rem;
            height:0.3rem;
            border:0.06rem solid #4BC165;
            border-radius:50% 50%;
          }
          .c-border{
            width:0.04rem;
            height:0.6rem;
            background:#dddddd;
            position: absolute;
            left:50%;
            top:50%;
            margin-left:-0.02rem;
            margin-top:-0.3rem;
          }
          .e-icon{
            position:absolute;
            left:0.25rem;
            bottom:0.32rem;
            width:0.3rem;
            height:0.3rem;
            border:0.06rem solid #FF7263;
            border-radius:50% 50%;
          }
        }

      }
    }
    .text-area{
      position: relative;
      height: 1.54rem;
      background: #fff;
      margin-top: .1rem;
      padding: .28rem .2rem;
      border-bottom: 1px solid #e4e4e4;
      border-top: 1px solid #e4e4e4;
      textarea{
        height: 100%;
        width: 100%;
        font-size: .3rem;
        letter-spacing:-0.34px;
        text-align:left;
        resize: none;
        font-family: PingFangSC-Regular;
        color: #333333;
        letter-spacing: -0.34px;
        :-webkit-scrollbar{
          display:none;
        }
      }
      textarea::-webkit-scrollbar{
        display:none;
      }
      .statistics{
        position: absolute;
        bottom: .24rem;
        right: .24rem;
        padding: 0 .1rem;
        width: .8rem;
        background:#d8d8d8;
        border-radius:33px;
        font-size:14px;
        color:#ffffff;
        letter-spacing:-0.32px;
        text-align:center;
        line-height: .44rem;
      }
    }
    @-webkit-keyframes showModel{
      from{
        // margin-top: -3rem;
      }
      to{
        margin-top: 0;
      }
    }
    @keyframes showModel{
      from{
        // margin-top: -3rem;
      }
      to{
        margin-top: 0;
      }
    }
    .trip-area{
      position: relative;
      height: 1.64rem;
      background: #fff;
      margin-left: .22rem;
      padding: .24rem 0.2rem 0 .2rem;
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

    .time-picker{
      .add-time{
        height: .88rem;
        text-align: center;
        line-height: .88rem;
        background: #fff;
        i{
          color:#0caef5;
          font-size: 15px;
        }
        span{
          font-size:15px;
          color:#0caef5;
          letter-spacing:0;
        }
      }


    }
    .total-len{
      position: relative;
      height: .96rem;
      margin: .1rem 0;
      padding: 0 .22rem;
      line-height: .96rem;
      background: #fff;
      font-size: .3rem;
      label{
        color:#999999;
        letter-spacing:-0.34px;
        text-align:left;
      }
      .spinner{
        position: absolute;
        top: 50%;
        right: 3%;
        transform: translateY(-50%);
      }
      span{
        float: right;
        font-size:15px;
        color:#333333;
        letter-spacing:-0.34px;
        text-align:right;
      }
    }

    .text-area{
      position: relative;
      height: 2.7rem;
      background: #fff;
      margin-top: .1rem;
      padding: .3rem .2rem;
      border-bottom: 1px solid #e4e4e4;
      textarea{
        height: 100%;
        width: 100%;
        font-size:0.3rem;
        color:#333333;
        letter-spacing:-0.34px;
        font-family: PingFangSC-Regular;
        text-align:left;
        resize: none;
      }
      .statistics{
        position: absolute;
        bottom: .24rem;
        right: .24rem;
        padding: .03rem .1rem;
        background:#d8d8d8;
        border-radius:33px;
        font-size:14px;
        color:#ffffff;
        letter-spacing:-0.32px;
        text-align:center;
        line-height: .44rem;
      }
    }

    .img{
      margin-top: .1rem;
      background: #fff;
      label{
        display: block;
        height: .7rem;
        margin-left: .22rem;
        line-height: .7rem;
        font-size:15px;
        color:#666666;
        letter-spacing:0;
        text-align:left;
        border-bottom: 1px solid #ededed;
      }
    }
    .ccpsndiv {
      height: 0.54rem;
      line-height: 0.54rem;
      padding-left: 0.26rem;
      font-size: 0.25rem;
      color: #999999;
    }
  }
  footer{
    position: fixed;
    width: 100%;
    height: 1rem;
    left: 0;
    bottom: 0;
    background: #0caef5;
    font-size:18px;
    color:#ffffff;
    line-height: 1rem;
    letter-spacing:-0.39px;
    text-align:center;
    span{
      display: inline-block;
      height: 100%;
      width: 100%;
    }
  }
</style>

<style scoped>
  .switch-bar{
    height: 1.1rem;
    border-top:1px solid #dddddd;
    background: #fff;
  }
  .switch-bar .mint-switch-core{
    width: 45px;
    height: 25px;
  }
  .switch-bar .mint-switch-core::after{
    width: 23px;
    height: 23px;
  }
  .switchdivtitle{
    height: 1.0rem;
    line-height: 1.0rem;
    width: 70%;
    float: left;
    color: #8c8d8e;
    padding-left: 0.2rem;
  }
  .switchdiv{
    height: 1.0rem;
    line-height: 1.0rem;
    float: right;
    padding-right: 0.2rem;
    padding-top: 0.25rem;
  }
</style>
