<template>
    <div style="padding: 2rem 3rem; text-align: left;">
        <div class="card" style="margin: 3rem">
            <input type="file" accept="application/pdf" class="fileinput" @change="onChange">

        </div>




        <div class="card" style="margin: 0">
            <div class="card" v-if="pdf" id="buttons">
                <button @click="previousPage"> {{ "<<" }} </button>
                        <input v-model="currentPage" disabled style="width: 20px; height: 25px; text-align: center;">
                        <button @click="nextPage">{{ ">>" }}</button>
                        <!-- <button @click="addSignature">Sign</button> -->
            </div>
            <br>
            <div> <canvas ref="pdfcanvas" id="myCanvas"></canvas>
            </div>
            <br>


        </div>
        <div class="card" style="margin: 3rem" v-if="pdf">
            <p class="card-header-title">
                Type your signature
            </p>
            <button ref="del">Delete</button>

            <div style="border: 5px solid #8080804f; margin: 20px; border-radius: 10px;">
                <VPerfectSignature :stroke-options="strokeOptions" ref="signaturePad" width="100%" />
            </div>
            <div class="card-footer">
                <a class="card-footer-item" @click="attachSignature">Attach</a>
                <a class="card-footer-item" @click="clear">Clear</a>

            </div>
        </div>



    </div>
</template>

<script>

// import { PDFDocument } from 'pdf-lib'
import VPerfectSignature from 'v-perfect-signature'

import { mapState, mapMutations } from 'vuex';
// import { PDFViewer } from "pdfjs-dist/web/pdf_viewer";
import * as pdfjsLib from 'pdfjs-dist/webpack';
import { fabric } from "fabric";


export default {
    props: ['currentStep'],
    components: { VPerfectSignature },


    data() {
        return {
            strokeOptions: {
                size: 5,
                thinning: 0.75,
                smoothing: 0.5,
                streamline: 0.5,
            },
            loaded: false,
            pdf: null,
            pdfDoc: null,
            pdfData: null,
            pages: [],

            currentPage: 1,
            totalPages: 0,
            canvas: null,
            fabricCanvas: null,
            hide: true,
            page: null

        }
    },
    computed: {
        ...mapState("globalStore", ["pdfDocument"]),

    },
    mounted() {
        this.canvas = new fabric.Canvas('myCanvas', {
            preserveObjectStacking: true

        })
        console.log(this.$refs);
        window.addEventListener('resize', this.onWindowResize)
        this.canvas.on({
            'selection:created': () => {
                this.$refs.del.style.display = 'inline-block'
            }

        })
        this.canvas.on({
            'selection:cleared': () => {
                this.$refs.del.style.display = 'none'
            }
        })
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onWindowResize)
    },
    methods: {

        ...mapMutations("globalStore", ['setPDFDoc']),

        render() {


            this.pdf.getPage(this.currentPage).then((page) => {
                this.page=page
                const canvas = this.canvas
                canvas.setDimensions({ width: page.view[2], height: page.view[3] });

                canvas.width = 50 * window.innerWidth / 100
                canvas.height = 100 * window.innerHeight / 100
                const viewport = page.getViewport({ scale: 1 })
                const scale = Math.min(canvas.width / viewport.width, canvas.height / viewport.height)
                const scaledViewport = page.getViewport({ scale: scale })

                canvas.width = scaledViewport.width;
                canvas.height = scaledViewport.height;


                canvas.setDimensions({
                    width: scaledViewport.width,
                    height: scaledViewport.height
                });

                const renderContext = {
                    canvasContext: canvas.getContext('2d'),
                    viewport: page.getViewport({ scale: scale })
                };
                page.render(renderContext).promise.then( ()=>{  
                })
                
            })
        }
        ,
        onChange(e) {

            if (!e.target.files.length) return;
            let file = e.target.files[0];
            let reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = async e => {
                pdfjsLib.GlobalWorkerOptions.workerSrc = 'node_modules/pdfjs-dist/build/pdf.worker.min.js'
                let src = e.target.result;
                this.pdfDoc = src
                let loadingTask = pdfjsLib.getDocument({ data: src })
                loadingTask.promise.then((pdf) => {
                    this.pdf = pdf
                    this.totalPages = pdf.numPages
                    this.currentPage = 1
                    this.render()

                    this.$emit('can-continue', { value: true });

                })

            }



        },
        clear() {
            this.$refs.signaturePad?.clear()
        },
        attachSignature() {
            const dataURL = this.$refs.signaturePad.toDataURL()
            console.log(dataURL);
            fabric.Image.fromURL(dataURL,(img)=>{
            this.canvas.add(img)
        })}
        ,

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
        onWindowResize() {
            this.render()
        }


        ,

    }
}


</script>
<style>
#myCanvas {
    width: 100%;
    height: 100%;
}

#buttons {
    border: none !important;
    color: aliceblue !important;
}
</style>