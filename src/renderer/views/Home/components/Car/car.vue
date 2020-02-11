<template>
  <v-flex xs12 fill-height>
    <v-app-bar flat light d-flex class="mb-5">
      <v-icon class="pr-3">home</v-icon>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-toolbar-title>车辆信息</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-dialog v-model="dialog" max-width="600px">
        <template v-slot:activator="{ on }">
          <slot name="button">
            <v-btn text class="success" v-on="on">录入新车</v-btn>
          </slot>
        </template>
        <v-card>
          <v-card-title>{{formTitle}}</v-card-title>
          <v-card-text>
            <v-form ref="form" lazy-validation>
              <v-text-field
                label="车牌"
                v-model="editedItem.code"
                :rules="[() => !!editedItem.code || '车牌号不能为空']"
                required
              ></v-text-field>
              <v-text-field label="教练" v-model="editedItem.owner"></v-text-field>
              <v-autocomplete
                ref="car_type"
                v-model="editedItem.car_type"
                :items="typeList"
                label="培训车型"
                v-bind:placeholder="typeList[0]"
              ></v-autocomplete>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-flex class="d-flex justify-end">
              <v-btn text class="mx-3 mb-3" @click="close">取消</v-btn>
              <v-btn
                text
                class="success mx-3 mb-3"
                @click="save"
                :disabled="editedItem.code === ''"
              >保存</v-btn>
            </v-flex>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app-bar>

    <v-data-table
      :headers="headers"
      :items="allCars"
      :items-per-page="500"
      class="elevation-2"
      hide-default-footer
    >
      <template v-slot:top></template>
      <template v-slot:item.code="{ item }">
        <router-link :to="{'name':'car/detail','params':{id:item.id}}">{{item.code}}</router-link>
      </template>

      <template v-slot:item.bxdq_time="{ item }">
        <div :class="getColor(item.bxdq_time)">{{item.bxdq_time}}</div>
      </template>
      <template v-slot:item.action="{ item }">
        <v-btn depressed small class="mr-2 normal" @click="editItem(item)">编辑</v-btn>
        <v-btn depressed small @click="deleteItem(item)" class="error">删除</v-btn>
      </template>
      <template v-slot:no-data>没有数据</template>
      <template v-slot:item.lr_time="{ item }">{{ item.lr_time }}</template>
    </v-data-table>
  </v-flex>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      moment: this.$moment,
      dialog: false,
      typeList: [
        "C1",
        "C2",
        "B1",
        "B2",
        "D",
        "E",
        "F",
        "A1",
        "A2",
        "A3",
        "C3",
        "C4",
        "C5",
        "M",
        "N",
        "P"
      ],
      headers: [
        { text: "车牌", value: "code", align: "center" },
        { text: "教练", value: "owner", align: "center" },
        { text: "培训车型", value: "car_type", align: "center" },
        { text: "录入时间", value: "lr_time", align: "center" },
        { text: "保险到期时间", value: "bxdq_time", align: "center" },
        { text: "总维修费用", value: "totalWXCost", align: "center" },
        { text: "总保险费用", value: "totalBXCost", align: "center" },
        { text: "操作", value: "action", sortable: false, align: "center" }
      ],
      defaultItem: {
        car_type: "C1"
      },
      editedIndex: -1,
      editedItem: {
        code: "",
        owner: "",
        car_type: "C1",
        lr_time: ""
      },
      dialog: false
    };
  },
  methods: {
    ...mapActions(["addCar", "updateCar", "deleteCar"]),
    getColor(time) {
      let timeObj = new Date(time);
      let now = new Date();
      let diff = Math.abs(now.getTime() - timeObj.getTime());
      if (diff < 30 * 24 * 3600 * 1000) {
        return "error--text";
      } else if (diff < 60 * 24 * 3600 * 1000) {
        return "warning--text";
      }
      return "black--text";
    },
    carClick(item) {
      console.log("click", item);
      this.$router.push({ name: "car", params: item });
    },
    editItem(item) {
      this.editedIndex = this.cars.findIndex(n => n.id === item.id);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;

      console.log("edititem", item, this.cars, this.editedIndex);
    },

    deleteItem(item) {
      confirm("确定要删除 " + item.code + " ?") &&
        this.deleteCar(this.cars.find(n => n.id === item.id));
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      if (this.editedIndex > -1) {
        this.updateCar(this.editedItem);
      } else {
        this.editedItem.lr_time = this.$moment(new Date()).format("YYYY-MM-DD");
        this.editedItem.state = "正常";
        this.addCar(this.editedItem);
      }
      this.close();
    }
  },
  computed: {
    ...mapGetters(["allCars"]),
    formTitle() {
      return this.editedIndex === -1 ? "录入新车" : "编辑车辆";
    },

    cars() {
      return this.$store.state.car.cars;
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>