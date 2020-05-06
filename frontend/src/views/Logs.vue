<template>
    <v-container fill-height fluid grid-list-xl>
        <v-layout justify-center wrap>
            <v-flex md12>
                <v-toolbar flat prominent>
                    <v-spacer />
                    <v-toolbar-items>
                        <v-flex align-center layout py-2>
                            <v-btn
                                :loading="pushing"
                                :disabled="pushing"
                                @click="logs_push"
                                color="info"
                                class="toolbar-items"
                            >
                                Logs push
                            </v-btn>
                        </v-flex>
                    </v-toolbar-items>
                </v-toolbar>
                <v-data-table
                    :headers="headers"
                    :items="logs"
                    :pagination.sync="pagination"
                    class="elevation-1"
                >
                    <template v-slot:items="props">
                        <tr>
                            <td>{{ (props.item.card) ? props.item.card.number : '' }}</td>
                            <td>{{ (props.item.reader) ? props.item.reader.name : '' }}</td>
                            <td class="text-xs-center">{{ (props.item.reader) ? props.item.reader.direction : '' }}</td>
                            <td class="text-xs-center">{{ props.item.createdAt | moment("DD.MM.YYYY HH:mm:ss") }}</td>
                            <td class="text-xs-center">
                                <v-icon v-if="props.item.synced" color="green">check_circle_outline</v-icon>
                                <v-icon v-else color="red">radio_button_unchecked</v-icon>
                            </td>
                        </tr>
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
    name: 'Cards',
    data() {
        return {
            pagination: {'sortBy': 'createdAt', 'descending': true},
            headers: [
                {
                    text: 'Card Number',
                    align: 'left',
                    value: 'number'
                },
                {
                    text: 'Reader',
                    align: 'left',
                    value: 'reader_name'
                },
                {
                    text: 'Direction',
                    align: 'center',
                    value: 'reader_direction'
                },
                {
                    text: 'Created At',
                    align: 'center',
                    value: 'createdAt'
                },
                {
                    text: 'Synced',
                    align: 'center',
                    value: 'log_synced'
                }
            ],
            pushing: null,
        };
    },
    mounted() {
        this.getLogs();
    },
    computed: {
        ...mapState([
            'isProcess',
            'errorMessage',
            'logs'
        ])
    },
    methods: {
        ...mapActions([
            'getLogs',
            'pushLogs',
        ]),
        async logs_push() {
            this.pushing = true;
            await this.pushLogs();
            this.pushing = false;
        }
    }
};
</script>
