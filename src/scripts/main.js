import Vue from "../../node_modules/vue/dist/vue.common.js";
import io from "socket.io-client";

new Vue({
  el: "#app",
  data() {
    return {
      socket: null,
      nickname: null,
      coordinates: { x: 0, y: 0 },
      color: "black",
      remoteClients: []
    };
  },
  methods: {
    handleKeydown(event) {
      switch (event.key) {
        case "ArrowUp":
          console.log("Sending request to move up");
          this.socket.emit("move", "up");
          break;
        case "ArrowRight":
          console.log("Sending request to move right");
          this.socket.emit("move", "right");
          break;
        case "ArrowDown":
          console.log("Sending request to move down");
          this.socket.emit("move", "down");
          break;
        case "ArrowLeft":
          console.log("Sending request to move left");
          this.socket.emit("move", "left");
      }
    },
    serverConnected() {
      console.log("Connected to server.");
    },
    setNickname(nickname) {
      console.log("Server asks to set nickname.", nickname);
      this.nickname = nickname;
    },
    setCoordinates(coordinates) {
      console.log("Server asks to set coordinates.", coordinates);
      this.coordinates = coordinates;
    },
    setColor(color) {
      console.log("Server asks to set color.", color);
      this.color = color;
    },
    addRemoteClient(remoteClient) {
      if (remoteClient.nickname != this.nickname)
        this.remoteClients.push(remoteClient);
    },
    resetRemoteClients() {
      this.remoteClients = [];
    },
    setRemoteClientCoordinates(update) {
      const remoteClient = this.remoteClients.find(rc => {
        return rc.nickname === update.nickname;
      });

      remoteClient.coordinates = update.coordinates;
    },
    serverDisconnected(reason) {
      console.log("Disconnected from server.", reason);
    }
  },
  mounted() {
    this.socket = io("http://localhost:3000");

    this.socket.on("connect", this.serverConnected);
    this.socket.on("setNickname", this.setNickname);
    this.socket.on("setCoordinates", this.setCoordinates);
    this.socket.on("setColor", this.setColor);
    this.socket.on("addRemoteClient", this.addRemoteClient);
    this.socket.on("resetRemoteClients", this.resetRemoteClients);
    this.socket.on(
      "setRemoteClientCoordinates",
      this.setRemoteClientCoordinates
    );
    this.socket.on("disconnect", this.serverDisconnected);

    document.addEventListener("keydown", this.handleKeydown);
  }
});
