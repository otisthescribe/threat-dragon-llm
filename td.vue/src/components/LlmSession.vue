<template>
    <div>
        <b-modal
            v-if="!!session"
            id="llm-session"
            size="lg"
            ok-variant="primary"
            header-bg-variant="primary"
            header-text-variant="light"
            title="LLM Threat Modeling session"
            ref="editModal"
        >
            <b-form>
                <b-form-row>
                    <b-col md=5>
                        <b-form-group
                            id="llm-group"
                            class="float-left"
                            :label="$t('llm.provider')"
                            label-for="llmProvider">
                            <b-form-radio-group
                                id="provider"
                                v-model="session.provider"
                                :options="llmModels"
                                buttons
                            ></b-form-radio-group>
                        </b-form-group>
                    </b-col>

                    <b-col md=2>
                        <b-form-group
                            id="count-group"
                            :label="$t('llm.properties.number')"
                            label-for="count">
                            <b-form-input
                                id="count"
                                v-model="session.count"
                                type="text"
                            ></b-form-input>
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col>
                        <b-form-group
                            id="description-group"
                            :label="$t('llm.context')"
                            label-for="description">
                            <b-form-textarea
                                id="description"
                                placeholder="Provide additional context here..."
                                v-model="session.context"
                                rows="5">
                            </b-form-textarea>
                        </b-form-group>
                    </b-col>
                </b-form-row>
            </b-form>

            <template #modal-footer>
                <div class="w-100">
                    <b-button  
                        variant="danger"
                        class="float-right"
                        @click="startSession()"
                    >
                        {{ $t('forms.startSession') }}
                    </b-button>
                    <b-button
                        variant="secondary"
                        class="float-right mr-2"
                        @click="hideModal()"
                    >
                    {{ $t('forms.cancel') }}
                    </b-button>
                </div>
            </template>
        </b-modal>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { createNewGeneratedThreats } from '@/service/threats/genthreats.js';
import { CELL_DATA_UPDATED } from '@/store/actions/cell.js';
import tmActions from '@/store/actions/threatmodel.js';
import dataChanged from '@/service/x6/graph/data-changed.js';

export default {
    name: 'TdLlmSession',
    computed: {
        ...mapState({
            cellRef: (state) => state.cell.ref,
            threatTop: (state) => state.threatmodel.data.detail.threatTop,
            diagram: (state) => state.threatmodel.selectedDiagram,
            threats: (state) => state.cell.threats,
        }),
        llmModels() {
            return [
                { value: 'openai', text: this.$t('llm.models.openai') },
                { value: 'gemini', text: this.$t('llm.models.gemini') },
                { value: 'llama', text: this.$t('llm.models.llama') }
            ];
        }
    },
    data() {
        return {
            session: {
                provider: "openai",
                count: 5,
                context: "",
            },
        };
    },
    methods: {
        prepareSession() {
            this.showModal();
        },
        async startSession() {
            this.hideModal();
            if (this.session.context == "") {
                this.session.context = "No additional context";
            }
            const threats = await createNewGeneratedThreats(this.diagram.diagramType, this.cellRef.data, this.threatTop+1, this.session);
            threats.forEach((threat) => {
                console.debug('new threat ID: ' + threat.id);
                this.cellRef.data.threats.push(threat);
                this.cellRef.data.hasOpenThreats = this.cellRef.data.threats.length > 0;
                this.$store.dispatch(tmActions.update, { threatTop: this.threatTop+1 });
                this.$store.dispatch(tmActions.modified);
                this.$store.dispatch(CELL_DATA_UPDATED, this.cellRef.data);
                dataChanged.updateStyleAttrs(this.cellRef);
            });
        },
        hideModal() {
            this.$refs.editModal.hide();
        },
        showModal() {
            this.$refs.editModal.show();
        },
    }
};

</script>
