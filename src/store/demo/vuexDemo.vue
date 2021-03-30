/**
 * Created by yangyang11 on 2017/11/3.
 * 
 */
<template>
  <div>
    <span>{{ text }}</span>
    <button style="height:1rem;width:5rem" @click="test1"> 点击测试根store的action</button>
    <button style="height:1rem;width:5rem" @click="test2"> 点击测试根store的Mutations'</button>
  </div>
</template>

<script>
  
  // import store from '@/store/index'
  import { mapState, mapMutations, mapGetters, mapActions } from 'vuex';
  export default {  
    name: 'test',
    data (){
      return {

      }
       
    },

    components: {
       
    },
   
    computed:{
      // vuex里的state数据可以通过mapState引入，可以直接用this.count这种方式调用
      ...mapState(["text"]),
      // getters用于调用数据之前先行计算
      // mapGetters({
      //   doneCount: 'doneTodosCount'
      // })
      // ...mapGetters([
      //   'rootGetters',
      //   'anotherGetter',
      //   // ...
      // ])
      text(){
        return this.$store.getters.rootGetters;
      }
      // count1(){
      //       return this.$store.state.count;
      //   }
    },

    mounted(){
      let count = this.$store.state.text
      console.log(count)
    },

   
    methods : {
      // 直接把Mutations里的事件传进来供直接调用 事件一般用于修改state里的状态
       ...mapMutations([
        'rootMutations' // 将 `this.rootMutations()` 映射为 `this.$store.commit('rootMutations')`
      ]),

      ...mapActions([
        'rootActions1' // 同上
      ]),

      test1(){
        this.$store.dispatch('rootActions1','根Actions')
      },

      test2(){
        this.rootMutations('根Mutations')
      }

    }
  }
</script>

<style lang='less' scoped>
button{
  margin-top: .3rem;
  display: block;
}
</style>