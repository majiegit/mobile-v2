const psnreg = r => require.ensure([], () => r(require('@/pages/staff-self/regmng/index')), 'psnreg')

export default [
  {
    path : '/psnreg',
    name : 'psnreg',
    component : psnreg
  }

]
