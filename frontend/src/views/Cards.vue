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
                    :items="cards"
                    class="elevation-1"
                >
                    <template v-slot:items="props">
                        <tr @click="props.expanded = !props.expanded; getCardLogs(props.item.id);">
                            <td>{{ props.item.number }}</td>
                            <td>
                                <div v-for="(period, index) in props.item.periods" v-if="period.From != '' || period.To != ''" :key="index">
                                    From: {{ period.From }}, To: {{ period.To }}
                                </div>
                            </td>
                            <td class="text-xs-center">
                                <v-icon v-if="props.item.allow_exit" color="green">check_circle_outline</v-icon>
                                <v-icon v-else color="red">radio_button_unchecked</v-icon>
                            </td>
                            <td class="text-xs-center">
                                <v-icon v-if="props.item.activated" color="green">check_circle_outline</v-icon>
                                <v-icon v-else color="red">radio_button_unchecked</v-icon>
                            </td>
                        </tr>
                    </template>
                    <template v-slot:expand="props">
                        <v-card flat>
                            <v-card-text>
                                <v-data-table
                                    :headers="log_headers"
                                    :items="card_logs"
                                    :pagination.sync="pagination"
                                    class="elevation-1"
                                >
                                    <template v-slot:items="log_props">
                                        <td>{{ (log_props.item.reader) ? log_props.item.reader.name : '' }}</td>
                                        <td class="text-xs-center">{{ (log_props.item.reader) ? log_props.item.reader.direction : '' }}</td>
                                        <td class="text-xs-center">{{ log_props.item.createdAt | moment("DD.MM.YYYY HH:mm:ss") }}</td>
                                        <td class="text-xs-center">
                                            <v-icon v-if="log_props.item.synced" color="green">check_circle_outline</v-icon>
                                            <v-icon v-else color="red">radio_button_unchecked</v-icon>
                                        </td>
                                    </template>
                                    <template v-slot:no-data>
                                        <v-alert :value="true" color="error" icon="warning" outline>
                                            Sorry, nothing to display here :(
                                        </v-alert>
                                    </template>
                                </v-data-table>
                            </v-card-text>
                        </v-card>
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
            headers: [
                {
                    text: 'Number',
                    align: 'left',
                    value: 'number'
                },
                {
                    text: 'Periods',
                    value: 'periods',
                    align: 'left'
                },
                {
                    text: 'Allow exit',
                    value: 'allow_exit',
                    align: 'center'
                },
                {
                    text: 'Activated',
                    value: 'activated',
                    align: 'center'
                }
            ],
            log_headers: [
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
            pagination: {'sortBy': 'createdAt', 'descending': true},
            pushing: null,
        };
    },
    mounted() {
        this.getCards();
    },
    computed: {
        ...mapState([
            'isProcess',
            'errorMessage',
            'cards',
            'card_logs',
        ])
    },
    methods: {
        ...mapActions([
            'getCards',
            'getCardLogs',
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
