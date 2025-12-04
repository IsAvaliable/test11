import { useTreeStore, TreeMorphState } from '../store/useTreeStore'

export function UI() {
  const { morphState, toggleMorphState, isTransitioning } = useTreeStore()
  
  const isTreeShape = morphState === TreeMorphState.TREE_SHAPE
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '40px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
    }}>
      {/* Title */}
      <h1 style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: '28px',
        fontWeight: 300,
        color: '#FFD700',
        textShadow: '0 0 30px rgba(255, 215, 0, 0.5)',
        letterSpacing: '8px',
        textTransform: 'uppercase',
        margin: 0,
      }}>
        Arix Signature
      </h1>
      
      {/* Toggle Button */}
      <button
        onClick={toggleMorphState}
        disabled={isTransitioning}
        style={{
          padding: '16px 48px',
          fontSize: '14px',
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
          letterSpacing: '3px',
          textTransform: 'uppercase',
          color: isTreeShape ? '#0d4a3a' : '#FFD700',
          backgroundColor: isTreeShape ? '#FFD700' : 'transparent',
          border: '2px solid #FFD700',
          borderRadius: '0',
          cursor: isTransitioning ? 'wait' : 'pointer',
          transition: 'all 0.4s ease',
          opacity: isTransitioning ? 0.6 : 1,
        }}
        onMouseEnter={(e) => {
          if (!isTransitioning) {
            e.currentTarget.style.backgroundColor = isTreeShape ? '#FFC800' : 'rgba(255, 215, 0, 0.1)'
            e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.4)'
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = isTreeShape ? '#FFD700' : 'transparent'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        {isTreeShape ? 'Scatter' : 'Assemble'}
      </button>
      
      {/* Subtitle */}
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '11px',
        color: 'rgba(255, 215, 0, 0.5)',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        margin: 0,
      }}>
        Interactive Christmas Tree
      </p>
    </div>
  )
}
