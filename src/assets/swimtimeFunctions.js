
function swimtimeToInt(time) {
    let out = time.replace(/[\.|\:]/g, '');
    return out !== '' ? parseInt(out) : '';
}

function intToSwimtime(value) {
    if (value !== '') {
        let tmp = "000000" + value;
        let out = tmp.slice(-6, -4) + ":" + tmp.slice(-4, -2) + "." + tmp.slice(-2);
        return  out;
    } else {
        return '00:00.00';
    }
}

export { swimtimeToInt, intToSwimtime };
