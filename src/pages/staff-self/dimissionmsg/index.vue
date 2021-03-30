<template>
  <div id="dimissinomng-index">
    <div id="dimission-header">
      <header>
        <hr-header
          title='离职申请'
          v-on:lcallBack='goApp'
        >
        </hr-header>
      </header>
    </div>
    <div id="dimission-body">
      <div class="header">
        <div class="items-bar">
          <div>
            <div  @click="handleClick('transtype')">
              <mt-cell title="流程类型" is-link ><span style="color:#333">{{innerMap.transtypename}}</span></mt-cell>
            </div>

          </div>
        </div>
      </div>
      <div class="body-psn">
        <div class="headerinfo">人员信息</div>
        <div  @click="handleClick('trnstype')">
          <mt-cell title="离职业务类型" is-link ><span style="color:#333">{{innerMap.trnstypename}}</span></mt-cell>
        </div>
        <div @click="handleClickref('trnreason')">
          <mt-cell title="离职原因" is-link ><span style="color:#999">{{innerMap.trnreasonname}}</span></mt-cell>
        </div>
        <mt-field label="生效日期" placeholder="请输入日期" type="date" v-model="innerMap.effecttime"></mt-field>
        <mt-field label="离职说明" placeholder="请输入..." type="textarea" rows="4" v-model="innerMap.memo"></mt-field>
      </div>
      <div class="dimission-before">
        <div class="headerinfo">离职前信息</div>
        <mt-cell v-for="(temp,index) in oldtemplet" :title="temp.itemName" :value="temp.displayname" v-if="temp.datatype!==4"></mt-cell>
        <mt-cell v-for="(temp,index) in oldtemplet" :title="temp.itemName" :value="temp.displayname==='Y'?'是':'否'" v-if="temp.datatype===4"></mt-cell>

      </div>
      <div class="dimission-after">
        <div class="headerinfo">离职后信息</div>

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
      <div class="dimission-afterorg">
        <div class="headerinfo">离职后管理组织</div>
        <div v-for="(temp,index) in crtmanage">
          <mt-cell title="原组织" style="color: #333" v-model='temp.oldhi_name'></mt-cell>
        </div>
        <div>
          <mt-cell title="新组织" style="color: #333" v-model='newcrtmanage.hiorg_name'></mt-cell>
        </div>
      </div>
      <div class="dimission-compactinfo">
        <div class="headerinfo">合同管理信息</div>
        <div v-for="(temp,index) in crtmanage">
          <mt-cell title="原合同组织" style="color: #333" v-model='temp.oldhrcm_name'></mt-cell>
        </div>
        <div>
          <mt-cell title="新合同组织" style="color: #333" v-model='newcrtmanage.hrcmorg_name'></mt-cell>
        </div>
        <div @click="handleClickref('isrelease')">
          <mt-cell is-link title="终止" v-model='isreleasename'></mt-cell>
        </div>
        <div @click="handleClickref('isend')">
          <mt-cell is-link title="解除" v-model='isendname'></mt-cell>
        </div>
      </div>

      <div id="dimission-compactinfo">
        <div class="headerinfo">执行信息</div>
        <div  @click="handleClickref('isdisablepsn')">
          <mt-cell is-link title="停用离职人员" v-model='isdisablepsnname'></mt-cell>
        </div>
        <div @click="handleClickref('ifaddblack')">
          <mt-cell is-link title="加入黑名单" v-model='ifaddblackname'></mt-cell>
        </div>
      </div>
    </div>
    <footer>
      <span @click='save'>保存</span>
    </footer>
    <div>
      <hrScrollcustom :scrolldata="refdata" v-on:increment="incrementTotal" ref="scrollpopup"></hrScrollcustom>
    </div>
  </div>
</template>

<script>
  import { Toast, Indicator, Cell, MessageBox, Spinner, DatetimePicker, Field } from 'mint-ui';
  import { fetchData, emojiFilter } from 'hr-utils'
  import { HrHeader, hrScrollcustom, ImgPicker} from 'hr-ui'

  export default {
    data( ){
      return {
        refsource: '',
        refsource_copy: '',
        refdata:{
          type:"blood",
          data:[]
        },
        trnreason: '',
        errorMessage: '',
        trnreasonname: '',
        transtypes: [], // 流程类型参照数组
        trnstype: [], // 离职业务类型参照数组x
        newtemplet: [],
        oldtemplet: [],
        crtmanage: [],
        isreleasename: '否',
        isendname: '否',
        isdisablepsnname: '是',
        ifaddblackname: '否',
        newpoststatname: '',
        newpk_psncl: '',
        ispost: [
          {
            title: '是',
            value: 'Y'
          },
          {
            title: '否',
            value: 'N'
          }
        ],
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
        innerMap: {
          transtypename: '请选择', // 交易类型名称
          transtypeid: '', // 交易类型id
          trnstypename: '请选择', // 离职业务类型名称
          pk_trnstype: '', // 离职业务类型ID
          trnreasonname: '', // 离职原因名称
          pk_trnreason: '', // 离职原因ID
          isrelease: false, // 解除合同
          isdisablepsn: true, // 停用离职人员
          ifaddblack: false, // 加入黑名单
          isend: false, // 终止合同
          effecttime: '',
          memo: ''
        }
      }
    },
    components: {
      HrHeader, ImgPicker, hrScrollcustom
    },
    created() {
      this.billkey = this.$route.query.pk_h
      this.queryTranstypeList()
      this.queryTrnstypeList()
      this.queryVOData()
      // this.queryVOData()
    },
    watch: {
      "innerMap.pk_trnstype" (){
        this.queryTemplet()
      },
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
        console.log(this.innerMap.isrelease)
      },
      isendname(){
        this.innerMap.isend = this.isendname === '是'?true:false
        if(this.innerMap.isend){
          this.isreleasename = '否'
          this.innerMap.isrelease = false
        }
      }
    },
    methods: {
      queryTemplet () {
        let _this = this
        if (_this.$route.params.transtype !== 'undefined' && _this.$route.params.transtype !== '') {
          fetchData({
            url: 'hrssc/portal/trnquery/queryTemplet',
            method: 'post',
            param: {
              'pk_trnstype': _this.innerMap.pk_trnstype,
              'billtype': 4
            },
            mock: false,
            contentType: "application/json",
            success: function (res) {
              if (res.statusCode === 200) {
                if (res.data !== 'undefined' && res.data !== '' && res.data !== 'null') {
                  _this.newtemplet = res.data.newmap
                  _this.oldtemplet = res.data.oldmap
                  _this.crtmanage = res.data.crtManage
                  console.log(_this.crtmanage)
                  _this.crtmanage.forEach(function (item, index) {
                    _this.newcrtmanage.pk_hrcm_org = item.pk_old_hrcm_org
                    _this.newcrtmanage.pk_hi_org = item.pk_old_hi_org
                    _this.newcrtmanage.hiorg_name = item.oldhi_name
                    _this.newcrtmanage.hrcmorg_name = item.oldhrcm_name
                  })
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
            if (res.data) {
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
      save() {
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
        fetchData({
          url: 'hrssc/portal/trnquery/savebill',
          method: 'post',
          param: {
            innerMap: _this.innerMap, // 无法从后台直接获取的界面输入信息
            newtemplet: _this.newtemplet, // 调配后字段信息
            oldtemplet: _this.oldtemplet, // 调配前字段信息
            crtmanage: _this.crtmanage, // 旧合同信息
            newcrtmanage: _this.newcrtmanage, // 新合同信息
            fun_code: '60090dimissionapply',
            pk_h: _this.billkey
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
                billtype: 'dimission',
                tbm_h_name: '离职',
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
      },
      handleClick(source){
        if(source === 'transtype'){
          if(this.transtypes.length === 0){
            Toast('暂无数据')
            return
          }
          this.refdata={
            type:"custom",
            data: this.transtypes,
            name:"transtypeid",
            mark:"transtypename"
          }
          //调用子组件的方法
          this.$refs.scrollpopup.openpopup();//子组件的方法
          this.$refs.scrollpopup.refresh(this.refdata);//子组件的方法
        }else{
          this.refdata={
            type:"custom",
            data: this.trnstype,
            name:"pk_trnstype",
            mark:"trnstypename"
          }
          //调用子组件的方法
          this.$refs.scrollpopup.openpopup();//子组件的方法
          this.$refs.scrollpopup.refresh(this.refdata);//子组件的方法
        }
      },
      queryTranstypeList(){
        let _this = this
        Indicator.open()
        fetchData({
          url: 'hrssc/portal/tbmquery/queryTranstype',
          method: 'post',
          param: {
            billtype: 'dimission'
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
      queryTrnstypeList(){
        let _this = this
        Indicator.open()
        fetchData({
          url: 'hrssc/portal/trnquery/queryTranstype',
          method: 'post',
          param: {
            billtype: 'dimission'
          },
          mock: false,
          contentType: "application/json",
          success: function(data) {
            Indicator.close()
            _this.trnstype = data.data
          },
          error: function(error) {
            Indicator.close()
            Toast(error.message)
          }
        })
      },
      incrementTotal(data){//传递到子组件中的回调方法
        if(data.name=='transtypeid'){
          this.innerMap.transtypeid=data.data.transtypeid;
          this.innerMap.transtypename=data.data.transtypename;
        }
        if(data.name=='pk_trnstype'){
          this.innerMap.pk_trnstype=data.data.pk_trnstype;
          this.innerMap.trnstypename=data.data.trnstypename;
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
      goApp() {
        this.$router.push('/application')
      },
      handleClickref(source){
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
          }else if (source === 'newpoststat' || source === 'isrelease'||source === 'isend' ||source === 'isdisablepsn' ||source === 'ifaddblack') {
            data = this.ispost
          }else{
            console.log('bbb')
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
      }
    }
  }
</script>

<style lang="less" scoped>
  header{
    position: fixed;
    width: 100%;
    height: .88rem;
    line-height: .88rem;
    z-index: 2;
  }
  #dimission-body {
    overflow-y: scroll;
    margin-top: .88rem;
    height: 85.9%;
    .header {
      .items-bar {
        padding-left: .22rem;
        background: #fff;
        .items {
          padding-bottom: .2rem;
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
      }
    }
    .headerinfo {
      height: .54rem;
      padding-left: .26rem;
      background: #f5f5f5;
      line-height: .54rem;
      font-size: .25rem;
      color: #999;
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
  }
</style>
