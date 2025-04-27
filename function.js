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

document.getElementById("submit-btn").addEventListener("click", () => {
    const comment = document.getElementById("comment-box").value;
    const commentList = document.getElementById("comments-list");

    if (comment.trim() !== "") {
        const listItem = document.createElement("li");
        listItem.textContent = comment;
        commentList.appendChild(listItem);
        document.getElementById("comment-box").value = "";
    }
});
