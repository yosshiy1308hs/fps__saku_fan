import { supabaseClient } from './supabaseClient.js';

const loginForm = document.getElementById("login-form");
const authMessage = document.getElementById("auth-message");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const { user, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            authMessage.textContent = "ログインに失敗しました: " + error.message;
        } else {
            authMessage.textContent = "ログイン成功！";
            console.log("ログインユーザー:", user);
            window.location.href = "index.html"; // ログイン成功後にトップページに遷移
        }
    } catch (err) {
        console.error("ログインエラー:", err);
        authMessage.textContent = "エラーが発生しました。";
    }
});