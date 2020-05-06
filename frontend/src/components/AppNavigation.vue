<template>
  <span>
    <v-navigation-drawer
      id="app-drawer"
      app
      v-model="drawer"
      class="indigo lighten-2"
      dark
      floating
      persistent
      mobile-break-point="991"
      width="260"
    >
      <v-img src="./img/bg-sidebar.jpg" height="100%">
        <v-layout class="fill-height" tag="v-list" column>
          <v-list-tile avatar to="/">
            <v-list-tile-avatar color="white">
              <v-img src="./img/logo.png" height="34" contain />
            </v-list-tile-avatar>
            <v-list-tile-title class="title">Turniket</v-list-tile-title>
          </v-list-tile>
          <v-divider />
          <template v-if="isAuthenticated">
            <v-list-tile
              v-for="(item, index) in items"
              :key="index"
              :to="item.to"
              active-class="success"
              avatar
              class="v-list-item"
            >
              <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-title v-text="item.text" />
            </v-list-tile>
          </template>
        </v-layout>
      </v-img>
    </v-navigation-drawer>
    <v-toolbar id="app-toolbar" flat prominent>
      <v-toolbar-title>
        <v-btn
          v-if="isAuthenticated && responsive"
          class="default v-btn--simple"
          dark
          icon
          @click.stop="drawer = !drawer"
        >
          <v-icon>menu</v-icon>
        </v-btn>
        {{ title }}
      </v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <v-flex align-center layout py-2>
          <template v-if="!isAuthenticated">
            <v-btn flat to="/login" class="toolbar-items">Login</v-btn>
          </template>
          <template v-else>
            <v-btn flat to="/readers" color="primary" class="toolbar-items">Readers</v-btn>
            <v-btn flat @click.stop="settingsDlg = true" class="toolbar-items">Settings</v-btn>
            <v-btn outline @click="logout" class="toolbar-items">Logout</v-btn>
          </template>
        </v-flex>
      </v-toolbar-items>
    </v-toolbar>

    <v-dialog v-model="settingsDlg" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Settings</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="form" v-model="form_valid">
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm4>Change password:</v-flex>
                <v-flex xs12 sm4>
                  <v-text-field
                    v-model="newPassword"
                    :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                    :rules="[rules.required]"
                    :type="showPassword ? 'text' : 'password'"
                    label="New Password"
                    @click:append="showPassword = !showPassword"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm4>
                  <v-text-field
                    v-model="newPasswordConfirm"
                    :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                    :rules="[rules.required, rules.confirmMatch]"
                    :type="showPassword ? 'text' : 'password'"
                    label="Confirm Password"
                    @click:append="showPassword = !showPassword"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "AppNavigation",
  data() {
    return {
      drawer: true,
      form_valid: false,
      settingsDlg: false,
      items: [
        { text: "Cards", to: "cards", icon: "list" },
        { text: "Logs", to: "logs", icon: "list" }
      ],
      title: null,
      responsive: false,
      showPassword: false,
      newPassword: "",
      newPasswordConfirm: "",
      rules: {
        required: value => !!value || "Required.",
        confirmMatch: value =>
          !!(value == this.newPassword) ||
          "The password and confirm password you entered don't match"
      }
    };
  },
  watch: {
    $route(val) {
      this.title = val.name;
    }
  },
  mounted() {
    this.onResponsiveInverted();
    window.addEventListener("resize", this.onResponsiveInverted);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResponsiveInverted);
  },
  computed: {
    ...mapState(["isProcess", "errorMessage"]),
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    }
  },
  methods: {
    ...mapActions(["updatePassword"]),
    logout() {
      this.$store.dispatch("doLogout");
    },
    onResponsiveInverted() {
      if (window.innerWidth < 991) {
        this.responsive = true;
      } else {
        this.responsive = false;
      }
    },
    close() {
      this.settingsDlg = false;
      setTimeout(() => {
        this.newPassword = "";
        this.newPasswordConfirm = "";
      }, 300);
    },

    save() {
      if (this.$refs.form.validate()) {
        this.updatePassword({ password: this.newPassword });
        this.close();
      }
    }
  }
};
</script>
