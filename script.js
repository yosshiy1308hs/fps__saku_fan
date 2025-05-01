import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uiguxlwkoaclvugqwomw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpZ3V4bHdrb2FjbHZ1Z3F3b213Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MzM1NTAsImV4cCI6MjA2MTQwOTU1MH0.0Uz4BbXvOWCx8EHxN6whml3GprdYLeTpVevB6pM3fBk';
const supabase = createClient(supabaseUrl, supabaseKey);

let heartCount = 0;
let starCount = 0;

document.getElementById("heart-btn").addEventListener("click", () => {
    heartCount++;
    document.getElementById("heart-count").textContent = heartCount;
});

document.getElementById("star-btn").addEventListener("click", () => {
    starCount++;
    document.getElementById("star-count").textContent = starCount;
});

const commentsList = document.getElementById("comments-list");
const commentBox = document.getElementById("comment-box");
const submitBtn = document.getElementById("submit-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const pageNumber = document.getElementById("page-number");

let comments = []; // 全コメントを格納
let currentPage = 1;
const commentsPerPage = 5; // 1ページに表示するコメント数

// コメントを取得
async function fetchComments() {
    const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) console.error(error);
    else {
        comments = data.map(item => item.comment_text);
        renderComments();
    }
}

// コメントを投稿
async function addComment(commentText) {
    const { data, error } = await supabase
        .from('comments')
        .insert([{ comment_text: commentText }]);

    if (error) console.error(error);
    else {
        comments.push(commentText);
        renderComments();
    }
}

// コメントを追加
submitBtn.addEventListener("click", async () => {
    const comment = commentBox.value.trim();
    if (comment) {
        await addComment(comment);
        commentBox.value = "";
    }
});

// コメントをレンダリング
function renderComments() {
    commentsList.innerHTML = ""; // 現在のコメントをクリア
    const startIndex = (currentPage - 1) * commentsPerPage;
    const endIndex = startIndex + commentsPerPage;
    const currentComments = comments.slice(startIndex, endIndex);

    currentComments.forEach((comment) => {
        const li = document.createElement("li");
        li.textContent = comment;
        commentsList.appendChild(li);
    });

    updatePaginationButtons();
    updatePageNumber(); // ページ番号を更新
}

// ページ番号を更新
function updatePageNumber() {
    pageNumber.textContent = currentPage;
}

// ページングボタンの状態を更新
function updatePaginationButtons() {
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage * commentsPerPage >= comments.length;
}

// 前のページ
prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderComments();
    }
});

// 次のページ
nextBtn.addEventListener("click", () => {
    if (currentPage * commentsPerPage < comments.length) {
        currentPage++;
        renderComments();
    }
});

// 初期コメントを取得
fetchComments();
