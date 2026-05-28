import { useState, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Check } from 'lucide-react'

export default function HabitCircle({ habit, isCompleted, streak, onToggle }) {
  const [isPressing, setIsPressing] = useState(false)
  const pressTimer = useRef(null)
  const controls = useAnimation()

  const handlePointerDown = () => {
    if (isCompleted) {
      // Just toggle off immediately for now
      onToggle()
      return
    }

    setIsPressing(true)
    controls.start({
      scale: 0.9,
      transition: { duration: 0.4 }
    })

    // Hold for 600ms to complete
    pressTimer.current = setTimeout(() => {
      onToggle()
      setIsPressing(false)
      controls.start({
        scale: 1,
        transition: { type: 'spring', bounce: 0.5 }
      })
    }, 600)
  }

  const handlePointerUp = () => {
    if (isCompleted) return
    
    clearTimeout(pressTimer.current)
    setIsPressing(false)
    controls.start({
      scale: 1,
      transition: { type: 'spring', bounce: 0.5 }
    })
  }

  // Pick color
  const color = habit.color || '#f59e0b' // Default amber

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Circle Button */}
      <motion.button
        animate={controls}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{ WebkitTapHighlightColor: 'transparent' }}
        className="relative w-32 h-32 rounded-full outline-none focus:outline-none flex items-center justify-center touch-none select-none"
      >
        {/* Background Ring */}
        <div 
          className="absolute inset-0 rounded-full border-[8px] transition-colors duration-300"
          style={{ borderColor: isCompleted ? color : `${color}30` }}
        />

        {/* Progress Ring (while pressing) */}
        {!isCompleted && isPressing && (
          <motion.svg className="absolute inset-0 w-full h-full -rotate-90">
            <motion.circle
              cx="64"
              cy="64"
              r="60"
              fill="transparent"
              stroke={color}
              strokeWidth="8"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease: 'linear' }}
            />
          </motion.svg>
        )}

        {/* Icon / Content */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          {isCompleted ? (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
            >
              <Check size={40} style={{ color }} />
            </motion.div>
          ) : (
            <span className="text-4xl" style={{ opacity: isPressing ? 0.5 : 1, transition: 'opacity 0.2s' }}>
              {habit.icon || '✨'}
            </span>
          )}
        </div>
      </motion.button>

      {/* Info */}
      <div className="text-center">
        <h3 className="font-bold text-text-primary uppercase tracking-wider text-sm leading-tight max-w-[120px]">
          {habit.name}
        </h3>
        <p className="text-xs text-text-muted mt-1 font-mono-numbers font-semibold flex justify-center gap-2">
          <span>{streak} Streak</span>
        </p>
      </div>
    </div>
  )
}
