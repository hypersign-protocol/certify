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
        <!-- <div class="field">
            <div class="control">
                <button class="btn btn-primary" @click="createNewDID()">Create New Id</button>
            </div>
        </div> -->

        <div class="">
            <label class="label">Your DID</label>

            <div class="input-group mb-3">
                <input type="text" class="form-control" 
                    :class="['form-control', ($v.didSubject.$error) ? 'is-danger' : '']"
                    disabled
                    v-model="didSubject"
                    placeholder="did:hid:testnet:123123" aria-label="did:hid:testnet:123123" aria-describedby="basic-addon2">
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary" @click="createNewDID()"><b-icon icon="person-fill"></b-icon> Create New Id</button>
                </div>
                
            </div>
            <p v-if="$v.didSubject.$error" class="help is-danger">Please create your identity first</p>
        </div>
    </div>
</template>

<script>
    import {validationMixin} from 'vuelidate'
    import {required} from 'vuelidate/lib/validators'
    import { mapState, mapGetters, mapMutations  } from 'vuex';
    import eventBus from "./eventBus";

    const ssi_api_host = 'https://api.entity.hypersign.id/api/v1';
    export default {
        props: ['clickedNext', 'currentStep'],
        mixins: [validationMixin],
        validations: {
            didSubject: {
                required
            }
        },
        computed: {
            ...mapGetters("globalStore", ["getSSIHeaders","getSSIAppAccessToken"]),
            ...mapState("globalStore", ["subjectDID"]),
            didSubject: {
                        get () {
                            return this.subjectDID
                        },
                        set (value) {
                            this.setSubjectDID(value)
                        }
                    }
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
                    this.$v.didSubject.$touch();
                }
            }
        },
        mounted() {
            console.log(this.$v.$invalid)
            console.log(this.$v)
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
                    if(this.didSubject){
                        console.error("You identity already created")
                        return 
                    }
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
                    this.didSubject = did;
                    // this.setSubjectDID(this.form.did)
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