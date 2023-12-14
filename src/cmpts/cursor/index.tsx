import React, { useEffect, useState } from 'react'
import './index.css'

function TerminalCursor() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // 设置定时器，每500毫秒切换光标的可见性
    const intervalId = setInterval(() => {
      setIsVisible(prevVisible => !prevVisible)
    }, 500)

    // 清除定时器以防止内存泄漏
    return () => clearInterval(intervalId)
  }, [])

  return <div className={`terminal-cursor ${isVisible ? 'visible' : 'hidden'}`}></div>
}

export default TerminalCursor
