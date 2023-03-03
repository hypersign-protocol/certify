import Vue from 'vue'
export default{
    methods: {
          notifySuccess(msg) {
            Vue.notify({
              group: "foo",
              title: "Information",
              type: "success",
              text: msg,
            });
          },
      
          notifyErr(msg) {
            Vue.notify({
              group: "foo",
              title: "Error",
              type: "error",
              text: msg,
            });
           
          },
          notifyWarning(msg) {
            
            Vue.notify({
              group: "foo",
              title: "Warning",
              type: "warn",
              text: msg,
            });
          },
          notifyInfo(msg) {
            Vue.notify({
              group: "foo",
              title: "Information",
              type: "info",
              text: msg,
            });
          },
       
       
    }
}