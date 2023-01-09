import directory from '@/pages/directory/index'
import directoryDetail from '@/pages/directory/detail'
import directorySearch from '@/pages/directory/search'
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
  }
]

