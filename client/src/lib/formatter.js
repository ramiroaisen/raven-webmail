const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const days = ["dom", "lun", "mar", "mie", "jue", "vie", "sab"];
const pad = (n) => n.toString().padStart(2, "0");
export const date = (str) => {
    const now = new Date();
    const date = new Date(str);
    if (now.getFullYear() !== date.getFullYear())
        return `${months[date.getMonth()]} ${date.getFullYear()}`;
    if (now.getMonth() !== date.getMonth())
        return `${date.getDate()} ${months[date.getMonth()]}`;
    if (now.getDate() !== date.getDate()) {
        return `${days[date.getDay()]} ${date.getDate()}`;
    }
    return `${date.getHours()}:${pad(date.getMinutes())}`;
};
