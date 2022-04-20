/*
* Created by yangyang11 on 2017/11/7.
*
*/
<template>
  <div>
    <header>
      <hr-header
        :title=title
        v-on:lcallBack='goApp'
        :rIcon = 'rIcon'
        v-on:rcallBack='deleteApply'
      >
      </hr-header>
    </header>
    <section v-show="show">
      <div class="postmark" v-show='approve_state == 0'>
        <img src="../../../../../../static/img/pages/attendance-leave/nopass.png" >     <!-- 未通过邮戳 -->
      </div>
      <div class="postmark" v-show='approve_state == 1'>
        <img src="../../../../../../static/img/pages/attendance-leave/pass.png" >    <!-- 通过邮戳 -->
      </div>
      <!-- 请假单数据模板 -->
      <div v-if='billType == "leave"'>
        <div class="normalInfo">
          <div class="type">
            <label style="padding-left: 0.22rem;">{{ tbm_h_name }}类型：</label>
            <span>{{ billInfo.leavetypename}}</span>
          </div>
          <div class="type">
            <label style="padding-left: 0.22rem;">流程类型：</label>
            <span>{{ billInfo.transtypename}}</span>
          </div>
          <div class="type" v-if="billInfo.islactation">
            <label style="padding-left: 0.22rem;">单日哺乳时长：</label>
            <span>{{ billInfo.lactationhour}}</span>
          </div>
        </div>
        <div class="applyList" v-for='(item, index) in billInfo.leavebs' :key=index>
          <div class="index">
            <div class="circular"></div>
            <span>
              明细{{ index+1 }}
            </span>
          </div>
          <div class="timeLabel">
            <label v-if="!billInfo.islactation">开始时间</label>
            <label v-if="billInfo.islactation">开始日期</label>
            <span v-if="!billInfo.islactation">结束时间</span>
            <span v-if="billInfo.islactation">结束日期</span>
          </div>
          <div class="time">
            <label v-if="!billInfo.islactation"><b>{{ item.begintime }}</b></label>
            <label v-if="billInfo.islactation"><b>{{ item.begindate }}</b></label>
            <span v-if="!billInfo.islactation"><b>{{ item.endtime }}</b></span>
            <span v-if="billInfo.islactation"><b>{{ item.enddate }}</b></span>
          </div>
          <div class="timeLabel" v-if="!billInfo.islactation">
            <label>请假时长：</label>
            <span style="color: #333333;">{{ item.length }} {{ item.unit }}</span>
          </div>
          <div class="timeLabel" v-if="billInfo.islactation">
            <label>哺乳时段：</label>
            <span style="color: #333333;">{{ item.lactationtypeshow }}</span>
          </div>
          <div class="area">
            <label>请假原因：</label>
            <span>{{item.leaveremark}}</span>
          </div>
        </div>
        <div class="applyInfo" v-if="!billInfo.islactation">
          <div class="totalLength">
            <label>{{ tbm_h_name }}总时长：</label>
            <span>{{ billInfo.sumhour }} {{ billInfo.unit }}</span>
          </div>
        </div>
        <div class="fujiandiv" @click="fjmanagement(billInfo.pk_leaveh, billInfo.approve_state)">附件管理</div>
      </div>
      <!-- 出差单数据模板 -->
      <div v-if='billType == "away"'>
        <div class="normalInfo">
          <div class="type">
            <label style="padding-left: 0.22rem;">流程类型：</label>
            <span>{{ billInfo.transtypename}}</span>
          </div>
          <div class="type">
            <label style="padding-left: 0.22rem;">{{ tbm_h_name }}类型：</label>
            <span>{{ billInfo.awaytypename}}</span>
          </div>
        </div>


        <div class="applyList" v-for='(item, index) in billInfo.awaybs' :key=index>
          <div class="index">
            <div class="circular"></div>
            <span>
              明细{{ index+1 }}
            </span>
          </div>
          <div class="timeLabel">
            <label>开始时间</label>
            <span>结束时间</span>
          </div>
          <div class="time">
            <label><b>{{ item.begintime }}</b></label>
            <span><b>{{ item.endtime }}</b></span>
          </div>
          <div class="area">
            <label>出差地点：</label>
            <span>{{item.awayaddress}}</span>
          </div>
          <div class="area">
            <label>出差时长：</label>
            <span>{{item.awayhour}} {{ item.unit }}</span>
          </div>
          <div class="msgtypediv" style="padding-left: 0;">任务安排：<label>{{item.workprocess}}</label></div>
        </div>
        <div class="applyInfo">
          <div class="totalLength">
            <label>{{ tbm_h_name }}总时长：</label>
            <span>{{ billInfo.sumhour }} {{ billInfo.unit }}</span>
          </div>
        </div>
        <div class="fujiandiv" @click="fjmanagement(billInfo.pk_awayh, billInfo.approve_state)">附件管理</div>
      </div>
      <!-- 加班单数据模板 -->
      <div v-if='billType == "overtime"'>
        <div class="normalInfo">
          <div class="type">
            <label>{{ tbm_h_name }}类型：</label>
            <span>{{ billInfo.typename}}</span>
          </div>
          <div class="type">
            <label style="padding-left: 0.22rem;">流程类型：</label>
            <span>{{ billInfo.transtypename}}</span>
          </div>
        </div>

        <div class="applyList" v-for='(item, index) in billInfo.blist' :key=index>
          <div class="index">
            <div class="circular"></div>
            <span>
              明细{{ index+1 }}
            </span>
          </div>
          <div class="timeLabel">
            <label>开始时间</label>
            <span>结束时间</span>
          </div>
          <div class="time">
            <label><b>{{ item.begintime }}</b></label>
            <span><b>{{ item.endtime }}</b></span>
          </div>
          <div class="area">
            <label>加班时长：</label>
            <span>{{item.length}} {{ item.unit }}</span>
          </div>
          <div class="area">
            <label>加班说明：</label>
            <span>{{item.overtimeremark}}</span>
          </div>
        </div>
        <div class="applyInfo">
          <div class="totalLength">
            <label>{{ tbm_h_name }}总时长：</label>
            <span>{{ billInfo.sumhour }} {{ billInfo.unit }}</span>
          </div>
        </div>
        <div class="fujiandiv" @click="fjmanagement(billInfo.pk_overtimeh, billInfo.approve_state)">附件管理</div>
      </div>
      <!-- 补签卡单数据模板 -->
      <div v-if='billType == "signcard"'>
        <div class="normalInfo">
          <div class="type">
            <label style="padding-left: 0.22rem;">流程类型：</label>
            <span>{{ billInfo.transtypename}}</span>
          </div>
          <div class="msgtypediv">补签卡原因：<label>{{billInfo.signremark}}</label></div>
        </div>
        <div class="applyList" v-for='(item, index) in billInfo.signbs' :key=index>
          <div class="index">
            <div class="circular"></div>
            <span>明细{{ index+1 }}</span>
          </div>
          <div class="timeLabel">
            <label>开始时间</label>
            <span>{{ item.time }}</span>
          </div>
        </div>
        <div class="applyInfo">
        </div>
        <div class="fujiandiv" @click="fjmanagement(billInfo.pk_signh, billInfo.approve_state)">附件管理</div>
      </div>
      <!-- 销假单数据模板 -->
      <div v-if='billType == "leaveoff"'>
        <div class="normalInfo">
          <div class="type">
            <label style="padding-left: 0.22rem;">{{ tbm_h_name }}类别：</label>
            <span>{{ billInfo.leavetypename}}</span>
          </div>
          <div class="type">
            <label style="padding-left: 0.22rem;">流程类型：</label>
            <span>{{ billInfo.transtypename}}</span>
          </div>
        </div>
        <div class="applyList">
          <div class="index">
            <div class="circular"></div>
            <span>
              请假明细
            </span>
          </div>
          <div class="timeLabel">
            <label v-if="!billInfo.islactation">请假开始时间</label>
            <label v-if="billInfo.islactation">请假开始日期</label>
            <span v-if="!billInfo.islactation">请假结束时间</span>
            <span v-if="billInfo.islactation">请假结束日期</span>
          </div>
          <div class="time">
            <label v-if="!billInfo.islactation"><b>{{ billInfo.regbegintimecopy }}</b></label>
            <label v-if="billInfo.islactation"><b>{{ billInfo.regbegindatecopy }}</b></label>
            <span v-if="!billInfo.islactation"><b>{{ billInfo.regendtimecopy }}</b></span>
            <span v-if="billInfo.islactation"><b>{{ billInfo.regenddatecopy }}</b></span>
          </div>
          <div class="area" v-if="!billInfo.islactation">
            <label>请假时长：</label>
            <span style="color: #333333;">{{ billInfo.regleavehourcopy }} {{ billInfo.unit }}</span>
          </div>
          <div class="area" v-if="billInfo.islactation">
            <label>哺乳时段：</label>
            <span style="color: #333333;">{{ billInfo.lactationtypeshow }}</span>
          </div>
          <div class="area" v-if="billInfo.islactation">
            <label>单日哺乳时长：</label>
            <span style="color: #333333;">{{ billInfo.lactationhour }}</span>
          </div>
          <div class="area">
            <div class="area-left">
              <label>请假说明：</label>
            </div>
            <div class="area-right">
              <span>{{billInfo.leaveremark}}</span>
            </div>
          </div>
        </div>
        <div class="applyList">
          <div class="index">
            <div class="circular"></div>
            <span>
              销假明细
            </span>
          </div>
          <div class="timeLabel">
            <label v-if="!billInfo.islactation">实际开始时间</label>
            <label v-if="billInfo.islactation">实际开始日期</label>
            <span v-if="!billInfo.islactation">实际结束时间</span>
            <span v-if="billInfo.islactation">实际结束日期</span>
          </div>
          <div class="time">
            <label v-if="!billInfo.islactation"><b>{{ billInfo.leavebegintime }}</b></label>
            <label v-if="billInfo.islactation"><b>{{ billInfo.leavebegindate }}</b></label>
            <span v-if="!billInfo.islactation"><b>{{ billInfo.leaveendtime }}</b></span>
            <span v-if="billInfo.islactation"><b>{{ billInfo.leaveenddate }}</b></span>
          </div>
          <div class="area" v-if="!billInfo.islactation">
            <label>实际时长：</label>
            <span style="color: #333333;">{{ billInfo.reallyleavehour }} {{ billInfo.unit }}</span>
          </div>
          <div class="area" v-if="!billInfo.islactation">
            <label>差异时长：</label>
            <span style="color: #333333;">{{ billInfo.differencehour }} {{ billInfo.unit }}</span>
          </div>
        </div>
        <div class="applyInfo" v-if="!billInfo.islactation">
          <div class="totalLength">
            <label>{{ tbm_h_name }}总时长：</label>
            <span>{{ billInfo.reallyleavehour }} {{ billInfo.unit }}</span>
          </div>
        </div>
        <div class="fujiandiv" @click="fjmanagement(billInfo.pk_leaveoff, billInfo.approve_state)">附件管理</div>
      </div>
      <!-- 销差单数据模板 -->
      <div v-if='billType == "awayoff"'>
        <div class="normalInfo">
          <div class="type">
            <label style="padding-left: 0.22rem;">{{ tbm_h_name }}类别：</label>
            <span>{{ billInfo.awaytypename}}</span>
          </div>
          <div class="type">
            <label style="padding-left: 0.22rem;">流程类型：</label>
            <span>{{ billInfo.transtypename}}</span>
          </div>
        </div>
        <div class="applyList">
          <div class="index">
            <div class="circular"></div>
            <span>
              出差明细
            </span>
          </div>
          <div class="timeLabel">
            <label>出差开始时间</label>
            <span>出差结束时间</span>
          </div>
          <div class="time">
            <label><b>{{ billInfo.regbegintimecopy }}</b></label>
            <span><b>{{ billInfo.regendtimecopy }}</b></span>
          </div>
          <div class="area">
            <label>出差地点：</label>
            <span>{{billInfo.awayaddress}}</span>
          </div>
          <div class="area">
            <label>出差时长：</label>
            <span>{{billInfo.regawayhourcopy}} {{ billInfo.unit }}</span>
          </div>
          <div class="msgtypediv" style="padding-left: 0;">
            <div class="area-left">
              任务安排：
            </div>
            <div class="area-right">
              <label>{{billInfo.workprocess}}</label>
            </div>
          </div>
        </div>
        <div class="applyList">
          <div class="index">
            <div class="circular"></div>
            <span>
              销差明细
            </span>
          </div>
          <div class="timeLabel">
            <label>实际开始时间</label>
            <span>实际结束时间</span>
          </div>
          <div class="time">
            <label><b>{{ billInfo.awaybegintime }}</b></label>
            <span><b>{{ billInfo.awayendtime }}</b></span>
          </div>
          <div class="area">
            <label>实际时长：</label>
            <span>{{billInfo.reallyawayhour}} {{ billInfo.unit }}</span>
          </div>
          <div class="area">
            <label>差异时长：</label>
            <span>{{billInfo.differencehour}} {{ billInfo.unit }}</span>
          </div>
        </div>
        <div class="applyInfo">
          <div class="totalLength">
            <label>{{ tbm_h_name }}总时长：</label>
            <span>{{ billInfo.reallyawayhour }} {{ billInfo.unit }}</span>
          </div>
        </div>
        <div class="fujiandiv" @click="fjmanagement(billInfo.pk_awayoff, billInfo.approve_state)">附件管理</div>
      </div>
      <!-- 转正单数据模板 -->
      <div v-if='billType == "psnreg"'>
        <div class="normalInfo">
          <div class="type">
            <label style="padding-left: 0.22rem;">试用类型：</label>
            <span>{{ billInfo.probation_type}}</span>
          </div>
          <div class="type">
            <label style="padding-left: 0.22rem;">流程类型：</label>
            <span>{{ billInfo.transtypename}}</span>
          </div>
        </div>
        <div class="applyList">
          <div class="index" @click="toggle('jbxxFlag')">
            <div class="circular" style="background: #0caef5"></div>
            <span style="color: #0caef5">
              基本信息
            </span>
          </div>
          <div v-if="this.jbxxFlag == true">
            <div class="timeLabel">
              <label>试用开始日期</label>
              <span>试用结束日期</span>
            </div>
            <div class="time">
              <label><b>{{ billInfo.begindate }}</b></label>
              <span><b>{{ billInfo.overdate }}</b></span>
            </div>
            <div class="area">
              <label>试用结果：</label>
              <span>{{billInfo.regularresultname}}</span>
            </div>
            <div class="area" v-if="billInfo.regularresult === 2">
              <label>延期转正日期：</label>
              <span>{{billInfo.yanqidate}}</span>
            </div>
            <div class="area">
              <label>生效日期：</label>
              <span>{{billInfo.regulardate}}</span>
            </div>
            <div class="msgtypediv" style="padding-left: 0;">
              <div class="area-left">
                说明：
              </div>
              <div class="area-right">
                <label>{{billInfo.memo}}</label>
              </div>
            </div>
          </div>
          <div class="index" @click="toggle('zzqxxFlag')">
            <div class="circular" style="background: #0caef5"></div>
            <span style="color: #0caef5">
              转正前信息
            </span>
          </div>
          <div v-if="this.zzqxxFlag">
            <div class="area" v-for="(item, index) in billInfo.data.olddata">
              <label>{{item.itemName}}：</label>
              <span style="float:right;padding-right: .4rem">{{item.displayname}}</span>
            </div>
          </div>
          <div class="index" @click="toggle('zzhxxFlag')">
            <div class="circular" style="background: #0caef5"></div>
            <span style="color: #0caef5">
              转正后信息
            </span>
          </div>
          <div v-if="this.zzhxxFlag">
            <div class="area" v-for="(item, index) in billInfo.data.newdata">
              <label>{{item.itemName}}：</label>
              <span style="float:right;padding-right: .4rem">{{item.displayname}}</span>
            </div>
          </div>
          <div class="index" @click="toggle('zxxxFlag')">
            <div class="circular" style="background: #0caef5"></div>
            <span style="color: #0caef5">
              执行信息
            </span>
          </div>
          <div v-if="this.zxxxFlag">
            <div class="area">
              <label>是否同步履历：</label>
              <span>{{billInfo.synchronized==true?'是':'否'}}</span>
            </div>
          </div>
        </div>
        <div class="fujiandiv" @click="fjmanagement(billInfo.pk_hi_regapply, billInfo.approve_state)">附件管理</div>
      </div>
      <div v-if='billType == "trns"'>
        <div class="normalInfo">
          <div class="type">
            <label style="padding-left: 0.22rem;">流程类型：</label>
            <span>{{ billInfo.innermap.transtypename}}</span>
          </div>
        </div>
        <div class="applyList">
          <div class="index" @click="toggle('jbxxFlag')">
            <div class="circular" style="background: #0caef5"></div>
            <span style="color: #0caef5">
              人员信息
            </span>
          </div>
          <div v-if="this.jbxxFlag == true">
            <div class="msgtypediv" style="padding-left: 0;">
              <div class="area-left">
                调配人员：
              </div>
              <div class="area-right">
                <label>{{billInfo.innermap.psnname}}</label>
              </div>
            </div>
            <div class="msgtypediv" style="padding-left: 0;">
              <div class="area-left">
                调配方式：
              </div>
              <div class="area-right">
                <label>{{billInfo.innermap.transtypevalue === 1?'组织内调动':'跨组织调动'}}</label>
              </div>
            </div>
            <div class="msgtypediv" style="padding-left: 0;">
              <div class="area-left">
                调配类型：
              </div>
              <div class="area-right">
                <label>{{billInfo.innermap.trnstypename }}</label>
              </div>
            </div>
            <div class="msgtypediv" style="padding-left: 0;">
              <div class="area-left">
                调配原因：
              </div>
              <div class="area-right">
                <label>{{billInfo.innermap.trnreasonname }}</label>
              </div>
            </div>
            <div class="timeLabel">
              <label>生效时间</label>
              <span>{{ billInfo.innermap.effecttime}}</span>
            </div>
            <div class="msgtypediv" style="padding-left: 0;">
              <div class="area-left">
                说明：
              </div>
              <div class="area-right">
                <label>{{billInfo.innermap.memo}}</label>
              </div>
            </div>
          </div>
          <div class="index" @click="toggle('zzqxxFlag')">
            <div class="circular" style="background: #0caef5"></div>
            <span style="color: #0caef5">
              调配前信息
            </span>
          </div>
          <div v-if="this.zzqxxFlag">
            <div class="area" v-for="(item, index) in billInfo.oldmap">
              <label>{{item.itemName}}：</label>
              <span style="float:right;padding-right: .4rem" v-if="item.datatype !== 4">{{item.displayname}}</span>
              <span style="float:right;padding-right: .4rem" v-if="item.datatype === 4">{{item.value === 'Y'?'是':'否'}}</span>
            </div>
          </div>
          <div class="index" @click="toggle('zzhxxFlag')">
            <div class="circular" style="background: #0caef5"></div>
            <span style="color: #0caef5">
              调配后信息
            </span>
          </div>
          <div v-if="this.zzqxxFlag">
            <div class="area" v-for="(item, index) in billInfo.newmap">
              <label>{{item.itemName}}：</label>
              <span style="float:right;padding-right: .4rem" v-if="item.datatype !== 4">{{item.displayname}}</span>
              <span style="float:right;padding-right: .4rem" v-if="item.datatype === 4">{{item.value === 'Y'?'是':'否'}}</span>
            </div>
          </div>
          <div class="index" @click="toggle('zzhxxFlag')">
            <div class="circular" style="background: #0caef5"></div>
            <span style="color: #0caef5">
              人事管理组织
            </span>
          </div>
          <div v-if="this.zzqxxFlag">

            <div class="area" v-for="(item, index) in billInfo.crtManage">
              <label>原组织：</label>
              <span style="float:right;padding-right: .4rem">{{item.oldhi_name}}</span>
            </div>
            <div class="area">
              <label>新组织：</label>
              <span style="float:right;padding-right: .4rem">{{billInfo.newcrtmanage.hiorg_name}}</span>
            </div>
          </div>

          <div class="index" @click="toggle('zzhxxFlag')">
            <div class="circular" style="background: #0caef5"></div>
            <span style="color: #0caef5">
              合同管理组织
            </span>
          </div>
          <div v-if="this.zzqxxFlag">

            <div class="area" v-for="(item, index) in billInfo.crtManage">
              <label>原合同组织：</label>
              <span style="float:right;padding-right: .4rem">{{item.oldhrcm_name}}</span>
            </div>
            <div class="area">
              <label>新合同组织：</label>
              <span style="float:right;padding-right: .4rem">{{billInfo.newcrtmanage.hrcmorg_name}}</span>
            </div>
            <div class="area">
              <label>解除：</label>
              <span>{{billInfo.innermap.isrelease===true?'是':'否'}}</span>
            </div>
            <div class="area">
              <label>终止：</label>
              <span>{{billInfo.innermap.isend===true?'是':'否'}}</span>
            </div>
          </div>
          <div class="index" @click="toggle('zxxxFlag')">
            <div class="circular" style="background: #0caef5"></div>
            <span style="color: #0caef5">
              执行信息
            </span>
          </div>
          <div v-if="this.zxxxFlag">
            <div class="area">
              <label>结束兼职：</label>
              <span>{{billInfo.innermap.ifendpart===true?'是':'否'}}</span>
            </div>
            <div class="area">
              <label>是否同步履历：</label>
              <span>{{billInfo.innermap.ifsynwork===true?'是':'否'}}</span>
            </div>
          </div>
        </div>
        <div class="fujiandiv" @click="fjmanagement(billInfo.pk_hi_regapply, billInfo.approve_state)">附件管理</div>
      </div>
      <div v-if='billType == "dimission"'>
        <div class="normalInfo">
          <div class="type">
            <label style="padding-left: 0.22rem;">流程类型：</label>
            <span>{{ billInfo.innermap.transtypename}}</span>
          </div>
        </div>
        <div class="applyList">
          <div class="index" @click="toggle('jbxxFlag')">
            <div class="circular" style="background: #0caef5"></div>
            <span style="color: #0caef5">
              人员信息
            </span>
          </div>
          <div v-if="this.jbxxFlag == true">
            <div class="msgtypediv" style="padding-left: 0;">
              <div class="area-left">
                离职类型：
              </div>
              <div class="area-right">
                <label>{{billInfo.innermap.trnstypename }}</label>
              </div>
            </div>
            <div class="msgtypediv" style="padding-left: 0;">
              <div class="area-left">
                离职原因：
              </div>
              <div class="area-right">
                <label>{{billInfo.innermap.trnreasonname }}</label>
              </div>
            </div>
            <div class="timeLabel">
              <label>生效时间</label>
              <span>{{ billInfo.innermap.effecttime}}</span>
            </div>
            <div class="msgtypediv" style="padding-left: 0;">
              <div class="area-left">
                说明：
              </div>
              <div class="area-right">
                <label>{{billInfo.innermap.memo}}</label>
              </div>
            </div>
          </div>
          <div class="index" @click="toggle('zzqxxFlag')">
            <div class="circular" style="background: #0caef5"></div>
            <span style="color: #0caef5">
              离职前信息
            </span>
          </div>
          <div v-if="this.zzqxxFlag">
            <div class="area" v-for="(item, index) in billInfo.oldmap">
              <label>{{item.itemName}}：</label>
              <span style="float:right;padding-right: .4rem" v-if="item.datatype !== 4">{{item.displayname}}</span>
              <span style="float:right;padding-right: .4rem" v-if="item.datatype === 4">{{item.value === 'Y'?'是':'否'}}</span>
            </div>
          </div>
          <div class="index" @click="toggle('zzhxxFlag')">
            <div class="circular" style="background: #0caef5"></div>
            <span style="color: #0caef5">
              离职后信息
            </span>
          </div>
          <div v-if="this.zzqxxFlag">
            <div class="area" v-for="(item, index) in billInfo.newmap">
              <label>{{item.itemName}}：</label>
              <span style="float:right;padding-right: .4rem" v-if="item.datatype !== 4">{{item.displayname}}</span>
              <span style="float:right;padding-right: .4rem" v-if="item.datatype === 4">{{item.value === 'Y'?'是':'否'}}</span>
            </div>
          </div>
          <div class="index" @click="toggle('zzhxxFlag')">
            <div class="circular" style="background: #0caef5"></div>
            <span style="color: #0caef5">
              人事管理组织
            </span>
          </div>
          <div v-if="this.zzqxxFlag">

            <div class="area" v-for="(item, index) in billInfo.crtManage">
              <label>原组织：</label>
              <span style="float:right;padding-right: .4rem">{{item.oldhi_name}}</span>
            </div>
            <div class="area">
              <label>新组织：</label>
              <span style="float:right;padding-right: .4rem">{{billInfo.newcrtmanage.hiorg_name}}</span>
            </div>
          </div>

          <div class="index" @click="toggle('zzhxxFlag')">
            <div class="circular" style="background: #0caef5"></div>
            <span style="color: #0caef5">
              合同管理组织
            </span>
          </div>
          <div v-if="this.zzqxxFlag">

            <div class="area" v-for="(item, index) in billInfo.crtManage">
              <label>原合同组织：</label>
              <span style="float:right;padding-right: .4rem">{{item.oldhrcm_name}}</span>
            </div>
            <div class="area">
              <label>新合同组织：</label>
              <span style="float:right;padding-right: .4rem">{{billInfo.newcrtmanage.hrcmorg_name}}</span>
            </div>
            <div class="area">
              <label>解除：</label>
              <span>{{billInfo.innermap.isrelease===true?'是':'否'}}</span>
            </div>
            <div class="area">
              <label>终止：</label>
              <span>{{billInfo.innermap.isend===true?'是':'否'}}</span>
            </div>
          </div>
          <div class="index" @click="toggle('zxxxFlag')">
            <div class="circular" style="background: #0caef5"></div>
            <span style="color: #0caef5">
              执行信息
            </span>
          </div>
          <div v-if="this.zxxxFlag">
            <div class="area">
              <label>停用离职人员：</label>
              <span>{{billInfo.innermap.isdisablepsn===true?'是':'否'}}</span>
            </div>
            <div class="area">
              <label>加入黑名单：</label>
              <span>{{billInfo.innermap.ifaddblack===true?'是':'否'}}</span>
            </div>
          </div>
        </div>
        <div class="fujiandiv" @click="fjmanagement(billInfo.pk_hi_regapply, billInfo.approve_state)">附件管理</div>
      </div>
    </section>
    <footer v-if='approve_state == -1'>
      <span @click="sumbitBill">提交</span>
      <span @click='reEdit'>编辑</span>
    </footer>
    <footer v-else>
      <div v-if="approve_state == 3">
        <span @click="sumbitLeav('callback')">收回</span>
        <span @click="showApproveStates()">审批状态</span>
      </div>
      <div v-else>
        <span style="width: 100%; border-right: none" @click="showApproveStates()">审批状态</span>
      </div>
    </footer>
    <ZhiPai
      :popupVisible = zhiPaiVisible
      :topData="zhiPaiData.userInfo"
      :pk_h="pk_h"
      :billtype="billType"
      @closepup="closepup">
    </ZhiPai>
  </div>
</template>

<script>
  import { HrHeader ,ZhiPai} from 'hr-ui'
  import { fetchData, getStorage } from 'hr-utils'
  import { Toast, Indicator, MessageBox } from 'mint-ui'
  export default {
    components: {
      ZhiPai,
      HrHeader
    },
    data (){
      return {
        zhiPaiVisible: false,
        zhiPaiData:{},
        show: false,
        title: '',
        billInfo: {
          data: {
            olddata: [],
            newdata:[]
          },
          newcrtmanage: {
            hiorg_name: '',
            pk_hi_org: '',
            hrcmorg_name: '',
            pk_hrcm_org: ''
          },
          oldtemplet: [],
          crtManage: [],
          innermap: {}
        },
        billType: '',
        pk_h: '',
        tbm_h_name: '',
        bill_code: '',
        orgName: '',
        leaveremark: '', //请假备注
        arayremark: '', //出差备注
        rIcon : '',
        jbxxFlag: true,
        zzqxxFlag: true,
        zzhxxFlag: true,
        zxxxFlag: true
      }
    },


    created() {
      let user = getStorage('userinfo').name
      this.approve_state = this.$route.query.approve_state
      this.tbm_h_name = this.$route.query.tbm_h_name
      this.billType = this.$route.query.billtype
      this.pk_h = this.$route.query.pk_h
      this.bill_code = this.$route.query.bill_code
      this.title =  `${user}的${this.tbm_h_name}申请`
      this.orgName = getStorage('userinfo').orgname
      this.queryBillInfo()
      this.rIcon = this.approve_state == -1 ? 'hr-dustbin' : ''
    },

    methods: {
      goApp() {
//        this.$router.push({name: 'myApply'})
        history.go(-1)
      },
      closepup(){
        this.zhiPaiVisible = false
      },
      fjmanagement(billId , approve_state){
        //alert("附件管理");
        //console.log("billcode = " + billId);
        this.$router.push({
          name: 'fjmanagement',
          query: {
            billId: billId,
            approve_state: approve_state
          }
        })
      },
      showApproveStates () {
//        this.$refs.approvebtn.show()
        this.$router.push({
          name: 'workflow',
          params: (this.$route.query.billtype === 'trns' || this.$route.query.billtype === 'dimission')?this.billInfo.innermap:this.billInfo
        })
      },
      reEdit() {
        let param = this.billInfo
        if(this.$route.query.billtype === 'trns'){
          param = {
            transway: this.billInfo.innermap.transtypevalue,
            transtype: this.billInfo.innermap.pk_trnstype
          }
        }
        this.$router.push({
          name: this.$route.query.billtype,
          params: param,
          query: {
            isEdit: true,
            pk_h: this.pk_h,
            bill_code: this.bill_code
          }
        })
      },
      toggle(flag){
        this[flag] = !this[flag]
      },
      queryBillInfo() {
        Indicator.open("正在加载中")
        let _this = this
        fetchData({
          url: 'hrssc/portal/tbmquery/getBillInfo',
          method: 'post',
          param: {
            pk_h: _this.pk_h,
            billtype: _this.billType,
            source: 'mobile'
          },
          mock: false,
          contentType: "application/json",
          success : res=>{
            Indicator.close()
            if(_this.billtype === 'dimission' || _this.billtype === 'trns'){
              this.billInfo.crtManage = res.data.crtManage
              this.billInfo.innermap = res.data.innermap
              this.billInfo.newcrtmanage = res.data.newcrtmanage
              this.billInfo.newmap = res.data.newmap
              this.billInfo.oldmap = res.data.oldmap
            }else {
              this.billInfo = res.data
            }
            _this.show = true
          },
          error : err=> {
            Indicator.close()
            Toast(err.message)
          }
        })
      },

      sumbitLeav(operation) {
        let msg = operation === 'submit' ? '提交' : '收回'
        MessageBox.confirm(`确定${msg}单据?`).then(action => {
          if(action === 'confirm'){
            this[operation]()
          }
        }).catch(err => {
          Indicator.close()
          if(err === 'cancel') {
            Toast('已取消')
          }else{
            Toast(err.message)
          }
        });
      },
      submit(){
        Indicator.open('正在提交中')
        let url = '';
        if(this.$route.query.billtype == 'away'){
          url = 'hrssc/portal/tbmAway/saveAndSubmitAway';
        }
        if(this.$route.query.billtype == 'signcard'){
          url = 'hrssc/portal/tbmSigncard/saveAndSigncard';
        }
        if(this.$route.query.billtype == 'overtime'){
          url = 'hrssc/portal/tbmquery/submitBill';
        }
        if(this.$route.query.billtype == 'leave'){
          url = 'hrssc/portal/tbmquery/submitLeave';
        }
        if(this.$route.query.billtype == 'leaveoff'){
          url = 'hrssc/portal/tbmquery/submitLeaveoff';
        }
        if(this.$route.query.billtype == 'awayoff'){
          url = 'hrssc/portal/tbmquery/submitAwayoff';
        }
        if(this.$route.query.billtype == 'psnreg'){
          url = 'hrssc/portal/regmng/submitPsnReg';
        }
        if(this.$route.query.billtype == 'trns'){
          url = 'hrssc/portal/trnquery/submit'
        }
        if(this.$route.query.billtype == 'dimission'){
          url = 'hrssc/portal/trnquery/submit'
        }
        fetchData({
          url: url,
          method: 'post',
          param: {
            billKey: this.pk_h,
            billtype: this.$route.query.billtype,
            oprationtype: 'Commit',
            assignUsers: []
          },
          mock: false,
          contentType: "application/json",
          success: res=> {
            Indicator.close()
            this.approve_state = res.data.approve_state
            Toast('提交成功')
            this.$router.push({name: 'myApply'})
          },
          error: error=> {
            Indicator.close()
            Toast(error.message)
          }
        })
      },
      sumbitBill(){
        MessageBox.confirm(`确定提交单据?`).then(action => {
          if(action === 'confirm'){
            this.submit('submit')
          }
        }).catch(err => {
            if(err === 'cancel') {
            Toast('已取消')
          }
        });
      },
      // 提交之前，查询是否需要指派
      selectIsZhiPai () {
        Indicator.open()
        fetchData({
          url: 'hrssc/portal/wf/judgeAssign',
          method: 'post',
          param: {
            pk_h: this.pk_h,
            billtype: this.$route.query.billtype,
            oprationtype: 'Commit'
          },
          success: res =>{
            Indicator.close()
            if (res.statusCode === 200) {
              if (res.data !== {}) {
                this.zhiPaiData = res.data.data
                if (this.zhiPaiData.isAssigned === 'true') {
                  // 需要调用指派并提交
                  this.zhiPaiVisible = true
                } else {
                  // 无需指派，直接提交
                  this.submit('submit')
                }
              } else {
                // 无需指派，直接提交
                this.submit('submit')
              }
            }
          },
          error: res =>{
          Indicator.close()
        }
        })
      },
      callback(){
        Indicator.open("正在收回中")
        let url = '';
        if(this.$route.query.billtype == 'away'){
          url = 'hrssc/portal/tbmAway/callbackAway';
        }
        if(this.$route.query.billtype == 'signcard'){
          url = 'hrssc/portal/tbmSigncard/callbackSigncard';
        }
        if(this.$route.query.billtype == 'overtime'){
          url = 'hrssc/portal/tbmquery/submitBill';
        }
        if(this.$route.query.billtype == 'leave'){
          url = 'hrssc/portal/tbmquery/submitLeave';
        }
        if(this.$route.query.billtype == 'leaveoff'){
          url = 'hrssc/portal/tbmquery/submitLeaveoff';
        }
        if(this.$route.query.billtype == 'awayoff'){
          url = 'hrssc/portal/tbmquery/submitAwayoff';
        }
        if(this.$route.query.billtype == 'psnreg'){
          url = 'hrssc/portal/regmng/submitPsnReg';
        }
        if(this.$route.query.billtype == 'trns'){
          url = 'hrssc/portal/trnquery/callback'
        }
        if(this.$route.query.billtype == 'dimission'){
          url = 'hrssc/portal/trnquery/callback'
        }
        fetchData({
          url: url,
          method: 'post',
          param: {
            billKey: this.pk_h,
            billtype: this.$route.query.billtype,
            oprationtype: 'rollBack',
            assignUsers: []

          },
          mock: false,
          contentType: "application/json",
          success: res=> {
            Indicator.close()
            this.approve_state = res.data.approve_state
            Toast('收回成功');
            this.$router.push({name: 'myApply'})
          },
          error: error=> {
            Indicator.close()
            Toast(error.message)
          }
        })
      },

      deleteApply() {
        let _this = this
        MessageBox.confirm('确定删除单据吗？').then(action => {
          fetchData({
            url: 'hrssc/portal/tbmquery/deleteBill',
            method: 'post',
            param: {
              pk_h: _this.pk_h,
              billtype: _this.billType
            },
            mock: false,
            contentType: "application/json",
            success : res=>{
              if (res.data.flag == '2') {
                Toast('删除成功')
                this.$router.push({
                  name: 'myApply'
                })
              } else {
                Toast(res.message)
              }
            },
            error : err=> {
              Toast(err.message)
            }
          })
        });
      }
    }
  }
</script>

<style lang='less' scoped>


  div{
    background: #fff;
  }
  header{
    position: fixed;
    width: 100%;
    height: .88rem;
    line-height: .88rem;
    .um-h-middle{
      width: 50%;
    }
  }
  section{
    position: relative;
    height: 85.0%;
    margin-top: .88rem;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    .normalInfo{
      /*margin-left: .22rem;*/
      font-size: 0.35rem;
      line-height:.75rem;
      border-bottom: 1px solid #ededed;
      .org{
        label{
          color:#777777;
          letter-spacing:-0.34px;
          text-align:left;
        }
        span{
          margin-left: .1rem;
          color:#333333;
          letter-spacing:-0.34px;
          text-align:left;
        }
      }
      .type{
        label{
          padding-left: 0.22rem;
          color:#777777;
          letter-spacing:-0.34px;
          text-align:left;
        }
        span{
          margin-left: .1rem;
          color:#333333;
          letter-spacing:-0.34px;
          text-align:left;
        }
      }
    }
    .applyList{
      margin-left: .22rem;
      font-size: 0.35rem;
      line-height:.75rem;
      border-bottom: 1px solid #ededed;
      padding-bottom: 0.2rem;
      .index{
        height: .32rem;
        margin-top: .15rem;
        line-height: .32rem;
        font-size: 0.3rem;
        color: #666666;
        .circular{
          float: left;
          height: .08rem;
          width: .08rem;
          margin-top: .12rem;
          margin-right: .08rem;
          border-radius: 50%;
          background: #666;
        }
      }
      .timeLabel{
        height: .75rem;
        line-height: .75rem;
        color:#777777;
        label{
          position: relative;
          letter-spacing:-0.34px;
          text-align:left;
          z-index: 2;
        }
        span{
          float: right;
          position: relative;
          margin-right: .22rem;
          letter-spacing:-0.34px;
          text-align:left;
          z-index: 2;
        }
      }
      .time{
        height: .55rem;
        line-height: .55rem;
        color:#333;
        font-size: 0.3rem;
        label{
          letter-spacing:-0.34px;
          text-align:left;
        }
        span{
          float: right;
          margin-right: .22rem;
          letter-spacing:-0.34px;
          text-align:left;
        }
      }
      .area{
        line-height: .55rem;
        font-size: 0.35rem;
        label{
          color: #777777;
        }
        span{
          color: #333333;
          margin-left: .1rem;
        }
        .area-left{
          display: inline-block;
          width: 25%;
          float: left;
        }
        .area-right{
          display: inline-block;
          width: 73%;
        }
      }
    }
    .applyInfo{
      margin-left: .22rem;
      margin-top: 0.1rem;
      .totalLength{
        height: .75rem;
        line-height: .65rem;
        font-size: 0.35rem;
        label{
          color:#777777;
        }
        span{
          color:#333333;
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
  .postmark{
    position: absolute;
    top: 0.5rem;
    right: 0;
    /*height: 2rem;*/
    width: 3.0rem;
    z-index: 3;
    background: transparent;
    img{
      display: block;
      height: 100%;
      width: 100%;
    }
  }

  .text-area{
    position: relative;
    height: 4.0rem;
    background: #fff;
    z-index: 3;
    /*margin-top: .1rem;*/
    padding: .2rem .3rem;
    border-bottom: 1px solid #e4e4e4;
    textarea{
      height: 100%;
      width: 100%;
      font-size: 0.35rem;
      color:#000;
      letter-spacing:-0.34px;
      font-family: PingFangSC-Regular;
      text-align:left;
      resize: none;
      /*padding: 0.2rem 0.2rem;*/
      background: #fff;
      border: 1px solid #CCC;
      opacity:1;
    }
  }
  .msgdiv{
    width: 90%;
    margin: auto;
    line-height: 0.5rem;
    color: #333333;
    text-indent: 2em;
    font-size: 0.3rem;
  }
  .msgtypediv{
    padding-left: 0.22rem;
    margin: auto;
    line-height: 0.5rem;
    color: #777777;
    font-size: 0.35rem;
    padding-right: 0.2rem;
    margin-top: 0.1rem;
    margin-bottom: 0.2rem;
    label{
      font-size: 0.35rem;
      color:#333333;
      letter-spacing:-0.34px;
      text-align:left;
    }
    .area-left{
      display: inline-block;
      width: 25%;
      float: left
    }
    .area-right{
      display: inline-block;
      width: 73%;
    }
  }
  .fujiandiv{
    padding-left: 0.22rem;
    height:0.8rem;
    line-height: 0.8rem;
    color: #0caef5;
    font-size: 0.35rem;
  }
  .mint-popup{
    z-index: 2 !important;
  }
</style>
