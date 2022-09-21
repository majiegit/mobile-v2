import Vue from 'vue'
import router from './router'
import axios from 'axios'
import store from './store/index'
import VCharts from 'v-charts'
Vue.use(VCharts)
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);
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

Vue.prototype.$NODE_ENV = process.env.NODE_ENV.NODE_ENV
Vue.prototype.$http = axios

Vue.directive('focus', {
	inserted(el) {
		el.focus()
	}
})

new Vue({
	el: '#app', // 组件树根节点挂载点
	router,	// 注入路由
	store // 注入store
})


