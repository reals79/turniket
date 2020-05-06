<template>
    <v-container fill-height>
        <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
                <v-card class="elevation-12">
                    <v-toolbar dark color="primary">
                        <v-toolbar-title>Authentication</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-alert
                            :value="errorMessage"
                            type="error"
                            transition="scale-transition"
                            outline
                        >
                            {{ errorMessage }}
                        </v-alert>
                        <v-form ref="form" v-model="valid">
                            <v-text-field
                                prepend-icon="person"
                                name="username"
                                label="Username"
                                type="text"
                                autofocus
                                v-model="username"
                                :rules="usernameRules"
                                required
                            ></v-text-field>
                            <v-text-field
                                prepend-icon="lock"
                                name="password"
                                label="Password"
                                type="password"
                                v-model="password"
                                :rules="passwordRules"
                                required
                            ></v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="primary"
                            :disabled="!valid || isProcess"
                            :loading="isProcess"
                            @click="loginSubmit"
                        >
                            Login
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    name: 'Login',
    data() {
        return {
            valid: false,
            username: '',
            password: '',
            usernameRules: [v => !!v || 'Username is required'],
            passwordRules: [
                v => !!v || 'Password is required',
                /*v =>
                    v.length >= 6 ||
                    'Password must be greater than 6 characters'*/
            ]
        };
    },
    computed: {
        ...mapState(['isProcess', 'errorMessage'])
    },
    methods: {
        ...mapActions(['doLogin']),
        loginSubmit() {
            if (this.$refs.form.validate()) {
                this.$store.dispatch('doLogin', {
                    username: this.username,
                    password: this.password
                });
            }
        }
    }
};
</script>
