<template>
    <div style="padding: 2rem 3rem; text-align: left;">

        <button @click="generateCredential">Sign Contract</button>

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
import { mapGetters, mapMutations, mapState,mapActions } from 'vuex';
import { PDFDocument } from 'pdf-lib';
export default {
    props: ['currentStep'],
    components: {},
    data() {
        return {
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
            accessToken:null,
        }
    },
    computed: {
        ...mapGetters("globalStore", ["getPDFDoc","getSubjectDID"]),
        ...mapState("globalStore", ["signature"])

    },
    mounted() {
        this.accessToken=localStorage.getItem('ssiAppAccessTokenKey')
    },
    methods: {
        ...mapMutations("globalStore", ["setSignature"]),
        ...mapActions("globalStore", ["issueCredential"]),

        async generateCredential() {


            const pdfDoc = this.getPDFDoc
            const pdfBytes = pdfDoc.pdfDoc
            const signature = pdfDoc.signature
            const pageNum = pdfDoc.pageNum
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
            this.credential.fields.fileSize=atob(pdfBytesDownload.split(',')[1]).length *1e-6 +"Mb"

            this.credential.fields.contentUrl=pdfBytesDownload
            this.credential.expirationDate=new Date('12-25-2030').toISOString()
            this.credential.fields.datePublished=new Date().toISOString()
            this.credential.fields.dateModified=null
            this.credential.issuerDid='did:hid:testnet:zF9hdCSFgp8cc6Q42e46A3yjHodpZeUTSWNQrMVFekWfB'
            this.credential.verificationMethodId="did:hid:testnet:zF9hdCSFgp8cc6Q42e46A3yjHodpZeUTSWNQrMVFekWfB#key-1"
            this.credential.subjectDid=this.getSubjectDID
           const credential= this.issueCredential(this.credential)
            console.log(credential);
        }


    }
}
</script>