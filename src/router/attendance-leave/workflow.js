const Workflow = r => require.ensure([], () => r(require('@/pages/staff-self/attendance-leave/my-apply/components/workflow')), 'workflow')

export default [
    {
        path : '/attendance-leave/my-apply/components/workflow',
        name : 'workflow',
        component : Workflow
    }

]
