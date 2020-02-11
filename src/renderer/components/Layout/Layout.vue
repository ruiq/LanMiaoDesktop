<template>
  <v-app light style="background:#FAFAFA">
    <v-app-bar app dark dense>
      <v-spacer></v-spacer>
      <span class="title">车辆管理系统</span>
      <v-spacer></v-spacer>
      <v-btn style="-webkit-app-region: no-drag" icon @click.native.stop="winControl('minimize')">
        <v-icon>remove</v-icon>
      </v-btn>
      <v-btn
        style="-webkit-app-region: no-drag"
        icon
        @click.native.stop="winControl('maximize')"
        v-show="isMaximized"
      >
        <v-icon style="font-size: 20px;">filter_none</v-icon>
      </v-btn>
      <v-btn
        style="-webkit-app-region: no-drag"
        icon
        @click.native.stop="winControl('maximize')"
        v-show="!isMaximized"
      >
        <v-icon>crop_square</v-icon>
      </v-btn>
      <v-btn style="-webkit-app-region: no-drag" icon @click.native.stop="winControl('close')">
        <v-icon color="red">close</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container fluid fill-height grid-list-md>
        <router-view background-color="grey lighten-5"></router-view>
      </v-container>
    </v-content>
    <v-footer app fixed inset dark align-center>
      <span class="grey--text">&copy; 2020 贵港市恒安驾校</span>
      <v-spacer></v-spacer>
    </v-footer>
  </v-app>
</template>

<script>
const electron = require("electron");
const remote = electron.remote;

import { mapActions } from "vuex";
import { ipcRenderer } from "electron";
import Add from "../add/add";

export default {
  components: {
    Add
  },
  data: () => ({
    title: "恒安驾校",
    drawer: null,
    item: 0,
    items: [{ icon: "home", text: "首页", to: "/home" }],
    mini: false,
    right: null,
    // 是最大化
    isMaximized: false
  }),
  methods: {
    ...mapActions(["updateDialog"]),
    winControl(action) {
      const browserWindow = remote.getCurrentWindow();
      switch (action) {
        case "minimize":
          browserWindow.minimize();
          break;
        case "maximize":
          // if (this.isMaximized) {
          if (browserWindow.isMaximized()) {
            browserWindow.unmaximize();
          } else {
            if (this.isMaximized) {
              browserWindow.unmaximize();
            } else {
              browserWindow.maximize();
            }
          }
          // this.isMaximized = browserWindow.isMaximized()
          this.isMaximized = !this.isMaximized;

          break;
        case "close":
          browserWindow.close();
          break;
        default:
          break;
      }
    },
    logout() {
      ipcRenderer.send("openLoginWindow");
    }
  }
};
</script>

<style scoped lang="scss">
.primary--text {
  color: orange !important;
  caret-color: orange !important;
}

.nav-item-logout {
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
