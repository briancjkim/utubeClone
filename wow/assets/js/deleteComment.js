import axios from "axios";

const deleteBtns = document.querySelectorAll(".jsDeleteBtn");
const commentNumber = document.getElementById("jsCommentNumber");

const fakeDecreaseCount = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) - 1;
};

const fakeDeleteComment = commentId => {
  deleteBtns.forEach(btn => {
    if (btn.classList.contains(commentId)) {
      btn.parentElement.remove();
      fakeDecreaseCount();
    }
  });
};

const deleteComment = async commentId => {
  const videoId = window.location.href.split("/videos/")[1];
  const response = await axios({
    url: `/api/${videoId}/delete-comment`,
    method: "POST",
    data: {
      commentId
    }
  });
  console.log(response);
  if (response.status === 200) {
    fakeDeleteComment(commentId);
  }
};

const handleClick = event => {
  const { target } = event;
  console.log(target.classList[target.classList.length - 1]);
  const commentId = target.classList[target.classList.length - 1];
  deleteComment(commentId);
};

function init() {
  deleteBtns.forEach(deleteBtn => {
    deleteBtn.addEventListener("click", handleClick);
  });
}

if (deleteBtns) {
  init();
}
