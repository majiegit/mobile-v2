<template>
  <div class="mainpanle">
    <myHeader :title="title"></myHeader>
    <section>
      <div>
        <mt-index-list id>

          <template v-if="datas.length > 0" v-for="(data, index) in listArray" >
            <mt-index-section :index="data" >

              <template v-if="datas.length > 0" v-for="(data2, index2) in datas" >
                <div class="itemheight" v-if="data2.shortname != null && data === data2.shortname.slice(0,1).toUpperCase()" @click="showDetail(data2.pk_psndoc)">
                  <div class="itemdiv">
                    <div class="itemimgdiv">
                      <div v-if="data2.photo != null">
                        <div class="i-box tc" id="headImg">
                          <img :src="data2.photo" class="um-circle">
                        </div>
                      </div>
                      <div v-else>
                        <div class="i-box tc" id="headImg" v-bind:style="{background: data2.color }">
                          {{ (data2.psnname + '').slice(-2) }}
                        </div>
                      </div>
                    </div>
                    <div class="itemmsgdiv">
                      <div class="itemmsg">
                        <span class="psnnamestyle">{{ data2.psnname}}</span><br/>
                        <span class="psnmobilestyle">{{ data2.mobile}}</span>
                      </div>
                      <div class="itemtelimg">
                        <a :href="'tel:' + data2.mobile" style="text-decoration:none;" @click.stop>
                          <!--<img src="../../../../static/img/pages/address/icon-call.png" class="tel">-->
                          <i class="hrfont hr-phone photoicon"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </template>

            </mt-index-section>
          </template>


          <div id="emptydiv" class="emptydiv">
            <img src="../../../../static/img/pages/application/noData.svg">
          </div>

          <template v-if="pageNo < totalPage">
            <div @click="loadMoreDatas()" class="moredatas">
              <span class="moredataspan">加载更多</span>
            </div>
          </template>

        </mt-index-list>
      </div>

    </section>
    <footer>

    </footer>
  </div>

</template>

<script>
  import { ajax, waterMark, clearWaterMark} from 'hr-utils'
  import { myHeader } from 'hr-ui'
  import { Toast, Indicator, IndexList, IndexSection } from 'mint-ui';

  export default {
    name: 'addressDeptList',
    data() {
      return {
        isWater: false,
        pageHeight: 0,
        title: '',
        datas: [],
        listArray: [], //记录右侧索引字母
        pageNo: 0,  //当前页码
        totalCount: 0,  //总记录数
        pageSize: 20,   //每页条数
        totalPage: 0    //记录总页数
      }
    },
    components: {
      myHeader
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
    mounted() {
      this.pageHeight = Math.max(document.body.scrollHeight, document.body.clientHeight)
      //调用接口加载数据
      this.loadData();
      this.title = this.$route.query.deptname;
    },
    methods: {
      routerpush: function(deptid) {
        this.$router.push("/addressDetail");
      },

      /**
       * 调用接口查询数据
       */
      loadData: function() {
        let deptId = this.$route.query.deptid;
        //let deptId = this.getQueryString("deptid");
        //console.log("location.hash == " + location.hash + ",,deptid=" + deptId);
        Indicator.open();
        let _this = this;
        let param = {
          deptId: deptId,
          pageno: _this.pageNo,
          pagesize: _this.pageSize
        }
        ajax('hrssc/portal/psnbase/queryPsnInfoByDeptPk', 'POST', "application/json", param, function(data) {
          Indicator.close()
          if(data.statusCode == 200) {
            //console.log(data);
            if(data.data != null && data.data.length > 0) {
              //this.datas = data.data;
              //组装通讯录界面数据
              _this.createArray(data.data);
              document.getElementById("emptydiv").style.display = 'none';
              _this.pageNo = data.pageno;
              _this.totalCount = data.totalCount;
              _this.totalPage = Math.ceil(_this.totalCount/_this.pageSize);
              if(_this.totalPage > _this.pageNo){
                _this.pageNo = _this.pageNo + 1;
              }
              //console.log(_this.totalPage);
            }else{
              _this.datas = [];
              //显示为空图标
              document.getElementById("emptydiv").style.display = 'block';
              _this.pageNo = 0;
              _this.totalCount = 0;
              _this.totalPage = 0;
            }
          } else {
            Toast(data.message)
          }
        }, function(data) {
          //Indicator.close()
          //console.log(data)
        });
      },
      /**
       * 跳转到人员详情页面
       * @param {Object} pk_psndoc
       */
      showDetail: function(pk_psndoc){
        this.$router.push({name:'addressDetail', query: {pk_psndoc: pk_psndoc}});
      },

      createArray: function(dataarr){
        var tempdatas = dataarr;
        if(tempdatas != null && tempdatas.length > 0){
          var tempIndex = "";
          var curIndex = "";
          var data = null;
          var flag = false;
          var color = "";
          //临时添加
          //var arr = ['b','b','c','d','g','g','i','j','k','m','o','p','r','s','v','j','w','o','x','z','i','g','d','b','c','m','o','r','g','v','j','w','o','x','z','i','g','d','b','c','m','o','r','g','s'];
          for(var i=0;i<tempdatas.length;i++){
            data = tempdatas[i];
            color = this.getColor(tempdatas[i].psnname);
            tempdatas[i].color = color;
            //临时添加
            //tempdatas[i].shortname = arr[i];
            if(tempdatas[i].shortname != null && tempdatas[i].shortname.length > 0){
              curIndex = tempdatas[i].shortname.slice(0,1).toUpperCase();
              if(this.listArray != null && this.listArray.length > 0){
                for(var k=0;k<this.listArray.length;k++){
                  if(curIndex == this.listArray[k]){
                    flag = true;
                    break;
                  }else{
                    flag = false;
                  }
                }
                if(!flag){
                  this.listArray.push(curIndex);
                }
              }else{
                this.listArray.push(curIndex);
              }
            }else{
              tempdatas[i].shortname = "#";
              curIndex = "#";
              if(this.listArray != null && this.listArray.length > 0){
                for(var k=0;k<this.listArray.length;k++){
                  if(curIndex == this.listArray[k]){
                    flag = true;
                    break;
                  }else{
                    flag = false;
                  }
                }
                if(!flag){
                  this.listArray.push(curIndex);
                }
              }else{
                this.listArray.push(curIndex);
              }
            }
          }
          for(var i=0;i<tempdatas.length;i++){
            this.datas.push(tempdatas[i]);
          }
        }
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
       * 根据pk获取请求url中的某个参数
       */
      getQueryString: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        if(window.location.hash.substr(1).split("?").length > 1){
          var r = window.location.hash.substr(1).split("?")[1].match(reg);
          if (r != null)
            return unescape(r[2]);
        }
        return null;
      },
      loadMoreDatas: function(){
        this.loadData();
      }
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .margin {
    height: 180px;
  }
  img.nothing {
    display: block;
    width: 20%;
    margin: 2rem auto 0.1rem;
  }
  .none {
    display: none;
  }
  p.noDesc {
    width: 100%;
    text-align: center;
    color: #b4b4b4;
  }
  .table-view {
    padding-left: 0;
    margin-top: 0;
    margin-bottom: 15px;
    list-style: none;
    background-color: #fff;
  }
  td.space {
    width: 4%;
  }
  td.head {
    width: 18.7%;
  }
  td.name {
    width: 58.3%;
    border-bottom: 1px solid #e4e4e4;
  }
  td.phone {
    width: 15%;
    border-bottom: 1px solid #e4e4e4;
  }
  .table-view td p.nameLine {
    margin-top: 0.22rem;
    line-height: 0.45rem;
    color: #343434;
  }
  .table-view td p.depLine {
    line-height: 0.45rem;
    color: #c6c6c6;
  }
  .i-box{
    width:0.9rem;
    height:0.9rem;
    line-height:0.9rem;
    margin-left: 0.9rem;
    margin-top: 0.15rem;
    transform:translateX(-50%);
    -webkit-transform: translateX(-50%);
    border-radius:50%;
    box-shadow:0 0 0 0.05rem #fff;
    font-size:0.25rem;
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
    z-index: -1;
  }
  .um-circle {
    border-radius: 50%;
  }
  .tc {
    text-align: center;
  }
  .tel{
    width: 0.4rem;
  }
  .nothingdiv{

  }
  .psnnamestyle{
    font-size: 0.35rem;
    line-height:0.45rem;
    color:#343434;
  }
  .psnmobilestyle{
    font-size: 0.25rem;
    line-height:0.45rem;
    color:#c6c6c6;
  }
  .itemheight{
    height: 1.2rem;
  }
  .itemdiv{
    width: 100%;
    float: right;
    background: #fff;
    height: 1.2rem;
  }
  .itemimgdiv{
    float: left;
    width: 23%;
  }
  .itemmsgdiv{
    float: left;
    width: 70%;
    height: 1.2rem;
    padding-top: 0.2rem;
    border-bottom: 1px solid #F5F5F5;
  }
  .itemmsg{
    float: left;
    width: 70%;
    height: 1.0rem;
  }
  .itemtelimg{
    float: left;
    width: 30%;
    height: 1.0rem;
    line-height: 1.0rem;
    text-align: right;
  }
  .emptydiv{
    width: 100%;
    text-align: center;
    margin: 2rem auto;
    display: none;
  }
  .moredatas{
    width: 100%;
    background: #F5F5F5;
    height: 0.6rem;
    line-height: 0.6rem;
    text-align: center;
  }
  .moredataspan{
    font-family:PingFangSC-Regular;
    font-size:0.25rem;
    color:#666666;
    letter-spacing:0;
    text-align:left;
  }
  .photoicon{
    font-size: 23px;
    color: #ccc;
  }
</style>

<style>
  .mainpanle .mint-indexlist-nav{
    border-left: solid 0px #ddd;
  }
</style>
