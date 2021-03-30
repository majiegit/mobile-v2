/**
 * Created by yangyang11 on 2017/11/3.
 * 
 */
const actions =  {
    // context store本身调用commit除法mutations 
 	rootActions1(context,t){
        context.commit('rootMutations',t)
    },

    // 直接把commit传进来
    rootActions2({commit}){
        commit('rootMutations','rootActions2')
    }
}

export default actions