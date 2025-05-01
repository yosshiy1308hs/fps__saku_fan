const supabaseUrl = 'https://uiguxlwkoaclvugqwomw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpZ3V4bHdrb2FjbHZ1Z3F3b213Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MzM1NTAsImV4cCI6MjA2MTQwOTU1MH0.0Uz4BbXvOWCx8EHxN6whml3GprdYLeTpVevB6pM3fBk';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

let heartCount = 0;
let starCount = 0;

const commentsList = document.getElementById("comments-list");
const commentBox = document.getElementById("comment-box");
const submitBtn = document.getElementById("submit-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const pageNumber = document.getElementById("page-number");

let comments = [];
let currentPage = 1;
const commentsPerPage = 5;

// ボタン押下回数を取得
async function fetchButtonCounts() {
    const { data, error } = await supabaseClient
        .from('button_counts')
        .select('*');

    if (error) {
        console.error(error);
    } else {
        data.forEach(button => {
            if (button.button_name === 'heart') {
                heartCount = button.count;
                document.getElementById("heart-count").textContent = heartCount;
            } else if (button.button_name === 'star') {
                starCount = button.count;
                document.getElementById("star-count").textContent = starCount;
            }
        });
    }
}

// ボタン押下回数を更新
async function updateButtonCount(buttonName) {
    const { data, error } = await supabaseClient
        .from('button_counts')
        .update({ count: supabaseClient.raw('count + 1') })
        .eq('button_name', buttonName);

    if (error) {
        console.error(error);
    } else {
        if (buttonName === 'heart') {
            heartCount++;
            document.getElementById("heart-count").textContent = heartCount;
        } else if (buttonName === 'star') {
            starCount++;
            document.getElementById("star-count").textContent = starCount;
        }
    }
}

document.getElementById("heart-btn").addEventListener("click", () => {
    updateButtonCount('heart');
});

document.getElementById("star-btn").addEventListener("click", () => {
    updateButtonCount('star');
});

// コメントを取得
async function fetchComments() {
    const { data, error } = await supabaseClient
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
    const { data, error } = await supabaseClient
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
    commentsList.innerHTML = "";
    const startIndex = (currentPage - 1) * commentsPerPage;
    const endIndex = startIndex + commentsPerPage;
    const currentComments = comments.slice(startIndex, endIndex);

    currentComments.forEach((comment) => {
        const li = document.createElement("li");
        li.textContent = comment;
        commentsList.appendChild(li);
    });

    updatePaginationButtons();
    updatePageNumber();
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

// 初期データを取得
fetchButtonCounts();
fetchComments();
