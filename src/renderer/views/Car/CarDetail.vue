<template>
  <v-flex xs12 fill-height>
    <v-app-bar flat light d-flex>
      <v-icon large @click="$router.back()">navigate_before</v-icon>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-toolbar-title>
        <div>{{detailData.code}}</div>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div>{{detailData.owner}}</div>
      <v-divider class="mx-2" inset vertical></v-divider>
      <div>{{detailData.car_type}}</div>
    </v-app-bar>
    <div class="pa-3 pb-0">
      <v-data-table
        :headers="weixiu.headers"
        :items="wxData"
        :items-per-page="500"
        class="elevation-2"
        hide-default-footer
      >
        <template v-slot:item.cost="{ item }">
          <div>{{item.cost + '元'}}</div>
        </template>

        <template v-slot:item.action="{ item }">
          <v-icon small class="mr-2" @click="editWXRecord(item)">edit</v-icon>
          <v-icon small @click="removeRecord(item)">delete</v-icon>
        </template>

        <template slot="footer" align-end>
          <v-toolbar flat>
            <div class="align-items:right">记录总数：{{wxData.length}}</div>
            <v-spacer></v-spacer>
            <div class="align-items:right">
              费用合计：
              <span class="primary--text">{{wxTotalCost}}</span>元
            </div>
          </v-toolbar>
        </template>

        <template v-slot:top>
          <v-toolbar flat>
            <div class="title mb-1">维修记录</div>
            <v-spacer></v-spacer>

            <v-dialog v-model="weixiu.dialog" max-width="600px" @input="v => v || close()">
              <template v-slot:activator="{ on }">
                <slot name="button">
                  <v-btn text v-on="on" color="primary">添加维修记录</v-btn>
                </slot>
              </template>
              <v-card>
                <v-card-title>维修记录</v-card-title>
                <v-card-text>
                  <v-form>
                    <v-menu
                      v-model="weixiu.datePickerDialog"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="weixiu.editObject.wx_time"
                          label="选择维修时间"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="weixiu.editObject.wx_time"
                        locale="zh-cn"
                        @change="datePicked"
                        no-title
                        scrollable
                      ></v-date-picker>
                    </v-menu>
                    <v-text-field
                      label="费用"
                      v-model="weixiu.editObject.cost"
                      prefix="￥"
                      :rules="[() => !!weixiu.editObject.cost || '字段值不能为空']"
                      required
                    ></v-text-field>
                    <v-combobox v-model="weixiu.editObject.operator" label="经办人" :items="persons"></v-combobox>
                    <v-combobox v-model="weixiu.editObject.target" label="维修单位" :items="wxTargets"></v-combobox>
                    <v-textarea label="维修明细" v-model="weixiu.editObject.detail"></v-textarea>
                    <v-textarea label="备注" v-model="weixiu.editObject.memo"></v-textarea>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-flex class="d-flex justify-end">
                    <v-btn text class="mx-3 mb-3" @click="close">取消</v-btn>
                    <v-btn
                      text
                      class="success mx-3 mb-3"
                      @click="saveRecord(0,weixiu.editObject)"
                    >保存</v-btn>
                  </v-flex>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:no-data>没有数据</template>
      </v-data-table>
    </div>

    <div class="pa-3">
      <v-data-table
        :headers="baoxian.headers"
        :items="bxData"
        :items-per-page="500"
        class="elevation-4"
        hide-default-footer
      >
        <template v-slot:item.action="{ item }">
          <v-icon small class="mr-2" @click="editBXRecord(item)">edit</v-icon>
          <v-icon small @click="removeRecord(item)">delete</v-icon>
        </template>
        <template slot="footer" align-end>
          <v-toolbar flat>
            <div class="align-items:right">记录总数：{{bxData.length}}</div>
            <v-spacer></v-spacer>
            <div class="align-items:right">
              费用合计：
              <span class="primary--text">{{bxTotalCost}}</span>元
            </div>
          </v-toolbar>
        </template>
        <template v-slot:top>
          <v-toolbar flat>
            <div class="title mb-1 mt-3">保险记录</div>
            <v-spacer></v-spacer>

            <v-dialog v-model="baoxian.dialog" max-width="600px">
              <template v-slot:activator="{ on }">
                <slot name="button">
                  <v-btn text v-on="on" color="primary">添加保险记录</v-btn>
                </slot>
              </template>
              <v-card>
                <v-card-title>保险记录</v-card-title>
                <v-card-text>
                  <v-form>
                    <v-menu
                      v-model="baoxian.datePickerDialog"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="baoxian.editObject.buy_time"
                          label="保险购买时间"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="baoxian.editObject.buy_time"
                        locale="zh-cn"
                        @change="datePicked"
                        no-title
                        scrollable
                      ></v-date-picker>
                    </v-menu>
                    <v-menu
                      v-model="baoxian.dueDatePickerDialog"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="baoxian.editObject.due_time"
                          label="保险过期时间"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="baoxian.editObject.due_time"
                        locale="zh-cn"
                        @change="datePicked"
                        no-title
                        scrollable
                      ></v-date-picker>
                    </v-menu>
                    <v-text-field
                      label="费用"
                      v-model="baoxian.editObject.cost"
                      prefix="￥"
                      :rules="[() => !!baoxian.editObject.cost || '字段值不能为空']"
                      required
                    ></v-text-field>
                    <v-combobox v-model="baoxian.editObject.operator" label="经办人" :items="persons"></v-combobox>
                    <v-combobox v-model="baoxian.editObject.target" label="保险公司" :items="bxTargets"></v-combobox>
                    <v-textarea label="保单明细" v-model="baoxian.editObject.detail"></v-textarea>
                    <v-textarea label="备注" v-model="baoxian.editObject.memo"></v-textarea>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-flex class="d-flex justify-end">
                    <v-btn text class="mx-3 mb-3" @click="close">取消</v-btn>
                    <v-btn
                      text
                      class="success mx-3 mb-3"
                      @click="saveRecord(1,baoxian.editObject)"
                    >保存</v-btn>
                  </v-flex>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:no-data>没有数据</template>
      </v-data-table>
    </div>
  </v-flex>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      car: {},
      weixiu: {
        dialog: false,
        datePickerDialog: false,
        targetListDialog: false,
        editObject: {},
        headers: [
          { text: "维修时间", value: "wx_time", align: "center" },
          { text: "维修单位", value: "target", align: "center" },
          {
            text: "维修明细",
            value: "detail",
            align: "center",
            width: "420px"
          },
          { text: "费用(元)", value: "cost", align: "center" },
          { text: "经办人", value: "operator", align: "center" },
          { text: "备注", value: "memo", align: "center" },
          { text: "操作", value: "action", align: "center" }
        ]
      },
      baoxian: {
        dialog: false,
        datePickerDialog: false,
        dueDatePickerDialog: false,
        editObject: {},
        headers: [
          { text: "购买时间", value: "buy_time", align: "center" },
          { text: "到期时间", value: "due_time", align: "center" },
          { text: "保险公司", value: "target", align: "center" },
          {
            text: "保险明细",
            value: "detail",
            align: "center",
            width: "420px"
          },
          { text: "费用(元)", value: "cost", align: "center" },
          { text: "经办人", value: "operator", align: "center" },
          { text: "备注", value: "memo", align: "center" },
          { text: "操作", value: "action", align: "center" }
        ]
      }
    };
  },

  methods: {
    ...mapActions(["addRecord", "updateRecord", "deleteRecord"]),
    editWXRecord(record) {
      console.log("edit wx record", record);
      this.weixiu.editObject = Object.assign({}, record);
      this.weixiu.dialog = true;
    },
    editBXRecord(record) {
      console.log("edit bx record", record);
      this.baoxian.editObject = Object.assign({}, record);
      this.baoxian.dialog = true;
    },
    removeRecord(record) {
      confirm("确定要删除记录?") && this.deleteRecord(record);
    },
    saveRecord(type, record) {
      if (record.id !== undefined) {
        console.log("edit record", record);
        this.updateRecord(record);
      } else {
        console.log("add record", record);
        this.addRecord({
          carid: this.detailData.id,
          record: record,
          type: type
        });
      }
      this.close();
    },
    datePicked(date) {
      console.log(date);
      this.baoxian.dueDatePickerDialog = false;
      this.weixiu.datePickerDialog = false;
      this.baoxian.datePickerDialog = false;
    },
    wxTargetListClick(target) {
      this.weixiu.editObject.target = target;
    },
    back() {
      this.$router.push("/");
    },
    close() {
      console.log("dialog close");
      this.baoxian.dialog = false;
      this.weixiu.dialog = false;
      this.weixiu.editObject = {};
      this.baoxian.editObject = {};
    },

    save() {}
  },
  computed: {
    ...mapGetters(["persons", "wxTargets", "bxTargets", "operators"]),
    targetList() {
      return this.$store.car.cars.map(n => n.owner);
    },
    wxData() {
      return this.detailData.wx_records || [];
    },
    bxData() {
      return this.detailData.bx_records || [];
    },
    wxTotalCost() {
      return this.wxData
        .map(n => Number(n.cost))
        .reduce((n1, n2) => n1 + n2, 0);
    },
    bxTotalCost() {
      return this.bxData
        .map(n => Number(n.cost))
        .reduce((n1, n2) => n1 + n2, 0);
    },
    detailData() {
      return this.$store.state.car.cars.find(
        o => o.id === this.$route.params.id
      );
    }
  }
};
</script>

<style scoped>
</style>