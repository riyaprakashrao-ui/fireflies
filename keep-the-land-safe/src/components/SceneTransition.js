import React from 'react';
const SceneTransition = ({ active, color }) => (
    <div style={{ position:'fixed', inset:0, backgroundColor:color||'#2d5a1b', zIndex:9999, pointerEvents:active?'all':'none', opacity:active?1:0, transition:'opacity 0.28s ease', display:'flex', alignItems:'center', justifyContent:'center' }}>
    {active && <div style={{ fontSize:60 }}></div>}
  </div>
);
export default SceneTransition;
