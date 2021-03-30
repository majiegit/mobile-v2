
import CalendarMain from '../calendarMain.vue'
import { mergeOptions } from './util'
import m from  '../css/style.less'
import s from  '../css/calendar.less'



let Calendar = {};


Calendar.install = function (Vue) {

    let t = new Date();

    Vue.prototype.$calendar = {}

    let  CalendarMainCom = Vue.extend(CalendarMain)

    let instance = new CalendarMainCom({
        el: document.createElement('div')
    })
    document.body.appendChild(instance.$el);

    Vue.prototype.$calendar.show  = (settings={})=>{
        instance.show = true;

        mergeOptions(instance, settings)
        console.log(instance)


    }
    Vue.prototype.$calendar.hide  = ()=>{
        instance.show = false
    }









}
export  default Calendar


