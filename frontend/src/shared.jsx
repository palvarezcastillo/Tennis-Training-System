import React from 'react'

export const TennisPlayer = ({ size = 100, color = "#d4501a", opacity = 1 }) => (
  <svg width={size} height={size * 1.4} viewBox="0 0 80 112" fill="none" xmlns="http://www.w3.org/2000/svg" style={{opacity}}>
    <circle cx="44" cy="11" r="9" fill={color}/>
    <ellipse cx="44" cy="5" rx="8" ry="4" fill={color} opacity="0.55"/>
    <path d="M44 20 C40 28 37 38 36 50 L52 50 C51 38 48 28 44 20Z" fill={color} opacity="0.9"/>
    <path d="M50 28 L65 18 L72 16" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
    <ellipse cx="75" cy="12" rx="6" ry="8" stroke={color} strokeWidth="2.5" fill="none"/>
    <line x1="75" y1="5" x2="75" y2="19" stroke={color} strokeWidth="0.8" opacity="0.5"/>
    <line x1="69.5" y1="8" x2="80.5" y2="8" stroke={color} strokeWidth="0.8" opacity="0.5"/>
    <line x1="69.5" y1="12" x2="80.5" y2="12" stroke={color} strokeWidth="0.8" opacity="0.5"/>
    <line x1="69.5" y1="16" x2="80.5" y2="16" stroke={color} strokeWidth="0.8" opacity="0.5"/>
    <path d="M38 28 L24 40 L18 46" stroke={color} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M36 50 L30 72 L24 90" stroke={color} strokeWidth="5.5" strokeLinecap="round"/>
    <path d="M52 50 L56 72 L62 90" stroke={color} strokeWidth="5.5" strokeLinecap="round"/>
    <ellipse cx="19" cy="92" rx="7" ry="3" fill={color} opacity="0.85"/>
    <ellipse cx="67" cy="92" rx="7" ry="3" fill={color} opacity="0.85"/>
    <circle cx="19" cy="50" r="5" fill="#c8e040" opacity="0.95"/>
    <path d="M16 47 Q19 50 22 47" stroke="#90a820" strokeWidth="1" fill="none"/>
    <path d="M16 53 Q19 50 22 53" stroke="#90a820" strokeWidth="1" fill="none"/>
  </svg>
);

export const RingChart = ({ value, max, color, size = 64, strokeWidth = 7, children }) => {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  const dash = pct * circ;
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#2a1808" strokeWidth={strokeWidth}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`} style={{transition:'stroke-dasharray 0.8s ease'}}/>
      {children}
    </svg>
  );
};

export const MiniBar = ({ value, max, color = "#d4501a" }) => (
  <div style={{ background: '#2a1808', borderRadius: 4, height: 6, overflow: 'hidden' }}>
    <div style={{ width: `${Math.min(100, (value/max)*100)}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 0.8s ease' }}/>
  </div>
);

const ICONS = {
  home: <><path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z" strokeWidth="2" strokeLinejoin="round" fill="none"/></>,
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" fill="none"/><path d="M3 9H21M8 2V6M16 2V6" strokeWidth="2" strokeLinecap="round"/></>,
  dumbbell: <><path d="M6 5V19M18 5V19" strokeWidth="2.5" strokeLinecap="round"/><path d="M3 8H9M15 8H21M3 16H9M15 16H21" strokeWidth="2.5" strokeLinecap="round"/><path d="M9 5H15M9 19H15" strokeWidth="3" strokeLinecap="round"/></>,
  utensils: <><path d="M3 2V8C3 10.2 4.8 12 7 12V22M7 2V12" strokeWidth="2" strokeLinecap="round"/><path d="M21 2C21 2 19 6 19 10C19 13.5 21 14 21 14V22" strokeWidth="2" strokeLinecap="round"/><path d="M17 2C17 2 19 6 19 10" strokeWidth="2" strokeLinecap="round"/></>,
  chart: <><path d="M3 20H21" strokeWidth="2" strokeLinecap="round"/><path d="M5 20V14L9 10L13 14L17 7L21 11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></>,
  moon: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" strokeWidth="2" fill="none"/>,
  heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeWidth="2" fill="none"/>,
  star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" strokeWidth="2" fill="none"/>,
  plus: <path d="M12 5V19M5 12H19" strokeWidth="2.5" strokeLinecap="round"/>,
  check: <path d="M20 6L9 17L4 12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
  bolt: <path d="M13 2L4.09 12.97H12L11 22L19.91 11.03H12L13 2Z" strokeWidth="2" strokeLinejoin="round" fill="none"/>,
  drop: <path d="M12 2C12 2 4 10.1 4 14.5C4 18.6 7.6 22 12 22C16.4 22 20 18.6 20 14.5C20 10.1 12 2 12 2Z" strokeWidth="2" fill="none"/>,
  trophy: <><path d="M7 3H17V13C17 16.3 14.8 19 12 19C9.2 19 7 16.3 7 13V3Z" strokeWidth="2" fill="none"/><path d="M17 5H20C20 8 18.5 10 17 11M7 5H4C4 8 5.5 10 7 11" strokeWidth="2" strokeLinecap="round"/><path d="M12 19V22M9 22H15" strokeWidth="2" strokeLinecap="round"/></>,
  brain: <><path d="M9.5 2C8 2 6.5 3 6.5 4.5C5 4.5 3.5 5.8 3.5 7.5C2.5 8 2 9.3 2 10.5C2 13.5 4.5 16 7.5 16H16.5C19.5 16 22 13.5 22 10.5C22 9.3 21.5 8 20.5 7.5C20.5 5.8 19 4.5 17.5 4.5C17.5 3 16 2 14.5 2C13.5 2 12.5 2.5 12 3.2C11.5 2.5 10.5 2 9.5 2Z" strokeWidth="1.8" fill="none"/><path d="M12 3.2V16M8 6.5C8 8 10 9 12 9M16 6.5C16 8 14 9 12 9" strokeWidth="1.5" strokeLinecap="round"/></>,
  racket: <><ellipse cx="9" cy="9" rx="6" ry="7" strokeWidth="2" fill="none"/><line x1="9" y1="3" x2="9" y2="15" strokeWidth="1.5" opacity="0.6"/><line x1="3.5" y1="6" x2="14.5" y2="6" strokeWidth="1.5" opacity="0.6"/><line x1="3.5" y1="9" x2="14.5" y2="9" strokeWidth="1.5" opacity="0.6"/><line x1="3.5" y1="12" x2="14.5" y2="12" strokeWidth="1.5" opacity="0.6"/><path d="M12 15L18 21" strokeWidth="2.5" strokeLinecap="round"/></>,
  fire: <path d="M12 2C8 6 6 10 8 14C6 13 4.5 11 4.5 9C3 11 3 14 3 16C3 19.3 7.1 22 12 22C16.9 22 21 19.3 21 16C21 11 17 7 12 2Z" strokeWidth="2" fill="none"/>,
  chevronRight: <path d="M9 18L15 12L9 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
  target: <><circle cx="12" cy="12" r="10" strokeWidth="2" fill="none"/><circle cx="12" cy="12" r="6" strokeWidth="2" fill="none"/><circle cx="12" cy="12" r="2" strokeWidth="2" fill="none"/></>,
  sleep: <><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" strokeWidth="2" fill="none"/></>,
  zap: <path d="M13 2L4.09 12.97H12L11 22L19.91 11.03H12L13 2Z" strokeWidth="2" strokeLinejoin="round" fill="none"/>,
  info: <><circle cx="12" cy="12" r="10" strokeWidth="2" fill="none"/><path d="M12 8V12M12 16H12.01" strokeWidth="2" strokeLinecap="round"/></>,
  edit: <><path d="M11 4H4C3.4 4 3 4.4 3 5V20C3 20.6 3.4 21 4 21H19C19.6 21 20 20.6 20 20V13" strokeWidth="2" strokeLinecap="round"/><path d="M18.5 2.5L21.5 5.5L12 15L9 15L9 12L18.5 2.5Z" strokeWidth="2" strokeLinejoin="round" fill="none"/></>,
  refresh: <path d="M23 4V10H17M1 20V14H7M20.49 9A9 9 0 1 0 21.99 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
};

export const Icon = ({ name, size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}>
    {ICONS[name] || ICONS.info}
  </svg>
);
