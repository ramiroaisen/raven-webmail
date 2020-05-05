<script>
    export let start; // 0 to 1
    export let end; // 0 to 1
    export let width = null;
    export let height = null;

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

    let d;
    $: d = describeArc(start * 180, end * 180);
</script>

<svg {height} {width} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
    <slot />
</svg>