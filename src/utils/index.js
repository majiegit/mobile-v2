import util from './util'
import {
  setStorage,
  getStorage,
  formatTime,
  clearStorage,
  removeStorage,
  formatdata,
  emojiFilter,
  setPhotoColorByName,
  clearWaterMark,
  waterMark
} from './tools'


module.exports = {
  questRequest: util.questRequest,
  ajax : util.ajax,
  fetchData : util.fetchData,
  myFetch : util.myFetch,
  getStorage : getStorage,
  setStorage : setStorage,
  clearStorage : clearStorage,
  removeStorage : removeStorage,
  formatdata : formatdata,
  formatTime: formatTime,
  emojiFilter : emojiFilter,
  setPhotoColorByName: setPhotoColorByName,
  clearWaterMark: clearWaterMark,
  waterMark: waterMark
}
