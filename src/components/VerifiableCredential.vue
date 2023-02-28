<template>
  <b-card :header="credentialType" :class="cardClass" :style="cardStyle">
    <b-row>
      <b-icon-download  @click="download" v-if="verified" font-scale="2" style="float:right ; color: gray;" ></b-icon-download>
      

      <b-icon v-if="verified" icon="check-circle-fill" variant="success" font-scale="2"
        style="float:right ; color: green;"></b-icon>
      <b-col md="auto" class="px-2">
        <div class="mb-2">
          <h5 class="mb-1"><strong>Name : {{ credentialSubject.name }}</strong></h5>
          <p class="small text-muted"><strong>ID : {{ credential.id }}</strong></p>
          <p class="small text-muted"><strong>Issued By : </strong> {{ issuerName }}</p>
          <p class="small text-muted"><strong>Issued on : </strong> {{ issuanceDate }}</p>
          <p class="small text-muted"><strong>Expires on : </strong> {{ expirationDate }}</p>
          <p class="small text-muted"> <strong>File Size : </strong> {{ fileSize }}</p>
          <p class="small text-muted"><strong>File Type : </strong>{{ fileType }}</p>
         
        </div>
      </b-col>
      <hr>
      <b-col md="auto" class="px-2">
        <div class="mb-2">
          <p class="small text-muted"> <strong>Status :</strong> {{ status }}</p>
          <p class="small text-muted"> <strong>
              Proof : </strong>{{ proofs.proofValue }}</p>
        </div>
      </b-col>
    </b-row>
    <div class="card-footer text-center">
      <p class="small text-muted">{{ credential.issuer }} | {{ new Date(credential.issuanceDate).toLocaleDateString() }}
      </p>
    </div>
  </b-card>
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
