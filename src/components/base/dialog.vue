<template>
  <div>
    <div class="dialogFu-wrap">
      <div class="dialogFu-cover"  v-if="isShow" @click="closeMyself"></div>
      <transition name="drop">
        <div class="dialogFu-content"  v-if="isShow">
          <div class="dialogFu-text">确定修改吗？</div>
          <div class="dialogFu-btn">
              <button class="btn bor" @click="closeMyself">取消</button>
              <button class="btn" @click="closeMyself">确定</button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      
    }
  },
  methods: {
    closeMyself () {
      this.$emit('on-close')
    }
  }
}
</script>

<style scoped>
.drop-enter-active {
  transition: all .5s ease;
}
.drop-leave-active {
  transition: all .3s ease;
}
.drop-enter {
  transform: translateY(-500px);
}
.drop-leave-active {
  transform: translateY(-500px);
}

.dialogFu-wrap {
  position: fixed;
  width: 100%;
  height: 100%;
}
.dialogFu-cover {
  background: #000;
  opacity: .3;
  position: fixed;
  z-index: 5;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.dialogFu-content {
    width: 50%;
    position: fixed;
    max-height: 50%;
    /*overflow: auto;*/
    background: #fff;
    top: 20%;
    left: 48%;
    margin-left: -25%;
    z-index: 10;
    border-radius: 5px;
}
.dialogFu-text{
    line-height: 0.7rem;
    text-align: center;
    color: #343434;
    font-size: 0.3rem;
    padding: 8%;
}
.dialogFu-btn{
    height: 0.9rem;
    border-top: 1px solid #e4e4e4;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-orient: horizontal;
    flex-flow: row;
    -webkit-flex-flow: row; 
}
    
.dialogFu-btn .btn{
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    line-height: 0.9rem;
    font-size: 0.34rem;
    color: #1baede;
    text-align: center;
    background: #fff;
}
.dialogFu-btn .bor{
    border-right: 1px solid #ccc;
}
.dialogFu-close {
  position: absolute;
  right: 5px;
  top: 5px;
  width: 20px;
  height: 20px;
  text-align: center;
  cursor: pointer;
}
.dialogFu-close:hover {
  color: #4fc08d;
}
</style>
