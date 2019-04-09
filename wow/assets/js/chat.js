// make connection from client
const serverUrl = process.env.PRODUCTION
  ? "https://utubeclone.herokuapp.com/"
  : "http://localhost:4000";
const socket = io.connect(serverUrl);
const chatButton = document.querySelector(".chat-button-container");
const closeButton = document.querySelector(".chat-close");
const sendButton = document.querySelector(".sendMessage");
const handle = document.querySelector(".handle");
const message = document.querySelector(".message");
const chat = document.querySelector(".chat");
const output = document.querySelector(".output");
const feedback = document.querySelector(".feedback");
const chatWindow = document.querySelector(".chat-window");

const handleChatButtonClick = () => {
  chat.classList.toggle("active");
};

const handleCloseButtonClick = () => {
  chat.classList.toggle("active");
};

const handleSendButtonClick = () => {
  if (message.value !== "") {
    socket.emit("chat", {
      handle: handle.value,
      message: message.value
    });
    message.value = "";
  }
};

const handleMessageTyping = e => {
  socket.emit("typing", handle.value);
  if (e.keyCode === 13) {
    if (message.value !== "") {
      e.preventDefault();
      sendButton.click();
    }
  }
};

// chat window scroll to bottom
const updateScroll = () => {
  chatWindow.scrollTop = chatWindow.scrollHeight;
};

function init() {
  chatButton.addEventListener("click", handleChatButtonClick);
  closeButton.addEventListener("click", handleCloseButtonClick);
  sendButton.addEventListener("click", handleSendButtonClick);
  message.addEventListener("keypress", handleMessageTyping);

  // socket event Listeners
  socket.on("chat", data => {
    feedback.innerHTML = "";
    const newElement = `<p>
    <strong>${data.handle}</strong>
    ${data.message}
  </p>`;
    output.innerHTML += newElement;
    // fix scroll to the bottom
    updateScroll();
  });
  socket.on("typing", data => {
    feedback.innerHTML = `<p><em>${data} is typing...</em></p>`;
  });
}

if (chatButton) {
  init();
}
