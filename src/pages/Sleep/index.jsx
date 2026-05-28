import { useState, useMemo } from 'react'
import { Moon, Sunrise, Activity, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { formatRelativeDate } from '../../utils/dateHelpers'
import useSleep from '../../hooks/useSleep'

import SleepRing from './components/SleepRing'
import SleepInsights from './components/SleepInsights'
import SleepTrends from './components/SleepTrends'
import AddSleepModal from './components/AddSleepModal'

export default function Sleep() {
  const { sleepLogs, isLoading, logSleep } = useSleep()
  const [showAddModal, setShowAddModal] = useState(false)
  
  // Basic date navigation
  const [selectedDate, setSelectedDate] = useState(new Date())

  const currentLog = useMemo(() => {
    const targetDateStr = selectedDate.toISOString().split('T')[0]
    return sleepLogs.find(d => d.logged_at === targetDateStr)
  }, [sleepLogs, selectedDate])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full py-32">
        <div className="w-8 h-8 rounded-full border-2 border-accent-blue border-t-transparent animate-spin" />
      </div>
    )
  }

  const navigateDate = (days) => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + days)
    setSelectedDate(newDate)
  }

  return (
    <div className="relative min-h-[calc(100vh-100px)] flex flex-col max-w-4xl mx-auto pb-24">
      {/* Top sticky header */}
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-base/80 backdrop-blur-xl py-4 z-30">
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
          Sleep
        </h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-10 h-10 bg-accent-blue/10 text-accent-blue rounded-full flex items-center justify-center hover:bg-accent-blue/20 transition-all"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Date Navigator */}
      <div className="flex items-center justify-center gap-6 mb-8">
        <button onClick={() => navigateDate(-1)} className="p-2 text-text-muted hover:text-text-primary transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div className="text-center w-40">
          <h2 className="text-lg font-bold text-text-primary">
            {selectedDate.toDateString() === new Date().toDateString() 
              ? 'Today' 
              : selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </h2>
        </div>
        <button 
          onClick={() => navigateDate(1)} 
          disabled={selectedDate.toDateString() === new Date().toDateString()}
          className="p-2 text-text-muted hover:text-text-primary disabled:opacity-30 transition-colors"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {currentLog ? (
        <div className="space-y-6">
          <SleepRing log={currentLog} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface/30 border border-white/5 rounded-3xl p-6 backdrop-blur-md">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
                <Moon size={16} className="text-accent-blue" />
                Time Asleep
              </h3>
              <p className="text-4xl font-bold font-mono-numbers text-white">
                {Math.floor(currentLog.duration_hours || 0)}<span className="text-xl text-text-muted ml-1">h</span> {Math.round(((currentLog.duration_hours || 0) % 1) * 60)}<span className="text-xl text-text-muted ml-1">m</span>
              </p>
            </div>
            
            <div className="bg-surface/30 border border-white/5 rounded-3xl p-6 backdrop-blur-md">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
                <Activity size={16} className="text-emerald-400" />
                Readiness Score
              </h3>
              <p className="text-4xl font-bold font-mono-numbers text-emerald-400">
                {Math.min(100, Math.round(((currentLog.quality || 3) / 5) * 100))}%
              </p>
            </div>
          </div>

          <SleepInsights log={currentLog} />
        </div>
      ) : (
        <div className="py-32 text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-accent-blue/10 flex items-center justify-center mb-6">
            <Moon size={40} className="text-accent-blue opacity-50" />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-2">No sleep data</h3>
          <p className="text-text-muted">You haven't logged any sleep for this date.</p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="mt-6 px-6 py-2 bg-accent-blue text-white font-bold rounded-full hover:bg-accent-blue/90 transition-all"
          >
            Add Sleep Log
          </button>
        </div>
      )}

      {/* Weekly Trends */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-text-primary mb-6">Sleep Trends</h3>
        <SleepTrends sleepData={sleepLogs} />
      </div>

      <AddSleepModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        addSleepLog={logSleep}
        targetDate={selectedDate.toISOString().split('T')[0]}
      />
    </div>
  )
}
