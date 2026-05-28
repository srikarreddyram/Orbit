import { Brain, AlertCircle, Zap, ShieldCheck } from 'lucide-react'

export default function SleepInsights({ log }) {
  const insights = log.insights_json || [];

  if (insights.length === 0) {
    return (
      <div className="bg-surface/30 border border-white/5 rounded-3xl p-6 backdrop-blur-md">
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
          <Brain size={16} className="text-accent-blue" />
          AI Recovery Insights
        </h3>
        <p className="text-text-muted text-sm">Log more details to generate recovery insights.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface/30 border border-white/5 rounded-3xl p-6 backdrop-blur-md">
      <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
        <Brain size={16} className="text-accent-blue" />
        AI Recovery Insights
      </h3>
      
      <div className="space-y-3">
        {insights.map((insight, idx) => {
          // Determine icon/color based on keywords
          let Icon = AlertCircle;
          let colorClass = 'text-accent-blue';
          let bgClass = 'bg-accent-blue/10 border-accent-blue/20';

          if (insight.toLowerCase().includes('compromised') || insight.toLowerCase().includes('debt') || insight.toLowerCase().includes('fragmented')) {
            colorClass = 'text-red-400';
            bgClass = 'bg-red-400/10 border-red-400/20';
          } else if (insight.toLowerCase().includes('excellent') || insight.toLowerCase().includes('prime')) {
            Icon = ShieldCheck;
            colorClass = 'text-emerald-400';
            bgClass = 'bg-emerald-400/10 border-emerald-400/20';
          } else if (insight.toLowerCase().includes('moderate')) {
            colorClass = 'text-amber-400';
            bgClass = 'bg-amber-400/10 border-amber-400/20';
          }

          return (
            <div key={idx} className={`p-4 rounded-2xl border ${bgClass} flex gap-3 items-start`}>
              <Icon size={18} className={`shrink-0 mt-0.5 ${colorClass}`} />
              <p className="text-sm text-text-primary leading-relaxed">
                {insight}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
