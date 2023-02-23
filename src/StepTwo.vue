<template>
    <div style="padding: 2rem 3rem; text-align: left;">
        <div class="card" style="margin: 3rem">
            <input type="file" accept="application/pdf" class="fileinput" @change="onChange">

        </div>

        <button @click="previousPage">-</button>

        <input v-model="currentPage" disabled style="width: 20px; height: 25px; text-align: center;">
        <button @click="nextPage">+</button>

        <div class="card" ref="card" :v-if="this.pdf">


            <canvas ref="pdfcanvas"></canvas>


        </div>



    </div>
</template>

<script>

// import { PDFDocument } from 'pdf-lib'
import { mapState, mapMutations } from 'vuex';
// import { PDFViewer } from "pdfjs-dist/web/pdf_viewer";
import * as pdfjsLib from 'pdfjs-dist/webpack';

export default {
    props: ['currentStep'],

    data() {
        return {
            loaded: false,
            pdf: null,
            pdfDoc: null,
            pdfData: null,
            pages: [],
            currentPage: 1,
            totalPages: 0,
            canvas: null,
        }
    },
    computed: {
        ...mapState("globalStore", ["pdfDocument"]),

    },
    mounted() {
        this.canvas = this.$refs.pdfcanvas
        window.addEventListener('resize', this.onWindowResize)


    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onWindowResize)
    },
    methods: {

        ...mapMutations("globalStore", ['setPDFDoc']),

        render() {


            this.pdf.getPage(this.currentPage).then((page) => {
                console.log(page);
                const canvas = this.canvas
                canvas.width = 50 * window.innerWidth / 100
                canvas.height = 100 * window.innerHeight / 100
                console.log(window.innerWidth);
                const context = this.canvas.getContext("2d")
                const viewport = page.getViewport({ scale: 1 })
                const scale = Math.min(canvas.width / viewport.width, canvas.height / viewport.height)
                const scaledViewport = page.getViewport({ scale: scale })

                canvas.width = scaledViewport.width;
                canvas.height = scaledViewport.height;
                const renderContext = {
                    canvasContext: context,
                    viewport: scaledViewport
                };
                page.render(renderContext);
            })
        }
        ,
        onChange(e) {

            if (!e.target.files.length) return;
            let file = e.target.files[0];
            let reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = async e => {
                pdfjsLib.GlobalWorkerOptions.workerSrc = 'node_modules/pdfjs-dist/build/pdf.worker.js'
                let src = e.target.result;
                this.pdfDoc = src
                let loadingTask = pdfjsLib.getDocument({ data: src })
                loadingTask.promise.then((pdf) => {
                    this.pdf = pdf
                    this.totalPages = pdf.numPages
                    pdf.getPage(this.currentPage).then((page) => {
                        console.log(page);
                        const canvas = this.canvas
                        canvas.width = 50 * window.innerWidth / 100
                        canvas.height = 100 * window.innerHeight / 100
                        console.log(window.innerWidth);
                        const context = this.canvas.getContext("2d")
                        const viewport = page.getViewport({ scale: 1 })
                        const scale = Math.min(canvas.width / viewport.width, canvas.height / viewport.height)
                        const scaledViewport = page.getViewport({ scale: scale })

                        canvas.width = scaledViewport.width;
                        canvas.height = scaledViewport.height;
                        const renderContext = {
                            canvasContext: context,
                            viewport: scaledViewport
                        };
                        page.render(renderContext);
                    })

                    this.$emit('can-continue', { value: true });

                })

            }



        }
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
    }
}


</script>
<style>
canvas {
    display: flex;
}
</style>