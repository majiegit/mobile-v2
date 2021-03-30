/**
 * Created by yangyang11 on 2017/11/3.
 * 
 */

 const vuexDemo = ({
 	state: {
 		count:1,
        text: 'vuex',
 	},

 	getters: {
 	 	count(state, getters, rootState){
        	return state.count +=100;
    	}
 	},

 	mutations: {
 	 	add(state, n){
        	state.count += n
	    },
	    reduce(state){
	        state.count --
	    }
 	},

 	actions: {
 	 	addAction(context){
        	// context store本身调用commit除法mutations 
            context.commit('add',10)
        },

        // 直接把commit传进来
        reduceAction({commit}){
            commit('reduce')
        }
 	}

 })

 export default vuexDemo