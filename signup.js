import { supabaseClient } from './supabaseClient.js';

const signupForm = document.getElementById("signup-form");
const authMessage = document.getElementById("auth-message");

signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const { user, error } = await supabaseClient.auth.signUp({
            email,
            password,
        });

        if (error) {
            authMessage.textContent = "サインアップに失敗しました: " + error.message;
        } else {
            authMessage.textContent = "サインアップ成功！";
            console.log("サインアップユーザー:", user);
            window.location.href = "login.html"; // サインアップ成功後にログインページに遷移
        }
    } catch (err) {
        console.error("サインアップエラー:", err);
        authMessage.textContent = "エラーが発生しました。";
    }
});