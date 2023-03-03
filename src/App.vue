<template>
    <div id="app">
        <vue-loader :active.sync="isLoading" :can-cancel="true" :is-full-page="true"></vue-loader>
        <notifications group="foo" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.4.1/css/bulma.min.css">
        <section class="hero">
            <div class="hero-body" style="padding: 1rem 0">
                <div class="">
                    <div class="columns">
                        <div class="column is-12 is-offset-5" style="display: flex; align-items: center;">
                            <div class="is-pulled-left">
                                <img width="80px" src="./assets/logo.png">
                            </div>
                            <div class="is-pulled-left" style="text-align: left">
                                <h1 class="title text-medium-grey" style="margin-bottom: .5rem">
                                    Hypersign Certify
                                </h1>
                                <hr class="is-marginless">
                                <h2 class="subtitle text-light-grey" style="margin-top: .5rem">
                                    Decentralised Document Signer
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="section" style="padding: 1rem ; min-height: 600px;">
            <div class="">
                <div class="columns">
                    <div class="column is-8 is-offset-2">
                        <horizontal-stepper :steps="demoSteps" @completed-step="completeStep" :top-buttons="true"
                            @active-step="isStepActive" @stepper-finished="alert"></horizontal-stepper>
                    </div>
                </div>
            </div>
        </section>

        <footer class="footer" style="background-color: white;">
            <strong>Powered</strong> by <a target="_blank" :href="teamUrl">Hypersign</a>.
        </footer>
    </div>
</template>

<script>
import HorizontalStepper from 'vue-stepper';
import StepOne from './StepOne.vue';
import StepThree from './StepThree.vue';
import StepTwo from './StepTwo.vue';

import { mapActions, mapMutations, mapState, mapGetters } from 'vuex';
import eventBus from "./eventBus";
import { PDFDocument } from 'pdf-lib'
const teamUrl = 'https://hypersign.id';
const repoUrl = 'https://github.com/PygmySlowLoris/vue-stepper';
export default {
    name: 'app',
    components: {
        HorizontalStepper
    },
    computed: {
        ...mapState({
            selectedDashboard: state => state.globalStore.selectedDashboard,

        }),
        ...mapGetters("globalStore", ["getSignature", "getPDFDoc"])
    },
    data() {
        return {
            isLoading: false,
            repoUrl: repoUrl,
            teamUrl: teamUrl,
            demoSteps: [
                {
                    icon: 'person',
                    name: 'first',
                    title: 'Onboarding',
                    subtitle: 'Create your decentralised identity',
                    component: StepOne,
                    completed: false
                },
                {
                    icon: 'file_upload',
                    name: 'second',
                    title: 'PDF Uploading',
                    subtitle: 'Upload your PDF document',
                    component: StepTwo,
                    completed: false
                },
                {
                    icon: 'fingerprint',
                    name: 'third',
                    title: 'eSign',
                    subtitle: 'Sign the contract',
                    component: StepThree,
                    completed: false
                }
            ],
            activeStep: 0
        }
    },
    created() {
        eventBus.$on('updateLoader', (isLoading) => {
            this.isLoading = isLoading;
        })
    },
    async mounted() {
        await this.authenticateSSIAppAction();
    },
    methods: {
        ...mapActions("globalStore", ["authenticateSSIAppAction"]),
        ...mapMutations("globalStore", ["fetchAppsListFromServer"]),
        completeStep(payload) {
            this.demoSteps.forEach((step) => {
                if (step.name === payload.name) {
                    step.completed = true;
                }
            })
        },
        isStepActive(payload) {
            this.demoSteps.forEach((step) => {
                if (step.name === payload.name) {
                    if (step.completed === true) {
                        step.completed = false;
                    }
                }
            })
        },
        async alert() {

            const pdfDoc = this.getPDFDoc
            const pdfBytes = pdfDoc.pdfDoc
            const signature = pdfDoc.signature
            const pageNum = pdfDoc.pageNum
            const pdfDocument = await PDFDocument.load(pdfBytes)
            pdfDocument.removePage(pageNum-1)
            const pngImage = await pdfDocument.embedPng(signature)
            const { width, height } = pngImage.scale(.77);

            const newPage = pdfDocument.insertPage(pageNum-1)
            newPage.drawImage(pngImage, {
                x: 0,
                y: 0,
                width,
                height
            })

            const pdfBytesDownload = await pdfDocument.saveAsBase64({ dataUri: true })

            this.downloadURI(pdfBytesDownload, "download.pdf")

        },
        downloadURI(uri, name) {
            const link = document.createElement("a");
            link.download = name;
            link.href = uri;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}
</script>

<style scoped>
#app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

.pointer {
    cursor: pointer;
}

h1,
h2 {
    font-weight: normal;
}

hr {
    background-color: transparent;
    border: none;
    display: block;
    height: inherit;
    margin: 1.5rem 0;
    border-top: dashed 1px;
}

</style>