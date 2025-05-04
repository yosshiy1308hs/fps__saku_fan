import { supabaseClient } from './supabaseClient.js';

let heartCount = 0;
let starCount = 0;

const elements = {
    commentsList: document.getElementById("comments-list"),
    commentBox: document.getElementById("comment-box"),
    submitBtn: document.getElementById("submit-btn"),
    prevBtn: document.getElementById("prev-btn"),
    nextBtn: document.getElementById("next-btn"),
    pageNumber: document.getElementById("page-number"),
    heartCount: document.getElementById("heart-count"),
    starCount: document.getElementById("star-count"),
};

let comments = [];
let currentPage = 1;
const commentsPerPage = 5;

// ボタン押下回数を取得
async function fetchButtonCounts() {
    try {
        const { data, error } = await supabaseClient.from('button_counts').select('*');
        if (error) throw error;

        data.forEach(button => {
            if (button.button_name === 'heart') {
                heartCount = button.count;
                elements.heartCount.textContent = heartCount;
            } else if (button.button_name === 'star') {
                starCount = button.count;
                elements.starCount.textContent = starCount;
            }
        });
    } catch (error) {
        console.error('Error fetching button counts:', error);
    }
}

// ボタン押下回数を更新
async function updateButtonCount(buttonName) {
    try {
        const { data, error } = await supabaseClient
            .from('button_counts')
            .select('count')
            .eq('button_name', buttonName)
            .single();
        if (error) throw error;

        let currentCount = data.count >= 2147483647 ? 0 : data.count;

        const { error: updateError } = await supabaseClient
            .from('button_counts')
            .update({ count: currentCount + 1 })
            .eq('button_name', buttonName);
        if (updateError) throw updateError;

        // フロントエンドの表示を更新
        if (buttonName === 'heart') {
            heartCount = currentCount + 1;
            elements.heartCount.textContent = heartCount;
        } else if (buttonName === 'star') {
            starCount = currentCount + 1;
            elements.starCount.textContent = starCount;
        }
    } catch (error) {
        console.error('Error updating button count:', error);
    }
}

// コメントを取得
async function fetchComments() {
    try {
        const { data, error } = await supabaseClient
            .from('comments')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;

        comments = data.map(item => item.comment_text);
        renderComments();
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
}

// コメントを投稿
async function addComment(commentText) {
    try {
        const { error } = await supabaseClient
            .from('comments')
            .insert([{ comment_text: commentText }]);
        if (error) throw error;

        comments.unshift(commentText); // 新しいコメントを先頭に追加
        renderComments();
    } catch (error) {
        console.error('Error adding comment:', error);
    }
}

// コメントをレンダリング
function renderComments() {
    elements.commentsList.innerHTML = "";
    const startIndex = (currentPage - 1) * commentsPerPage;
    const endIndex = startIndex + commentsPerPage;
    const currentComments = comments.slice(startIndex, endIndex);

    currentComments.forEach(comment => {
        const li = document.createElement("li");
        li.textContent = comment;
        elements.commentsList.appendChild(li);
    });

    updatePagination();
}

// ページネーションの更新
function updatePagination() {
    elements.pageNumber.textContent = currentPage;
    elements.prevBtn.disabled = currentPage === 1;
    elements.nextBtn.disabled = currentPage * commentsPerPage >= comments.length;
}

// イベントリスナーの設定
elements.submitBtn.addEventListener("click", () => {
    const comment = elements.commentBox.value.trim();
    if (comment) {
        addComment(comment);
        elements.commentBox.value = "";
    }
});

elements.prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderComments();
    }
});

elements.nextBtn.addEventListener("click", () => {
    if (currentPage * commentsPerPage < comments.length) {
        currentPage++;
        renderComments();
    }
});

document.getElementById("heart-btn").addEventListener("click", () => {
    updateButtonCount('heart');
});

document.getElementById("star-btn").addEventListener("click", () => {
    updateButtonCount('star');
});

// ログインフォームの要素を取得
const loginForm = document.getElementById("login-form");
const authMessage = document.getElementById("auth-message");

// 初期データを取得
fetchButtonCounts();
fetchComments();
