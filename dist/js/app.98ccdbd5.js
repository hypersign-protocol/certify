(function(){var t={5222:function(t,e,i){"use strict";var a=i(7195),s=function(){var t=this,e=t._self._c;return e("div",{attrs:{id:"app"}},[e("vue-loader",{attrs:{active:t.isLoading,"can-cancel":!0,"is-full-page":!0},on:{"update:active":function(e){t.isLoading=e}}}),e("notifications",{attrs:{group:"foo"}}),e("link",{attrs:{rel:"stylesheet",href:"https://cdnjs.cloudflare.com/ajax/libs/bulma/0.4.1/css/bulma.min.css"}}),t._m(0),e("section",{staticClass:"section",staticStyle:{padding:"1rem","min-height":"600px"}},[e("div",{},[e("div",{staticClass:"columns"},[e("div",{staticClass:"column is-8 is-offset-2"},[e("horizontal-stepper",{attrs:{steps:t.demoSteps,"top-buttons":!0},on:{"completed-step":t.completeStep,"active-step":t.isStepActive,"stepper-finished":t.alert}})],1)])])]),e("footer",{staticClass:"footer",staticStyle:{"background-color":"white"}},[e("strong",[t._v("Powered")]),t._v(" by "),e("a",{attrs:{target:"_blank",href:t.teamUrl}},[t._v("Hypersign")]),t._v(". ")])],1)},n=[function(){var t=this,e=t._self._c;return e("section",{staticClass:"hero"},[e("div",{staticClass:"hero-body",staticStyle:{padding:"1rem 0"}},[e("div",{},[e("div",{staticClass:"columns"},[e("div",{staticClass:"column is-12 is-offset-5",staticStyle:{display:"flex","align-items":"center"}},[e("div",{staticClass:"is-pulled-left"},[e("img",{attrs:{width:"80px",src:i(6949)}})]),e("div",{staticClass:"is-pulled-left",staticStyle:{"text-align":"left"}},[e("h1",{staticClass:"title text-medium-grey",staticStyle:{"margin-bottom":".5rem"}},[t._v(" Hypersign Certify ")]),e("hr",{staticClass:"is-marginless"}),e("h2",{staticClass:"subtitle text-light-grey",staticStyle:{"margin-top":".5rem"}},[t._v(" Decentralised Document Signer ")])])])])])])])}],r=i(5450),o=function(){var t=this,e=t._self._c;return e("div",{staticStyle:{padding:"2rem 3rem","text-align":"left"}},[e("div",{},[e("label",{staticClass:"label"},[t._v("Your DID")]),e("div",{staticClass:"input-group mb-3"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.didSubject,expression:"didSubject"}],staticClass:"form-control",class:["form-control",t.$v.didSubject.$error?"is-danger":""],attrs:{type:"text",disabled:"",placeholder:"did:hid:testnet:123123","aria-label":"did:hid:testnet:123123","aria-describedby":"basic-addon2"},domProps:{value:t.didSubject},on:{input:function(e){e.target.composing||(t.didSubject=e.target.value)}}}),e("div",{staticClass:"input-group-append"},[e("button",{staticClass:"btn btn-outline-secondary",on:{click:function(e){return t.createNewDID()}}},[e("b-icon",{attrs:{icon:"person-fill"}}),t._v(" Create New Id")],1)])]),t.$v.didSubject.$error?e("p",{staticClass:"help is-danger"},[t._v("Please create your identity first")]):t._e()])])},c=[],l={methods:{notifySuccess(t){a["default"].notify({group:"foo",title:"Information",type:"success",text:t})},notifyErr(t){a["default"].notify({group:"foo",title:"Error",type:"error",text:t})},notifyWarning(t){a["default"].notify({group:"foo",title:"Warning",type:"warn",text:t})},notifyInfo(t){a["default"].notify({group:"foo",title:"Information",type:"info",text:t})}}},d=i(113),u=i(4940),p=i(408);const h=new a["default"];var f=h;const g="https://api.entity.hypersign.id/api/v1";var m={props:["clickedNext","currentStep"],mixins:[d.oE,l],validations:{didSubject:{required:u.C1}},computed:{...(0,p.Se)("globalStore",["getSSIHeaders","getSSIAppAccessToken"]),...(0,p.rn)("globalStore",["subjectDID"]),didSubject:{get(){return this.subjectDID},set(t){this.setSubjectDID(t)}}},watch:{$v:{handler:function(t){t.$invalid?(this.$emit("can-continue",{value:!1}),setTimeout((()=>{this.$emit("change-next",{nextBtnValue:!1})}),3e3)):this.$emit("can-continue",{value:!0})},deep:!0},clickedNext(t){console.log(t),!0===t&&this.$v.didSubject.$touch()}},mounted(){this.$v.$invalid?this.$emit("can-continue",{value:!1}):this.$emit("can-continue",{value:!0})},methods:{...(0,p.OI)("globalStore",["setSubjectDID"]),async createNewDID(){try{if(this.didSubject)return this.notifyErr("Your identity already created"),void console.error("Your identity already created");f.$emit("updateLoader",!0);const t=`${g}/did/create`,e={namespace:"testnet"},i=await fetch(t,{method:"POST",headers:this.getSSIHeaders,body:JSON.stringify(e)}),a=await i.json();if(400==i.status)throw new Error(a.message.toString());const{did:s}=a;this.didSubject=s,this.notifySuccess("Identity created successfully")}catch(t){this.notifyErr(t.message),console.error(t.message)}finally{f.$emit("updateLoader",!1)}}}},v=m,b=i(1001),y=(0,b.Z)(v,o,c,!1,null,null,null),S=y.exports,w=function(){var t=this,e=t._self._c;return e("div",{staticStyle:{padding:"2rem 3rem","text-align":"left"}},[e("div",[e("b-button-toolbar",[e("b-button-group",{staticClass:"mr-1"},[e("b-button",{attrs:{title:"Previous Page"},on:{click:t.previousPage}},[e("b-icon",{attrs:{icon:"arrow-left-circle","aria-hidden":"true"}})],1),e("b-button",{attrs:{title:"Current Page"}},[t._v(" "+t._s(t.currentPage)+" ")]),e("b-button",{attrs:{title:"Next Page"},on:{click:t.nextPage}},[e("b-icon",{attrs:{icon:"arrow-right-circle","aria-hidden":"true"}})],1)],1),e("b-button-group",{staticClass:"mr-1",staticStyle:{float:"right"}},[t.loaded?t._e():e("b-button",{attrs:{title:"Issue Credential"},on:{click:t.issueCred}},[e("b-icon",{attrs:{icon:"file-earmark-arrow-up","aria-hidden":"true"}}),t._v("Finish ")],1),t.loaded?e("b-button",{attrs:{title:"Verify Credential"},on:{click:t.verifyCred}},[e("b-icon",{attrs:{icon:"check-square","aria-hidden":"true"}}),t._v(" Verify ")],1):t._e()],1)],1)],1),e("div",{staticClass:"card",staticStyle:{"max-height":"600px","overflow-y":"scroll"}},[e("canvas",{ref:"pdfcanvas",attrs:{id:"myCanvas"}})]),e("div",{staticStyle:{display:"flex","align-items":"center"}},[t.loaded?e("VerifiableCredential",{attrs:{credential:t.credentialDocument,verified:t.verified}}):t._e()],1)])},C=[],P=(i(2801),i(8131)),D=function(){var t=this,e=t._self._c;return e("div",{staticClass:"card",staticStyle:{padding:"3rem",width:"100%"}},[e("form",[e("div",{staticClass:"form-group row"},[t._m(0),e("div",{staticClass:"col-sm-8"},[e("input",{staticClass:"form-control-plaintext",attrs:{type:"text",readonly:"",id:"staticEmail"},domProps:{value:t.credential.id}})]),t.verified?e("b-icon",{staticClass:"col-sm-2",staticStyle:{float:"right",color:"green"},attrs:{icon:"check-circle-fill",variant:"success","font-scale":"2"}}):t._e()],1),e("div",{staticClass:"form-group row"},[t._m(1),e("div",{staticClass:"col-sm-10"},[e("input",{staticClass:"form-control-plaintext",attrs:{type:"text",readonly:"",id:"staticEmail"},domProps:{value:t.status}})])]),e("div",{staticClass:"form-group row"},[t._m(2),e("div",{staticClass:"col-sm-10"},[e("input",{staticClass:"form-control-plaintext",attrs:{type:"text",readonly:"",id:"staticEmail"},domProps:{value:t.fileSize}})])]),e("div",{staticClass:"form-group row"},[t._m(3),e("div",{staticClass:"col-sm-10"},[e("input",{staticClass:"form-control-plaintext",attrs:{type:"text",readonly:"",id:"staticEmail"},domProps:{value:t.fileType}})])]),e("div",{staticClass:"form-group row"},[t._m(4),e("div",{staticClass:"col-sm-10"},[e("input",{staticClass:"form-control-plaintext",attrs:{type:"text",readonly:"",id:"staticEmail"},domProps:{value:t.issuerName}})])]),e("div",{staticClass:"form-group row"},[t._m(5),e("div",{staticClass:"col-sm-10"},[e("input",{staticClass:"form-control-plaintext",attrs:{type:"text",readonly:"",id:"staticEmail"},domProps:{value:t.credentialSubject.id}})])]),e("div",{staticClass:"form-group row"},[t._m(6),e("div",{staticClass:"col-sm-10"},[e("input",{staticClass:"form-control-plaintext",attrs:{type:"text",readonly:"",id:"staticEmail"},domProps:{value:t.issuanceDate}})])]),e("div",{staticClass:"form-group row"},[t._m(7),e("div",{staticClass:"col-sm-10"},[e("input",{staticClass:"form-control-plaintext",attrs:{type:"text",readonly:"",id:"staticEmail"},domProps:{value:t.expirationDate}})])]),e("div",{staticClass:"form-group row"},[t._m(8),e("div",{staticClass:"col-sm-10"},[e("input",{staticClass:"form-control-plaintext",attrs:{type:"text",readonly:"",id:"staticEmail"},domProps:{value:t.proofs.proofValue}})])]),e("div",{staticClass:"form-group row"},[e("b-button-toolbar",[e("b-button-group",{staticClass:"mr-1"},[e("button",{staticClass:"btn btn-outline-secondary",attrs:{type:"button"},on:{click:t.download}},[e("b-icon",{attrs:{icon:"download","aria-hidden":"true"}}),t._v(" Download ")],1),e("button",{staticClass:"btn btn-outline-secondary",attrs:{type:"button",disabled:""}},[e("b-icon",{attrs:{icon:"share","aria-hidden":"true"}}),t._v(" Share ")],1)])],1)],1)])])},x=[function(){var t=this,e=t._self._c;return e("label",{staticClass:"col-sm-2 col-form-label",attrs:{for:"staticEmail"}},[e("strong",[t._v("Document Id ")])])},function(){var t=this,e=t._self._c;return e("label",{staticClass:"col-sm-2 col-form-label",attrs:{for:"staticEmail"}},[e("strong",[t._v("Status")])])},function(){var t=this,e=t._self._c;return e("label",{staticClass:"col-sm-2 col-form-label",attrs:{for:"staticEmail"}},[e("strong",[t._v("File Size")])])},function(){var t=this,e=t._self._c;return e("label",{staticClass:"col-sm-2 col-form-label",attrs:{for:"staticEmail"}},[e("strong",[t._v("File Type")])])},function(){var t=this,e=t._self._c;return e("label",{staticClass:"col-sm-2 col-form-label",attrs:{for:"staticEmail"}},[e("strong",[t._v("Issued By")])])},function(){var t=this,e=t._self._c;return e("label",{staticClass:"col-sm-2 col-form-label",attrs:{for:"staticEmail"}},[e("strong",[t._v("Issued To")])])},function(){var t=this,e=t._self._c;return e("label",{staticClass:"col-sm-2 col-form-label",attrs:{for:"staticEmail"}},[e("strong",[t._v("Issued At")])])},function(){var t=this,e=t._self._c;return e("label",{staticClass:"col-sm-2 col-form-label",attrs:{for:"staticEmail"}},[e("strong",[t._v("Expires On")])])},function(){var t=this,e=t._self._c;return e("label",{staticClass:"col-sm-2 col-form-label",attrs:{for:"staticEmail"}},[e("strong",[t._v("Issuer Signature")])])}],_=(i(3767),i(8585),i(8696),{props:{credential:{type:Object,required:!0},verified:{type:Boolean,required:!1}},computed:{status(){return"LIVE"},header(){return`${this.credential.credentialSubject.description}`},issuerName(){return this.credential.credentialSubject.author.name},fileSize(){return this.credential.credentialSubject.fileSize},fileType(){return this.credential.credentialSubject.encodingFormat},issuanceDate(){return new Date(this.credential.issuanceDate).toLocaleString("en")},expirationDate(){return new Date(this.credential.expirationDate).toLocaleString("en")},credentialType(){return this.credential.type[1]},proofs(){return this.credential.proof},cardClass(){return["rounded-lg","shadow-lg","p-4","bg-white"]},cardStyle(){return{"max-width":"100vw",width:"41vw","background-color":"#ffffff","border-radius":"8px","box-shadow":"0 2px 5px rgba(0,0,0,0.2)",padding:"20px","text-align":"left",display:"flex","flex-direction":"column","justify-content":"space-between","font-family":"Arial, sans-serif","font-size":"16px","word-wrap":"break-word","overflow-wrap":"break-word","border-top":"3px solid #0D6EFD","border-left":"3px solid #0D6EFD","border-right":"3px solid #0D6EFD","border-bottom":"3px solid #0D6EFD"}},credentialSubject(){return this.credential.credentialSubject}},methods:{download(){const t=this.$props.credential.credentialSubject.contentUrl,e="Contract.pdf",i=atob(t.slice("data:application/pdf;base64,".length)),a=new Array(i.length);for(let o=0;o<i.length;o++)a[o]=i.charCodeAt(o);const s=new Blob([new Uint8Array(a)],{type:"application/pdf"}),n=URL.createObjectURL(s),r=document.createElement("a");r.download=e,r.href=n,r.click(),URL.revokeObjectURL(n)}}}),j=_,I=(0,b.Z)(j,D,x,!1,null,"9def9136",null),k=I.exports,A=i(5605),F={props:["currentStep"],components:{VerifiableCredential:k},mixins:[l],data(){return{pdfDoc:{},currentPage:1,totalPages:0,pdf:null,credential:{schemaContext:["https://schema.org"],type:["DigitalDocument"],subjectDid:"did:hid:testnet:zFvWaeG6JCiaDRZv2bbhqnzGTeZ89VtVHC5ZtnHMycUGe",issuerDid:"did:hid:testnet:zFvWaeG6JCiaDRZv2bbhqnzGTeZ89VtVHC5ZtnHMycUGe",expirationDate:"2027-12-10T18:30:00.000Z",fields:{name:"Contract",description:"Signed Document by hypersign-certify",author:{"@type":"Issuer",name:"Certify"},datePublished:"2023-02-22T00:00:00Z",dateModified:"2023-02-22T00:00:00Z",encodingFormat:"application/pdf",fileSize:null,contentUrl:null},namespace:"testnet",verificationMethodId:"did:hid:testnet:zFvWaeG6JCiaDRZv2bbhqnzGTeZ89VtVHC5ZtnHMycUGe#key-1",persist:!1},credentialDocument:{"@context":["https://www.w3.org/2018/credentials/v1","https://schema.org","https://w3id.org/security/suites/ed25519-2020/v1"],id:"vc:hid:testnet:zA5Ur88rMVSmA3FhzdCi9FjYQ1wPbM1RVFmjG1L3Tsgop",type:["VerifiableCredential","DigitalDocument"],issuer:"did:hid:testnet:zF9hdCSFgp8cc6Q42e46A3yjHodpZeUTSWNQrMVFekWfB",issuanceDate:"2023-02-28T09:34:19Z",expirationDate:"2030-12-24T18:30:00Z",credentialSubject:{name:"Contract",description:"Signed Document by hypersign-certify",author:{"@type":"Issuer",name:"Certify"},datePublished:"2023-02-28T09:35:46.837Z",dateModified:null,encodingFormat:"application/pdf",fileSize:"0.14345Mb",contentUrl:"",id:"did:hid:testnet:zHogdUdCUhj3jkdsX9yxN6hHVLZZe96adZFQUKp9NEvHd"},credentialStatus:{id:"https://api.jagrat.hypersign.id/hypersign-protocol/hidnode/ssi/credential/vc:hid:testnet:zA5Ur88rMVSmA3FhzdCi9FjYQ1wPbM1RVFmjG1L3Tsgop",type:"CredentialStatusList2017"},proof:{type:"Ed25519Signature2020",created:"2023-02-28T09:35:59Z",verificationMethod:"did:hid:testnet:zF9hdCSFgp8cc6Q42e46A3yjHodpZeUTSWNQrMVFekWfB#key-1",proofPurpose:"assertionMethod",proofValue:"z5FeuG9mUxtWioByBTFEs5XUxsDQCVH2oQcn4rQdRTyh4ASFWB3ubGNYmetJsSTb8PPV2RcuCtE9pxrtdUwNiahtA"}},verified:!1,accessToken:null,loaded:!1,pdfObj:null}},computed:{...(0,p.Se)("globalStore",["getPDFDoc","getSubjectDID"]),...(0,p.rn)("globalStore",["signature"])},async mounted(){this.accessToken=localStorage.getItem("ssiAppAccessTokenKey"),await this.generateCredential(),P.GlobalWorkerOptions.workerSrc="node_modules/pdfjs-dist/build/pdf.worker.min.js",await this.render()},methods:{...(0,p.OI)("globalStore",["setSignature"]),...(0,p.nv)("globalStore",["issueCredential","verifyCredential"]),async render(){let t=P.getDocument(this.pdfObj);t.promise.then((t=>{this.pdf&&this.pdf.destroy(),this.pdf=t,this.totalPages=t.numPages,this.pdf.getPage(this.currentPage).then((t=>{this.page=t;const e=document.getElementById("myCanvas"),i=e.getContext("2d");i.imageSmoothingEnabled=!1,console.log({width:t.view[2],height:t.view[3]}),e.width=50*window.innerWidth/100,e.height=100*window.innerHeight/100;const a=t.getViewport({scale:1}),s=Math.min(e.width/a.width,e.height/a.height),n=t.getViewport({scale:s});e.width=n.width,e.height=n.height,this.viewPort=n;const r={canvasContext:e.getContext("2d"),viewport:t.getViewport({scale:s})};t.render(r)})),this.$emit("can-continue",{value:!1})}))},nextPage(){this.currentPage+=1,this.currentPage=this.currentPage>this.totalPages?1:this.currentPage,this.render()},previousPage(){this.currentPage-=1,this.currentPage=this.currentPage<1?this.totalPages:this.currentPage,this.render()},async generateCredential(){const t=this.getPDFDoc,e=t.pdfDoc,i=t.signature,a=t.pageNum;console.log(e);const s=await A.PDFDocument.load(e);s.removePage(a-1);const n=await s.embedPng(i),{width:r,height:o}=n.scale(.77),c=s.insertPage(a-1);c.drawImage(n,{x:0,y:0,width:r,height:o});const l=await s.saveAsBase64({dataUri:!0});this.credential.fields.fileSize=1e-6*atob(l.split(",")[1]).length+"Mb",this.credential.fields.contentUrl=l,this.credential.expirationDate=new Date("12/25/2030").toISOString(),this.credential.fields.datePublished=(new Date).toISOString(),this.credential.fields.dateModified=null,this.credential.issuerDid="did:hid:testnet:zF9hdCSFgp8cc6Q42e46A3yjHodpZeUTSWNQrMVFekWfB",this.credential.verificationMethodId="did:hid:testnet:zF9hdCSFgp8cc6Q42e46A3yjHodpZeUTSWNQrMVFekWfB#key-1",this.credential.subjectDid=this.getSubjectDID,this.pdfObj=l,this.notifySuccess("Credential generated successfully")},async issueCred(){try{f.$emit("updateLoader",!0);const t=await this.issueCredential(this.credential);this.credentialDocument=t.credentialDocument,this.loaded=!0,this.notifySuccess("Credential issued successfully")}catch(t){console.error(t.message),this.notifyErr(t.message)}finally{f.$emit("updateLoader",!1)}},async verifyCred(){try{f.$emit("updateLoader",!0);const t=await this.verifyCredential({credentialDocument:this.credentialDocument});this.verified=t.verified,console.log(this.verified),this.notifySuccess("Credential verified successfully")}catch(t){console.error(t.message),this.notifyErr(t.message)}finally{f.$emit("updateLoader",!1)}}}},E=F,T=(0,b.Z)(E,w,C,!1,null,null,null),O=T.exports,U=function(){var t=this,e=t._self._c;return e("div",{staticStyle:{padding:"2rem 3rem","text-align":"left"}},[e("div",{},[e("input",{staticClass:"fileinput input",attrs:{type:"file",accept:"application/pdf"},on:{change:t.onChange}})]),t.pdf?e("div",{staticStyle:{padding:"1rem 0"}},[t.pdf?e("div",{attrs:{id:"buttons"}},[e("div",[e("b-button-toolbar",[e("b-button-group",{staticClass:"mr-1"},[e("b-button",{attrs:{title:"Previous Page"},on:{click:t.previousPage}},[e("b-icon",{attrs:{icon:"arrow-left-circle","aria-hidden":"true"}})],1),e("b-button",{attrs:{title:"Current Page"}},[t._v(" "+t._s(t.currentPage)+" ")]),e("b-button",{attrs:{title:"Next Page"},on:{click:t.nextPage}},[e("b-icon",{attrs:{icon:"arrow-right-circle","aria-hidden":"true"}})],1)],1),e("b-button-group",{staticClass:"mr-1"},[t.savebtn?e("b-button",{attrs:{title:"Save"},on:{click:t.save}},[e("b-icon",{attrs:{icon:"save","aria-hidden":"true"}}),t._v(" Save ")],1):t._e(),t.pdf&&!t.hideSignPad?e("b-button",{attrs:{title:"Create Signature"},on:{click:function(e){return t.openWalletPopup()}}},[e("b-icon",{attrs:{icon:"vector-pen","aria-hidden":"true"}}),t._v(" Create Signature ")],1):t._e()],1)],1)],1)]):t._e(),e("div",{staticClass:"card",staticStyle:{"max-height":"600px","overflow-y":"scroll"}},[e("canvas",{ref:"pdfcanvas",attrs:{id:"myCanvas"}})])]):t._e(),e("b-modal",{ref:"signature",attrs:{title:"Create & Attach Signature","hide-footer":"",static:"",lazy:""}},[t.pdf&&!t.hideSignPad?e("div",{staticClass:"card"},[e("div",{staticStyle:{border:"2px solid #8080804f",margin:"10px","border-radius":"10px"}},[e("VueSignaturePad",{ref:"signaturePad",attrs:{id:"vue-signature",width:"100%",height:"200px",options:{onBegin:()=>{t.$refs.signaturePad.resizeCanvas()}}}})],1),e("div",{staticClass:"card-footer"},[e("a",{staticClass:"card-footer-item",on:{click:t.attachSignature}},[t._v("Attach")]),e("a",{staticClass:"card-footer-item",on:{click:t.clear}},[t._v("Clear")])])]):t._e()])],1)},$=[],V=i(1235),z=i(8467),Z={props:["currentStep"],components:{VueSignaturePad:z.W},mixins:[l],data(){return{canvasVehiculo:!1,strokeOptions:{size:10,thinning:.75,smoothing:.5,streamline:.5},savebtn:!1,hideSignPad:!1,hide:!1,loaded:!1,pdf:null,pdfDoc:[],pdfData:null,pages:[],sig:{},viewPort:{},currentPage:1,totalPages:0,canvas:null,fabricCanvas:null,page:null}},computed:{...(0,p.rn)("globalStore",["pdfDocObject"])},created(){window.addEventListener("keydown",(t=>{"Delete"===t.key&&this.canvas.remove(this.canvas.getActiveObject())}))},mounted(){},beforeDestroy(){window.removeEventListener("resize",this.onWindowResize)},methods:{...(0,p.OI)("globalStore",["setPDFDoc"]),openWalletPopup(){this.$refs["signature"].show()},closeWalletPopup(){this.$refs["signature"].hide()},save(){this.savebtn=!1,this.canvas.discardActiveObject().renderAll(),this.canvas.forEachObject((function(t){t.selectable=!1}));const t=this.canvas.toDataURL({format:"png",quality:1});console.log(t),this.setPDFDoc({pdfDoc:this.pdfDoc,signature:t,pageNum:this.currentPage}),this.$emit("can-continue",{value:!0})},drawSignatureOnCanvas(t){this.hide=!0;const e=document.getElementById("myCanvas"),i=e.toDataURL("image/png"),a=new V.fabric.Canvas("myCanvas",{selection:!1}),s=a.getContext("2d");s.imageSmoothingEnabled=!1,a.setDimensions({width:this.viewPort.width,height:this.viewPort.height}),a.setBackgroundImage(i,a.renderAll.bind(a)),t.on({moving:()=>{t.set({top:t.top,left:t.left,width:t.width,height:t.height}),this.sig=t}}),a.on({"selection:created":()=>{this.savebtn=!0}}),a.on({"selection:cleared":()=>{this.savebtn=!1}}),a.add(t),a.renderAll(),this.canvas=a,this.hideSignPad=!0},render(){let t=P.getDocument(this.pdfDoc);t.promise.then((t=>{this.pdf&&this.pdf.destroy(),this.pdf=t,this.totalPages=t.numPages,this.pdf.getPage(this.currentPage).then((t=>{this.page=t;const e=document.getElementById("myCanvas"),i=e.getContext("2d");i.imageSmoothingEnabled=!1,console.log({width:t.view[2],height:t.view[3]}),e.width=50*window.innerWidth/100,e.height=100*window.innerHeight/100;const a=t.getViewport({scale:1}),s=Math.min(e.width/a.width,e.height/a.height),n=t.getViewport({scale:s});e.width=n.width,e.height=n.height,this.viewPort=n;const r={canvasContext:e.getContext("2d"),viewport:t.getViewport({scale:s})};t.render(r).promise.then((()=>{})),this.notifySuccess("PDF page rendered successfully")})),this.$emit("can-continue",{value:!1})}))},onChange(t){if(!t.target.files.length)return;let e=t.target.files[0],i=new FileReader;i.readAsDataURL(e),i.onload=async t=>{P.GlobalWorkerOptions.workerSrc="node_modules/pdfjs-dist/build/pdf.worker.min.js";let e=t.target.result;this.currentPage=1,this.pdfDoc=e,this.render()}},clear(){this.$refs.signaturePad?.clearSignature(),this.closeWalletPopup()},attachSignature(){const{data:t}=this.$refs.signaturePad.saveSignature();console.log(t);const e=t;V.fabric.Image.fromURL(e,(t=>{t.set({top:50,left:10}),this.drawSignatureOnCanvas(t)})),this.clear()},nextPage(){this.currentPage+=1,this.currentPage=this.currentPage>this.totalPages?1:this.currentPage,this.render()},previousPage(){this.currentPage-=1,this.currentPage=this.currentPage<1?this.totalPages:this.currentPage,this.render()},onWindowResize(){this.render()}}},L=Z,W=(0,b.Z)(L,U,$,!1,null,null,null),M=W.exports;const H="https://hypersign.id",N="https://github.com/PygmySlowLoris/vue-stepper";var R={name:"app",components:{HorizontalStepper:r["default"]},computed:{...(0,p.rn)({selectedDashboard:t=>t.globalStore.selectedDashboard}),...(0,p.Se)("globalStore",["getSignature","getPDFDoc"])},data(){return{isLoading:!1,repoUrl:N,teamUrl:H,demoSteps:[{icon:"person",name:"first",title:"Onboarding",subtitle:"Create your decentralised identity",component:S,completed:!1},{icon:"file_upload",name:"second",title:"PDF Uploading",subtitle:"Upload your PDF document",component:M,completed:!1},{icon:"fingerprint",name:"third",title:"eSign",subtitle:"Sign the contract",component:O,completed:!1}],activeStep:0}},created(){f.$on("updateLoader",(t=>{this.isLoading=t}))},async mounted(){await this.authenticateSSIAppAction()},methods:{...(0,p.nv)("globalStore",["authenticateSSIAppAction"]),...(0,p.OI)("globalStore",["fetchAppsListFromServer"]),completeStep(t){this.demoSteps.forEach((e=>{e.name===t.name&&(e.completed=!0)}))},isStepActive(t){this.demoSteps.forEach((e=>{e.name===t.name&&!0===e.completed&&(e.completed=!1)}))},async alert(){const t=this.getPDFDoc,e=t.pdfDoc,i=t.signature,a=t.pageNum,s=await A.PDFDocument.load(e);s.removePage(a-1);const n=await s.embedPng(i),{width:r,height:o}=n.scale(.77),c=s.insertPage(a-1);c.drawImage(n,{x:0,y:0,width:r,height:o});const l=await s.saveAsBase64({dataUri:!0});this.downloadURI(l,"download.pdf")},downloadURI(t,e){const i=document.createElement("a");i.download=e,i.href=t,document.body.appendChild(i),i.click(),document.body.removeChild(i)}}},B=R,G=(0,b.Z)(B,s,n,!1,null,"3c781411",null),Q=G.exports;a["default"].use(p.ZP);const q="https://api.entity.hypersign.id/api/v1",K={namespaced:!0,state:{ssiAPIKey:"764840749413568265abfaa7d76b9.87810ca9cc65894e3473851729f205c650b91756e8f3bd93deea6c8ed8d4ea6620c2d4d7b4ba84e7718a491fb558a6552",ssiAppAccessTokenKey:"ssiAppAccessTokenKey",subjectDID:"",pdfDocObject:{}},getters:{getSSIAppAccessToken:t=>localStorage.getItem(t.ssiAppAccessTokenKey),getSSIHeaders:(t,e)=>({Authorization:"Bearer "+e.getSSIAppAccessToken,"Content-Type":"application/json"}),getPDFDoc:(t,e)=>t.pdfDocObject,getSubjectDID:(t,e)=>t.subjectDID},mutations:{setSsiAppAccessToken:(t,e)=>localStorage.setItem(t.ssiAppAccessTokenKey,e),setSubjectDID:(t,e)=>t.subjectDID=e,setPDFDoc:(t,e)=>t.pdfDocObject=e},actions:{authenticateSSIAppAction:({state:t,commit:e})=>new Promise(((i,a)=>{const s=`${q}/app/oauth`;fetch(s,{method:"POST",headers:{"X-Api-Secret-Key":t.ssiAPIKey}}).then((t=>(400==t.statusCode&&a("Bad Request"),401==t.statusCode&&a("Invalid API Secret Key"),t.json()))).then((t=>{const{access_token:a}=t;e("setSsiAppAccessToken",a),i()})).catch((t=>{a(t.message)}))})),verifyCredential(t,e){return new Promise(((i,a)=>{const s=t.getters.getSSIHeaders,n=`${q}/credential/verify`;fetch(n,{method:"POST",headers:s,body:JSON.stringify(e)}).then((t=>(console.log(t),400==t.statusCode&&a("Bad Request"),401==t.statusCode&&a("Invalid Access Token"),500==t.statusCode&&a(t.message),500==t.status&&a(t.message),t.json()))).then((t=>{i(t)})).catch((t=>{a(t.message)}))}))},issueCredential:(t,e)=>new Promise(((i,a)=>{const s=t.getters.getSSIHeaders,n=`${q}/credential/issue`;fetch(n,{method:"POST",headers:s,body:JSON.stringify(e)}).then((t=>(console.log(t),400==t.statusCode&&a("Bad Request"),401==t.statusCode&&a("Invalid Access Token"),500==t.statusCode&&a(t.message),500==t.status&&a(t.message),t.json()))).then((t=>{i(t)})).catch((t=>{a(t.message)}))}))}};var J=K;a["default"].use(p.ZP);var Y=new p.ZP.Store({modules:{globalStore:J}}),X=i(5698),tt=i.n(X),et=i(4359),it=i(7244),at=(i(7024),i(9649)),st=i.n(at);a["default"].config.productionTip=!1,a["default"].component("vue-loader",tt()),a["default"].use(et.XG7),a["default"].use(it.X),a["default"].use(it.A7),a["default"].use(st()),new a["default"]({store:Y,render:t=>t(Q)}).$mount("#app")},6949:function(t,e,i){"use strict";t.exports=i.p+"img/logo.32b03ae7.png"},4960:function(){},6759:function(){},6272:function(){},3414:function(){},172:function(){},2001:function(){},3779:function(){},6558:function(){},2258:function(){}},e={};function i(a){var s=e[a];if(void 0!==s)return s.exports;var n=e[a]={exports:{}};return t[a].call(n.exports,n,n.exports,i),n.exports}i.m=t,function(){var t=[];i.O=function(e,a,s,n){if(!a){var r=1/0;for(d=0;d<t.length;d++){a=t[d][0],s=t[d][1],n=t[d][2];for(var o=!0,c=0;c<a.length;c++)(!1&n||r>=n)&&Object.keys(i.O).every((function(t){return i.O[t](a[c])}))?a.splice(c--,1):(o=!1,n<r&&(r=n));if(o){t.splice(d--,1);var l=s();void 0!==l&&(e=l)}}return e}n=n||0;for(var d=t.length;d>0&&t[d-1][2]>n;d--)t[d]=t[d-1];t[d]=[a,s,n]}}(),function(){i.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return i.d(e,{a:e}),e}}(),function(){i.d=function(t,e){for(var a in e)i.o(e,a)&&!i.o(t,a)&&Object.defineProperty(t,a,{enumerable:!0,get:e[a]})}}(),function(){i.u=function(t){return"js/"+t+".3feb0afc.js"}}(),function(){i.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"===typeof window)return window}}()}(),function(){i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)}}(),function(){i.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}}(),function(){i.p="/"}(),function(){i.b=document.baseURI||self.location.href;var t={143:0};i.O.j=function(e){return 0===t[e]};var e=function(e,a){var s,n,r=a[0],o=a[1],c=a[2],l=0;if(r.some((function(e){return 0!==t[e]}))){for(s in o)i.o(o,s)&&(i.m[s]=o[s]);if(c)var d=c(i)}for(e&&e(a);l<r.length;l++)n=r[l],i.o(t,n)&&t[n]&&t[n][0](),t[n]=0;return i.O(d)},a=self["webpackChunkhypersigncerts"]=self["webpackChunkhypersigncerts"]||[];a.forEach(e.bind(null,0)),a.push=e.bind(null,a.push.bind(a))}();var a=i.O(void 0,[998],(function(){return i(5222)}));a=i.O(a)})();
//# sourceMappingURL=app.98ccdbd5.js.map