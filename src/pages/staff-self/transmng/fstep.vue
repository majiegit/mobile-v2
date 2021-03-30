<template>
  <div id="fstep">
    <div id="fstep-header">
      <hr-header
        title='选择业务类型'
        v-on:lcallBack='goApp'
        rText="下一步"
        v-on:rcallBack="goNext"
      >
      </hr-header>
    </div>
    <div id="fstep-body">
      <div  @click="handleClick('transways')">
        <mt-cell title="调配方式" is-link style="color: #333"><span style="color:#999">{{transwaysname}}</span></mt-cell>
      </div>
      <div  @click="handleClick('transtypes')">
        <mt-cell title="调配类型" is-link style="color: #333"><span style="color:#999">{{transtypesname}}</span></mt-cell>
      </div>
    </div>
    <div>
      <hrScrollcustom :scrolldata="transdata" v-on:increment="incrementTotal" ref="scrollpopup"></hrScrollcustom>
    </div>
  </div>
</template>

<script>
  import { HrHeader, hrTime1, hrScrollcustom} from 'hr-ui'
  import { Popup,Toast,Cell,Indicator } from 'mint-ui'
  import { fetchData } from 'hr-utils'

  export default {
    components: {
      HrHeader,hrTime1,hrScrollcustom
    },
    data() {
      return {
        data: '',
        refsource: '',
        transways: '',
        transwaysname: '必填项',
        transtypes: '',
        transtypesname: '必填项',
        transway: [
          {pk_trnstype: 1, trnstypename: '跨部门调动'},
          {pk_trnstype: 2, trnstypename: '跨组织调动'}
          ],
        transtype: [],
        transdata:{
          type:"blood",
          data:[]
        }

      }
    },
    created () {
      this.queryTranstypeList()
    },
    methods: {
      incrementTotal(data){//传递到子组件中的回调方法
        if(data.name == 'pk_trnstype') {
          let refpk = this.refsource
          let refname = this.refsource+'name'
          this[refpk]= data.data.pk_trnstype;
          this[refname]= data.data.trnstypename;
        }
      },
      queryTranstypeList(){
        let _this = this
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
            _this.transtype = data.data
          },
          error: function(error) {
            Indicator.close()
            Toast(error.message)
          }
        })
      },
      handleClick(source) {
        this.refsource = source
        this.transdata={
          type:"custom",
          data: source==='transways'? this.transway: this.transtype,
          name:"pk_trnstype",
          mark:"trnstypename"
        }
        //调用子组件的方法
        this.$refs.scrollpopup.openpopup();//子组件的方法
        this.$refs.scrollpopup.refresh(this.transdata);//子组件的方法
      },
      goNext() {
        if (this.trnstypename == '' || this.trnstypename == '必填项'
              || this.trnstypename == '' || this.trnstypename == '必填项') {
          Toast('调配方式与调配类型不能为空！')
        } else {
          this.$router.push('/transmng/index/' + this.transways + '/' + this.transtypes)
        }
      },
      goApp() {
        this.$router.push('/application')
      }
    }
  }
</script>

<style scoped>
  #fstep-header{
    position: fixed;
    height: .88rem;
    width: 100%;
    line-height: .88rem;
  }
  #fstep-body {
    padding-top: .88rem;
  }
</style>
