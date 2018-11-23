function createBody(target, token) {
    return {
        "from": "Marea Unire Virtuala <noreply@mareaunirevirtuala.ro",
        "to": target,
        "subject": "Resetare parola",
        "text": "Acceseaza linkul",
        "html": `<b>Acceseaza linkul pentru a reseta parola <a href="www.mareaunirevirtuala.ro/reset-pass?token=${token}">Click aici</a> </b>`
    }
}

module.exports = createBody;