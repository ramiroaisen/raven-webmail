<style>
  @keyframes CircularProgressCircleIndeterminate{
    0% {
      stroke-dasharray: 1px, 200px;
      stroke-dashoffset: 0px;
    }
  
    50% {
        stroke-dasharray: 100px, 200px;
        stroke-dashoffset: -15px;
    }
  
    100% {
        stroke-dasharray: 100px, 200px;
        stroke-dashoffset: -125px;
    }
  }
  
  @keyframes CircularProgressRotate{
    100% {
      transform: rotate(360deg);
    }
  }
  
  .circular-progress{
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--progress-color, var(--red));
    animation: CircularProgressRotate 1.4s linear infinite;
  }
  
  .circle.indeterminate{
    animation: CircularProgressCircleIndeterminate 1.4s ease-in-out infinite;
    stroke-dasharray: 80px, 200px;
    stroke-dashoffset: 0px;
  }
  </style>
  
  <script lang="ts">
    export let size = "1em";
  </script>
  
  <div class="circular-progress">
    <svg viewBox="22 22 44 44" height={size} width={size}>
      <circle class="circle indeterminate" cx="44" cy="44" r="20.2" fill="none" stroke="currentColor" stroke-width="3.6"></circle>
    </svg>
  </div>