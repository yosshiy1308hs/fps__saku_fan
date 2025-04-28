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

// コメントを追加
submitBtn.addEventListener("click", () => {
    const comment = commentBox.value.trim();
    if (comment) {
        comments.push(comment);
        commentBox.value = "";
        renderComments();
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
