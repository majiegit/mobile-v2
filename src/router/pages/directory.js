import directory from '@/pages/directory/index'
import directoryDetail from '@/pages/directory/detail'
import directorySearch from '@/pages/directory/search'
import directoryList from '@/pages/directory/list'
export default [
  {
    path: '/directory',
    name: 'directory',
    component: directory
  },
  {
    path: '/directorySearch',
    name: 'directorySearch',
    component: directorySearch
  },
  {
    path: '/directoryDetail',
    name: 'directoryDetail',
    component: directoryDetail
  },
  {
    path: '/directoryList',
    name: 'directoryList',
    component: directoryList
  }
]

