import React, { useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'
import { useBroadcast } from '../hooks/useBroadcast'

const StatusBar: React.FC = () => {
  const { broadcastTime } = useBroadcast()
  const [cpuStatus, setCpuStatus] = useState(0.0)
  const [memoryStatus, setMemoryStatus] = useState(0.0)

  const { getCPUUsage, getProcessMemoryInfo, getSystemMemoryInfo } = process
  const { total } = getSystemMemoryInfo()

  const calcPercentCpuUsage = useCallback(() => {
    const { percentCPUUsage } = getCPUUsage()
    return Math.round(percentCPUUsage * 100) / 100
  }, [getCPUUsage])

  // This is a lie
  const calcPercentMemoryUsage = useCallback(async () => {
    const { private: notShared, shared } = await getProcessMemoryInfo()
    const percentMemoryUsage = ((notShared + shared) / total) * 100
    return Math.round(percentMemoryUsage * 100) / 100
  }, [getProcessMemoryInfo, total])

  useEffect(() => {
    setInterval(async () => {
      const percentCpuUsage = calcPercentCpuUsage()
      const percentMemoryUsage = await calcPercentMemoryUsage()
      setCpuStatus(percentCpuUsage)
      setMemoryStatus(percentMemoryUsage)
    }, 1000)
  }, [calcPercentCpuUsage, calcPercentMemoryUsage])

  return (
    <Wrapper>
      <Span>Memory: {memoryStatus.toFixed(2)}%</Span>
      <Span>CPU: {cpuStatus.toFixed(2)}%</Span>
      <Span>LIVE: {broadcastTime}</Span>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row-reverse;
  line-height: 24px;
  margin-top: auto;
  padding: 4px 0;
  width: 100%;
  height: 24px;
`

const Span = styled.span`
  margin-left: 24px;
`

export default StatusBar
