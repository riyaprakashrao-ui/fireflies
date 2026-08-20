import React, { useState } from 'react';
const PlayButton = ({ onClick, label='PLAY!', size='large', color='#F5C518', borderColor, textColor, icon }) => {
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const sizes = { large:{fontSize:'30px',padding:'18px 56px',borderRadius:'50px',minWidth:'200px'}, medium:{fontSize:'20px',padding:'13px 36px',borderRadius:'40px',minWidth:'150px'}, small:{fontSize:'15px',padding:'9px 24px',borderRadius:'30px',minWidth:'110px'} };
  const s = sizes[size]||sizes.large;
  const bColor = borderColor || '#8B6914';
  const tColor = textColor || '#1a1a1a';
  return (
    <button onClick={onClick} onMouseDown={()=>setPressed(true)} onMouseUp={()=>setPressed(false)} onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>{setHovered(false);setPressed(false);}}
      style={{ background:pressed?`${color}AA`:hovered?`${color}DD`:color, border:`4px solid ${bColor}`, borderBottom:pressed?`4px solid ${bColor}`:`8px solid ${bColor}`, borderRadius:s.borderRadius, padding:s.padding, fontSize:s.fontSize, fontFamily:"'Fredoka One',cursive", color:tColor, cursor:'pointer', transform:pressed?'translateY(4px) scale(0.97)':hovered?'translateY(-4px) scale(1.05)':'scale(1)', transition:'all 0.15s ease', boxShadow:pressed?'0 2px 8px rgba(0,0,0,0.3)':'0 8px 20px rgba(0,0,0,0.3)', animation:'none', minWidth:s.minWidth, display:'flex', alignItems:'center', justifyContent:'center', gap:icon?10:0, outline:'none', letterSpacing:1 }}>
      {icon && <span>{icon}</span>}{label}
    </button>
  );
};
export default PlayButton;
