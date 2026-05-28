import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Moon, Clock, ArrowRight, Brain, Battery, Zap, Coffee, Activity } from 'lucide-react'

// Simple 1-10 slider component
function SliderScore({ label, value, onChange, invertColors = false }) {
  const isHighGood = !invertColors;
  const isGood = isHighGood ? value >= 7 : value <= 4;
  const isBad = isHighGood ? value <= 4 : value >= 7;
  
  let colorClass = 'text-accent-blue';
  if (isGood) colorClass = 'text-emerald-400';
  if (isBad) colorClass = 'text-red-400';

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold text-text-secondary uppercase tracking-wider">{label}</label>
        <span className={`font-bold font-mono-numbers ${colorClass}`}>{value}/10</span>
      </div>
      <input 
        type="range" 
        min="1" 
        max="10" 
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full accent-accent-blue"
      />
    </div>
  )
}

function ToggleChip({ label, icon: Icon, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
        active 
          ? 'bg-accent-blue/20 border-accent-blue text-white' 
          : 'bg-surface border-white/5 text-text-muted hover:text-text-secondary'
      }`}
    >
      <Icon size={16} className={active ? 'text-accent-blue' : ''} />
      <span className="text-sm font-semibold">{label}</span>
    </button>
  )
}

export default function AddSleepModal({ isOpen, onClose, addSleepLog, targetDate }) {
  const [step, setStep] = useState(1);

  // Step 1: Timing
  // We'll construct default Date objects for yesterday 10:30 PM and today 6:30 AM
  const [bedtimeStr, setBedtimeStr] = useState('22:30');
  const [wakeTimeStr, setWakeTimeStr] = useState('06:30');
  const [onsetDelay, setOnsetDelay] = useState(15); // minutes

  // Step 2: Interruptions
  const [awakeningsCount, setAwakeningsCount] = useState(0);
  const [awakeDuration, setAwakeDuration] = useState(0);

  // Step 3: Factors
  const [usedScreensLate, setUsedScreensLate] = useState(false);
  const [consumedCaffeineLate, setConsumedCaffeineLate] = useState(false);
  const [feltStressedAnxious, setFeltStressedAnxious] = useState(false);
  const [tookNaps, setTookNaps] = useState(false);

  // Step 4: Morning Check-in
  const [energy, setEnergy] = useState(5);
  const [clarity, setClarity] = useState(5);
  const [mood, setMood] = useState(5);
  const [soreness, setSoreness] = useState(5);
  const [motivation, setMotivation] = useState(5);

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => Math.max(1, s - 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 4) return;
    
    // Parse times based on the target date. 
    // Usually bedtime is the night before targetDate, wake time is targetDate morning.
    const target = new Date(targetDate);
    const nightBefore = new Date(target);
    nightBefore.setDate(nightBefore.getDate() - 1);

    const [bHours, bMins] = bedtimeStr.split(':').map(Number);
    const [wHours, wMins] = wakeTimeStr.split(':').map(Number);
    
    // If bedtime is after midnight (e.g. 01:00), it's technically the targetDate early morning.
    const actualBedtimeDate = bHours >= 0 && bHours < 12 ? target : nightBefore;
    actualBedtimeDate.setHours(bHours, bMins, 0);

    const wakeDate = new Date(target);
    wakeDate.setHours(wHours, wMins, 0);

    // Onset time is bedtime + onsetDelay
    const onsetDate = new Date(actualBedtimeDate.getTime() + onsetDelay * 60000);

    await addSleepLog({
      logged_at: targetDate, // YYYY-MM-DD
      bedtime: actualBedtimeDate.toISOString(),
      sleep_onset_time: onsetDate.toISOString(),
      wake_time: wakeDate.toISOString(),
      awakenings_count: awakeningsCount,
      awake_duration_minutes: awakeDuration,
      used_screens_late: usedScreensLate,
      consumed_caffeine_late: consumedCaffeineLate,
      felt_stressed_anxious: feltStressedAnxious,
      took_naps: tookNaps,
      energy_upon_waking: energy,
      mental_clarity: clarity,
      mood: mood,
      muscle_soreness: soreness,
      motivation_to_train: motivation
    });
    
    // Reset state and close
    setStep(1);
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="w-full max-w-[480px] bg-base border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] pointer-events-auto"
            >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/5 bg-surface/50">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Moon className="text-accent-blue" />
                  Morning Recovery Check-in
                </h2>
                <div className="flex gap-1 mt-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full ${step >= i ? 'bg-accent-blue' : 'bg-white/10'}`} />
                  ))}
                </div>
              </div>
              <button onClick={onClose} className="p-2 -mr-2 text-text-muted hover:text-white rounded-full transition-colors self-start">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto hide-scrollbar flex-1">
              <form id="sleep-form" onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold">1. Sleep Timing</h3>
                        <p className="text-sm text-text-muted">When did you get into bed and when did you wake up?</p>
                        
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-text-secondary uppercase">Bedtime</label>
                            <input type="time" value={bedtimeStr} onChange={e => setBedtimeStr(e.target.value)} className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-text-secondary uppercase">Wake Time</label>
                            <input type="time" value={wakeTimeStr} onChange={e => setWakeTimeStr(e.target.value)} className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue" />
                          </div>
                        </div>

                        <div className="space-y-2 pt-4">
                          <label className="text-xs font-semibold text-text-secondary uppercase flex justify-between">
                            <span>Time to fall asleep</span>
                            <span className="text-accent-blue font-bold">{onsetDelay} min</span>
                          </label>
                          <input type="range" min="0" max="120" step="5" value={onsetDelay} onChange={e => setOnsetDelay(parseInt(e.target.value))} className="w-full accent-accent-blue" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold">2. Interruptions</h3>
                        <p className="text-sm text-text-muted">Did you wake up during the night?</p>

                        <div className="space-y-2 pt-4">
                          <label className="text-xs font-semibold text-text-secondary uppercase flex justify-between">
                            <span>Number of awakenings</span>
                            <span className="text-accent-blue font-bold">{awakeningsCount}</span>
                          </label>
                          <input type="range" min="0" max="10" value={awakeningsCount} onChange={e => setAwakeningsCount(parseInt(e.target.value))} className="w-full accent-accent-blue" />
                        </div>

                        {awakeningsCount > 0 && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2 pt-4">
                            <label className="text-xs font-semibold text-text-secondary uppercase flex justify-between">
                              <span>Total time awake (mins)</span>
                              <span className="text-accent-blue font-bold">{awakeDuration} min</span>
                            </label>
                            <input type="range" min="0" max="180" step="5" value={awakeDuration} onChange={e => setAwakeDuration(parseInt(e.target.value))} className="w-full accent-accent-blue" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold">3. Behavioral Factors</h3>
                        <p className="text-sm text-text-muted">Select any factors that applied before bedtime.</p>

                        <div className="grid grid-cols-2 gap-3 mt-4">
                          <ToggleChip label="Late Screens" icon={Brain} active={usedScreensLate} onClick={() => setUsedScreensLate(!usedScreensLate)} />
                          <ToggleChip label="Late Caffeine" icon={Coffee} active={consumedCaffeineLate} onClick={() => setConsumedCaffeineLate(!consumedCaffeineLate)} />
                          <ToggleChip label="High Stress" icon={Activity} active={feltStressedAnxious} onClick={() => setFeltStressedAnxious(!feltStressedAnxious)} />
                          <ToggleChip label="Daytime Naps" icon={Battery} active={tookNaps} onClick={() => setTookNaps(!tookNaps)} />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 4 && (
                    <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 pb-4">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-bold">4. Morning Readiness</h3>
                          <p className="text-sm text-text-muted mb-4">How do you feel right now?</p>
                        </div>
                        <SliderScore label="Morning Energy" value={energy} onChange={setEnergy} />
                        <SliderScore label="Mental Clarity" value={clarity} onChange={setClarity} />
                        <SliderScore label="Mood" value={mood} onChange={setMood} />
                        <SliderScore label="Motivation to Train" value={motivation} onChange={setMotivation} />
                        <SliderScore label="Muscle Soreness" value={soreness} onChange={setSoreness} invertColors={true} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>

            {/* Footer Buttons */}
            <div className="p-6 bg-surface/50 border-t border-white/5 flex gap-3">
              {step > 1 && (
                <button type="button" onClick={handlePrev} className="px-6 py-3 rounded-xl font-bold text-text-primary bg-white/5 hover:bg-white/10 transition-colors">
                  Back
                </button>
              )}
              
              {step < 4 ? (
                <button type="button" onClick={handleNext} className="flex-1 py-3 bg-accent-blue hover:bg-accent-blue/90 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                  Continue <ArrowRight size={18} />
                </button>
              ) : (
                <button type="submit" form="sleep-form" className="flex-1 py-3 bg-accent-blue hover:bg-accent-blue/90 text-white font-bold rounded-xl transition-colors">
                  Save Check-in
                </button>
              )}
            </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
