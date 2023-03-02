<template>
  <div class="card" style="padding: 3rem; width: 100%;">
    <form>
      <div class="form-group row">
        <label for="staticEmail" class="col-sm-2 col-form-label"><strong>Document Id </strong></label>
        <div class="col-sm-8">
          <input type="text" readonly class="form-control-plaintext" id="staticEmail" :value="credential.id">
        </div>
      <b-icon class="col-sm-2" v-if="verified" icon="check-circle-fill" variant="success" font-scale="2" style="float:right ; color: green;"></b-icon>

      </div>

      <div class="form-group row">
        <label for="staticEmail" class="col-sm-2 col-form-label"><strong>Status</strong> </label>
        <div class="col-sm-10">
          <input type="text" readonly class="form-control-plaintext" id="staticEmail" :value="status">
        </div>
      </div>

      <div class="form-group row">
        <label for="staticEmail" class="col-sm-2 col-form-label"><strong>File Size</strong> </label>
        <div class="col-sm-10">
          <input type="text" readonly class="form-control-plaintext" id="staticEmail" :value="fileSize">
        </div>
      </div>
      <div class="form-group row">
        <label for="staticEmail" class="col-sm-2 col-form-label"><strong>File Type</strong> </label>
        <div class="col-sm-10">
          <input type="text" readonly class="form-control-plaintext" id="staticEmail" :value="fileType">
        </div>
      </div>

      <div class="form-group row">
        <label for="staticEmail" class="col-sm-2 col-form-label"><strong>Issued By</strong> </label>
        <div class="col-sm-10">
          <input type="text" readonly class="form-control-plaintext" id="staticEmail" :value="issuerName">
        </div>
      </div>

      <div class="form-group row">
        <label for="staticEmail" class="col-sm-2 col-form-label"><strong>Issued To</strong> </label>
        <div class="col-sm-10">
          <input type="text" readonly class="form-control-plaintext" id="staticEmail" :value="credentialSubject.id">
        </div>
      </div>

      <div class="form-group row">
        <label for="staticEmail" class="col-sm-2 col-form-label"><strong>Issued At</strong></label>
        <div class="col-sm-10">
          <input type="text" readonly class="form-control-plaintext" id="staticEmail" :value="issuanceDate">
        </div>
      </div>

      <div class="form-group row">
        <label for="staticEmail" class="col-sm-2 col-form-label"><strong>Expires On</strong></label>
        <div class="col-sm-10">
          <input type="text" readonly class="form-control-plaintext" id="staticEmail" :value="expirationDate">
        </div>
      </div>

      <div class="form-group row">
        <label for="staticEmail" class="col-sm-2 col-form-label"><strong>Issuer Signature</strong> </label>
        <div class="col-sm-10">
          <input type="text" readonly class="form-control-plaintext" id="staticEmail" :value="proofs.proofValue">
        </div>
      </div>
      <div class="form-group row">

        <b-button-toolbar>
          <b-button-group class="mr-1">
            <button type="button" @click="download" class="btn btn-outline-secondary">
        <b-icon icon="download" aria-hidden="true"></b-icon>
        Download
      </button>

       
      <button type="button" class="btn btn-outline-secondary" disabled>
        <b-icon icon="share" aria-hidden="true"></b-icon> 
        Share
      </button>

          </b-button-group>
        </b-button-toolbar>

       
      </div>
      

    </form>
  </div>
</template>

<script>
export default {
  props: {
    credential: {
      type: Object,
      required: true
    }
    ,
    verified: {
      type: Boolean,
      required: false
    }
  },
  computed: {
    status() {
      return 'LIVE'
    },
    header() {
      return `${this.credential.credentialSubject.description}`;
    },
    issuerName() {
      return this.credential.credentialSubject.author.name;
    },
    fileSize() {
      return this.credential.credentialSubject.fileSize;

    },
    fileType() {
      return this.credential.credentialSubject.encodingFormat;

    },
    issuanceDate() {
      return new Date(this.credential.issuanceDate).toLocaleString('en');
    },
    expirationDate() {
      return new Date(this.credential.expirationDate).toLocaleString('en');
    },
    credentialType() {
      return this.credential.type[1]
    },
    proofs() {
      return this.credential.proof
    },
    cardClass() {
      return ['rounded-lg', 'shadow-lg', 'p-4', 'bg-white'];
    },
    cardStyle() {
      return {
        'max-width': '100vw',
        'width': '41vw',
        'background-color': '#ffffff',
        'border-radius': '8px',
        'box-shadow': '0 2px 5px rgba(0,0,0,0.2)',
        'padding': '20px',
        'text-align': 'left',
        'display': 'flex',
        'flex-direction': 'column',
        'justify-content': 'space-between',
        'font-family': 'Arial, sans-serif',
        'font-size': '16px',
        'word-wrap': 'break-word',
        'overflow-wrap': 'break-word',
        'border-top': '3px solid #0D6EFD',
        'border-left': '3px solid #0D6EFD',
        'border-right': '3px solid #0D6EFD',
        'border-bottom': '3px solid #0D6EFD',

      };
    },

    credentialSubject() {
      return this.credential.credentialSubject;
    }
  },

  methods: {
    download(){
      
      const pdfDataUrl=this.$props.credential.credentialSubject.contentUrl
      const fileName = 'Contract.pdf'; // replace with your file name

// Convert data URL to blob
const byteCharacters = atob(pdfDataUrl.slice('data:application/pdf;base64,'.length));
const byteNumbers = new Array(byteCharacters.length);
for (let i = 0; i < byteCharacters.length; i++) {
  byteNumbers[i] = byteCharacters.charCodeAt(i);
}
const pdfBlob = new Blob([new Uint8Array(byteNumbers)], { type: 'application/pdf' });

// Create object URL for blob
const pdfUrl = URL.createObjectURL(pdfBlob);

// Create link element with download attribute
const link = document.createElement('a');
link.download = fileName;

// Set href attribute to object URL
link.href = pdfUrl;

// Programmatically click the link to trigger download
link.click();

// Clean up object URL
URL.revokeObjectURL(pdfUrl);
    }
  },
};
</script>

<style scoped>
.card-header {
  background-color: #f5f5f5;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-top: 3px solid #cac8c8;
  border-left: 3px solid #cac8c8;
  border-right: 3px solid #cac8c8;
  padding: 10px;
  font-weight: bold;
  font-size: 20px;
  color: #000000;
}

.card-body {
  padding: 20px;
  background-color: #ffffff;
  border-left: 3px solid #cac8c8;
  border-right: 3px solid #cac8c8;
  border-bottom: 3px solid #cac8c8;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.card-footer {
  background-color: #f5f5f5;
  border-radius: 5px;
  border-top: 3px solid #d6d6d7;

  border-bottom: 3px solid #d6d6d7;
  border-left: 3px solid #d6d6d7;
  border-right: 3px solid #d6d6d7;
  padding: 5px;
  font-size: 13px;
  color: #666666;
}
</style>
