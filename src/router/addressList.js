/*
 *Created by tianxfc on 2017/8/17.
 *
 */

const AddressList = r => require.ensure([], () => r(require('@/pages/staff-self/addressList/addressList')), 'addressList')
const AddressDeptList = r => require.ensure([], () => r(require('@/pages/staff-self/addressList/addressDeptList')), 'addressList')
const AddressDetail = r => require.ensure([], () => r(require('@/pages/staff-self/addressList/addressDetail')), 'addressDetail')
const AddressOrgStructure = r => require.ensure([], () => r(require('@/pages/staff-self/addressList/addressOrgStructure')), 'addressOrgStructure')
const SearchBar = r => require.ensure([], () => r(require('@/components/base/searchbar')), 'searchBar')
export default [
    {
        path : '/addressList',
        name : 'addressList',
        component : AddressList
    },

    {
        path : '/addressDeptList',
        name : 'addressDeptList',
        component : AddressDeptList
    },

    {
        path : '/addressDetail',
        name : 'addressDetail',
        component : AddressDetail
    },

    {
        path : '/addressOrgStructure',
        name : 'addressOrgStructure',
        component : AddressOrgStructure
    },

    {
        path : '/searchBar',
        name : 'searchBar',
        component : SearchBar
    }

]
