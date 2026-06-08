function login() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    if (user === "admin" && pass === "1234") {
        document.body.innerHTML = "<h1>Welcome Admin</h1>";
    } else {
        document.getElementById("msg").innerText =
            "Invalid username or password";
    }
}
