interface DiamondProps {
  className?: string;
  style?: React.CSSProperties;
}

  export function Diamond({ className = "", style }: DiamondProps) {
  return (
    <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="108 216 52 56" className={className} style={style}>
      <defs>
      </defs>
      <path className="cls-1" d="M134.96,219.3h-2.83s-.89,23.03-23.16,23.03v3.26c22.27,0,23.16,23.03,23.16,23.03h2.83s.89-23.03,23.16-23.03v-3.26c-22.27,0-23.16-23.03-23.16-23.03Z"/>
    </svg>
  )
}
