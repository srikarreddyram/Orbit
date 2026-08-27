import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Trash2, Tag, RefreshCw } from 'lucide-react'
import { ICON_REGISTRY, COLOR_PALETTE, getIconComponent } from './CategoryConfig'
import toast from 'react-hot-toast'

export default function CategoryManagerModal({ isOpen, onClose, categories = [], addCategory, deleteCategory, restoreDefaultCategories }) {
  const [activeTab, setActiveTab] = useState('expense') // 'expense' or 'income'
  const [isCreating, setIsCreating] = useState(false)
  
  // New Category State
  const [name, setName] = useState('')
  const [color, setColor] = useState(COLOR_PALETTE[0])
  const [icon, setIcon] = useState('Package')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)
    try {
      await addCategory({
        name: name.toLowerCase().trim(),
        type: activeTab,
        color,
        icon
      })
      // Reset form
      setName('')
      setColor(COLOR_PALETTE[0])
      setIcon('Package')
      setIsCreating(false)
    } catch {
      toast.error('Failed to create category')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this category? Past transactions using it will still keep the text label, but lose their icon/color.')) {
      await deleteCategory(id)
    }
  }

  const handleRestoreDefaults = async () => {
    if (confirm('This will restore all missing default categories. Proceed?')) {
      try {
        await restoreDefaultCategories()
        toast.success('Defaults restored')
      } catch {
        toast.error('Failed to restore defaults')
      }
    }
  }

  const filteredCategories = categories.filter(c => c.type === activeTab)

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
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Tag className="text-accent-purple" />
                  Manage Categories
                </h2>
                <button onClick={onClose} className="p-2 -mr-2 text-text-muted hover:text-white rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex p-4 border-b border-white/5 bg-surface/30">
                <div className="flex p-1 bg-surface/80 rounded-xl border border-white/5 w-full">
                  <button
                    onClick={() => { setActiveTab('expense'); setIsCreating(false); }}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                      activeTab === 'expense' ? 'bg-elevated text-white shadow-sm' : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    Expenses
                  </button>
                  <button
                    onClick={() => { setActiveTab('income'); setIsCreating(false); }}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                      activeTab === 'income' ? 'bg-elevated text-white shadow-sm' : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    Income
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto hide-scrollbar flex-1 bg-surface/20">
                {!isCreating ? (
                  <div className="space-y-4">
                    <button
                      onClick={() => setIsCreating(true)}
                      className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-2 text-text-muted hover:text-white hover:border-accent-purple/50 transition-all hover:bg-accent-purple/5"
                    >
                      <Plus size={20} />
                      <span className="font-bold">Create New {activeTab === 'expense' ? 'Expense' : 'Income'} Category</span>
                    </button>

                    <div className="space-y-3 mt-6">
                      {filteredCategories.length === 0 ? (
                        <p className="text-center text-text-muted text-sm py-4">No categories found.</p>
                      ) : (
                        filteredCategories.map(cat => {
                          const Icon = getIconComponent(cat.icon)
                          return (
                            <div key={cat.id} className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-white/5">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: `${cat.color}15`, border: `1px solid ${cat.color}30` }}>
                                  <Icon size={18} style={{ color: cat.color }} />
                                </div>
                                <span className="font-semibold text-white capitalize">{cat.name}</span>
                              </div>
                              <button 
                                onClick={() => handleDelete(cat.id)}
                                className="p-2 text-text-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          )
                        })
                      )}
                    </div>
                    
                    {/* Restore Defaults */}
                    <button
                      onClick={handleRestoreDefaults}
                      className="w-full mt-6 py-3 flex items-center justify-center gap-2 text-text-muted hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-xl font-semibold text-sm"
                    >
                      <RefreshCw size={16} />
                      Restore Default Categories
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleCreate} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-text-secondary uppercase">Category Name</label>
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Groceries"
                        className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-text-secondary uppercase">Color</label>
                      <div className="flex flex-wrap gap-2">
                        {COLOR_PALETTE.map(c => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setColor(c)}
                            className={`w-10 h-10 rounded-full transition-transform ${color === c ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-base' : 'hover:scale-105'}`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-text-secondary uppercase">Icon</label>
                      <div className="grid grid-cols-5 gap-3 max-h-48 overflow-y-auto p-1 hide-scrollbar">
                        {Object.keys(ICON_REGISTRY).map(iconKey => {
                          const IconComp = ICON_REGISTRY[iconKey]
                          const isSelected = icon === iconKey
                          return (
                            <button
                              key={iconKey}
                              type="button"
                              onClick={() => setIcon(iconKey)}
                              className={`aspect-square rounded-xl flex items-center justify-center transition-all ${
                                isSelected ? 'bg-accent-purple text-white shadow-lg' : 'bg-surface border border-white/5 text-text-muted hover:text-text-primary'
                              }`}
                            >
                              <IconComp size={20} />
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button 
                        type="button"
                        onClick={() => setIsCreating(false)}
                        className="px-6 py-3 rounded-xl font-bold text-text-primary bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-3 bg-accent-purple hover:bg-accent-purple/90 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
                      >
                        {isSubmitting ? 'Creating...' : 'Create Category'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
