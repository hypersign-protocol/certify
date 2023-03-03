/* eslint-disable */
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex)
const ssi_api_host = 'https://api.entity.hypersign.id/api/v1';
const globalStore = {
    namespaced: true,
    state: {
        ssiAPIKey: '764840749413568265abfaa7d76b9.87810ca9cc65894e3473851729f205c650b91756e8f3bd93deea6c8ed8d4ea6620c2d4d7b4ba84e7718a491fb558a6552',
        ssiAppAccessTokenKey: 'ssiAppAccessTokenKey',
        subjectDID: "",
        pdfDocObject: {},


    },
    getters: {
        getSSIAppAccessToken: (state) => localStorage.getItem(state.ssiAppAccessTokenKey),
        getSSIHeaders: (state, getters) => {
            return {
                'Authorization': 'Bearer ' + getters.getSSIAppAccessToken,
                'Content-Type': 'application/json'
            }
        },
        getPDFDoc: (state, getters) => {
            return state.pdfDocObject
        },
        getSubjectDID: (state, getters) => {
            return state.subjectDID
        }

    },
    mutations: {
        setSsiAppAccessToken: (state, payload) => localStorage.setItem(state.ssiAppAccessTokenKey, payload),
        setSubjectDID: (state, payload) => state.subjectDID = payload,
        setPDFDoc: (state, payload) => state.pdfDocObject = payload
    },
    actions: {
        authenticateSSIAppAction: ({ state, commit }) => {
            return new Promise((resolve, reject) => {
                const url = `${ssi_api_host}/app/oauth`
                fetch(url, {
                    method: 'POST',
                    headers: {
                        'X-Api-Secret-Key': state.ssiAPIKey
                    }
                }).then(resp => {
                    if (resp.statusCode == 400) {
                        reject('Bad Request')
                    }
                    if (resp.statusCode == 401) {
                        reject('Invalid API Secret Key')
                    }
                    return resp.json()
                }).then(json => {
                    const { access_token } = json;
                    commit('setSsiAppAccessToken', access_token)
                    resolve()
                }).catch(e => {
                    reject(e.message)
                })
            })
        },
        verifyCredential(context, payload) {
            return new Promise((resolve, reject) => {
                const headers = context.getters.getSSIHeaders
                const url = `${ssi_api_host}/credential/verify`
                fetch(url, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(payload)
                }).then(resp => {
                    console.log(resp);
                    if (resp.statusCode == 400) {
                        reject('Bad Request')
                    }
                    if (resp.statusCode == 401) {
                        reject('Invalid Access Token')
                    }
                    if (resp.statusCode == 500) {
                        reject(resp.message)
                    }
                    if (resp.status == 500) {
                        reject(resp.message)
                    }
                    return resp.json()
                }).then(json => {

                    resolve(json)
                }).catch(e => {
                    reject(e.message)
                })

            })
        },

        issueCredential: (context, payload) => {
            return new Promise((resolve, reject) => {
                const headers = context.getters.getSSIHeaders
                const url = `${ssi_api_host}/credential/issue`
                fetch(url, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(payload)
                }).then(resp => {
                    console.log(resp);
                    if (resp.statusCode == 400) {
                        reject('Bad Request')
                    }
                    if (resp.statusCode == 401) {
                        reject('Invalid Access Token')
                    }
                    if (resp.statusCode == 500) {
                        reject(resp.message)
                    }
                    if (resp.status == 500) {
                        reject(resp.message)
                    }
                    return resp.json()
                }).then(json => {

                    resolve(json)
                }).catch(e => {
                    reject(e.message)
                })

            })
        }
    }
}

export default globalStore;
