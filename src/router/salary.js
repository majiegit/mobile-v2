
/*
 *Created by yangyang11 on 2017/8/17.
 *
 */
import Salary from '@/pages/salary/salary'
// const Salarydetail = r => require.ensure([], () => r(require('@/pages/staff-self/salary/salarydetail.vue')), 'Salarydetail')
// const SalaryPWD = r => require.ensure([], () => r(require('@/pages/staff-self/salary/salaryPWD.vue')), 'SalaryPWD')
// const ResetSalaryPWD = r => require.ensure([], () => r(require('@/pages/staff-self/salary/resetSalaryPWD.vue')), 'ResetSalaryPWD')
export default [
      {
        path : '/salary',
        name : 'salary',
        component : Salary
      },
      // {
      //   path : '/salarydetail:detaildata',
      //   name : 'salarydetail',
      //   component : Salarydetail
      // },
      // {
      //   path : '/salaryPWD',
      //   name : 'salaryPWD',
      //   component : SalaryPWD
      // },
      // {
      //   path : '/resetSalaryPWD',
      //   name : 'resetSalaryPWD',
      //   component : ResetSalaryPWD
      // },
]
