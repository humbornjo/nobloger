const ROWS = 3;
const DURATION = 15000;

export function LerpRand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function Shuffle(arr: string[]): string[] {
  return [...arr].sort(() => .5 - Math.random());
}

export function TagPalette(tagName: string) {

}

const InfiniteLoopSlider = ({ children, duration, reverse = false }) => {
  return (
    <div className= 'loop-slider' style = {{
    '--duration': `${duration}ms`,
      '--direction': reverse ? 'reverse' : 'normal'
  }
}>
  <div className='inner' >
    { children }
{ children }
</div>
  </div>
  );
};

