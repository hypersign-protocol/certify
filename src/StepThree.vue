<template>
    <div style="padding: 2rem 3rem; text-align: left;">
                <div>
                    <b-button-toolbar>
                        <b-button-group class="mr-1">
                            <b-button title="Previous Page" @click="previousPage">
                                <b-icon icon="arrow-left-circle" aria-hidden="true"></b-icon>
                            </b-button>
                            <b-button title="Current Page">
                            {{ currentPage }}
                            </b-button>
                            <b-button  @click="nextPage" title="Next Page">
                                <b-icon icon="arrow-right-circle" aria-hidden="true"></b-icon>
                            </b-button>
                        </b-button-group>
                        <b-button-group class="mr-1" style="float:right">
                            <b-button title="Issue Credential"  v-if="!loaded" @click="issueCred">
                                <b-icon icon="file-earmark-arrow-up" aria-hidden="true"></b-icon>Finish
                            </b-button>
                            <b-button title="Verify Credential" v-if="loaded" @click="verifyCred">
                                <b-icon icon="check-square" aria-hidden="true" ></b-icon> Verify
                            </b-button>
                        </b-button-group>
                    </b-button-toolbar>
                </div>
                
                <div class="card" style="max-height: 600px; overflow-y: scroll;"> 
                    <canvas ref="pdfcanvas" id="myCanvas"></canvas>
                </div>

                <div style="display: flex ; align-items: center;">
                    <VerifiableCredential :credential="credentialDocument" :verified="verified" v-if="loaded"  />
                </div>
                <!-- <div style="text-align: center;">
                    <b-button  v-if="!loaded" @click="issueCred">Issue Credential</b-button>
                    <b-button  v-if="loaded && !verified" @click="verifyCred">verify</b-button>
                </div> -->
    </div>


    <!-- <div class="card" style="margin: 3rem">
        <header class="card-header">
            <p class="card-header-title">
                Component
            </p>
            <a href="#" class="card-header-icon" aria-label="more options">
              <span class="icon">
                <i class="fa fa-angle-down" aria-hidden="true"></i>
              </span>
            </a>
        </header>
        <div class="card-content">
            <div class="content">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris.
                <a href="#">@bulmaio</a>. <a href="#">#css</a> <a href="#">#responsive</a>
                <br>
                <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
            </div>
        </div>
        <footer class="card-footer">
            <a class="card-footer-item">Save</a>
            <a class="card-footer-item">Edit</a>
            <a class="card-footer-item" @click="canContinue">Can Continue</a>
        </footer>
    </div> -->
</template>

<script>
import * as pdfjsLib from 'pdfjs-dist/webpack';
import { mapGetters, mapMutations, mapState, mapActions } from 'vuex';
import VerifiableCredential from './components/VerifiableCredential.vue';
import { PDFDocument } from 'pdf-lib';
import eventBus from "./eventBus";

export default {
    props: ['currentStep'],
    components: { VerifiableCredential },
    data() {
        return {
            pdfDoc: {},
            currentPage: 1,
            totalPages: 0,
            pdf: null,
            credential: {
                schemaContext: ["https://schema.org"],
                type: ["DigitalDocument"],

                subjectDid: "did:hid:testnet:zFvWaeG6JCiaDRZv2bbhqnzGTeZ89VtVHC5ZtnHMycUGe",
                issuerDid: "did:hid:testnet:zFvWaeG6JCiaDRZv2bbhqnzGTeZ89VtVHC5ZtnHMycUGe",
                expirationDate: "2027-12-10T18:30:00.000Z",
                fields: {
                    name: "Contract",
                    description: "Signed Document by hypersign-certify",
                    author: {
                        "@type": "Issuer",
                        "name": "Certify"
                    },
                    datePublished: "2023-02-22T00:00:00Z",
                    dateModified: "2023-02-22T00:00:00Z",
                    encodingFormat: "application/pdf",
                    fileSize: null,
                    contentUrl: null,
                },
                namespace: "testnet",
                verificationMethodId: "did:hid:testnet:zFvWaeG6JCiaDRZv2bbhqnzGTeZ89VtVHC5ZtnHMycUGe#key-1",
                persist: false
            },
            credentialDocument: {
                "@context": [
                    "https://www.w3.org/2018/credentials/v1",
                    "https://schema.org",
                    "https://w3id.org/security/suites/ed25519-2020/v1"
                ],
                "id": "vc:hid:testnet:zA5Ur88rMVSmA3FhzdCi9FjYQ1wPbM1RVFmjG1L3Tsgop",
                "type": [
                    "VerifiableCredential",
                    "DigitalDocument"
                ],
                "issuer": "did:hid:testnet:zF9hdCSFgp8cc6Q42e46A3yjHodpZeUTSWNQrMVFekWfB",
                "issuanceDate": "2023-02-28T09:34:19Z",
                "expirationDate": "2030-12-24T18:30:00Z",
                "credentialSubject": {
                    "name": "Contract",
                    "description": "Signed Document by hypersign-certify",
                    "author": {
                        "@type": "Issuer",
                        "name": "Certify"
                    },
                    "datePublished": "2023-02-28T09:35:46.837Z",
                    "dateModified": null,
                    "encodingFormat": "application/pdf",
                    "fileSize": "0.14345Mb",
                    "contentUrl": "",
                    "id": "did:hid:testnet:zHogdUdCUhj3jkdsX9yxN6hHVLZZe96adZFQUKp9NEvHd"
                },
                "credentialStatus": {
                    "id": "https://api.jagrat.hypersign.id/hypersign-protocol/hidnode/ssi/credential/vc:hid:testnet:zA5Ur88rMVSmA3FhzdCi9FjYQ1wPbM1RVFmjG1L3Tsgop",
                    "type": "CredentialStatusList2017"
                },
                "proof": {
                    "type": "Ed25519Signature2020",
                    "created": "2023-02-28T09:35:59Z",
                    "verificationMethod": "did:hid:testnet:zF9hdCSFgp8cc6Q42e46A3yjHodpZeUTSWNQrMVFekWfB#key-1",
                    "proofPurpose": "assertionMethod",
                    "proofValue": "z5FeuG9mUxtWioByBTFEs5XUxsDQCVH2oQcn4rQdRTyh4ASFWB3ubGNYmetJsSTb8PPV2RcuCtE9pxrtdUwNiahtA"
                },
            },
            verified:false,
            accessToken: null,
            loaded: false,
            pdfObj: null,
        }
    },
    computed: {
        ...mapGetters("globalStore", ["getPDFDoc", "getSubjectDID"]),
        ...mapState("globalStore", ["signature"])

    },
    async mounted() {
        this.accessToken = localStorage.getItem('ssiAppAccessTokenKey')
        await this.generateCredential()
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'node_modules/pdfjs-dist/build/pdf.worker.min.js'

        await this.render()
    },
    methods: {
        ...mapMutations("globalStore", ["setSignature"]),
        ...mapActions("globalStore", ["issueCredential","verifyCredential"]),
        async render() {
            let loadingTask = pdfjsLib.getDocument(this.pdfObj)
            loadingTask.promise.then((pdf) => {
                if (this.pdf) {
                    this.pdf.destroy()
                }
                this.pdf = pdf
                this.totalPages = pdf.numPages

                this.pdf.getPage(this.currentPage).then((page) => {
                    this.page = page
                    const canvas = document.getElementById('myCanvas')
                    const ctx = canvas.getContext('2d')
                    ctx.imageSmoothingEnabled = false
                    console.log({ width: page.view[2], height: page.view[3] });
                    // canvas.setDimensions({ width: page.view[2], height: page.view[3] });

                    canvas.width = 50 * window.innerWidth / 100
                    canvas.height = 100 * window.innerHeight / 100
                    const viewport = page.getViewport({ scale: 1 })
                    const scale = Math.min(canvas.width / viewport.width, canvas.height / viewport.height)
                    const scaledViewport = page.getViewport({ scale: scale })

                    canvas.width = scaledViewport.width;
                    canvas.height = scaledViewport.height;
                    this.viewPort = scaledViewport


                    // canvas.setDimensions({
                    //     width: scaledViewport.width,
                    //     height: scaledViewport.height
                    // });

                    const renderContext = {
                        canvasContext: canvas.getContext('2d'),
                        viewport: page.getViewport({ scale: scale })
                    };
                    page.render(renderContext)

                })

                this.$emit('can-continue', { value: false });

            })

        },
        nextPage() {
            this.currentPage += 1
            this.currentPage = this.currentPage > this.totalPages ? 1 : this.currentPage
            this.render()

        },
        previousPage() {
            this.currentPage -= 1
            this.currentPage = this.currentPage < 1 ? this.totalPages : this.currentPage
            this.render()
        },
        async generateCredential() {


            const pdfDoc = this.getPDFDoc
            const pdfBytes = pdfDoc.pdfDoc
            const signature = pdfDoc.signature
            const pageNum = pdfDoc.pageNum
            console.log(pdfBytes);
            const pdfDocument = await PDFDocument.load(pdfBytes)
            pdfDocument.removePage(pageNum - 1)
            const pngImage = await pdfDocument.embedPng(signature)
            const { width, height } = pngImage.scale(.77);

            const newPage = pdfDocument.insertPage(pageNum - 1)
            newPage.drawImage(pngImage, {
                x: 0,
                y: 0,
                width,
                height
            })

            const pdfBytesDownload = await pdfDocument.saveAsBase64({ dataUri: true })
            this.credential.fields.fileSize = atob(pdfBytesDownload.split(',')[1]).length * 1e-6 + "Mb"

            this.credential.fields.contentUrl = pdfBytesDownload
            this.credential.expirationDate = new Date('12/25/2030').toISOString()
            this.credential.fields.datePublished = new Date().toISOString()
            this.credential.fields.dateModified = null
            this.credential.issuerDid = 'did:hid:testnet:zF9hdCSFgp8cc6Q42e46A3yjHodpZeUTSWNQrMVFekWfB'
            this.credential.verificationMethodId = "did:hid:testnet:zF9hdCSFgp8cc6Q42e46A3yjHodpZeUTSWNQrMVFekWfB#key-1"
            this.credential.subjectDid = this.getSubjectDID
            this.pdfObj = pdfBytesDownload

        },
        async issueCred() {
            try{
                eventBus.$emit('updateLoader', true);
                const credential = await this.issueCredential(this.credential)
                this.credentialDocument = credential.credentialDocument
                this.loaded = true
            }catch(e){
                console.error(e.message)
            } finally{
                eventBus.$emit('updateLoader', false);
            }
        },
        async verifyCred() {
           try{
            eventBus.$emit('updateLoader', true);
            const verify=await this.verifyCredential({credentialDocument:this.credentialDocument})
            this.verified=verify.verified
            console.log(this.verified)
           }catch(e){
            console.error(e.message)
           } finally{   
            eventBus.$emit('updateLoader', false);
           }
        }
    }
}
</script>