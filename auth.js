function validateLogin(email, password) {
    if (!email || !password) return false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) return false;

    if (password.length < 6) return false;

    return true;
}

module.exports = { validateLogin };