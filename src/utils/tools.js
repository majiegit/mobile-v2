/*
 * Created by zhanghuag on 2017/09/05.
 * formatTime
 * @module utils/tools
 *
 * @param {object} [data] - 时间对象
 * @param {string} [format] -返回的时间格式
 *
 */
import $ from 'jquery'
export const formatTime = (data, format) => {
  var o = {
    "M+" : data.getMonth()+1, //month
    "d+" : data.getDate(), //day
    "h+" : data.getHours(), //hour
    "m+" : data.getMinutes(), //minute
    "s+" : data.getSeconds(), //second
    "q+" : Math.floor((data.getMonth()+3)/3), //quarter
    "S" : data.getMilliseconds() //millisecond
  };
  if(/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (data.getFullYear()+"").substr(4 - RegExp.$1.length));
  }
  for(var k in o) {
    if(new RegExp("("+ k +")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
    }
  }
  return format;
}

/*
 * Created by zhanghuag on 2017/09/06.
 * localStorage
 * @module utils/tools
 *
 * getStorage(key)  - 获取localStorage数据
 * @param {string} [key]    - 返回对象或字符串
 *
 * setStorage(key,value)     - 设置localStorage数据，
 * @param {string} [key] - 设置的localStorage的名称
 * @param {object/string} [value] - 设置的localStorage的名称对应的值
 *
 * clearStorage()  - 清空localStorage数据
 *
 * removeStorage(key)  - 删除localStorage数据
 * @param {string} [key]
 *
 */
// export const getStorage = () => {
//     var v=localStorage.getItem(key);
//     if(!v){return null}
//     var v4=v.slice(0,4);
//     if(v4=='obj-'){
//         v=JSON.parse(v.slice(4));
//     }else if(v4=='str-'){
//         v=v.slice(4);
//     }
//     return v
// }
export const getStorage = (key) => {
  var v=localStorage.getItem(key);
  if(!v){return null}
  var v4=v.slice(0,4);
  if(v4=='obj-'){
    v=JSON.parse(v.slice(4));
  }else if(v4=='str-'){
    v=v.slice(4);
  }
  return v
}
// function getStorage(key){
//     var v=localStorage.getItem(key);
//     if(!v){return null}
//     var v4=v.slice(0,4);
//     if(v4=='obj-'){
//         v=JSON.parse(v.slice(4));
//     }else if(v4=='str-'){
//         v=v.slice(4);
//     }
//     return v
// };

export const setStorage = (key, value) => {
  var v=value;
  if(typeof v == "object"){
    v="obj-"+JSON.stringify(v)
  }else{

    if(value==null||value==undefined){
      v="str-"
    }else{
      v="str-"+v
    }
  }
  localStorage.setItem(key,v);
}

export const clearStorage = () => {
  localStorage.clear();
}

export const removeStorage = () => {
  localStorage.remove(key);
}


/*
 * Created by zhanghuag on 2017/09/08.
 * list数组转map，涉及到递归
 * @module utils/tools
 *
 * @param {string} [str] - 父级编号，最顶级为undefined
 * @param {string} [key] - 当前元素与父级编号对比字段的属性名
 * @param {string} [value] - 当前元素的编号属性名
 * @param {array} [array] - 要进行递归的数组
 *
 */

export const formatdata = (str, key, value ,arr) => {
  var newarr=arr.filter(function(item){
    if(item[key]==str){
      item.data=formatdata(item[value],key,value,arr)
      return item
    }
  })
  return newarr
}


/*
 * Created by yangyaang11 on 2017/09/25.
 * 去掉字符串中的emoji表情
 * @module utils/tools
 * @param {string} [str] - 带emoji表情的字符串
 *
 */
export const emojiFilter = (str) => {
  return unescape(escape(str).replace(/\%uD.{3}/g, ''))
}


function entitiestoUtf16 (str){
  // 检测出形如&#12345;形式的字符串
  var strObj=str
  var patt = /&#\d+;/g;
  var H,L,code;
  var arr = strObj.match(patt)||[];
  for (var i=0;i<arr.length;i++){
    code = arr[i];
    code=code.replace('&#','').replace(';','');

    // 高位
    H = Math.floor((code-0x10000) / 0x400)+0xD800;
    // 低位
    L = (code - 0x10000) % 0x400 + 0xDC00;
    code = "&#"+code+";";
    var s = String.fromCharCode(H,L);
    strObj.replace(code,s);
  }
  console.log(strObj)
  return s
}

function utf16toEntities(str){
  var patt=/[\ud800-\udbff][\udc00-\udfff]/g;
  // 检测utf16字符正则
  str = str.replace(patt, function(char){
    var H, L, code;
    if (char.length===2) {
      H = char.charCodeAt(0);
      // 取出高位
      L = char.charCodeAt(1);
      // 取出低位
      code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00;
      // 转换算法
      return "&#" + code + ";";
    } else {
      return char;
    }
  });
  console.log(str)
  return str
}

/**
 * 根据名字获取背景颜色
 */
export const setPhotoColorByName = (nnameamestr) => {
  var color= ['#eead10','#f99a2b','#f38134','#6495ed','#3ab1aa','#0abfb5','#06aae1','#00bfff','#96bc53','#00ced1','#89a8e0'];
  var newName = encodeURI(name).replace(/%/g, "");
  var lastName, hexadecimal, tenBinary;
  //长度大于等于6位，取后六位
  if(newName.length >= 6) {
    lastName = newName.substr(lastName,6);
    hexadecimal = parseInt(lastName,16);
    //能转成数字
    if(hexadecimal) {
      tenBinary = hexadecimal%10;
      return color[tenBinary];
    } else {
      //不能转数字
      return color[10];
    }
  } else {
    return color[10]
  }
}
export const clearWaterMark = () => {
  $('body .mask_div').remove()
}
export const waterMark = (setting) => {
  // 默认设置
  var defaultSettings = {
    watermark_txt: 'text',
    watermark_x: 20, // 水印起始位置x轴坐标
    watermark_y: 100, // 水印起始位置Y轴坐标
    watermark_rows: 20, // 水印行数
    watermark_cols: 3, // 水印列数
    watermark_x_space: 20, // 水印x轴间隔
    watermark_y_space: 30, // 水印y轴间隔
    watermark_color: '#aaa', // 水印字体颜色
    watermark_alpha: 0.3, // 水印透明度
    watermark_fontsize: '15px', // 水印字体大小
    watermark_font: '仿宋', // 水印字体
    watermark_width: 110, // 水印宽度
    watermark_height: 40, // 水印高度
    watermark_angle: 10 // 水印倾斜度数
  }
  // 采用配置项替换默认值，作用类似jquery.extend
  if (arguments.length === 1 && typeof arguments[0] === 'object') {
    var src = arguments[0] || {}
    for (var key in src) {
      if (src[key] && defaultSettings[key] && src[key] === defaultSettings[key]) {
        continue
      } else if (src[key]) {
        defaultSettings[key] = src[key]
      }
    }
  }

  var oTemp = document.createDocumentFragment()

  // 获取页面最大宽度
  var pageWidth = Math.max(document.body.scrollWidth, document.body.clientWidth)
  // 获取页面最大长度
  var pageHeight = Math.max(document.body.scrollHeight, document.body.clientHeight)
  // 如果将水印列数设置为0，或水印列数设置过大，超过页面最大宽度，则重新计算水印列数和水印x轴间隔
  if (defaultSettings.watermark_cols === 0 || (parseInt(defaultSettings.watermark_x + defaultSettings.watermark_width * defaultSettings.watermark_cols + defaultSettings.watermark_x_space * (defaultSettings.watermark_cols - 1)) > pageWidth)) {
    defaultSettings.watermark_cols = parseInt((pageWidth - defaultSettings.watermark_x + defaultSettings.watermark_x_space) / (defaultSettings.watermark_width + defaultSettings.watermark_x_space))
    defaultSettings.watermark_x_space = parseInt((pageWidth - defaultSettings.watermark_x - defaultSettings.watermark_width * defaultSettings.watermark_cols) / (defaultSettings.watermark_cols - 1))
  }
  // 如果将水印行数设置为0，或水印行数设置过大，超过页面最大长度，则重新计算水印行数和水印y轴间隔
  if (defaultSettings.watermark_rows === 0 || (parseInt(defaultSettings.watermark_y + defaultSettings.watermark_height * defaultSettings.watermark_rows + defaultSettings.watermark_y_space * (defaultSettings.watermark_rows - 1)) > pageHeight)) {
    defaultSettings.watermark_rows = parseInt((defaultSettings.watermark_y_space + pageHeight - defaultSettings.watermark_y) / (defaultSettings.watermark_height + defaultSettings.watermark_y_space))
    defaultSettings.watermark_y_space = parseInt(((pageHeight - defaultSettings.watermark_y) - defaultSettings.watermark_height * defaultSettings.watermark_rows) / (defaultSettings.watermark_rows - 1))
  }
  var x
  var y
  for (var i = 0; i < defaultSettings.watermark_rows; i++) {
    y = defaultSettings.watermark_y + (defaultSettings.watermark_y_space + defaultSettings.watermark_height) * i
    for (var j = 0; j < defaultSettings.watermark_cols; j++) {
      x = defaultSettings.watermark_x + (defaultSettings.watermark_width + defaultSettings.watermark_x_space) * j
      var maskDiv = document.createElement('div')
      maskDiv.id = 'mask_div' + i + j
      maskDiv.className = 'mask_div'
      maskDiv.appendChild(document.createTextNode(setting.watermark_txt))
      // 设置水印div倾斜显示
      maskDiv.style.webkitTransform = 'rotate(-' + defaultSettings.watermark_angle + 'deg)'
      maskDiv.style.MozTransform = 'rotate(-' + defaultSettings.watermark_angle + 'deg)'
      maskDiv.style.msTransform = 'rotate(-' + defaultSettings.watermark_angle + 'deg)'
      maskDiv.style.OTransform = 'rotate(-' + defaultSettings.watermark_angle + 'deg)'
      maskDiv.style.transform = 'rotate(-' + defaultSettings.watermark_angle + 'deg)'
      maskDiv.style.visibility = ''
      maskDiv.style.position = 'absolute'
      maskDiv.style.left = x + 'px'
      maskDiv.style.top = y + 'px'
      maskDiv.style.overflow = 'hidden'
      maskDiv.style.zIndex = '9999'
      // mask_div.style.border="solid #eee 1px";
      maskDiv.style.opacity = defaultSettings.watermark_alpha
      maskDiv.style.fontSize = defaultSettings.watermark_fontsize
      maskDiv.style.fontFamily = defaultSettings.watermark_font
      maskDiv.style.color = defaultSettings.watermark_color
      maskDiv.style.textAlign = 'center'
      maskDiv.style.width = defaultSettings.watermark_width + 'px'
      maskDiv.style.height = defaultSettings.watermark_height + 'px'
      maskDiv.style.display = 'block'
      maskDiv.style.pointerEvents = 'none'
      oTemp.appendChild(maskDiv)
    }
  }
  document.body.appendChild(oTemp)
}
