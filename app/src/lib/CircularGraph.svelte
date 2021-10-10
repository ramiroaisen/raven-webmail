<script lang="ts">
  export let start: number; // 0 to 1
  export let end: number; // 0 to 1
  export let width: number | null = null;
  export let height: number | null = null;
  export let strokeWidth = "var(--stroke-width, 5)";
  export let stroke = "var(--red)";
  export let fill = "transparent";

  const polarToCartesian = (cX, cY, radius, degrees) => {
      const radians = (degrees - 180) * Math.PI / 180;
      return {
          x: cX + (radius * Math.cos(radians)),
          y: cY + (radius * Math.sin(radians))
      }
  }

  const describeArc = (x, y, radius, startA, endA) => {
      const start = polarToCartesian(x, y, radius, endA)
      const end = polarToCartesian(x, y, radius, startA)

      const largeArcFlag = endA - startA <= 180 ? "0" : "1";

      return `
          M ${start.x}, ${start.y}
          A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}
      `;
  }
  
  $: d = describeArc(50, 50, 35, start * 360 + 90, end * 360 + 90);
</script>

<svg {height} {width} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
  <circle 
    style="
      stroke: rgba(0,0,0,0.075); stroke-width: {strokeWidth};
      fill: transparent"
    cx={50}
    cy={50}
    r={35}  
  />
  <path {d} style="stroke: {stroke}; fill: {fill}; stroke-width: {strokeWidth}; stroke-linecap: round;"></path>
</svg>