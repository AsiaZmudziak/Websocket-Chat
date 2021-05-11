const socket = io();

const loginForm = document.getElementById('welcome-form'); //reference to login form
const messagesSection = document.getElementById('messages-section'); //reference to messages section
const messagesList = document.getElementById('messages-list'); //reference to messages list
const addMessageForm = document.getElementById('add-messages-form'); //reference to add message form
const userNameInput = document.getElementById('username'); //reference to text field from the login form
const messageContentInput = document.getElementById('message-content'); //reference to text field of the form for sending a message

let userName = ''; //global variable - user login

socket.on('message', ({ author, content }) => addMessage(author, content));

//login form

const login = event => {
  event.preventDefault();

  let name = userNameInput.value;

  if (!name.length) {
    alert('Enter your name');
  } else {
    userName = name;
    socket.emit('join', userName);
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
  }
};

loginForm.addEventListener('submit', event => {
  login(event);
});

//message form

const addMessage = (author, content) => {
  const message = document.createElement('li');

  message.classList.add('message');
  message.classList.add('message--received');

  if (author === userName) message.classList.add('message--self');
  message.innerHTML = `
      <h3 class="message__author">${userName === author ? 'You' : author}</h3>
      <div class="message__content">
        ${content}
      </div>
    `;
  messagesList.appendChild(message);
};

const sendMessage = event => {
  event.preventDefault();

  let messageContent = messageContentInput.value;

  if (!messageContent.length) {
    alert('Enter your message');
  } else {
    addMessage(userName, messageContent);
    socket.emit('message', { author: userName, content: messageContent });
    messageContentInput.value = '';
  }
};

addMessageForm.addEventListener('submit', event => {
  sendMessage(event);
});

