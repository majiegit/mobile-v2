<!--绩效信息主页 by tianxx5 20180117-->
<template>
  <div style=" overflow: auto;" class="body">
      <header id="myPerformance-header">
        <hr-header
          title='绩效结果审核'
          v-on:lcallBack='goApp'
        >
        </hr-header>
      </header>
    <div class="mp-body" style="width: 100%; height:15%;  background: #2479ED; float: left; position: relative;">
      <div style="float: left; width: 85%; height: 35%; position: absolute; top: 6%; left: 7.5%">
        <input type="text" placeholder="请输入关键词搜索" style="color: #B3B3B3; font-size:0.1rem;
       padding: 0 15% 0 5%; height: 100%; width: 85%; border-radius: 25px;
        background-image: url('../../../../static/img/pages/performanceInfo/check-search.png');
        background-repeat: no-repeat;
        background-size: auto 0.4rem;
        background-position: 95% center;"/>
        <span class="quxiao">取消</span>
      </div>
      <div style="position: relative; width: 100%; height: 50%; top: 50%;">
        <section class="job-module" style="width: 100%; height: 100%;">
          <dl class="retrie">
            <dt>
              <a id="area" href="javascript:;">绩效方案 </a>
              <a id="wage" href="javascript:;">绩效期间</a>
            </dt>
            <dd class="area">
              <ul class="slide downlist">
                <li  v-if="fangAnList.length === 0"><a href="javascript:;">无方案期间</a></li>
                <li v-for="(item,index) in fangAnList" :key="index"  @click="selectFangAnId(index)">
                  <a href="javascript:;" :class="fangAnId == item.id ? select_option_color : ''">{{item.pe_sch_evaname}}</a>
                </li>
              </ul>
            </dd>
            <dd class="wage">
              <ul class="slide downlist">
                <li  v-if="fangAnList.length === 0"><a href="javascript:;">无绩效期间</a></li>
                <li  v-for="(item,index) in hrpeTimeList" :key="index" @click="selectHrpeValue(index)">
                  <a href="javascript:;" :class="hrpeValue == item.value ? select_option_color : ''">{{item.text}}</a>
                </li>
              </ul>
            </dd>
          </dl>
        </section>
      </div>
    </div>
    <div style="width: 100%; height: 8%; float: left;">
      <button class="button" :disabled="saveDisabled == true" :class="{btnBg:saveDisabled}" @click="saveData()">保 存</button>
      <button class="button" :disabled="quXiaoDisabled == true" :class="{btnBg:quXiaoDisabled}" @click="quxiao()">取 消</button>
      <button class="button" :disabled="checkDisabled == true" :class="{btnBg:checkDisabled}" @click="approveClick()">审 核</button>
      <button class="button" :disabled="noCheckDisabled == true" :class="{btnBg:noCheckDisabled}">弃 审</button>
    </div>
    <div style="width: 100%;  height: 30%; float: left;" v-for="(item,index) in checkDataList">
      <div style="width: 100%; height: 100%; float: left;">
        <div class="check_div" >
          <ul class="check_ul">
            <li>考核对象：{{item.object_pk_psndoc_name}}</li>
            <li>考核等级：{{getGrade(item.eva_pk_grade_item)}}</li>
            <li>考核总分：{{item.eva_score}}</li>
            <li>考核系数：{{item.eva_coef}}</li>
          </ul>
          <ul class="check_ul">
            <li v-if="item.aprrst_status == 1" style="color: red">审核状态：未审核</li>
            <li v-if="item.aprrst_status == 2" style="color: #2692DD">审核状态：审核中</li>
            <li v-if="item.aprrst_status == 3" >审核状态： 已审核</li>
            <li>审核总分：<input type="text" v-model="item.apr_score" style="width: 25%; font-size: 0.28rem; background: #fff"
                            @change="inputChange(index,item,$event,'apr_score')"
                            :disabled="item.aprrst_status == 3 ? true : false"/></li>
            <li>审核系数：<input type="text" v-model="item.apr_coef" style="width: 25%; font-size: 0.28rem; background: #fff"
                            @change="inputChange(index,item,$event,'apr_coef')"
                            :disabled="item.aprrst_status == 3 ? true : false"/></li>
            <li>审核等级：
              <select class="grade_select" v-model="item.pk_grade_item" :disabled="item.aprrst_status == 3 ? true : false">
                <option :value="item.key" v-for="(item,index) in grade_items" :key="index">{{item.value}}</option>
              </select>
            </li>
          </ul>
          <button class="check_bottom_button" @click="lookInfo(index,item.pk_eva_object)">评分明细
            <span v-if="jianTouFangXiang == 1">▼</span>
            <span v-if="jianTouFangXiang == 0">▲</span>
          </button>
        </div>
      </div>
      <div style="width: 100%; height: 40%; float: left; display: none">
        <div class="check_div_2" >
          <p style="width: 100%; height: 30%; color: #333333; font-size: 0.29rem; padding: 2%; font-weight: bold;">考核人</p>
          <ul class="check_ul_2">
            <li>考核人姓名：{{item.child_pk_psndoc_name}}</li>
            <li>考核人类别：{{item.child_pk_defdoc_name}}</li>
            <li>考核轮次：{{item.child_turn}}</li>
          </ul>
          <ul class="check_ul_2">
            <li>考核状态：{{ (item.child_pre_appraiser_status == 1 ? '未审核' : (item.child_pre_appraiser_status == 2 ? '审核中' : '已审核')) }}</li>
            <li>考核总分：{{item.child_score}}</li>
            <li>考核结果等级：{{getGrade(item.child_pk_res_gradeitem)}}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {HrHeader} from 'hr-ui'
  import $ from 'jquery'
  import axios from 'axios'
  import { ajax, fetchData, getStorage, setStorage, clearStorage} from 'hr-utils'
  import { Toast } from 'mint-ui';
  export default {
    name: 'performanceCheck',
    data() {
      return {
        select_option_color:'select_option_color',
        saveDisabled: true,
        quXiaoDisabled: true,
        checkDisabled: true,
        noCheckDisabled: true,
        jianTouFangXiang:0,
        windowPageContent: 'https://test.bjcsjs.com:7001/hrssc/hrpe/',
        grade_items:[],
        checkDataList:[],
        hrpeValue: '',
        hrpeTimeList:[],
        fangAnId: '',
        fangAnList:[],
        value:1,
        currPage : 0,
        pageSize : 20,
        unAbleApproveEvaObjectCount: 0
      }
    },
    components: {
      HrHeader: HrHeader
    },
    mounted(){
      $('.retrie dt a').click(function(){
        var $t=$(this);
        if($t.hasClass('up')){
          $(".retrie dt a").removeClass('up');
          $('.downlist').hide();
          $('.mask').hide();
        }else{
          $(".retrie dt a").removeClass('up');
          $('.downlist').hide();
          $t.addClass('up');
          $('.downlist').eq($(".retrie dt a").index($(this)[0])).show();
          $('.mask').show();
        }
      });
      $(".area ul li a:contains('"+$('#area').text()+"')").addClass('selected');
      $(".wage ul li a:contains('"+$('#wage').text()+"')").addClass('selected');
    },
    created(){
      this.queryHrpeFangAn()
    },
    methods: {
      // 取消
      quxiao(){
        this.queryCheckList()
      },
      //  input改变
      inputChange(index,item,e,param){
        let  newValue= e.target.value
        let reg = new RegExp('^\\d+(\\.\\d+)?$')
        if (!reg.test(newValue)) {
          Toast('只能输入数字')
        }else{
          if(param == 'apr_score'){
            item.apr_score  =  parseInt(newValue)
          }else if (param == 'apr_coef'){
            item.apr_coef  =  parseInt(newValue)
          }
          var data = Object.assign(this.checkDataList[index],item);
          this.checkDataList.splice(index,1,data)
          console.log(this.checkDataList)
          this.saveDisabled = false
          this.quXiaoDisabled = false
        }
      },
      // 获取是否弃审
      getIsNoCheck(){
      },
      saveData(){
        alert(111)
      },
      // 审核数据
      approveClick () {
        console.log(this.checkDataList)
       // this.approve()
      /*//  this.queryUnAbleApproveCount()
        let schForceDist = true
        let groupForceDist = true
        let isSchOut = 0
        let isGroupOut = 0
        let groupName = ''
        let aggVOs = this.forceDistData
        if (aggVOs !== null && aggVOs.length > 0) {
          for (let i = 0; i < aggVOs.length; i++) {
            let schEvaTabVO = aggVOs[i]
            let forceDistParamVO = schEvaTabVO.forceDistParamVO
            let forceDistWay = schEvaTabVO.forcedist_way
            if (i === 0) {
              schEvaTabVO = aggVOs[0]
              let isSchApprover = forceDistParamVO.isSchApprover
              let isSchForce = forceDistParamVO.isSchForce
              let isSchAccord = forceDistParamVO.isSchAccord
              if (!isSchApprover) {
                schForceDist = true
                continue
              }
              if (isSchForce && isSchAccord) {
                schForceDist = true
                groupForceDist = true
                break
              }
              if (isSchForce && !isSchAccord) {
                if (forceDistWay === 3) {
                  schForceDist = false
                  groupForceDist = false
                  break
                }
                if (forceDistWay === 2) {
                  schForceDist = false
                  groupForceDist = true
                  isSchOut = 1
                  break
                }
                if (forceDistWay === 1) {
                  schForceDist = true
                  groupForceDist = true
                  break
                }
              }
              if (isSchApprover && !isSchForce) {
                schForceDist = true
                continue
              }
            } else {
              let isGroupApprover = forceDistParamVO.isGroupApprover
              let isGroupForce = forceDistParamVO.isGroupForce
              let isGroupAccord = forceDistParamVO.isGroupAccord
              if (isGroupApprover && isGroupForce && isGroupAccord) {
                continue
              }
              if (isGroupForce && !isGroupAccord) {
                if (forceDistWay === 3) {
                  groupForceDist = false
                  if (groupName === '') {
                    groupName = schEvaTabVO.group_name
                  } else {
                    groupName += (',' + schEvaTabVO.group_name)
                  }
                  break
                } else if (forceDistWay === 2) {
                  groupForceDist = false
                  isGroupOut = 1
                } else if (forceDistWay === 1) {
                }
              }
            }
          }
        }
        if (schForceDist && groupForceDist && isSchOut === 0 && isGroupOut === 0) {
          this.approve()
        } else if (!schForceDist && !groupForceDist && isSchOut === 0 && isGroupOut === 0) {
          Toast('不符合整个方案的强制分布要求，请调整审核总分或审核等级')
        } else if (!schForceDist && groupForceDist && isSchOut === 1 && isGroupOut === 0) {
          //this.showConfirmDialog('方案不符合强制分布要求，是否继续审核')
        } else if (schForceDist && !groupForceDist && isSchOut === 0 && isGroupOut === 1) {
          //this.showConfirmDialog('考核对象组不符合强制分布要求，是否继续审核')
        } else if (schForceDist && !groupForceDist && isSchOut === 0 && isGroupOut === 0) {
          Toast('考核对象组:【' + groupName + '】不符合强制分布要求，请调整审核总分/审核等级或者执行组级强制分布')
        }*/
      },
      approve () {
        let datas = this.checkDataList
        let approveData = JSON.stringify(this.checkDataList)
        for (let index = 0; index < datas.length; index++) {
          if (datas[index].pk_grade_item === null) {
            Toast('审核等级不能为空! ')
            return
          }
        }
        let url = this.windowPageContent + '/approveresult/approve?pk_parent=' + this.fangAnId +
          '&pkPeriod=' + this.hrpeValue+'&userid=' + getStorage('userinfo').pk_psndoc
        axios.post(url, {
          changedArray: approveData
        }).then(res => {
          if (res.data.success) {
            this.queryCheckList()
            Toast('审核成功！')
          } else {
            Toast(res.data.msg)
          }
        })
      },
      // 获取等级
      getGrade(pk_grade_item){
        for(var i = 0 ; i< this.grade_items.length; i++){
          if(pk_grade_item == this.grade_items[i].key){
            return this.grade_items[i].value
          }
        }
      },
      //查询评分明细数据
      queryMinXiCheckList (index,param) {
        let url = this.windowPageContent + '/approveresult/queryappraisers'
        axios.get(url,
          {
            params: {
              pk_eva_object: param
            }
          }).then(res => {
          if(res.data.success == true){
          var result = JSON.parse(res.data.resultData)[0]
          var obj = {
            'child_pk_defdoc_name': result.pk_defdoc_name,
            'child_score': result.score,
            'child_pk_psndoc_name': result.pk_psndoc_name,
            'child_pre_appraiser_status': result.pre_appraiser_status,
            'child_turn': result.turn,
            'child_pk_res_gradeitem': result.pk_res_gradeitem
          }
          var data = Object.assign(this.checkDataList[index],obj);
          this.checkDataList.splice(index,1,data)
          }
        })
      },
      //查询考核结果列表数据
      queryCheckList () {
        let url = this.windowPageContent + '/approveresult/queryPeApproveResult'
        axios.get(url,
          {
            params: {
              userid: getStorage('userinfo').pk_psndoc,
              pk_parent: this.fangAnId,
              pkPeriod: this.hrpeValue,
              currPage: 0,
              sizePage: 20
            }
          }).then(res => {
            if(res.data.success == true){
              this.checkDataList = res.data.resultData[1]
              // 查看是否有未审核的数据
              for (var i=0; i<this.checkDataList.length; i++){
                var item = this.checkDataList[i]
                if(item.aprrst_status !== 3) {
                  this.checkDisabled = false
                  break
                }
                // 循环完没有发现未审核或审核中的数据  禁用审核按钮
                this.checkDisabled = true
              }
              // 如果没数据 禁用审核按钮
              if(this.checkDataList.length == 0){
                this.checkDisabled = true
                this.saveDisabled= true
              }
                this.saveDisabled = true
                this.quXiaoDisabled = true
            }
        })
      },
      //查询绩效期间
      queryHrpeJiXiao (param) {
        let url = this.windowPageContent + '/score/queryPeriod/' + param
        axios.get(url).then(res => {
          if(res.data.success == true){
            if(res.data.resultData.length != 0){
              this.hrpeTimeList  = res.data.resultData
              this.hrpeValue = this.hrpeTimeList[0].value
              this.queryCheckList()
            }
          }
        })
      },
      //查询方案期间
      queryHrpeFangAn () {
        let url = this.windowPageContent + '/approveresult/queryPeSchEvaRef'
        axios.get(url,
          {
            params: {
              userid: getStorage('userinfo').pk_psndoc,
              currPage: 0,
              sizePage: 20
            }
          }).then(res => {
            if(res.data.resultData[0].totalCount != 0){
              this.fangAnList =  res.data.resultData[1]
              this.fangAnId = this.fangAnList[0].id
              this.queryHrpeJiXiao(this.fangAnId)
            }
        })
      },
      // 查询等级
      queryGradeItem (scheva) {
        let url = this.windowPageContent + '/approveresult/gradeitems'
        axios.post(url, {
          pk_sch_eva: scheva
        }).then(res => {
          this.grade_items = res.data.resultData
        })
      },
      lookInfo(index,pk_eva_object){
        var check_div =  $('.body').children("div").eq(2+index)
        var check =  check_div.children("div")
        if(check.eq(1).css( 'display') == 'none'){
          this.queryMinXiCheckList(index,pk_eva_object)
          check_div.css({ 'height': '50%'})
          check.eq(0).css({ 'height': '60%'})
          check.eq(1).css({ 'height': '40%'})
          check.eq(1).css({'display':'block'})
          this.jianTouFangXiang = 1
        }else{
          check.eq(1).css({'display':'none'})
          check_div.css({ 'height': '30%'})
          check.eq(0).css({ 'height': '100%'})
          this.jianTouFangXiang = 0
        }
      },
      selectFangAnId(index){
        this.fangAnId = this.fangAnList[index].id
        $('.downlist').hide();
        this.queryGradeItem(this.fangAnId)
        this.queryHrpeJiXiao(this.fangAnId)
      },
      selectHrpeValue(index){
        this.hrpeValue = this.hrpeTimeList[index].value
        $('.downlist').hide();
        this.queryCheckList()
      },
      goApp() {
        this.$router.push('application')
      },
      routerpush(path) {
        this.$router.push(path)
      },
      getFangAnList(){
        fetchData({
          url : 'hrssc/hrpe/approveresult/queryPeSchEvaRef',
          method : 'GET',
          param : {
            userid:  getStorage('userinfo').pk_psndoc,
            currPage: this.currPage,
            sizePage: this.pageSize
          },
          success : res=> {
            console.log(res)
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .check_div_2{
    padding-bottom: 2%;
    width: 95%; height: 95%;
    background: #FFFFFF;
    position: relative;
    top: 2.5%;
    left: 2.5%;
    box-shadow: 0px 0px 24px 0px rgba(193, 193, 193, 0.41);
    border-radius: 0.1rem;
  }
  .check_bottom_button{
      font-size: 0.25rem;
      color: #FFFFFF;
      width: 30%;
      height: 15%;
      background: #2692DD;
      box-shadow: 0px 2px 6px 2px rgba(60, 60, 60, 0.16);
      border-radius: 0.1rem;
      position: relative;
      left: 35%;
  }
  .check_ul_2{
    width: 49%;
    height: 70%;
    float: left;
    padding-top: 2%;
    padding-left: 6%;
    border-left: 1px solid #DDDDDD;
    position: relative;
    left: 2%;
  }
  .check_ul_2 li{
    font-size: 0.27rem;
    width: 100%;
    height: 33%;
    list-style-type:none;
    color: #666666;
    position: relative;
  }
  .check_ul{
    width: 50%;
    height: 80%;
    float: left;
    padding-top: 5%;
    padding-left: 6%;
  }
  .check_ul li{
    font-size: 0.28rem;
    width: 100%;
    height: 25%;
    list-style-type:none;
    color: #333333;
    position: relative;
  }
  .check_div{
   width: 95%; height: 95%;
    background: #FFFFFF;
    position: relative;
    top: 2.5%;
    left: 2.5%;
    box-shadow: 0px 0px 24px 0px rgba(193, 193, 193, 0.41);
    border-radius: 0.2rem;
  }
  .btnBg{
    background: #999999 !important;
  }
  .button{
    font-size: 0.25rem;
    color: #FFFFFF;
    width: 20%;
    height: 70%;
    background: #2692DD;
    box-shadow: 0px 2px 6px 2px rgba(60, 60, 60, 0.16);
    border-radius: 0.1rem;
    position: relative;
    top: 25%;
    margin-left: 3%;
  }
  .select option{
    width: 100%;
    height: 25%;
    background: #fff;
    border: none;
    color: #333333;
  }
  .select{
    width: 70%; height:50%; background: #fff; position: relative;
    top: 25%;
  }
  .select_div2{
    border-left: 2px solid #F5F5F7;
  }
  .select_div{
    width: 50%; height: 100%; float: left; text-align: center;
  }
  .quxiao{
    margin-left: 1%;
    font-size: 0.2rem;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #FFFFFF;
  }
  @fff-color: #ffffff;
  @333-color: #333333;
  html {
    div {
    }
  }
  #myPerformance-header{
    z-index: 10;
    height: 6.6%;
    width: 100%;
    line-height: .88rem;
  }
  .grade_select{
    background: #fff;
    width: 25%;
    /*很关键：将默认的select选择框样式清除*/
    appearance:none;
    -moz-appearance:none;
    -webkit-appearance:none;
  }
  .grade_select option {
    padding-left:20px;
  }

  body.blue { background: #efeff4; }
  article,
  aside,
  details,
  figcaption,
  figure,
  footer,
  header,
  hgroup,
  nav,
  section { display: block; }
  dl,
  dt,
  dd,
  ul,
  ol,
  li,
  em,
  i,
  p {
    margin:0;
    padding:0;
    list-style: none;
    font-style: normal;
  }
  li {
    //font-size: 14px;
    font-size: 0.3rem;
  }
  table {
    border-collapse: separate;
    border-spacing: 0;
  }
  caption,
  th,
  td {
    text-align: left;
    font-weight: normal;
  }
  h1,
  h2,
  h3,
  h4 {
    font-family: inherit;
    font-weight: 500;
    line-height: 1.1;
    color: inherit
  }
  :focus { outline: 0; }
  a {
    color: #333;
    tap-highlight-color: rgba(0,0,0,0);
    focus-ring-color: rgba(0, 0, 0, 0);
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    -webkit-focus-ring-color: rgba(0, 0, 0, 0);
    -moz-tap-highlight-color: rgba(0,0,0,0);
    -moz-focus-ring-color: rgba(0, 0, 0, 0);
  }
  a:hover { color: #000; }
  a:focus { outline: none; }
  a,
  a:hover,
  a:active {
    outline: 0;
    text-decoration: none;
  }


  /* ===== retrie分类下来 ===== */
  .retrie {
    position: relative;
    z-index: 102;
    height: 100%;
    background-color: #fff;
    border-bottom: 1px solid #e8e8e8;
  }
  .retrie dt { overflow: hidden }
  .retrie dt a {
    position: relative;
    float: left;
    width: 50%;
    height: 100%;
    line-height: 1rem;
    color: #333;
    font-size: 0.3rem;
    text-align: center;
  }
  .retrie dt a:after {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -4%;
    margin-left: 20%;
    width: 0.2rem;
    height: 0.2rem;
    border: #666 solid;
    border-width: 1px 1px 0 0;
    content: ' ';
    -webkit-transform: rotate(135deg);
  }
  .retrie dt .up {
    color: #007ccf;
    border-bottom: 2px solid #007ccf;
  }
  .retrie dt .up:after {
    margin-top: 0;
    border: #007ccf solid;
    border-width: 1px 1px 0 0;
    -webkit-transform: rotate(-45deg);
  }
  .retrie dt a:last-child:before {
    position: absolute;
    top: 10px;
    left: 0;
    display: block;
    width: 1px;
    height: 30px;
    background-color: #ebebeb;
    content: ' ';
  }
  .retrie dd { position: relative; }
  /* ===== slide-area ===== */
  .slide {
    position: absolute;
    top: 0px;
    left: 0;
    z-index: 104;
    display: none;
    width: 100%;
    overflow-y: auto;
    background-color: #fff;
  }
  .slide li {
    display: block;
    height: 50px;
    border-bottom: 1px solid #eee;
  }
  .slide li a {
    display: block;
    padding: 0 30px;
    height: 50px;
    background-color: transparent;
    line-height: 50px;
  }
  .slide li a:hover,
  .slide li a.selected { background-color: #f6f6f6; }

  .slide li a.select { background-color: #fff; }
  .select_option_color{
    color: #007ccf !important;
  }
</style>
