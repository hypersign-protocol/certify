<template>
  <div>
    <div style="padding: 2rem 3rem; text-align: left">
      <div class="" v-if="selected == 'null' && !finished">
        <input type="file" accept="application/pdf" class="fileinput input" @change="onChange" />
      </div>

      <hr data-content="OR" class="hr-text" v-if="pdf==null && selected == 'null' && !finished">

      <div v-if="pdf==null">
        <select name="selectContract" id="selectContract" class="form-control" v-model="selected"
          @change="selectOption($event)">
          <option value="null">Select Contract</option>
          <option value="1">Customer Agreement</option>

        </select>

      </div>
      <div class="" v-if="pdf" style="padding: 1rem 0">
        <div class="" v-if="pdf" id="buttons">
          <div>
            <b-button-toolbar>
              <b-button-group class="mr-1">
                <b-button title="Previous Page" @click="previousPage">
                  <b-icon icon="arrow-left-circle" aria-hidden="true"></b-icon>
                </b-button>
                <b-button title="Current Page">
                  {{ currentPage }}
                </b-button>
                <b-button @click="nextPage" title="Next Page">
                  <b-icon icon="arrow-right-circle" aria-hidden="true"></b-icon>
                </b-button>
              </b-button-group>

              <b-button-group class="mr-1">
                <b-button title="Save" v-if="savebtn" @click="save">
                  <b-icon icon="save" aria-hidden="true"></b-icon> Save
                </b-button>

                <b-button title="Create Signature" v-if="pdf && !hideSignPad" @click="openWalletPopup()">
                  <b-icon icon="vector-pen" aria-hidden="true"></b-icon> Attach Signature
                </b-button>
              </b-button-group>
            </b-button-toolbar>
          </div>
        </div>

        <div class="card" style="max-height: 600px; overflow-y: scroll;">
          <canvas ref="pdfcanvas" id="myCanvas"></canvas>
        </div>
      </div>

      <b-modal ref="signature" title="Create & Attach Signature" hide-footer static lazy>
        <div class="card" v-if="pdf && !hideSignPad">
          <div style="border: 2px solid #8080804f; margin: 10px; border-radius: 10px;">
            <VueSignaturePad id="vue-signature" width="100%" height="200px" ref="signaturePad"
              :options="{ onBegin: () => { $refs.signaturePad.resizeCanvas() } }" />
          </div>
          <div class="card-footer">
            <a class="card-footer-item" @click="attachSignature">Attach</a>
            <a class="card-footer-item" @click="clear">Clear</a>
          </div>
        </div>
      </b-modal>
    </div>



    <div class="selection">
      <b-button-group class="mr-1" v-if="selected !== 'null'">
        <b-button title="Previous Page" @click="previousPageSelect">
          <b-icon icon="arrow-left-circle" aria-hidden="true"></b-icon>
        </b-button>
        <b-button title="Current Page">
          {{ currentPage }}
        </b-button>
        <b-button @click="nextPageSelect" title="Next Page">
          <b-icon icon="arrow-right-circle" aria-hidden="true"></b-icon>
        </b-button>
        <!-- <b-button title="Save" @click="saveSelection">
          <b-icon icon="save" aria-hidden="true"></b-icon> Save
        </b-button> -->

        <b-button @click="finish" title="Finish">
          <b-icon icon="upload" aria-hidden="true"></b-icon> Finish

        </b-button>
      </b-button-group>
      <div id="pdfSelectContainer">

      </div>
    </div>


  </div>
</template>

<script>
/* eslint-disable */
// import VPerfectSignature from "v-perfect-signature";
import { mapState, mapMutations } from "vuex";
import * as  pdfjsLib from "pdfjs-dist/webpack";

import * as pdfjsViewer from 'pdfjs-dist/web/pdf_viewer'

// import {} from 'pdfjs-dist'
import { fabric } from "fabric";
import notificationMixins from './mixins/notificationMixins'
import { VueSignaturePad } from 'vue-signature-pad';
export default {
  props: ["currentStep"],
  components: { VueSignaturePad },
  mixins: [notificationMixins],
  data() {
    return {
      selected: "null",
      strokeOptions: {
        size: 10,
        thinning: 0.75,
        smoothing: 0.5,
        streamline: 0.5,
      },
      finished:false,
      savebtn: false,
      hideSignPad: false,
      hide: false,
      loaded: false,
      pdf: null,
      pdfDoc: [],
      pdfData: null,
      pages: [],
      sig: {},
      viewPort: {},

      currentPage: 1,
      totalPages: 0,
      canvas: null,
      fabricCanvas: null,
      page: null,
      pdfDocument: null,
      forms: new Map()
    };
  },
  computed: {
    ...mapState("globalStore", ["pdfDocObject"]),
  },
  created() {

    window.addEventListener("keydown", (e) => {
      if (e.key === "Delete") {
        this.canvas.remove(this.canvas.getActiveObject());
      }
    });
  },
  mounted() {
    // this.canvas = document.getElementById('myCanvas')
    // window.addEventListener('resize', this.onWindowResize)
    // this.canvas.on({
    //     'selection:created': () => {
    //         this.$refs.del.style.display = 'inline-block'
    //     }

    // })
    // this.canvas.on({
    //     'selection:cleared': () => {
    //         this.$refs.del.style.display = 'none'
    //     }
    // })
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onWindowResize);
  },
  methods: {
    ...mapMutations("globalStore", ["setPDFDoc"]),



    async selectPDFRender() {
      let container = document.getElementById('pageContainer')
      if (container) {
        container.remove()
      }
      container = document.createElement('div')
      container.setAttribute('id', 'pageContainer')
      container.setAttribute('class', 'pdfViewer singlePageView')
      const mainContainer = document.getElementById('pdfSelectContainer')
      mainContainer.appendChild(container)
      const eventBus = new pdfjsViewer.EventBus()

      const pdfPage = await this.pdfDocument.getPage(this.currentPage)
      const annotationData = await pdfPage.getAnnotations()
      for (let idx in annotationData) {
        this.forms.set(annotationData[idx].id, annotationData[idx].fieldValue)
      }
      const SCALE = .9
      const pdfPageView = new pdfjsViewer.PDFPageView({
        container,
        id: this.currentPage,
        scale: SCALE,
        defaultViewport: pdfPage.getViewport({ scale: SCALE }),
        eventBus,
        textLayerFactory: !this.pdfDocument.isPureXfa
          ? new pdfjsViewer.DefaultTextLayerFactory()
          : null,
        annotationLayerFactory: new pdfjsViewer.DefaultAnnotationLayerFactory(),
        xfaLayerFactory: this.pdfDocument.isPureXfa
          ? new pdfjsViewer.DefaultXfaLayerFactory()
          : null,
        structTreeLayerFactory: new pdfjsViewer.DefaultStructTreeLayerFactory(),
        renderInteractiveForms: true



      })
      pdfPageView.setPdfPage(pdfPage);

      return pdfPageView.draw();

    },
    async selectOption(e) {
      let pdfDocument;
      switch (e.target.value) {
        case '1': {
          this.selected = '1'
          const pdffileURL = './pdfs/sample.pdf'
          const loadingTask = pdfjsLib.getDocument({
            url: pdffileURL,
            cMapPaked: true,
            cMapUrl: '../../node_modules/pdfjs-dist/cmaps/'
          })
          this.pdfDocument = await loadingTask.promise;
          pdfDocument = this.pdfDocument
          const page=await this.pdfDocument.getPage(1)
          const annotationData=await page.getAnnotations()
          annotationData[1].fieldValue="RANDOM DATA"
          this.totalPages = pdfDocument.numPages
          this.currentPage = 1
          this.selectPDFRender()

          break;
        }
        default:
          const mainContainer = document.getElementById('pageContainer')
          mainContainer.remove()

          break;
      }


    },
    async saveSelection() {
      const page = await this.pdfDocument.getPage(this.currentPage)
      const annotationData = await page.getAnnotations()

      annotationData.forEach(e => {
        const value = document.getElementById('pdfjs_internal_id_' + e.id)?.value
        if (value === undefined) { return }
        e.fieldValue = value
      })
      this.forms.forEach((value, key) => {
        const inputValue = document.getElementById('pdfjs_internal_id_' + key)?.value
        if (inputValue === undefined) {
          return
        }
        this.forms.set(key, inputValue)
        this.pdfDocument.annotationStorage.setValue(key, { value: inputValue })

      })
      // console.log(this.pdfDocument.annotationStorage);

      // this.pdfDocument.saveDocument(this.pdfDocument.annotationStorage).then((data, fn) => {
      //   let fileName = 'abc.pdf'
      //   const blob = new Blob([data], { type: 'application/pdf' });
      //   const a = document.createElement('a');

      //   a.download = fileName;
      //   a.href = URL.createObjectURL(blob);
      //   a.dataset.downloadurl = [fileName, a.download, a.href].join(':');
      //   a.style.display = "none";
      //   document.body.appendChild(a);
      //   a.click();
      //   document.body.removeChild(a);
      // })

    },


    async finish() {
      await this.saveSelection()
      
      for (let i = 1; i < this.currentPage; i++) {
        const page = await this.pdfDocument.getPage(i)
        const annotationData = await page.getAnnotations()
        for (let e in annotationData) {
          annotationData[e].readOnly = true
        }


      }
      // console.log(this.pdfDocument.annotationStorage);
      this.pdfDocument.saveDocument(this.pdfDocument.annotationStorage).then(data => {
        this.pdfDoc = data
        this.pdf = this.pdfDocument
        this.render()
      })
      let container = document.getElementById('pageContainer')
      container.remove()
      this.forms = new Map()
      this.pdfDocument = null
      this.selected='null'
      this.finished=true
    },

    async nextPageSelect() {
      await this.saveSelection()
      this.currentPage += 1;
      this.currentPage =
        this.currentPage > this.totalPages ? 1 : this.currentPage;

      this.selectPDFRender()
    },
    async previousPageSelect() {
      await this.saveSelection()

      this.currentPage -= 1;
      this.currentPage =
        this.currentPage < 1 ? this.totalPages : this.currentPage;
      this.selectPDFRender()
    },
    openWalletPopup() {
      if(!localStorage.getItem('tempSignature')){
       return this.$refs['signature'].show()

      }
      return this.attachSignature()
      // this.$nextTick(() => {
      //     console.log(this.$refs)
      //     console.log(this.$refs['signaturePad'])
      //     this.$refs['signaturePad'].resizeCanvas();
      // })


    },
    closeWalletPopup() {
      this.$refs['signature'].hide()
    },
    save() {
      this.savebtn = false;
      this.canvas.discardActiveObject().renderAll();
      this.canvas.forEachObject(function (object) {
        object.selectable = false;
      });

      const signaturePage = this.canvas.toDataURL({
        format: "png",
        quality: 1,
      });
      this.setPDFDoc({
        pdfDoc: this.pdfDoc,
        signature: signaturePage,
        pageNum: this.currentPage,
      });

      this.$emit("can-continue", { value: true });
    },
    drawSignatureOnCanvas(sig) {
      this.hide = true;

      // always when there is a need to  interact then init fabric its nothing but a wrapper

      const canvas = document.getElementById("myCanvas");
      const background = canvas.toDataURL("image/png");
      const fabricCanvas = new fabric.Canvas("myCanvas", {
        selection: false,
      });
      const ctx = fabricCanvas.getContext("2d");
      ctx.imageSmoothingEnabled = false;
      fabricCanvas.setDimensions({
        width: this.viewPort.width,
        height: this.viewPort.height,
      });
      fabricCanvas.setBackgroundImage(
        background,
        fabricCanvas.renderAll.bind(fabricCanvas)
      );

      sig.on({
        moving: () => {
          sig.set({
            top: sig.top,
            left: sig.left,
            width: sig.width,
            height: sig.height,
          });
          this.sig = sig;
        },
      });

      fabricCanvas.on({
        "selection:created": () => {
          this.savebtn = true;
        },
      });

      fabricCanvas.on({
        "selection:cleared": () => {
          this.savebtn = false;
        },
      });

      fabricCanvas.add(sig);
      fabricCanvas.renderAll();
      this.canvas = fabricCanvas;
      this.hideSignPad = true;
    },
    render() {

      let loadingTask = pdfjsLib.getDocument(this.pdfDoc);
      loadingTask.promise.then((pdf) => {
        if (this.pdf) {
          this.pdf.destroy();
        }
        this.pdf = pdf;
        this.totalPages = pdf.numPages;

        this.pdf.getPage(this.currentPage).then((page) => {
          this.page = page;
          const canvas = document.getElementById("myCanvas");
          const ctx = canvas.getContext("2d");
          ctx.imageSmoothingEnabled = false;
          // console.log({ width: page.view[2], height: page.view[3] });
          // canvas.setDimensions({ width: page.view[2], height: page.view[3] });

          canvas.width = (50 * window.innerWidth) / 100;
          canvas.height = (100 * window.innerHeight) / 100;
          const viewport = page.getViewport({ scale: 1 });
          const scale = Math.min(
            canvas.width / viewport.width,
            canvas.height / viewport.height
          );
          const scaledViewport = page.getViewport({ scale: scale });

          canvas.width = scaledViewport.width;
          canvas.height = scaledViewport.height;
          this.viewPort = scaledViewport;

          // canvas.setDimensions({
          //     width: scaledViewport.width,
          //     height: scaledViewport.height
          // });

          const renderContext = {
            canvasContext: canvas.getContext("2d"),
            viewport: page.getViewport({ scale: scale }),
          };

          page.render(renderContext).promise.then(() => {
            // let bg = canvas.toDataURL("image/png");
            // console.log(bg);
            // let fcanvas = new fabric.Canvas("myCanvas", { selection: false,
            //     preserveObjectStacking:true })
            // fcanvas.setBackgroundImage(bg, fcanvas.renderAll.bind(fcanvas));
            // let rect = new fabric.Rect({
            //     left: 100,
            //     top: 100,
            //     width: 50,
            //     height: 50,
            //     fill: '#FF454F',
            //     opacity: 0.5,
            //     transparentCorners: true,
            //     borderColor: "gray",
            //     cornerColor: "gray",
            //     cornerSize: 5
            // });
            // fcanvas.add(rect);
            // fcanvas.renderAll()
          });
          this.notifySuccess('PDF page rendered successfully')
        });

        this.$emit("can-continue", { value: false });
      });
    },
    onChange(e) {
      if (!e.target.files.length) return;
      let file = e.target.files[0];
      let reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = async (e) => {
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          "node_modules/pdfjs-dist/build/pdf.worker.min.js";
        let src = e.target.result;
        this.currentPage = 1;
        this.pdfDoc = src;
        this.render();
      };
    },
    clear() {
      this.$refs.signaturePad?.clearSignature();
      this.closeWalletPopup()
    },
    attachSignature() {
let datatemp;
      try {
        const { data } = this.$refs.signaturePad.saveSignature();
        datatemp=data

      } catch (error) {
        console.log(error);
      }
      // console.log(data)
      const dataURL = datatemp===undefined?localStorage.getItem('tempSignature'):datatemp;
      fabric.Image.fromURL(dataURL, (img) => {
        img.set({
          top: 50,
          left: 10,
        });

        this.drawSignatureOnCanvas(img);
      });
      this.clear();
    },
    nextPage() {
      this.currentPage += 1;
      this.currentPage =
        this.currentPage > this.totalPages ? 1 : this.currentPage;
      this.render();
    },
    previousPage() {
      this.currentPage -= 1;
      this.currentPage =
        this.currentPage < 1 ? this.totalPages : this.currentPage;
      this.render();
    },
    onWindowResize() {
      this.render();
    },
  },
};
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

div#__BVID__23___BV_modal_backdrop_ {
  z-index: 0;
}

#vue-signature {
  border: double 3px transparent;
  border-radius: 5px;
  background-image: linear-gradient(white, white),
  radial-gradient(circle at top left, #4bc5e8, #9f6274);
  background-origin: border-box;
  background-clip: content-box, border-box;
}

#pdfContainer {
  padding-left: 60px;
}

/* #vue-signature{
    height: 100%;
    width: 450px;
} */

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
@import '../node_modules/pdfjs-dist/web/pdf_viewer.css'
</style>
