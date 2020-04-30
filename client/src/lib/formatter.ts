import {Locale} from "../../../src/i18n/types";

//const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
//const days = ["dom", "lun", "mar", "mie", "jue", "vie", "sab"]

const pad = (n: number) => n.toString().padStart(2, "0");

export const date = (str: string, locale: Locale) => {
  const now = new Date();
  const date = new Date(str);

  if(now.getFullYear() !== date.getFullYear())
    return `${locale.months[date.getMonth() as keyof typeof locale.months]} ${date.getFullYear()}`
  
  if(now.getMonth() !== date.getMonth())
    return `${date.getDate()} ${locale.months[date.getMonth() as keyof typeof locale.months]}`;

  if(now.getDate() !== date.getDate()){
    return `${locale.weekDays[date.getDay() as keyof typeof locale.weekDays]} ${date.getDate()}`;
  }

  return `${date.getHours()}:${pad(date.getMinutes())}`;
}