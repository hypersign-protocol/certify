<template>
    <div style="padding: 2rem 3rem; text-align: left;">
        <div class="card" style="margin: 3rem">
            <input type="file" accept="application/pdf" class="fileinput" @change="onChange">

        </div>

        <embed ref="pdf" width="100%" height="600px" type="application/pdf">


    </div>
</template>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.943/pdf.min.js" defer/>

<script>

import { PDFDocument } from 'pdf-lib'
import { mapState, mapGetters, mapMutations  } from 'vuex';
import pdfjsLib from 'pdfjs-dist'
export default {
    props: ['currentStep'],
    
    data() {
        return {
            loaded: false,
            pdfDoc: null,
            pdfData: null,
            pages: [],
        }
    },
    computed:{...mapState("globalStore", ["pdfDocument"])
    },
    methods: {
        ...mapMutations("globalStore", ['setPDFDoc']),

        onChange(e) {
            if (!e.target.files.length) return;
            let file = e.target.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async e => {
                let src = e.target.result;

                const pdfDoc = await PDFDocument.load(src)
                this.pdfDoc = pdfDoc
                this.loaded = true
                this.pages =await pdfDoc.getPages()
                
                this.$refs.pdf.src=await this.pdfDoc.saveAsBase64({dataUri:true})
                this.$emit('can-continue', {value: true});
                this.setPDFDoc(this.pdfDoc)

            }



        }
    }
}


</script>