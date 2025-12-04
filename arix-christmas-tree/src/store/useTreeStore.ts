import { create } from 'zustand'

export enum TreeMorphState {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE',
}

interface TreeStore {
  morphState: TreeMorphState
  morphProgress: number
  isTransitioning: boolean
  toggleMorphState: () => void
  setMorphProgress: (progress: number) => void
  setIsTransitioning: (transitioning: boolean) => void
}

export const useTreeStore = create<TreeStore>((set, get) => ({
  morphState: TreeMorphState.SCATTERED,
  morphProgress: 0,
  isTransitioning: false,
  toggleMorphState: () => {
    const current = get().morphState
    set({
      morphState: current === TreeMorphState.SCATTERED 
        ? TreeMorphState.TREE_SHAPE 
        : TreeMorphState.SCATTERED,
      isTransitioning: true,
    })
  },
  setMorphProgress: (progress) => set({ morphProgress: progress }),
  setIsTransitioning: (transitioning) => set({ isTransitioning: transitioning }),
}))
