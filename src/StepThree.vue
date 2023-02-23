<template>
    <div style="padding: 2rem 3rem; text-align: left;">
        <div class="card" style="margin: 3rem">
            <p class="card-header-title">
                Type your signature
            </p>
            <div style="border: 5px solid #8080804f; margin: 20px; border-radius: 10px;">
                <VPerfectSignature :stroke-options="strokeOptions" ref="signaturePad" />
            </div>
            <div class="card-footer">
                <a class="card-footer-item" @click="canContinue">Download</a>
                <a class="card-footer-item">Save</a>
                <a class="card-footer-item" @click="clear">Clear</a>
            </div>    
        </div>
           
        
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
import VPerfectSignature from 'v-perfect-signature'
import {  mapGetters, mapMutations ,mapState } from 'vuex';

    export default {
        props: ['currentStep'],
        components: {VPerfectSignature},
        data(){
            return {
                strokeOptions: {
                    size: 5,
                    thinning: 0.75,
                    smoothing: 0.5,
                    streamline: 0.5,
                },
            
            }
        },
        computed:{
            ...mapGetters("globalStore", ["getPDFDoc","getSignature"]),
            ...mapState("globalStore", ["signature"])

        },
        methods: {
            ...mapMutations("globalStore",["setSignature"]),

            clear(){
                this.$refs.signaturePad?.clear()
            },
            toDataURL() {
                const dataURL = this.$refs.signaturePad.toDataURL()
                console.log(dataURL);
                fetch(dataURL)
                .then(res=>res.arrayBuffer())
                .then(         buff=>       this.setSignature(buff))
            },
          canContinue() {
            this.toDataURL()
              this.$emit('can-continue', {value: true});
          }
        },
        mounted() {
//            this.$emit('can-continue', {value: true})
        }
    }
</script>