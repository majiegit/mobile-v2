/**
 * Created by yangyang11 on 2017/11/1.
 * 
 */
import Vue from 'vue'
const MessageBoxConstructor = Vue.extend(require('./message.vue'))



let getAnInstance = () => {
  return new MessageBoxConstructor({
    el: document.createElement('div')
  });
};

const confirm = options =>{
  let instance = getAnInstance();
  //只遍历对象自身的属性，而不包含继承于原型链上的属性。  
  for(let prop in options){
    if (options.hasOwnProperty(prop)) {
          instance[prop] = options[prop];
        }
  }
  instance.type = 'confirm'
  document.body.appendChild(instance.$el);
}

const alert = options =>{
  let instance = getAnInstance()
  for(let prop in options){
    if (options.hasOwnProperty(prop)) {
          instance[prop] = options[prop];
        }
  }
  instance.type = 'alert'
  document.body.appendChild(instance.$el);
}

module.exports = {
    confirm, alert
}

