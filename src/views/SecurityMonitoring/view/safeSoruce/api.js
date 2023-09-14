// import request from '@/request/index.js'
import { xungeng } from '@/utils/request'

// 获取态势感知-危机数
export function getGlobalRisk () {
  return xungeng.get('/ngsoc/global-risk')
}

// 获取态势感知-处置率
export function getAlarmDispose () {
  return xungeng.get('/ngsoc/alarm-dispose')
}

// 获取态势感知-失陷率
export function getVictimSurvey () {
  return xungeng.get('/ngsoc/victim-survey')
}

// 获取态势感知-威胁告警趋势
export function getThreadTrend () {
  return xungeng.get('/ngsoc/threat-trend')
}

// 态势感知-外部危险总览
export function getOuterThreatOverview () {
  return xungeng.get('/ngsoc/outer-threat-overview')
}

// 获取态势感知-外部威胁等级分布
export function getOuterThreatLevel () {
  return xungeng.get('/ngsoc/outer-threat-level')
}

// 获取态势感知-内部危险总览
export function getInnerThreatOverview () {
  return xungeng.get('/ngsoc/inner-threat-overview')
}

// 获取态势感知-内部威胁等级分布
export function getInnerThreatLevel () {
  return xungeng.get('/ngsoc/inner-threat-level')
}
