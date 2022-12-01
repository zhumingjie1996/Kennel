 const SECOND = 1000;
 const MINUTE = SECOND * 60;
 const HOUR = MINUTE * 60;
 const DAY = HOUR * 24;
 export function formatTimeInterval(time){
    let day = Math.floor(time / DAY);
    let hour = Math.floor(time % DAY / HOUR);
    let minute = Math.floor(time % HOUR / MINUTE);
    let second = Math.floor(time % MINUTE / SECOND);
    return {
        day:day < 10 ? ('0' + day) : day,
        hour:hour < 10 ? ('0' + hour) : hour,
        minute: minute < 10 ? ('0' + minute) : minute,
        second:second < 10 ? ('0' + second) : second
    }
 }