export const bodyParse = (res) => {
    const josonstr = '{ "' + res.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
    return josonstr;
}
