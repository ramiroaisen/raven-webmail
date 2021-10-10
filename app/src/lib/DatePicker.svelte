<script lang="ts" context="module">
  const SECOND = 1000;
  const MINUTE = SECOND * 60;
  const HOUR = MINUTE * 60;
  const DAY = HOUR * 24;

  const startOfDay = (src: Date): Date => {
    let r = new Date(src);
    r.setHours(0);
    r.setMinutes(0);
    r.setSeconds(0);
    r.setMilliseconds(0);
    return r;
  } 
  
  const startOfMonth = (src: Date): Date => {
    let r = startOfDay(src);
    r.setDate(1);
    return r;
  }

  const days: Date[] = [];

  const currentDays = (date: Date) => {
    let d = new Date(date);
    d.setHours(12);
    d.setDate(1);
    const current: Date[] = [];
    const m = d.getMonth();
    while(d.getMonth() === m) {
      current.push(d);
      d = new Date(+d + DAY);
    }
    return current;
  }
  

  const leadingDays = (date: Date) => {
    let d = new Date(+startOfMonth(date) - DAY);
    d.setHours(12);
    let leading: Date[] = [];
    while(d.getDay() !== 6) {
      leading.push(d);
      d = new Date(+d - DAY);
    }

    return leading.reverse();
  }

  const trailingDays = (date: Date) => {
    let d = startOfMonth(nextMonth(date));
    d.setHours(12);
    const trailing: Date[] = [];
    while(d.getDay() !== 0) {
      trailing.push(d);
      d = new Date(+d + DAY);
    }

    return trailing;
  }

  const prevMonth = (date: Date): Date => {
    const d = new Date(date);
    if(d.getMonth() === 0) {
      d.setMonth(11);
      d.setFullYear(d.getFullYear() - 1);
    } else {
      d.setMonth(d.getMonth() - 1);
    }
    return d;
  }

  const nextMonth = (date: Date): Date => {
    const d = new Date(date);
    if(d.getMonth() === 11) {
      d.setMonth(0);
      d.setFullYear(d.getFullYear() + 1);
    } else {
      d.setMonth(d.getMonth() + 1);
    }

    return d;
  }

  const isSameDay = (d1: Date, d2: Date): boolean => {
    return d1.getFullYear() ===  d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  }

  const isSameMonth = (d1: Date, d2: Date): boolean => {
    return d1.getFullYear() ===  d2.getFullYear() &&
      d1.getMonth() === d2.getMonth();
  }

  const hashMonth = (date: Date) => {
    return `${date.getFullYear()}-${date.getMonth()}`;
  }

  const hashDay = (date: Date) => {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }
</script>

<script lang="ts">
  const start = new Date();
  start.setHours(0);
  start.setMinutes(0);
  start.setSeconds(0);
  start.setMilliseconds(0);

  export let date = startOfDay(start);
  let currentMonth = date;

  export let onDateSelected: (date: Date) => void = () => {};

  import ChevronLeft from "svelte-material-icons/ChevronLeft.svelte";
  import ChevronRight from "svelte-material-icons/ChevronRight.svelte";
  import Ripple from "./Ripple.svelte";

  const weekDays = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábabo",
  ];

  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiempre",
    "Octubre",
    "Noviembre",
    "Diciembre"
  ];

  type Days = {
    leading: Date[]
    current: Date[],
    trailing: Date[],
  }

  const listDays = (date: Date): Days => {
    const d = new Date(date);
    d.setDate(1);
    d.setHours(12);

    const leading = leadingDays(d);
    const current = currentDays(d);
    const trailing = trailingDays(d);
    
    return { leading, current, trailing };
  }

  const gotoPrevMonth = () => {
    currentMonth = prevMonth(currentMonth);
  }

  const gotoNextMonth = () => {
    currentMonth = nextMonth(currentMonth);
  }

  const selectDay = (day: Date) => {
    if(!isSameMonth(currentMonth, day)) {
      currentMonth = day;
    }
    date = startOfDay(day);
    onDateSelected(date);
  }

  let days: Days;
  $: days = listDays(currentMonth);
</script>

<style>
  .date-picker {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: rgba(0,0,0,0.4) 0 0 8px 0;
    border-radius: 0.25rem;
    padding: 1rem;
    color: #333;
    background: #fff;
  }

  .title-bar {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .title {
    font-size: 1.1rem;
    font-weight: 600;
    text-align: center;
    flex: 1;
    white-space: nowrap;
  }

  .prev, .next {
    font-size: 1.5rem;
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    border-radius: 50%;
  }

  .days-top {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
  }

  .days-top > div {
    width: 2.5rem;
    height: 2.5rem;
    text-align: center;
    font-size: 0.8em;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: normal;
  }

  .days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
  }

  .day {
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    border-radius: 50%;
    transition: background-color 250ms ease, color 250ms ease;
    font-weight: 500;
  }

  .day.current {
    background:var(--red);
    color: #fff;
  }

  .day.leading, .day.trailing {
    opacity: 0.6;
    font-weight: 400;
  }
</style>

<div class="date-picker">
  <div class="title-bar">
    <div class="prev btn-dark" on:click={gotoPrevMonth}>
      <ChevronLeft />
      <Ripple />
    </div>
    {#each [0] as _ (currentMonth.getMonth())}
      <div class="title">
        {months[currentMonth.getMonth()]} de {currentMonth.getFullYear()}
      </div>
    {/each}
    <div class="next btn-dark" on:click={gotoNextMonth}>
      <ChevronRight />
      <Ripple />
    </div>
  </div>
  <div class="days-top">
    {#each weekDays as weekDay}
      <div>{weekDay[0]}</div>
    {/each}
  </div>
  {#each [0] as _ (hashMonth(currentMonth))}
    <div class="days btn-dark">
      {#each days.leading as day}
        <div class="day leading" on:click={() => selectDay(day)} class:current={isSameDay(date, day)}>
          {day.getDate()}
          <Ripple />
        </div>
      {/each}
      {#each days.current as day}
        <div class="day btn-dark" on:click={() => selectDay(day)} class:current={isSameDay(date, day)}>
          {day.getDate()}
          <Ripple />
        </div>
      {/each}
      {#each days.trailing as day}
        <div class="day trailing btn-dark" on:click={() => selectDay(day)} class:current={isSameDay(date, day)}>
          {day.getDate()}
          <Ripple />
        </div>
      {/each}
    </div>
  {/each}
</div>