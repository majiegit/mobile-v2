// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import router from './router' 
import routerconfig from './router'
import MintUI from 'mint-ui'
import axios from 'axios'
import "mint-ui/lib/style.css"
import store from './store/index'

String.prototype._trim = function() {
		return decodeURI(encodeURI(this).replace(/%E2%80%86/g, ""))
}

Array.prototype.remove=function(index){
	for(var i =0;i <this.length;i++){
		if(index == i){
			for(var j = i;j <this.length;j++){
				this[j]=this[j+1];
			}
			this.length = this.length-1;
		}	
	}
	return this 
}

// development 本地开发   // production  生产环境
// window.NODE_ENV = process.env.NODE_ENV.NODE_ENV 
Vue.prototype.$NODE_ENV = process.env.NODE_ENV.NODE_ENV 
Vue.prototype.$http = axios

Vue.directive('focus', {
	inserted(el) {
		el.focus()
	}
})

Vue.use(MintUI)

new Vue({
	el: '#app', // 组件树根节点挂载点
	router,	// 注入路由
	store // 注入store
})


