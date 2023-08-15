// import request from '@/request/index.js'
const baseUrl='/h5/xunjian/ngsoc'
import { xungeng } from '@/utils/request'


// 获取态势感知-危机数
export function getGlobalRisk(){
	return xungeng.get('/ngsoc/global-risk')
}
// 获取态势感知-处置率
export function getAlarmDispose(){
	// return request({
	// 	url:`${baseUrl}/alarm-dispose`,
	// 	method:'GET',
	// })
	return xungeng.get('/ngsoc/alarm-dispose')
}
// 获取态势感知-失陷率
export function getVictimSurvey(){
	// return request({
	// 	url:`${baseUrl}/victim-survey`,
	// 	method:'GET',
	// })
	return xungeng.get('/victim-survey')
}
// 获取态势感知-威胁告警趋势
export function getThreadTrend(){
	// return request({
	// 	url:`${baseUrl}/threat-trend`,
	// 	method:'GET',
	// })
	return xungeng.get('/threat-trend')
}
// 态势感知-外部危险总览
export function getOuterThreatOverview(){
	// return request({
	// 	url:`${baseUrl}/outer-threat-overview`,
	// 	method:'GET',
	// })
	return xungeng.get('/outer-threat-overview')
}
// 获取态势感知-外部威胁等级分布
export function getOuterThreatLevel(){
	// return request({
	// 	url:`${baseUrl}/outer-threat-level`,
	// 	method:'GET',
	// })
	return xungeng.get('/outer-threat-level')
}
// 获取态势感知-内部危险总览
export function getInnerThreatOverview(){
	// return request({
	// 	url:`${baseUrl}/inner-threat-overview`,
	// 	method:'GET',
	// })
	return xungeng.get('/inner-threat-overview')
}
// 获取态势感知-内部威胁等级分布
export function getInnerThreatLevel(){
	// return request({
	// 	url:`${baseUrl}/inner-threat-level`,
	// 	method:'GET',
	// })
	return xungeng.get('/inner-threat-level')
}
