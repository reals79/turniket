<template>
    <v-container fill-height fluid grid-list-xl>
        <v-layout justify-center wrap>
            <v-flex md12>
                <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on }">
                        <v-btn color="primary" dark class="mb-2" v-on="on">
                            New Reader
                        </v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="headline">{{ formTitle }}</span>
                        </v-card-title>

                        <v-card-text>
                            <v-form ref="form" v-model="form_valid">
                                <v-container grid-list-md>
                                    <v-layout wrap>
                                        <v-flex xs12 sm4>
                                            <v-text-field
                                                v-model="editedItem.name"
                                                label="Name"
                                                autofocus
                                                :rules="[rules.required]"
                                            ></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm4>
                                            <v-select
                                                v-model="editedItem.type"
                                                :items="types_reader"
                                                label="Type"
                                                :rules="[rules.required]"
                                            ></v-select>
                                        </v-flex>
                                        <v-flex xs12 sm4>
                                            <v-select
                                                v-model="editedItem.format"
                                                :items="formats_reader"
                                                label="Format"
                                                :rules="[rules.required]"
                                            ></v-select>
                                        </v-flex>
                                        <v-flex xs12 sm6>
                                            <v-select
                                                v-model="editedItem.direction"
                                                :items="directions_reader"
                                                label="Direction"
                                                :rules="[rules.required]"
                                            ></v-select>
                                        </v-flex>
                                        <v-flex xs12 sm6>
                                            <v-text-field
                                                v-model="editedItem.port"
                                                label="Port"
                                                :rules="[rules.required]"
                                                hint="For Wiegand type should be: pin0,pin1"
                                                persistent-hint
                                            ></v-text-field>
                                        </v-flex>
                                        <v-flex xs6>
                                            <v-text-field
                                                v-model="editedItem.pin"
                                                label="Pin Relay"
                                                type="number"
                                                min="0"
                                                :rules="[rules.required]"
                                            ></v-text-field>
                                        </v-flex>
                                        <v-flex xs6>
                                            <v-text-field
                                                v-model="editedItem.pin_led"
                                                label="Pin Led"
                                                type="number"
                                                min="0"
                                                :rules="[rules.required]"
                                            ></v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-checkbox
                                                v-model="editedItem.check_periods"
                                                label="Check periods"
                                            ></v-checkbox>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-form>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" flat @click="close">
                                Cancel
                            </v-btn>
                            <v-btn color="blue darken-1" flat @click="save">
                                Save
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

                <v-data-table
                    :headers="headers"
                    :items="readers"
                    class="elevation-1"
                >
                    <template v-slot:items="props">
                        <td>{{ props.item.id }}</td>
                        <td>{{ props.item.name }}</td>
                        <td class="text-xs-center">
                            {{ getTypeReader(props.item.type) }}
                        </td>
                        <td class="text-xs-center">
                            {{ getFormatReader(props.item.format) }}
                        </td>
                        <td class="text-xs-center">
                            {{ getDirectionReader(props.item.direction) }}
                        </td>
                        <td>
                            {{ props.item.port }}
                        </td>
                        <td class="text-xs-center">
                            {{ props.item.pin }}
                        </td>
                        <td class="text-xs-center">
                            {{ props.item.pin_led }}
                        </td>
                        <td class="text-xs-center">
                            <v-icon
                                v-if="props.item.check_periods"
                                color="green"
                                >check_circle_outline
                            </v-icon>
                            <v-icon v-else color="red"
                                >radio_button_unchecked
                            </v-icon>
                        </td>
                        <td class="justify-center layout px-0">
                            <v-icon
                                class="mr-2"
                                color="success"
                                @click="openReader(props.item)"
                            >
                                lock_open
                            </v-icon>
                            <v-icon
                                small
                                class="mr-2"
                                @click="editItem(props.item)"
                            >
                                edit
                            </v-icon>
                            <v-icon small @click="deleteItem(props.item)">
                                delete
                            </v-icon>
                        </td>
                    </template>
                    <template v-slot:no-data>
                        <v-alert :value="true" color="error" icon="warning">
                            Sorry, nothing to display here :(
                        </v-alert>
                    </template>
                </v-data-table>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    name: 'Readers',
    data() {
        return {
            form_valid: false,
            dialog: false,
            headers: [
                {
                    text: 'ID',
                    align: 'left',
                    value: 'id'
                },
                {
                    text: 'Name',
                    align: 'left',
                    value: 'name'
                },
                {
                    text: 'Type',
                    value: 'type',
                    align: 'center'
                },
                {
                    text: 'Format',
                    value: 'format',
                    align: 'center'
                },
                {
                    text: 'Direction',
                    value: 'direction',
                    align: 'center'
                },
                {
                    text: 'Port',
                    value: 'port',
                    align: 'left'
                },
                {
                    text: 'Pin Relay',
                    value: 'pin',
                    align: 'center'
                },
                {
                    text: 'Pin Led',
                    value: 'pin_led',
                    align: 'center'
                },
                {
                    text: 'Check periods',
                    value: 'check_periods',
                    align: 'center'
                },
                { text: 'Actions', value: '', align: 'center', sortable: false }
            ],
            items: [],
            editedIndex: -1,
            editedItem: {
                id: null,
                name: '',
                type: '',
                format: '',
                direction: '',
                port: '',
                pin: null,
                pin_led: null,
                check_periods: null
            },
            rules: {
                required: value => !!value || 'Required.'
            }
        };
    },
    watch: {
        dialog(val) {
            val || this.close();
        }
    },
    mounted() {
        this.getReaders();
    },
    computed: {
        ...mapState([
            'isProcess',
            'errorMessage',
            'types_reader',
            'formats_reader',
            'directions_reader',
            'readers'
        ]),
        formTitle() {
            return this.editedIndex === -1 ? 'New Reader' : 'Edit Reader';
        }
    },
    methods: {
        ...mapActions([
            'getReaders',
            'addReader',
            'updateReader',
            'deleteReader',
            'openReader'
        ]),
        editItem(item) {
            this.editedIndex = this.readers.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.dialog = true;
        },

        deleteItem(item) {
            const index = this.readers.indexOf(item);
            confirm('Are you sure you want to delete this item?') &&
                this.readers.splice(index, 1) &&
                this.deleteReader(item.id);
        },

        close() {
            this.dialog = false;
            setTimeout(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;
            }, 300);
        },

        save() {
            if (this.$refs.form.validate()) {
                if (this.editedIndex > -1) {
                    Object.assign(
                        this.readers[this.editedIndex],
                        this.editedItem
                    );
                    this.updateReader(this.editedItem);
                } else {
                    let reader = this.addReader(this.editedItem);
                    reader.then(data => this.readers.push(data));
                }
                this.close();
            }
        },
        getDirectionReader: function(direction) {
            var dirReader = this.directions_reader.filter(val => {
                return val.value == direction;
            });
            if (!dirReader.length) return;
            return dirReader[0].text;
        },
        getTypeReader: function(type) {
            var typeReader = this.types_reader.filter(val => {
                return val.value == type;
            });
            if (!typeReader.length) return;
            return typeReader[0].text;
        },
        getFormatReader: function(format) {
            var formatReader = this.formats_reader.filter(val => {
                return val.value == format;
            });
            if (!formatReader.length) return;
            return formatReader[0].text;
        }
    }
};
</script>
