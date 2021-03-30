/**
 * Created by yangyang11 on 2017/11/1.
 * 
 */
import Vue from 'vue'
const ToastShowConstructor = Vue.extend(require('./toast.vue'))
const ToastLoadingConstructor = Vue.extend(require('./toast-loading.vue'))


let getshowInstance = () => {
  return new ToastShowConstructor({
    el: document.createElement('div')
  });
};

const show = (options) =>{
  let instance = getshowInstance();
  instance.text = typeof options === 'string' ? options : options.text
  instance.timeout = options.timeout
  instance.iconType = options.iconType
  document.body.appendChild(instance.$el);
  return instance
}



let getloadingInstance = () => {
  return new ToastLoadingConstructor({
    el: document.createElement('div')
  });
};

const loading = (options) =>{
  let instance = getloadingInstance()
  instance.text = typeof options === 'string' ? options : options.text
  instance.close = options.close
  instance.shadeColor = options.shadeColor
  // instance.shade = options.shade
  // instance.shadeClick = options.shadeClick
  document.body.appendChild(instance.$el);
  return instance
}

const close = () => {
  document.getElementById('hrToastLoading').remove()
}
module.exports = {
    show, loading, close
}

