<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on }">
      <slot name="button">
        <v-btn text class="success" v-on="on">录入新车</v-btn>
      </slot>
    </template>
    <v-card>
      <v-card-title>{{formTitle}}</v-card-title>\
      <v-card-text>
        <v-form>
          <v-text-field label="车牌" v-model="editedItem.code"></v-text-field>
          <v-text-field label="教练" v-model="editedItem.owner"></v-text-field>
          <v-text-field label="培训车型" v-model="editedItem.car_type"></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-flex class="d-flex justify-end">
          <v-btn text class="mx-3 mb-3" @click="close">取消</v-btn>
          <v-btn text class="success mx-3 mb-3" @click="submit">保存</v-btn>
        </v-flex>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "录入新车" : "编辑车辆";
    }
  },
  data() {
    return {
      editedIndex: -1,
      editedItem: {
        code: "",
        owner: "",
        car_type: ""
      },
      dialog: false
    };
  },
  methods: {
    submit() {
      console.log(this.editedItem);
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
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