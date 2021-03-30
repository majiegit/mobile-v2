<template>
  <div class="addrmainpanle">
    <section class="sel">
      <div id="header" class="um-header-fixed">
        <div href="javascript:void(0);" class="back">
          <a @click="goback()"><img src="../../../../static/img/pages/address/a-left.png" class="um-circle"></a>
        </div>
      </div>
      <div class="headerbgc">
        <div v-if="psninfo != null && psninfo.photo">
          <div class="i-box tc">
            <img :src="psninfo.photo" class="um-circle">
          </div>
        </div>
        <div v-else>
          <div class="i-box tc" id="headImg" v-bind:style="{background: psninfo.color }">
            {{ (psninfo.name + '').slice(-2) }}
          </div>
        </div>
        <p class="i-name" id="name">{{ psninfo.name }}</p>
      </div>

      <div class="splitdiv"></div>

      <ul>
        <mt-cell title="手机号码">
          <div class="mobilediv">
            {{psninfo.mobile}}
          </div>
          <div class="telimgdiv">
            <template v-if="psninfo.mobile != null && psninfo.mobile.length > 0">
              <a :href="'tel:' + psninfo.mobile" style="text-decoration:none;">
                <!--<img slot="icon" src="../../../../static/img/pages/address/icon-call.png" width="18" height="18">-->
                <i class="hrfont hr-phone photoicon"></i>
              </a>
            </template>
          </div>
        </mt-cell>
        <mt-cell title="办公电话" value="">{{ psninfo.officephone }}</mt-cell>
        <mt-cell title="公司邮箱" value="">{{ psninfo.email }}</mt-cell>
      </ul>

      <div class="splitdiv"></div>

      <ul>
        <mt-cell title="公司">{{ psninfo.orgname }}</mt-cell>
        <mt-cell title="部门">{{ psninfo.deptname }}</mt-cell>
        <!--<mt-cell title="职务">{{ psninfo.jobname }}</mt-cell>-->
        <mt-cell title="职位">{{ psninfo.postname }}</mt-cell>
        <!--<mt-cell title="上级" value="说明文字">{{ psninfo.superior }}</mt-cell>-->
        <!--<mt-cell title="下属人数" >{{ psninfo.subpsnum }}</mt-cell>-->
      </ul>
    </section>
    <footer>

    </footer>
  </div>

</template>

<script>
  import { ajax, waterMark, clearWaterMark} from 'hr-utils'
  import { Toast, Indicator } from 'mint-ui';
  import { Cell } from 'mint-ui';
  export default {
    name: 'addressDeptList',
    data() {
      return {
        isWater: false,
        pageHeight: 0,
        psninfo: {},
        labels:[],
        selected: 0
      }
    },
    updated () {
      var pageHeight = Math.max(document.body.scrollHeight, document.body.clientHeight)
      if (pageHeight !== this.pageHeight || this.isWater === false) {
        this.isWater = true
        clearWaterMark()
        waterMark({watermark_txt: localStorage.getItem('userName').split('-')[1] + ' ' + localStorage.getItem('mobile').split('-')[1] })
      }
    },
    beforeDestroy () {
      clearWaterMark()
    },
    components: {},
    mounted() {
      this.pageHeight = Math.max(document.body.scrollHeight, document.body.clientHeight)
      this.loadData();
    },
    methods: {
      goback: function() {
        history.go(-1);
      },

      /**
       * 调用接口查询数据
       */
      loadData: function(){
        let pkpsndoc = this.$route.query.pk_psndoc;
        //console.log("location.hash == " + location.hash + ",pk_psndoc=" + pkpsndoc);
        let param = {
          pk_psndoc: pkpsndoc
        }
        let _this = this;
        ajax('hrssc/portal/psnbase/getPsnInfo', 'POST', "application/json", param, function(data) {
          //Indicator.close()
          if(data.statusCode == 200) {
            //console.log(data.data);
            if(data.data != null && data.data.length > 0) {
              //添加颜色属性
              _this.addColor(data.data[0]);
            }else{
              this.psninfo = null;
            }
          } else {
            //Toast(data.data.message)
          }
        }, function(data) {
          //Indicator.close()
          //console.log(data)
        });
      },

      addColor: function(data){
        var color = this.getColor(data.name);
        data.color = color;
        this.psninfo = data;
      },

      /**
       * 根据名字获取背景颜色
       */
      getColor: function(name) {
        var color= ['#eead10','#f99a2b','#f38134','#6495ed','#3ab1aa','#0abfb5','#06aae1','#00bfff','#96bc53','#00ced1','#89a8e0'];
        var newName = encodeURI(name).replace(/%/g, "");
        var lastName, hexadecimal, tenBinary;
        //长度大于等于6位，取后六位
        if(newName.length >= 6) {
          lastName = newName.substr(lastName,6);
          hexadecimal = parseInt(lastName,16);
          //能转成数字
          if(hexadecimal) {
            tenBinary = hexadecimal%10;
            return color[tenBinary];
          } else {
            //不能转数字
            return color[10];
          }
        } else {
          return color[10]
        }
      },


      /**
       * 跳转到贴标签页面
       */
      labelPaste: function(){
        this.$router.push({name: 'labelPaste', query: { pk_psndoc: this.psninfo.pk_psndoc}});
      },
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .addrmainpanle {
    width: 100%; height: 100%; overflow: auto;
  }
  .headerbgc{
    width:100%; height:3.98rem;
    background:url(../../../../static/img/pages/address/c-bg.png) no-repeat 0 0 ;
    background-size:100% 100%;
    position:relative;
    z-index: 1;
  }
  .i-box{
    width:1.5rem;
    height:1.5rem;
    line-height:1.5rem;
    position:absolute;
    left:50%;
    top:1.2rem;
    transform:translateX(-50%);
    -webkit-transform: translateX(-50%);
    border-radius:50%;
    box-shadow:0 0 0 0.05rem #fff;
    font-family:"微软雅黑";
    font-size:0.42rem;
    color:#fff;
  }
  .i-box img{
    width:100%;
    height:100%;
    margin:0;
    padding:0;
    position:absolute;
    left:0;
    top:0;
  }
  .i-name{
    position:absolute;
    top:3rem; width:100%;
    height:0.4rem;
    line-height:0.4rem;
    font-size:0.32rem;
    color:#fff;
    text-align:center;
  }
  .um-circle {
    border-radius: 50%;
  }
  .tc {
    text-align: center;
  }
  .um-header-fixed{
    width: 100%;
    position:absolute;
    top: 0;
    left: 0;
    min-height:44px;
    z-index: 49;
    background: rgba(255,255,255,0);
  }
  .back{
    padding-top: 11px;
    padding-left: 10px;
  }
  .splitdiv{
    height: 0.07rem;
    width:100%;
    background: #ecf2f7;
  }
  .telimgdiv{
    float: right;
    width: 45%;
    text-align: right;
  }
  .mobilediv{
    float: left;
    width: 50%;
  }
</style>

<style>
  .photoicon{
    font-size: 25px;
    color: #ccc;
  }
</style>
