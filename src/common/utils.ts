export function generateUUID(){
    let d = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}

export function generateDate(time: number, format: (y, m, d, h, minute, s) => string) {
    let date = new Date(time);

    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let sm = m < 10 ? ('0' + m) : m;
    let d = date.getDate();
    let sd = d < 10 ? ('0' + d) : d;
    let h = date.getHours();
    let sh = h < 10 ? ('0' + h) : h;
    let minute = date.getMinutes();
    let sminute = minute < 10 ? ('0' + minute) : minute;
    let s = date.getSeconds();
    let ss = s < 10 ? ('0' + s) : s;
    return format(y, sm, sd, sh, sminute, ss);
}

export function genrateDate(time: number) {
    return generateDate(time, function (y, m, d, h, min, s) {
        return y + '/' + m + '/' + d+' ' + h + ':' + min + ':' + s;
    });
}
