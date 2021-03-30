<template>

<div class="hr-list2">

  <div class="h-list-group" >
    <div class="h-list-title">
      <div class="h-title-content">
        <h3>{{moduleData.name}}</h3>
        <span class="h-title-mark"  v-if="isShowNav=='show'&&(aprlist&&aprlist[moduleData.table_code])">信息待审批</span>
        <div v-if="isShowNav=='show'" @click="gopage({
              'name':moduleData.table_code=='bd_psndoc'?'editpage':'editlist',
              'modulelist':moduleData,
              'infoData':infoData,
              'isEdit':true,
              'parent':'personal',
              'examineflag':(aprlist&&aprlist[moduleData.table_code])})" >
          <span class="h-title-edit" v-if="moduleData.caneditflag=='Y'"><i class="icon hrfont hr-edit2"></i></span>
        </div>
      </div>
    </div>

    <div class="h-list-body" >
      <div class="h-term-group"
      v-for="(termgroup, index) in infoData"
      v-show="index<1||termshow" :key="index">

      <div @click="gopage({
            'name':'editpage',
            'modulelist':moduleData,
            'infoData':termgroup,
            'isEdit':false,
            'examineflag':(aprlist&&aprlist[moduleData.table_code])})"  >
        <hrList3 :listmodule="modulelist" :listinfo="termgroup" page="showlistflag" :aprlist="aprlist" :isEdit=isEdit v-for="(modulelist,hindex) in moduleData.tablefield" :key="hindex" ></hrList3>
      </div>
      </div>
      <div class="h-term-more" v-if="!!infoData&&infoData.length>1" @click="toggleShow">{{tremshowname}}</div>
      <div class="h-term-more" v-if="!!infoData&&infoData.length==0" >暂无数据</div>
    </div>
  </div>
</div>

</template>
<script>

/**
 * zhanghuag 20170905
 * hr-list2
 * @module pages/personalInfo
 *
 * @param {object} [moduleData] - 模板数据
 * @param {object} [infoData] -用户数据
 * @param {string} [isShowNav] -判断是否显示导航编辑功能，show为显示，其他都不显示
 *
 * @example
 * <hrList2 :moduleData="模板数据" :infoData="用户数据" isShowNav="show" ></hrList2>
 */
import hrList3 from './hr-list3.vue'
import { setStorage, getStorage } from 'hr-utils'

    export default {
      name:'hr-list2',
        components: {
            hrList3
        },
         props:["moduleData","infoData","isShowNav","aprlist"],
        data(){
            return {
                termshow:false,//控制是否显示所有字段
                tremshowname:"显示更多",//显示更多数据字段
                num:1,//默认显示条数
                isEdit:false,//是否显示
                //aprlist:"",//需要添加审核标记的数据
            }
        },
        watch:{
        },
        mounted (){
        },
        methods:{
            toggleShow(){//切换显示与隐藏字段
                this.termshow=!this.termshow;
                if(this.termshow){
                    this.tremshowname="隐藏更多"
                }else{
                    this.tremshowname="显示更多"
                }
            },
            gopage:function(param){//测试
              this.$router.push({name:param.name})
              setStorage("personal_"+param.name,param)
              //console.log(param)
            },

        }


    };
</script>


<style lang='less'scoped>
    @0CAEF5-color : #0CAEF5;
    @b2b2b2-color : #b2b2b2;
    .hr-list2{
        .h-list-group{
          background:#fff;
          .h-list-title {
            width: 100%;
            height: 0.8rem;
            border-bottom: 1px solid #e4e4e4;
            position: relative;
            overflow: hidden;
            .h-title-content {
              width:100%;
              height: 0.4rem;
              line-height: 0.4rem;

              position: relative;
              left: 0.12rem;
              top: 0.2rem;

              border-left: 0.08rem solid #1baede;
              font-size: 0.34rem;
              color: #343434;
              text-indent: 0.5em;
              h3{
                display:inline-block;
                font-size: 0.34rem;
                line-height:0.4rem;
              }
              .h-title-mark{
                font-size: 0.28rem;
                line-height:0.4rem;
                background:@0CAEF5-color;
                border-radius:5px;
                color:#fff;
                padding:0.04rem 0.1rem;
                margin-left:0.1rem;
              }
              .h-title-edit{
                position: absolute;
                right: 0.32rem;
                top: -0.2rem;
                color: #0CAEF5;
                width: 0.8rem;
                height: 0.8rem;
                line-height: 0.8rem;
                i{
                  font-size: 0.5rem;
                  color: @0CAEF5-color;
                }
              }
            }
          }
          .h-list-body {
            padding: 0.2rem;
            border-bottom: 1px solid #e4e4e4;
            /*margin-bottom: 0.2rem;*/
            .h-term-group{
              border-bottom: 1px solid #e4e4e4;
              padding: 0.2rem 0;
            }

            .h-term-more {
              width: 100%;
              height: 0.6rem;
              line-height: 0.4rem;
              font-size: 0.3rem;
              text-align: center;
              padding-top: 0.2rem;
           }
          }
        }




    }

</style>

