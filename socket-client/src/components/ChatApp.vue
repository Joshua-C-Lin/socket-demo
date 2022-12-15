<template>
  <div v-if="!isJoin" class="chat-container">
    <div class="name-container">
      <input v-model.trim="currentUser" type="text" class="user-name" />
      <button class="join-button" @click="join">Join</button>
    </div>
  </div>
  <div v-else>
    <h1>Welcome {{ currentUser }}</h1>
    <div>
      <div class="list-message">
        <div v-for="item in messagesList" :key="item.id">
          <b>
            {{ item.user }}
          </b>
          : {{ item.text }}
        </div>
      </div>
      <textarea
        v-model.trim="textMsg"
        class="text-message"
        @keyup.enter="sendMessage"
      ></textarea>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";

export default {
  name: "ChatApp",
  data() {
    return {
      isJoin: false,
      currentUser: "",
      textMsg: "",
      messagesList: [],
    };
  },
  methods: {
    join() {
      this.isJoin = true;
      // let userName = this.currentUser;

      this.socketInstance = io("http://localhost:3000");
      var socket = io.connect("http://localhost:3000");

      this.socketInstance.on(
        // console.log(userName, "已登入！"),
        // alert("連線成功"),
        // 監聽 Server 傳來的 message:received 事件
        "message:received",
        (data) => {
          this.messagesList = this.messagesList.concat(data);
        }
      );
      socket.on("chat message", () => {
        console.log("連線成功！！！");
      });
      this.socketInstance.on("connection", (socket) => {
        socket.on("chat message", (msg) => {
          console.log("message: " + msg);
        });
      });
      // 連結成功通知
      socket.on("connect", () => {
        alert(this.currentUser + " 連線成功！");
        console.log(socket.id, "Connected!!!");
      });
    },
    sendMessage() {
      if (this.textMsg === "") {
        return;
      } else {
        console.log(this.textMsg);
        this.addMessage();
        this.textMsg = "";
      }
    },
    addMessage() {
      const message = {
        id: new Date().getTime(),
        text: this.textMsg,
        user: this.currentUser,
      };

      this.messagesList = this.messagesList.concat(message);

      // 把資料同步給 Server
      this.socketInstance.emit("message", message);
    },
  }
};
</script>

<style scoped>
::-webkit-scrollbar {
  display: none;
}
.name-container {
  display: flex;
  flex-direction: column;
}
.user-name {
  height: 30px;
  font-size: 20px;
  padding: 5px;
  margin-bottom: 5px;
  text-align: center;
  font-weight: bold;
}

.join-button {
  margin-top: 10px;
  font-size: 20px;
}

.text-message {
  min-width: 396px;
  min-height: 70px;
  position: absolute;
  top: 92%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.list-message {
  background-color: white;
  color: black;
  height: 55vh;
  width: 369px;
  padding: 15px;
  text-align: left;
  overflow: hidden;
  overflow-y: scroll;
}
</style>
