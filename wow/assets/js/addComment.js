import axios from "axios";

// Add
const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");
const loggedUserInfo = document.getElementById("loggedUserInfo");

const increaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};
const addComment = (comment, userId, userName, avatarUrl) => {
  const li = document.createElement("li");
  const a = document.createElement("a");
  const img = document.createElement("img");

  // avatar
  img.src = avatarUrl;
  img.className = "commentAvatar";
  a.href = `https://utubeclone.herokuapp.com/users/${userId}`;
  a.appendChild(img);
  const div = document.createElement("div");

  // comment wrapper
  div.className = "commentWrapper";
  const spanUsername = document.createElement("span");
  const spanText = document.createElement("span");
  spanUsername.innerHTML = userName;
  spanUsername.className = "commentUsername";
  spanText.innerHTML = comment;

  // append spans to div
  div.appendChild(spanUsername);
  div.appendChild(spanText);

  // append a and div to li
  li.appendChild(a);
  li.appendChild(div);

  // append li to ul
  commentList.prepend(li);

  increaseNumber();
};

const sendComment = async comment => {
  const videoId = window.location.href.split("/videos/")[1];
  const response = await axios({
    url: `/api/${videoId}/comment`,
    method: "POST",
    data: {
      comment
    }
  });
  if (response.status === 200) {
    const classLength = loggedUserInfo.classList.length;
    const userId = loggedUserInfo.classList[0];
    const userName = loggedUserInfo.classList[1];
    const avatarUrl = loggedUserInfo.classList[classLength - 1];
    addComment(comment, userId, userName, avatarUrl);
  }
};

const handleSubmit = event => {
  event.preventDefault();
  const commentInput = addCommentForm.querySelector("input");
  const comment = commentInput.value;

  sendComment(comment);
  commentInput.value = "";
};

function init() {
  addCommentForm.addEventListener("submit", handleSubmit);
}

if (addCommentForm) {
  init();
}
