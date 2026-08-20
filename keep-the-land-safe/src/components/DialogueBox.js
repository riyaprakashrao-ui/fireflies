import React, { useState, useEffect } from 'react';

const DialogueBox = ({ text, onNext, onBack, showNext=true, style={}, characterName='Blaze', showName=true, image=null, imageSize=48, compact=false }) => {
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => { setDisplayed(''); setCharIdx(0); setTyping(true); }, [text]);

  useEffect(() => {
    if (charIdx < text.length) {
      const t = setTimeout(() => { setDisplayed(p=>p+text[charIdx]); setCharIdx(p=>p+1); }, 28);
      return () => clearTimeout(t);
    } else { setTyping(false); }
  }, [charIdx, text]);

  const handleClick = () => {
    if (typing) { setDisplayed(text); setCharIdx(text.length); setTyping(false); }
  };

  return (
    <div onClick={handleClick} style={{ background:'white', border:'3px solid #1F93BA', borderRadius:16, padding: compact ? '12px 16px' : '20px 26px', boxShadow:'0 6px 24px rgba(0,0,0,0.15)', cursor:'pointer', position:'relative', animation:'fadeInSoft 0.18s ease', ...style }}>
      {showName && <div style={{ position:'absolute', top:-17, left:18, background:'#1F93BA', color:'white', fontFamily:"'Fredoka One',cursive", fontSize:13, padding:'3px 12px', borderRadius:10, boxShadow:'0 2px 6px rgba(0,0,0,0.2)' }}>
        {characterName}
      </div>}
      <div style={{ display: image && imageSize >= 72 ? 'flex' : 'block', alignItems: 'center', gap: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {image && imageSize < 72 && (
            <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
              {image === 'back' ? (
                <div style={{ background:'#FE8340', border:'3px solid #CE600A', borderRadius:30, padding:'6px 18px', fontFamily:"'Fredoka One',cursive", fontSize:14, color:'white', display:'inline-block' }}>← Back</div>
              ) : image === 'next' ? (
                <div style={{ background:'#F819E7', borderRadius:18, padding:'5px 14px', fontFamily:"'Fredoka One',cursive", fontSize:15, color:'white', display:'inline-block' }}>Next ▶</div>
              ) : (
                <img src={image} alt="" style={{ width: imageSize, height: imageSize, objectFit: 'contain' }} />
              )}
            </div>
          )}
          <p style={{ fontFamily:"'Nunito',sans-serif", fontSize: compact ? 18 : 20, fontWeight:700, color:'#1a1a1a', lineHeight:1.5, minHeight: compact ? 0 : 50, margin:0, whiteSpace:'pre-wrap' }}>
            {displayed}
            {typing && <span style={{ display:'inline-block', width:2, height:16, background:'#1F93BA', marginLeft:2, animation:'pulse 0.5s ease infinite', verticalAlign:'middle' }}/>}
          </p>
        </div>
        {image && imageSize >= 72 && (
          <img src={image} alt="" style={{ width: imageSize, height: 'auto', objectFit: 'contain', flexShrink: 0 }} />
        )}
      </div>
      {!typing && showNext && (
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:12 }}>
          {/* Back button */}
          {onBack ? (
            <button onClick={(e) => { e.stopPropagation(); onBack(); }} style={{
              background: '#FE8340', border: 'none',
              borderRadius: 18, padding: '5px 14px',
              fontFamily: "'Fredoka One',cursive", fontSize: 15,
              color: 'white', cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            }}>◀ Back</button>
          ) : <div />}

          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            {/* Blue speaking dots */}
            <div style={{ display:'flex', gap:4 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width:8, height:8, borderRadius:'50%', background:'#1F93BA', animation:'speakPulse 1s ease-in-out infinite', animationDelay:`${i*0.25}s` }} />
              ))}
            </div>
            <button onClick={(e) => { e.stopPropagation(); if (onNext) onNext(); }} style={{
              background: '#F819E7', color: 'white',
              fontFamily: "'Fredoka One',cursive", fontSize: 15,
              padding: '5px 14px', borderRadius: 18, border: 'none',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)', cursor: 'pointer',
            }}>
              {onNext ? 'Next ▶' : 'Got it! ✓'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default DialogueBox;
