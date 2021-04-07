
const hostList = {
    'proxy' : '',  // 代理
    'mock' : 'https://easy-mock.com/mock/59bb76d1e0dc663341ab689c/', // easy-mock
    'test123' : 'http://10.211.55.3:8050/',
    'shengaozhengshi' : 'http://115.238.47.59:8098/',
    'test172': 'http://172.20.14.201:8199/',
    'customer': 'http://10.16.16.14:8080/',  //移动客户测试环境ip
    'customerZSC': 'http://10.16.24.13:80/',  //移动客户准生产环境ip

    'customerZS': 'http://10.16.120.9:80/',  //移动客户生产环境ip
    'customerym': 'http://ehr.xiangyu.cn:9080/',  //移动客户生产环境域名
    'ceshi': 'http://8.140.136.205:8080/', //测试环境
    'localhost': 'http://127.0.0.1:8001/', //测试环境
    'nginxFW': 'http://172.18.10.163:8081/', //nginx服务部署用
    'yangwengsheng': 'http://172.18.12.203/'
}

module.exports = {
	host: hostList.ceshi
}
