import { create } from 'zustand'

const useStore = create((set) => ({
  // Sidebar
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  // Quick add modal
  quickAddOpen: false,
  quickAddType: null, // 'task' | 'workout' | 'sleep' | 'meal' | 'transaction'
  openQuickAdd: (type = null) => set({ quickAddOpen: true, quickAddType: type }),
  closeQuickAdd: () => set({ quickAddOpen: false, quickAddType: null }),

  // Command palette
  commandPaletteOpen: false,
  toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
  setCommandPaletteOpen: (isOpen) => set({ commandPaletteOpen: isOpen }),

  // Active workout tracking
  activeWorkout: null,
  setActiveWorkout: (workout) => set({ activeWorkout: workout }),
  clearActiveWorkout: () => set({ activeWorkout: null }),

  // Date navigation
  selectedDate: new Date().toISOString().split('T')[0],
  setSelectedDate: (date) => set({ selectedDate: date }),

  // Toast queue (managed by react-hot-toast, but we track custom state here if needed)
}))

export default useStore
