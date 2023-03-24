<template>
    <div style="padding: 2rem 3rem; text-align: left;">
        <b-card no-body  v-if="tempSignature === null" >
            <b-tabs  content-class="mt-3"  style="display: block;" card>
            <b-tab title="Type" >
                <template #title> 
                    <b-icon  icon="type" />

                </template>

                <div class="card">
                <div style="border: 1px solid #8080804f; margin: 10px; border-radius: 10px;">
                    <b-input type="text" v-model="textData" class="input-group" v-if="tempSignature === null"
                        @keyup="getSignature($event)" />
                    <div class="container">
                        <b-form-group v-slot="{ ariaDescribedby }">
                            <b-form-radio v-model="selected" :aria-describedby="ariaDescribedby" name="some-radios"
                                value="Satisfaction" default><img src="" id="svg1" alt="" srcset=""></b-form-radio>
                            <b-form-radio v-model="selected" :aria-describedby="ariaDescribedby" name="some-radios"
                                value="Autography"><img src="" id="svg2" alt="" srcset=""></b-form-radio>
                        </b-form-group>
                        <br>

                    </div>
                </div>



                <div class="card-footer">
                    <a class="card-footer-item" @click="save()">Save</a>
                </div>
            </div>

            </b-tab>
            <b-tab title="Signature">
                <template #title> 
                     <b-icon  icon="vector-pen" />

                </template>
                <div class="card">
                <div style="border: 2px solid #8080804f; margin: 10px; border-radius: 10px;">
                    <VueSignaturePad id="vue-signature" width="100%" height="300px" ref="signaturePad"
                        :options="{ onBegin: () => { $refs.signaturePad.resizeCanvas() } }" />
                </div>
                <div class="card-footer">
                    <a class="card-footer-item" @click="createKeyPair">Save</a>
                    <a class="card-footer-item" @click="clear">Clear</a>
                </div>
            </div>
            </b-tab>
            <b-tab title="Upload">
                <template #title> 
                    <b-icon  icon="upload" />

                </template>
                <div class="input-group" v-if="tempSignature === null">
            <b-form-group style="width: 100%;">
                <b-form-file id="file-default" accept="image/png" @change="uploadSignature"></b-form-file>
            </b-form-group>
        </div>
            </b-tab>

        </b-tabs>
    </b-card>
<!--        
        <b-modal ref="signature" title="Create Signature" hide-footer static lazy>
            <div class="card">
                <div style="border: 2px solid #8080804f; margin: 10px; border-radius: 10px;">
                    <VueSignaturePad id="vue-signature" width="100%" height="300px" ref="signaturePad"
                        :options="{ onBegin: () => { $refs.signaturePad.resizeCanvas() } }" />
                </div>
                <div class="card-footer">
                    <a class="card-footer-item" @click="createKeyPair">Save</a>
                    <a class="card-footer-item" @click="clear">Clear</a>
                </div>
            </div>
        </b-modal> -->
<!-- 
        <b-modal ref="text2sign" title="Type Signature" hide-footer static lazy>
            <div class="card">
                <div style="border: 2px solid #8080804f; margin: 10px; border-radius: 10px;">
                    <input type="text" v-model="textData" class="input-group" v-if="tempSignature === null"
                        @keyup="getSignature($event)">
                    <div class="container">
                        <b-form-group v-slot="{ ariaDescribedby }">
                            <b-form-radio v-model="selected" :aria-describedby="ariaDescribedby" name="some-radios"
                                value="Satisfaction"><img src="" id="svg1" alt="" srcset=""></b-form-radio>
                            <b-form-radio v-model="selected" :aria-describedby="ariaDescribedby" name="some-radios"
                                value="Autography"><img src="" id="svg2" alt="" srcset=""></b-form-radio>
                        </b-form-group>
                        <br>

                    </div>
                </div>



                <div class="card-footer">
                    <a class="card-footer-item" @click="save()">Save</a>
                    <a class="card-footer-item" @click="openSignaturePad()">Draw</a>
                </div>
            </div>
        </b-modal> -->
        <!-- <div class="input-group" v-if="tempSignature === null">
            <b-form-group style="width: 100%;">
                <b-form-file id="file-default" accept="image/png" @change="uploadSignature"></b-form-file>
            </b-form-group>
        </div> -->

        <div class="input-group-append">

<!-- 
            <button class="btn btn-outline-secondary" v-if="tempSignature === null" @click="openSignatureText()"><b-icon
                    icon="vector-pen"></b-icon>
                Create Signature</button> -->



            <button v-if="tempSignature !== null" class="btn btn-outline-secondary" @click="downloadSignature"><b-icon
                    icon="download"></b-icon>
                Download Signature</button>
            <button v-if="tempSignature !== null" class="btn btn-outline-secondary" @click="newSignature"><b-icon
                    icon="arrow-clockwise"></b-icon>
                Reset</button>
        </div>

        <div class="">
            <label class="label">Your DID</label>

            <div class="input-group mb-3">
                <input type="text" class="form-control" :class="['form-control', ($v.didSubject.$error) ? 'is-danger' : '']"
                    disabled v-model="didSubject" placeholder="did:hid:testnet:123123" aria-label="did:hid:testnet:123123"
                    aria-describedby="basic-addon2">


            </div>
            <p v-if="$v.didSubject.$error" class="help is-danger">Please create your identity first</p>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
import notificationMixins from './mixins/notificationMixins'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { mapState, mapGetters, mapMutations } from 'vuex';
import { Buffer } from 'buffer'
import { Text2Sign, svgToPng } from 'Text2Sign'
import fonts from './assets/fonts.json'
import crypto from 'crypto';
import eventBus from "./eventBus";
import { VueSignaturePad } from 'vue-signature-pad';
import { HypersignDID } from 'hs-ssi-sdk'
const ssi_api_host = 'https://api.entity.hypersign.id/api/v1';
export default {
    props: ['clickedNext', 'currentStep'],
    components: { VueSignaturePad },

    mixins: [validationMixin, notificationMixins],
    data() {
        return {
            strokeOptions: {
                size: 10,
                thinning: 0.75,
                smoothing: 0.5,
                streamline: 0.5,
            },
            tempSignature: null,
            HypersignDID: null,
            textData: 'Enter Text',
            timeoutId: '',
            selected: 'Satisfaction',
        }
    },
    validations: {
        didSubject: {
            required
        }
    },
    computed: {
        ...mapGetters("globalStore", ["getSSIHeaders", "getSSIAppAccessToken"]),
        ...mapState("globalStore", ["subjectDID"]),

        didSubject: {
            get() {
                return this.subjectDID
            },
            set(value) {
                this.setSubjectDID(value)
            }
        }
    },
    watch: {
        $v: {
            handler: function (val) {
                if (!val.$invalid) {
                    this.$emit('can-continue', { value: true });
                } else {
                    this.$emit('can-continue', { value: false });
                    setTimeout(() => {
                        this.$emit('change-next', { nextBtnValue: false });
                    }, 3000)
                }
            },
            deep: true
        },
        clickedNext(val) {
            if (val === true) {
                this.$v.didSubject.$touch();
            }
        }
    },
    async mounted() {
        this.getSignatureImage(this.textData)
        this.$on('imageLoaded', (img) => {
            localStorage.setItem('tempSignature', img)
            this.createKeyPairWithData(img)
        })

       

        const data = localStorage.getItem('tempSignature')
        if (data !== '' || data !== null) {
            this.createKeyPairWithData(data)

        }

        if (!this.$v.$invalid) {
            this.$emit('can-continue', { value: true });
        } else {
            this.$emit('can-continue', { value: false });
        }

        this.tempSignature = localStorage.getItem('tempSignature')
    },
    methods: {
        ...mapMutations("globalStore", ['setSubjectDID']),

        getSignature(e) {
            clearTimeout(this.timeoutId);
            this.timeoutId = setTimeout(() => {
                return this.getSignatureImage(e.target.value)
            }, 500)


        }
        ,
        getSignatureImage(data) {

            const text2sign = new Text2Sign()

            text2sign.generateSignature(data, 50, { url: fonts.Satisfaction, name: 'Satisfaction' }, 'black')
            const svgData1 = text2sign.getSVGdata()
            svgToPng(svgData1, (img) => {
                document.getElementById('svg1').src = img

            })

            const text2sign2 = new Text2Sign()

            text2sign2.generateSignature(data, 50, { url: fonts.Autography, name: 'Autography' }, 'black')

            const svgData2 = text2sign2.getSVGdata()
            svgToPng(svgData2, (img) => {
                document.getElementById('svg2').src = img

            })


        },
        newSignature() {
            localStorage.clear()
            window.location.replace('/')
        }
        ,
        async openSignaturePad() {
            this.$refs['text2sign'].hide()
            this.$refs['signature'].show()

        },
        async openSignatureText() {
            this.$refs['text2sign'].show()
            if (this.textData !== "") {
                this.getSignatureImage(this.textData)
            }

        },
        closeWalletPopup() {
            this.$refs['signature'].hide()
        },
        clear() {
            this.$refs.signaturePad?.clearSignature();
        },
        watermakImageWithText(originalImage, watermarkText) {
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            const canvasWidth = originalImage.width;
            const canvasHeight = originalImage.height;

            canvas.width = canvasWidth;
            canvas.height = canvasHeight;

            // initializing the canvas with the original image
            context.drawImage(originalImage, 0, 0, canvasWidth, canvasHeight);

            // adding a blue watermark text in the bottom right corner
            context.fillStyle = 'grey'
            context.textAlign = 'end'
            context.textBaseline = "middle";
            context.font = "10px serif";
            context.fillText(watermarkText, canvasWidth - 100, canvasHeight - 20);

            return canvas.toDataURL();
        },
        seedFromDataURL(data) {
            const hash = crypto.createHash('sha256').update(data).digest('hex')
            const seedBytes1 = Buffer.from(hash.slice(0, 32))
            const seedBytes2 = Buffer.from(hash.slice(32, 64))
            const finalSeedBytes = seedBytes1.map((a, i) => a + seedBytes2[i])
            return finalSeedBytes
        },
        save() {
            if (this.textData === '') {
                return this.notifyErr("Empty Data")
            }
            const text2sign = new Text2Sign()

            text2sign.generateSignature(this.textData, 100, { url: fonts[this.selected], name: this.selected }, 'black')
            const svgData = text2sign.getSVGdata()

            svgToPng(svgData, (img) => {
                this.$emit('imageLoaded', img)
            })

        },
        createKeyPairWithData(data) {

            const image = new Image()
            image.src = data
            let that = this
            image.onload = async function () {
                // const data = that.watermakImageWithText(this, "Created with Hypersign-Certify "
                //     + new Date())
                localStorage.setItem('tempSignature', data)
                that.notifyInfo("Signature Created")
                that.tempSignature = data
                const finalSeedBytes = that.seedFromDataURL(data)
                const hypersignDID = new HypersignDID({ namespace: 'testnet' })
                const kp = await hypersignDID.generateKeys({ seed: finalSeedBytes })
                const did = await hypersignDID.generate({
                    publicKeyMultibase: kp.publicKeyMultibase
                })
                localStorage.setItem('DidDocument', JSON.stringify(did))
                that.didSubject = did.id
                localStorage.setItem('KeyPair', JSON.stringify(kp))

            }
        },
        createKeyPair() {
            const { data } = this.$refs.signaturePad.saveSignature();
            if (data == undefined) {
                this.notifyErr("No Signature is created")
                return 
            }
            const image = new Image()
            image.src = data
            let that = this
            image.onload = async function () {
                const data = that.watermakImageWithText(this, "Created with Hypersign-Certify "
                    + new Date())
                localStorage.setItem('tempSignature', data)
                that.notifyInfo("Signature Created")
                that.tempSignature = data
                const finalSeedBytes = that.seedFromDataURL(data)
                const hypersignDID = new HypersignDID({ namespace: 'testnet' })
                const kp = await hypersignDID.generateKeys({ seed: finalSeedBytes })
                const did = await hypersignDID.generate({
                    publicKeyMultibase: kp.publicKeyMultibase
                })
                localStorage.setItem('DidDocument', JSON.stringify(did))
                that.didSubject = did.id
                localStorage.setItem('KeyPair', JSON.stringify(kp))

                that.downloadURI(data, 'Signature.png')
            }
        },
        downloadURI(uri, name) {
            const link = document.createElement("a");
            link.download = name;
            link.href = uri;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            link.remove()
        },
        downloadSignature() {
            const dataURL = localStorage.getItem('tempSignature')
            if (dataURL === null) {
                return this.notifyErr("No Signature Found")
            }
            this.downloadURI(dataURL, 'Signature.png')
        },
        // About to become redundent
        async createNewDID() {
            try {
                if (this.didSubject) {
                    this.notifyErr('Your identity already created')
                    console.error("Your identity already created")
                    return
                }
                // create a new did Doc
                eventBus.$emit('updateLoader', true);

                const createDIDUrl = `${ssi_api_host}/did/create`
                const body = {
                    "namespace": "testnet"
                }
                const respCreatDID = await fetch(createDIDUrl, {
                    method: 'POST',
                    headers: this.getSSIHeaders,
                    body: JSON.stringify(body)
                })
                const createDIDJson = await respCreatDID.json();
                if (respCreatDID.status == 400) {
                    throw new Error(createDIDJson.message.toString())
                }
                const { did } = createDIDJson;
                this.didSubject = did;
                this.notifySuccess('Identity created successfully')
                // this.setSubjectDID(this.form.did)
                // register a new did doc
            } catch (e) {
                this.notifyErr(e.message)
                console.error(e.message);
            } finally {
                eventBus.$emit('updateLoader', false);
            }
        },
        uploadSignature(e) {
            if (!e.target.files.length) return;
            let file = e.target.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(file)
            let that = this
            reader.onload = async (e) => {
                that.tempSignature = e.target.result
                localStorage.setItem('tempSignature', that.tempSignature)
                const finalSeedBytes = that.seedFromDataURL(this.tempSignature)
                const hypersignDID = new HypersignDID({ namespace: 'testnet' })
                const kp = await hypersignDID.generateKeys({ seed: finalSeedBytes })
                const did = await hypersignDID.generate({
                    publicKeyMultibase: kp.publicKeyMultibase
                })
                localStorage.setItem('DidDocument', JSON.stringify(did))
                that.didSubject = did.id
                localStorage.setItem('KeyPair', JSON.stringify(kp))
            }
        }
    }

}
</script>

<style>
.modal-backdrop {
    display: none;
}

#vue-signature {
    border: double 3px transparent;
    border-radius: 5px;
    background-image: linear-gradient(white, white),
        radial-gradient(circle at top left, #4bc5e8, #9f6274);
    background-origin: border-box;
    background-clip: content-box, border-box;
}

hr.hr-text {
    position: relative;
    border: none;
    height: 1px;
    background: #999;
}

hr.hr-text::before {
    content: attr(data-content);
    display: inline-block;
    background: #fff;
    font-weight: bold;
    font-size: 0.85rem;
    color: #999;
    border-radius: 30rem;
    padding: 0.2rem 2rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

a{
    text-decoration: none !important;
    
}
.card-footer , .card{
    text-decoration: none !important;
}
.tabs,.card,.card-header,.nav, .active{
    background-color: white !important;
}
.card{
    scroll-behavior: unset;
}

</style>