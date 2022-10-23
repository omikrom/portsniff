const notPwned = require('not-pwned');

passwordBreach = async (password) => {

    let status = {
        password: "",
        safety: true,
    }
    try {
        console.log('passwordBreach');
        console.log('password:', password);
        await notPwned(password).then((result) => {
            console.log('result', result);
            if (result) {
                console.log('password has not been found and is unsafe');
                status.password = password;
                status.safety = true;
                return status;
            } else {
                console.log('password has been found and is unsafe');
                status.password = password;
                status.safety = false;
                return status;
            }
        }
        ).catch((err) => {
            console.log('err', err);
            return err;
        });
    } catch (err) {
        console.log('err', err);
        return err;
    }

    return status;
}


/*
notPwned("123456").then(answer => {
    if (answer === true) {
        //return "Password has been pwned"
        console.log('Good news — no pwnage found! This password wasn\'t found in any of the Pwned Passwords loaded into Have I been pwned.')
    } else {
        console.log('Oh no — pwned! This password was found ' + answer + ' times... you should probably change it!')
        //return "Password has not been pwned"
    }
});*/

module.exports = passwordBreach;