import addressBook from '@/pages/addressBook/index'
import addressBookDetail from '@/pages/addressBook/detail'
import addressBookList from '@/pages/addressBook/list'
export default [
  {
    path: '/addressBook',
    name: 'addressBook',
    component: addressBook
  },
  {
    path: '/addressBookDetail',
    name: 'addressBookDetail',
    component: addressBookDetail
  },
  {
    path: '/addressBookList',
    name: 'addressBookList',
    component: addressBookList
  }
]

