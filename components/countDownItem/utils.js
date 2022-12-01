 const SECOND = 1000;
 const MINUTE = SECOND * 60;
 const HOUR = MINUTE * 60;
 const DAY = HOUR * 24;
 export function formatTime(time){
    let day = Math.floor(time / DAY);
    let hour = Math.floor(time % DAY / HOUR);
    let minute = Math.floor(time % HOUR / MINUTE);
    let second = Math.floor(time % MINUTE / SECOND);
    return {
        day,
        hour,
        minute,
        second
    }
 }