<template>
    <div style="padding: 2rem 3rem; text-align: left;">
        <!-- <div class="field">
            <label class="label">Username</label>
            <div class="control">
                <input :class="['input', ($v.form.username.$error) ? 'is-danger' : '']" type="text" placeholder="Text input"
                       v-model="form.username">
            </div>
            <p v-if="$v.form.username.$error" class="help is-danger">This username is invalid</p>
        </div> -->
        <!-- <div class="field">
            <label class="label">Email</label>
            <div class="control">
                <input :class="['input', ($v.form.demoEmail.$error) ? 'is-danger' : '']"  type="text" placeholder="Email input" v-model="form.demoEmail">
            </div>
            <p v-if="$v.form.demoEmail.$error" class="help is-danger">This email is invalid</p>
        </div> -->
        <!-- <div class="field">
            <label class="label">Message</label>
            <div class="control">
                <textarea :class="['textarea', ($v.form.message.$error) ? 'is-danger' : '']"  placeholder="Textarea" v-model="form.message"></textarea>
            </div>
        </div> -->

        <div class="field">
            <div class="control">
                <button class="btn btn-primary" @click="createNewDID()">Create New Id</button>
            </div>
        </div>

        <div class="field">
            <label class="label">Your DID</label>
            <div class="control">
                <input 
                :class="['input', ($v.form.did.$error) ? 'is-danger' : '']"  
                type="text" placeholder="did:hid:testnet:123123" 
                v-model="form.did" 
                disabled>
            </div>
            <p v-if="$v.form.did.$error" class="help is-danger">Please create your identity first</p>
        </div>
    </div>
</template>

<script>
    import {validationMixin} from 'vuelidate'
    import {required} from 'vuelidate/lib/validators'
    import { mapGetters, mapMutations  } from 'vuex';
  import eventBus from "./eventBus";

    const ssi_api_host = 'https://api.entity.hypersign.id/api/v1';
    export default {
        props: ['clickedNext', 'currentStep'],
        mixins: [validationMixin],
        data() {
            return {
                form: {
                    did:""
                }
            }
        },
        validations: {
            form: {
                did: {
                    required
                }
            }
        },
        computed: {
            ...mapGetters("globalStore", ["getSSIHeaders","getSSIAppAccessToken"]),
        },  
        watch: {
            $v: {
                handler: function (val) {
                    if(!val.$invalid) {
                        this.$emit('can-continue', {value: true});
                    } else {
                        this.$emit('can-continue', {value: false});
                        setTimeout(()=> {
                            this.$emit('change-next', {nextBtnValue: false});
                        }, 3000)
                    }
                },
                deep: true
            },
            clickedNext(val) {
                console.log(val);
                if(val === true) {
                    this.$v.form.$touch();
                }
            }
        },
        mounted() {
            if(!this.$v.$invalid) {
                this.$emit('can-continue', {value: true});
            } else {
                this.$emit('can-continue', {value: false});
            }
        },
        methods: {
            ...mapMutations("globalStore", ['setSubjectDID']),
            async createNewDID() {
                try{
                    // create a new did Doc
                    eventBus.$emit('updateLoader', true);

                    const createDIDUrl = `${ssi_api_host}/did/create`
                    const body =  {
                       "namespace": "testnet"
                    }
                    const respCreatDID = await fetch(createDIDUrl, {
                        method: 'POST',
                        headers:  this.getSSIHeaders,
                        body: JSON.stringify(body)
                    }) 
                    const createDIDJson = await respCreatDID.json();
                    if(respCreatDID.status == 400){
                        throw new Error(createDIDJson.message.toString())
                    }
                    const { did } = createDIDJson;
                    this.form.did = did;
                    this.setSubjectDID(this.form.did)
                    // register a new did doc
                }catch(e){
                    console.error(e.message);
                } finally {
                    eventBus.$emit('updateLoader', false);
                }
            }
        }

    }
</script>