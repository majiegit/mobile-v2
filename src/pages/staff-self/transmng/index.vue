<template>
  <div id="transmgn-index">
    <div id="index-header">
      <hr-header
        title='调配申请'
        v-on:lcallBack='goApp'
      >
      </hr-header>
    </div>
    <div id="index-body">
      <div id="body-base">
        <div @click="handleClick()">
          <mt-cell title="流程类型" is-link style="color: #333"><span style="color:#999">{{innerMap.transtypename}}</span></mt-cell>
        </div>
        <!--<mt-cell title="申请人" value="测试人"></mt-cell>-->
        <!--<mt-cell title="申请日期" value="2019年1月1日"></mt-cell>-->
      </div>
      <div id="body-psn">
        <div class="psninfo">人员信息</div>
        <mt-cell title="调配人员" v-model="psnname"></mt-cell>
        <mt-cell title="调配方式" v-model="transwayname"></mt-cell>
        <mt-cell title="调配类型" v-model="innerMap.trnstypename"></mt-cell>
        <div @click="handleClickref('trnreason')">
          <mt-cell title="调配原因" is-link style="color: #333"><span style="color:#999">{{innerMap.trnreasonname}}</span></mt-cell>
        </div>
        <mt-field label="生效日期" placeholder="请输入日期" type="date" v-model="innerMap.effecttime"></mt-field>
        <mt-field label="调配说明" placeholder="请输入..." type="textarea" rows="4" v-model="innerMap.memo"></mt-field>
      </div>
      <div id="body-before">
        <div class="before">调配前信息</div>
        <mt-cell v-for="(temp,index) in oldtemplet" :title="temp.itemName" :value="temp.displayname" v-if="temp.datatype!==4"></mt-cell>
        <mt-cell v-for="(temp,index) in oldtemplet" :title="temp.itemName" :value="temp.displayname==='Y'?'是':'否'" v-if="temp.datatype===4"></mt-cell>
      </div>
      <div id="body-after">
        <div class="after">调配后信息</div>

        <div v-for="(temp,index) in newtemplet" @click="handleClickref(temp.itemKey)" v-if="temp.datatype===5">
          <mt-cell :title="temp.itemName" is-link style="color: #333" v-model='temp.displayname'></mt-cell>
        </div>
        <div v-for="(temp,index) in newtemplet" v-if="temp.datatype===4" @click="handleClickref(temp.itemKey)">
          <mt-cell is-link :title="temp.itemName" v-model='newpoststatname'></mt-cell>
        </div>
        <div v-for="(temp,index) in newtemplet" v-if="temp.datatype===0">
          <mt-field :label="temp.itemName" v-model='temp.displayname' placeholder="请输入..." type="textarea" rows="4"></mt-field>
        </div>
      </div>
      <div id="body-afterorg">
        <div class="compareorg">调配后管理组织</div>
        <div v-for="(temp,index) in crtmanage">
          <mt-cell title="原组织" style="color: #333" v-model='temp.oldhi_name'></mt-cell>
        </div>
        <div @click="handleClickref('pk_new_hi')">
          <mt-cell title="新组织" is-link style="color: #333" v-model='newcrtmanage.hiorg_name'></mt-cell>
        </div>
      </div>
      <div id="body-compactorg">
        <div class="compactorg">合同管理信息</div>
        <div v-for="(temp,index) in crtmanage">
          <mt-cell title="原合同组织" style="color: #333" v-model='temp.oldhrcm_name'></mt-cell>
        </div>
        <div @click="handleClickref('pk_new_hrcm')">
          <mt-cell title="新合同组织" is-link style="color: #333" v-model='newcrtmanage.hrcmorg_name'></mt-cell>
        </div>
        <div @click="handleClickref('isrelease')">
          <mt-cell is-link title="终止" v-model='isreleasename'></mt-cell>
        </div>
        <div @click="handleClickref('isend')">
          <mt-cell is-link title="解除" v-model='isendname'></mt-cell>
        </div>
      </div>
      <div id="body-compactorg2">
        <div class="compactorg">执行信息</div>
        <div  @click="handleClickref('ifendpart')">
          <mt-cell is-link title="结束兼职" v-model='ifendpartname'></mt-cell>
        </div>
        <div @click="handleClickref('ifsynwork')">
          <mt-cell is-link title="同步工作履历" v-model='ifsynworkname'></mt-cell>
        </div>
      </div>
    </div>
    <footer>
      <span @click="savebill()">保存</span>
    </footer>
    <div>
      <hrScrollcustom :scrolldata="refdata" v-on:increment="incrementTotal" ref="scrollpopup"></hrScrollcustom>
    </div>
  </div>
</template>

<script>
  import { HrHeader, hrTime1, hrScrollcustom} from 'hr-ui'
  import { Popup,Toast,Cell,Field,DatetimePicker,Indicator } from 'mint-ui'
  import { fetchData } from 'hr-utils'

  export default {
    components: {
      HrHeader,hrTime1,hrScrollcustom
    },
    data() {
      return {
        refsource: '',
        refsource_copy: '',
        trnreason: '',
        trnreasonname: '',
        refdata:{
          type:"blood",
          data:[]
        },
        isreleasename: '否',
        isendname: '否',
        ifendpartname: '否',
        ifsynworkname: '是',
        transtypes: [],
        ispost: [
          {
            title: '是',
            value: 'Y'
          },
          {
            title: '否',
            value: 'Y'
          }
        ],
        transway: '',
        trnstype: '',
        newpoststatname: '',
        newpk_psncl: '',
        newpk_orgdatas:[],
        newpk_psncldatas:[],
        newpk_deptdatas:[],
        newcrtmanage: {
          hiorg_name: '',
          pk_hi_org: '',
          hrcmorg_name: '',
          pk_hrcm_org: ''
        },
        newpk_org: '',
        newpk_dept: '',
        newtemplet: [],
        oldtemplet: [],
        crtmanage: [],
        billkey: '',
        psnname: '',
        innerMap: {
          transtypename: '', // 交易类型名称
          transtypeid: '', // 交易类型id
          trnstypename: '', // 调配业务类型名称
          pk_trnstype: '', // 调配业务类型ID
          trnreasonname: '', // 调配原因名称
          pk_trnreason: '', // 调配原因ID
          transtypevalue: '', // 调配业务方式
          isrelease: false, // 解除合同
          ifendpart: false, // 结束兼职
          ifsynwork: true, // 同步工作履历
          isend: false, // 终止合同
          effecttime: '',
          memo: ''
        },
      }
    },
    watch: {
      newpk_orgdatas(){
        if (this.newpk_orgdatas && this.newpk_orgdatas.length > 0) {
          this.handleClickref("newpk_org")
        }
      },
      newpk_psncldatas(){
        if (this.newpk_psncldatas && this.newpk_psncldatas.length > 0) {
          this.handleClickref("newpk_psncl")
        }
      },
      newpk_deptdatas(){
        if (this.newpk_deptdatas && this.newpk_deptdatas.length > 0) {
          this.handleClickref("newpk_dept")
        }
      },
      transtypes() {
        if (this.transtypes && this.transtypes.length > 0) {
          this.handleClick()
        }
      },
      refsource_copy() {
        if (this.refdatas && this.refdatas.length > 0) {
          this.handleClickref(this.refsource_copy)
        }
      },
      newpoststatname(){
        let _this = this
        _this.newtemplet.forEach(function (temp,index) {
          if(temp.itemKey==='newpoststat'){
            temp.value = _this.newpoststatname ==='是' ? true:false
          }
        })
      },
      isreleasename(){
        this.innerMap.isrelease = this.isreleasename === '是'?true:false
        if(this.innerMap.isrelease){
          this.isendname = '否'
          this.innerMap.isend = false
        }
      },
      isendname(){
        this.innerMap.isend = this.isendname === '是'?true:false
        if(this.innerMap.isend){
          this.isreleasename = '否'
          this.innerMap.isrelease = false
        }
      }
    },
    created () {
      this.billkey = this.$route.query.pk_h
      this.getHrefInfo()
      this.queryTrnstypeList()
      this.queryTemplet()
      this.queryVOData()
      this.psnname = localStorage.getItem('userName').replace('str-','')
    },
    methods: {
      queryVOData () {
        let _this = this
        fetchData({
          url: 'hrssc/portal/trnquery/queryVOData',
          method: 'post',
          param:{
            'pk_h': _this.billkey
          },
          mock: false,
          contentType: 'application/json',
          success: function (res) {
            if(res.data){
              _this.newcrtmanage = res.data.newcrtmanage
              _this.oldtemplet = res.data.oldmap
              _this.newtemplet = res.data.newmap
              _this.crtmanage = res.data.crtManage
              _this.innerMap = res.data.innermap
              // 具体数据赋值
            }
          },
          error: function (error) {
            Indicator.close()
            Toast(error.message)
          }
        })
      },
      queryTemplet () {
        let _this = this
        if (_this.$route.params.transtype !== 'undefined' && _this.$route.params.transtype !== '') {
          fetchData({
            url: 'hrssc/portal/trnquery/queryTemplet',
            method: 'post',
            param: {
              'pk_trnstype': _this.$route.params.transtype,
              'billtype': _this.$route.params.transway
            },
            mock: false,
            contentType: "application/json",
            success: function (res) {
              if (res.statusCode === 200) {
                if (res.data !== 'undefined' && res.data !== '' && res.data !== 'null') {
                  _this.newtemplet = res.data.newmap
                  _this.oldtemplet = res.data.oldmap
                  _this.crtmanage = res.data.crtManage
                  _this.newtemplet.forEach(function (item, index) {
                    if (item.itemKey === 'newpk_org') {
                      _this.newpk_org = item.value
                    } else if (item.itemKey === 'newpk_dept') {
                      _this.newpk_dept = item.value
                    }
                  })
                } else {
                  _this.$message({
                    type: 'error',
                    message: '没有可用的调配项目'
                  })
                }
              } else {
                _this.$message({
                  type: 'error',
                  message: res.message || '没有可用的调配项目'
                })
              }
            },
            error: function(error) {
              Indicator.close()
              Toast(error.message)
            }
          })
        }
      },
      getHrefInfo(){
        this.innerMap.transtypevalue = this.$route.params.transway
        if(this.innerMap.transtypevalue === 1){
          this.transwayname = '组织内调动'
        }else{
          this.transwayname = '跨组织调动'
        }
      },
      queryTrnstypeList(){
        let _this = this
        _this.trnstype = _this.$route.params.transtype
        Indicator.open()
        fetchData({
          url: 'hrssc/portal/trnquery/queryTranstype',
          method: 'post',
          param: {
            billtype: 'trns'
          },
          mock: false,
          contentType: "application/json",
          success: function(data) {
            Indicator.close()
            data.data.forEach(function (item,index) {
              if (item.pk_trnstype === _this.trnstype) {
                _this.innerMap.trnstypename = item.trnstypename
                _this.innerMap.pk_trnstype = item.pk_trnstype
              }
            })
          },
          error: function(error) {
            Indicator.close()
            Toast(error.message)
          }
        })
      },
      incrementTotal(data) {
        if(data.name=='transtypeid'){
          this.innerMap.transtypeid = data.data.transtypeid
          this.innerMap.transtypename = data.data.transtypename
        }
        if(data.name=='pk'){
          let refpk = this.refsource
          let refname = this.refsource+'name'
          this[refpk]= data.data.pk;
          this[refname]= data.data.name;
        }
        if(data.name=='value'){
          let refpk = this.refsource
          let refname = this.refsource+'name'
          this[refname]= data.data.title;
          if(refpk === 'newpk_org' || refpk === 'newpk_dept'
            || refpk === 'newpk_psncl'){
            this[refpk] =  data.data.value
          }
          if(refpk == 'trnreason'){
            this.innerMap.pk_trnreason = data.data.value
            this.innerMap.trnreasonname = data.data.title
          }
          if(refpk == 'pk_new_hrcm'){
            this.newcrtmanage.hrcmorg_name = data.data.title
            this.newcrtmanage.pk_hrcm_org = data.data.value
          }
          if(refpk == 'pk_new_hi'){
            this.newcrtmanage.hiorg_name = data.data.title
            this.newcrtmanage.pk_hi_org = data.data.value
          }
          for(var i=0; i<this.newtemplet.length; i++){
            if(this.newtemplet[i].itemKey === refpk){
              this.newtemplet[i].displayname = data.data.title
              this.newtemplet[i].value = data.data.value
            }
          }
        }
      },
      handleClick() {
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
          console.log('aaa')
          return
        }
        this.refsource=source
        let data
        if(source === 'newpk_org'&&
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
            for(var i=0; i<this.newtemplet.length; i++){
              if((this.newtemplet[i].itemKey === 'newpk_post')
                && !this.newtemplet[i].value){
                Toast('请先选择岗位！')
                return
              }
            }
          }
          if(source === 'newpk_psncl'){
            this.queryRefList2(source)
          }else if (source === 'newpoststat' || source === 'isrelease'||source === 'isend' ||source === 'ifendpart' ||source === 'ifsynwork') {
            data = this.ispost
          }else{
            this.queryRefList(source)
          }
        }
        if(data && data.length>0){
            this.refdata={
              type:"custom",
              data: data,
              name:"value",
              mark:"title"
          }
          //调用子组件的方法
          this.$refs.scrollpopup.openpopup();//子组件的方法
          this.$refs.scrollpopup.refresh(this.refdata);//子组件的方法
        }
      },
      queryRefList(type){
        let _this = this
        Indicator.open()
        let newseries = ''
        if(type === 'newpk_job'){
          for(var i=0; i<this.newtemplet.length; i++){
            if(this.newtemplet[i].itemKey === 'newseries'){
              newseries = this.newtemplet[i].value
            }
          }
          if(!newseries){
            Toast('请先选择职务类别！')
            return
          }
        }
        let newpk_org
        for(var i=0; i<this.newtemplet.length; i++){
          if(this.newtemplet[i].itemKey === 'newpk_org'){
            newpk_org = this.newtemplet[i].value
          }
        }
        fetchData({
          url: 'hrssc/portal/psnbase/querySeoRef',
          method: 'post',
          param: {
            seotype: type,
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
      queryRefList2(type){
        let _this = this
        Indicator.open()
        let newseries = ''
        if(type === 'newpk_job'){
          for(var i=0; i<this.newtemplet.length; i++){
            if(this.newtemplet[i].itemKey === 'newseries'){
              newseries = this.newtemplet[i].value
            }
          }
          if(!newseries){
            Toast('请先选择职务类别！')
            return
          }
        }
        let newpk_org
        for(var i=0; i<this.newtemplet.length; i++){
          if(this.newtemplet[i].itemKey === 'newpk_org'){
            newpk_org = this.newtemplet[i].value
          }
        }
        fetchData({
          url: 'hrssc/portal/psnbase/queryReferencePsn',
          method: 'post',
          param: {
            refType: type
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
              _this.newpk_psncldatas = data.data.body
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
      queryTranstypeList(){
        let _this = this
        Indicator.open()
        fetchData({
          url: 'hrssc/portal/tbmquery/queryTranstype',
          method: 'post',
          param: {
            billtype: 'trns'
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
      goApp() {
        this.$router.push('/application')
      },
      savebill() {
        Indicator.open()
        let _this = this
        //校验数据
        if(_this.innerMap.effecttime === 'undefined' || _this.innerMap.effecttime === '') {
          Toast('有效时间必填！')
          return
        }
        if(_this.innerMap.pk_trnreason === 'undefined' || _this.innerMap.pk_trnreason === '') {
          Toast('调配原因必填！')
          return
        }
        _this.newtemplet.forEach(function (temp,index) {
          if(temp.isrequired && (temp.value ==='undefined'|| temp.value ==='') ){
            Toast(temp.itemKey + '必填！')
            return
          }
        })
        if(_this.newcrtmanage.pk_hi_org === 'undefined' || _this.newcrtmanage.pk_hi_org === ''){
          Toast('调配后人事管理组织必填！')
          return
        }
        if(_this.newcrtmanage.pk_hrcm_org === 'undefined' || _this.newcrtmanage.pk_hrcm_org === ''){
          Toast('调配后合同管理组织必填！')
          return
        }
        _this.crtmanage.forEach(function (temp,index) {
          if(_this.innerMap.transtypevalue === 1 && _this.newcrtmanage.pk_hi_org === temp.pk_old_hi_org){
            Toast('调配方式为组织内调配时，不允许调配后人事组织和原调配后人事组织不一致')
            return
          }
          if(_this.innerMap.transtypevalue === 2 && _this.newcrtmanage.pk_hrcm_org === temp.pk_old_hrcm_org){
            Toast('调配方式为组织内调配时，不允许调配后合同管理组织和原调配后人事组织不一致')
            return
          }
        })
        fetchData({
          url: 'hrssc/portal/trnquery/savebill',
          method: 'post',
          param: {
            innerMap: _this.innerMap, // 无法从后台直接获取的界面输入信息
            newtemplet: _this.newtemplet, // 调配后字段信息
            oldtemplet: _this.oldtemplet, // 调配前字段信息
            crtmanage: _this.crtmanage, // 旧合同信息
            newcrtmanage: _this.newcrtmanage, // 新合同信息
            pk_h: _this.billkey,
            fun_code: '60090transapply'
          },
          mock: false,
          contentType: 'application/json',
          success: function (data) {
            Indicator.close()
            Toast('保存成功，请预览')
            _this.$router.push({
              name: 'apply-detail',
              query: {
                approve_state: -1,
                pk_h: data.data.pk_h,
                billtype: 'trns',
                tbm_h_name: '调配',
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
    }
  }
</script>

<style scoped>
  #index-header{
    position: fixed;
    height: .88rem;
    width: 100%;
    line-height: .88rem;
  }
  #index-body {
    margin-top: .88rem;
    background: white;
    height: 85.9%;
    overflow-y: scroll;
  }
  #body-psn .psninfo, #body-before .before, #body-after .after,
    #body-afterorg .compareorg, #body-compactorg .compactorg,#body-compactorg2 .compactorg {
    height: .54rem;
    padding-left: .26rem;
    background: #f5f5f5;
    line-height: .54rem;
    font-size: .25rem;
    color: #999;
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
  }
</style>
