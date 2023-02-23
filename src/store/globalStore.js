/* eslint-disable */
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex)
const ssi_api_host = 'https://api.entity.hypersign.id/api/v1';
const globalStore = {
    namespaced: true,
    state: {
        ssiAPIKey: 'c8630a89fcf196df19bf2b76cea0f.f54d187140afb86dbcab1f8d0775da90185b179f668d70222253d7192c2330c854800584e258bd68f56da971661f3c480',
        ssiAppAccessTokenKey: 'ssiAppAccessTokenKey',  
        subjectDID: "",
        pdfDocument:null,
        signature:null,   
    },
    getters: {
        getSSIAppAccessToken: (state) => localStorage.getItem(state.ssiAppAccessTokenKey),
        getSSIHeaders: (state, getters) => {
            return {
                'Authorization': 'Bearer ' + getters.getSSIAppAccessToken,
                'Content-Type': 'application/json'
            }
        },
        getPDFDoc:(state, getters)=>{
            return state.pdfDocument
        },
        getSignature:(state, getters)=>{
            return state.signature
        }
    },
    mutations: {
        setSignature:(state, payload)=>state.signature=payload,
        setSsiAppAccessToken: (state, payload) => localStorage.setItem(state.ssiAppAccessTokenKey, payload),
        setSubjectDID: (state, payload) => state.subjectDID = payload,
        setPDFDoc: (state, payload) => state.pdfDocument=payload 
    },
    actions: {
        authenticateSSIAppAction: ({state, commit}) => {
            return new Promise((resolve, reject) => {
                const url = `${ssi_api_host}/app/oauth`
                fetch(url, {
                    method: 'POST',
                    headers: {
                        'X-Api-Secret-Key': state.ssiAPIKey
                    }
                }).then( resp => {
                    if(resp.statusCode == 400){
                        reject('Bad Request')
                    }
                    if(resp.statusCode == 401){
                        reject('Invalid API Secret Key')
                    }
                    return resp.json()
                }).then(json =>{
                    const { access_token } = json;
                    commit('setSsiAppAccessToken', access_token)
                    resolve()
                }).catch(e => {
                    reject(e.message)
                })
             })
        },
    }
}

export default globalStore;
