const socketChat = io();

// CHAT

//START utility functions
const getHtml = (template) => template.join("\n");

const renderMeMessage = (message) => {
  const html = getHtml([
    '<div class="app-chat__messages-me">',
    '<div class="app-chat__messages-me-box">',
    '<span class="app-chat__messages-me-box--name">Me</span>',
    `<span class="app-chat__messages-me-box--text">${message}</span>`,
    "</div>",
    "</div>",
  ]);
  return html;
};

const renderUserMessage = (username, message) => {
  const html = getHtml([
    '<div class="app-chat__messages-user">',
    '<div class="app-chat__messages-user-box">',
    `<span class="app-chat__messages-me-box--name">${username}</span>`,
    `<span class="app-chat__messages-me-box--text">${message}</span>`,
    "</div>",
    "</div>",
  ]);
  return html;
};

//END utility functions

let user;

//DOM elemets
const chatBox = document.getElementById("chat-box");
const messagesBox = document.getElementById("messages-box");

//Toast
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 5000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

//Authentification
fetch("http://localhost:8080/api/sessions/current")
  .then((response) => response.json())
  .then((result) => {
    const { firstName, lastName } = result.payload;
    const user = firstName + " " + lastName;

    socketChat.emit("login", user);
  });

//Socket logic

//Socket Emitters

chatBox.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    if (chatBox.value.trim().length) {
      socketChat.emit("message", { user: user, message: chatBox.value });
      chatBox.value = "";
    }
  }
});

//Socket listeners

socketChat.on("welcome", (user) => {
  Toast.fire({
    icon: "success",
    title: `Welcome ${user}!`,
  });
});

socketChat.on("new-user", (user) => {
  Toast.fire({
    icon: "info",
    title: `${user} is online`,
  });
});

socketChat.on("message-logs", (data) => {
  const html = getHtml(
    data.map((item) => {
      if (item.user === user) {
        return renderMeMessage(item.message);
      } else {
        return renderUserMessage(item.user, item.message);
      }
    })
  );
  messagesBox.innerHTML = html;
});
