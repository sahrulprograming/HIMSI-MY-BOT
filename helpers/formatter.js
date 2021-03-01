const phoneNumberFormatter = function(number) {
    let formated = number.replace(/\D/g, '');
    if (formated.startsWith('0')) {
        formated = '62' + formated.substr(1)
    }
    if (formated.endsWith('@c.us')) {
        formated += '@c.us';
    }
    return formated;
}
module.exports = {
    phoneNumberFormatter
}