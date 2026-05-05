'use client'

import { useState, useEffect, useCallback } from 'react'

const titleLine1 = 'Campus Network'
const titleLine2 = 'Feedback'
const subtitle = 'ZJUers，进来锐评你的校园网'
const charDelay = 80
const pauseBetweenLines = 800

export default function Intro() {
  const [line1Text, setLine1Text] = useState('')
  const [line2Text, setLine2Text] = useState('')
  const [subtitleText, setSubtitleText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [cursorPos, setCursorPos] = useState<'line1' | 'line2' | 'subtitle'>('line1')
  const [phase, setPhase] = useState<'line1' | 'pause1' | 'line2' | 'pause2' | 'subtitle' | 'done'>('line1')
  const [showContinue, setShowContinue] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    if (phase === 'line1') {
      if (line1Text.length < titleLine1.length) {
        const timer = setTimeout(() => {
          setLine1Text(titleLine1.slice(0, line1Text.length + 1))
        }, charDelay)
        return () => clearTimeout(timer)
      } else {
        setPhase('line2')
        setCursorPos('line2')
      }
    }
  }, [line1Text, phase])

  useEffect(() => {
    if (phase === 'line2') {
      if (line2Text.length < titleLine2.length) {
        const timer = setTimeout(() => {
          setLine2Text(titleLine2.slice(0, line2Text.length + 1))
        }, charDelay)
        return () => clearTimeout(timer)
      } else {
        const timer = setTimeout(() => {
          setPhase('subtitle')
          setCursorPos('subtitle')
        }, pauseBetweenLines)
        return () => clearTimeout(timer)
      }
    }
  }, [line2Text, phase])

  useEffect(() => {
    if (phase === 'subtitle') {
      if (subtitleText.length < subtitle.length) {
        const timer = setTimeout(() => {
          setSubtitleText(subtitle.slice(0, subtitleText.length + 1))
        }, charDelay)
        return () => clearTimeout(timer)
      } else {
        setPhase('done')
      }
    }
  }, [subtitleText, phase])

  useEffect(() => {
    if (phase === 'done') {
      setShowContinue(true)
      const cursorInterval = setInterval(() => {
        setShowCursor(prev => !prev)
      }, 530)
      return () => clearInterval(cursorInterval)
    }
  }, [phase])

  const handleContinue = useCallback(() => {
    setFadeOut(true)
    setTimeout(() => {
      setIsVisible(false)
      sessionStorage.setItem('introShown', 'true')
    }, 600)
  }, [])

  if (!isVisible) return null

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-background transition-opacity duration-600 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      } ${showContinue ? 'cursor-pointer' : ''}`}
      onClick={showContinue ? handleContinue : undefined}
    >
      <div className="relative flex h-full w-full">
        <div className="flex flex-col px-10 pt-24 sm:px-16 md:px-24 md:pt-32 animate-fade-in">
          <div className="flex items-center">
            <h1 className="font-serif text-5xl font-light tracking-tight text-foreground sm:text-6xl md:text-7xl">
              {line1Text}
            </h1>
            {cursorPos === 'line1' && (
              <span
                className="inline-block w-[3px] bg-foreground animate-blink ml-1"
                style={{ height: '2em' }}
              />
            )}
          </div>
          <div className="flex items-center mt-1">
            <h1 className="font-serif text-5xl font-light tracking-tight text-foreground sm:text-6xl md:text-7xl">
              {line2Text}
            </h1>
            {cursorPos === 'line2' && (
              <span
                className="inline-block w-[3px] bg-foreground animate-blink ml-1"
                style={{ height: '2em' }}
              />
            )}
          </div>
        </div>

        <div className="absolute right-10 bottom-1/3 sm:right-16 md:right-24 flex flex-col items-end animate-fade-in">
          <div className="flex items-center h-8">
            <p className="font-sans text-lg text-muted-foreground sm:text-xl">
              {subtitleText}
            </p>
            {cursorPos === 'subtitle' && (
              <span
                className={`inline-block w-[3px] bg-foreground transition-opacity duration-100 ml-0.5 ${
                  phase === 'done' ? (showCursor ? 'opacity-100' : 'opacity-0') : ''
                }`}
                style={{ height: '1em' }}
              />
            )}
          </div>

          <div className="h-12 flex items-center">
            {showContinue && (
              <button
                className="px-6 py-3 font-sans text-sm tracking-widest text-muted-foreground uppercase hover:text-foreground transition-all duration-300 animate-fade-in cursor-pointer"
              >
                Click to continue
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 left-0 right-0 text-center">
        <p className="font-serif text-xs tracking-wider text-muted-foreground/50">
          SQTP | 浙江大学校园网络服务用户反馈平台
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-blink {
          animation: blink 1s step-end infinite;
        }
      `}</style>
    </div>
  )
}
