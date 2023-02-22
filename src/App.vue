<template>
  <div id="app">
    <vue-loader :active.sync="isLoading" :can-cancel="true" :is-full-page="true"></vue-loader>

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.4.1/css/bulma.min.css">
      <section class="hero">
          <div class="hero-body" style="padding: 1rem 0">
              <div class="container">
                  <div class="columns">
                      <div class="column is-12 is-offset-4" style="display: flex; align-items: center;">
                          <div class="is-pulled-left">
                              <img width="80px" src="./assets/logo.png">
                          </div>
                          <div class="is-pulled-left" style="text-align: left">
                              <h1 class="title text-medium-grey" style="margin-bottom: .5rem">
                                  Hypersign Certify
                              </h1>
                              <hr class="is-marginless">
                              <h2 class="subtitle text-light-grey" style="margin-top: .5rem">
                                  Decentralised Document Certifier
                              </h2>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      <section class="section" style="padding-top: .5rem">
          <div class="container">
              <div class="columns">
                  <div class="column is-8 is-offset-2">
                      <horizontal-stepper :steps="demoSteps" @completed-step="completeStep" :top-buttons="true"
                                          @active-step="isStepActive" @stepper-finished="alert"></horizontal-stepper>
                  </div>
              </div>
          </div>
      </section>

      <footer class="footer">
          <div class="container">
              <div class="content has-text-centered">
                  <p>
                      <strong>Powered</strong> by <a target="_blank"
                          :href="teamUrl">Hypersign</a>.
                  </p>
              </div>
          </div>
      </footer>
  </div>
</template>

<script>
  import HorizontalStepper from 'vue-stepper';
  import StepOne from './StepOne.vue';
  import StepTwo from './StepTwo.vue';
  import { mapActions, mapMutations, mapState } from 'vuex';
  import eventBus from "./eventBus";
  const teamUrl = 'https://hypersign.id';
  const repoUrl = 'https://github.com/PygmySlowLoris/vue-stepper';
  export default {
      name: 'app',
      components: {
          HorizontalStepper
      },
      computed: {
        ...mapState({
          selectedDashboard: state => state.globalStore.selectedDashboard,
        }),
      },
      data(){
          return {
            isLoading: false,
              repoUrl: repoUrl,
              teamUrl: teamUrl,
              demoSteps: [
                  {
                      icon: 'person',
                      name: 'first',
                      title: 'Onboarding',
                      subtitle: 'Create your decentralised identity',
                      component: StepOne,
                      completed: false
                  },
                  {
                      icon: 'report_problem',
                      name: 'second',
                      title: 'Sample title 2',
                      subtitle: 'Subtitle sample',
                      component: StepTwo,
                      completed: false
                  },
                  {
                      icon: 'announcement',
                      name: 'third',
                      title: 'Sample title 3',
                      subtitle: 'Subtitle sample',
                      component: StepOne,
                      completed: false
                  }
              ],
              activeStep: 0
          }
      },
      created(){
        eventBus.$on('updateLoader',   (isLoading) => {
          this.isLoading = isLoading;
        })
      },
      async mounted(){
        await this.authenticateSSIAppAction();
      },
      methods: {
        ...mapActions("globalStore", ["authenticateSSIAppAction"]),
        ...mapMutations("globalStore", ["fetchAppsListFromServer"]),
          completeStep(payload) {
              this.demoSteps.forEach((step) => {
                  if (step.name === payload.name) {
                      step.completed = true;
                  }
              })
          },
          isStepActive(payload) {
              this.demoSteps.forEach((step) => {
                  if (step.name === payload.name) {
                      if(step.completed === true) {
                          step.completed = false;
                      }
                  }
              })
          },
          alert() {
              alert('end')
          }
      }
  }
</script>

<style scoped>
  #app {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #2c3e50;
  }
  .pointer {
      cursor: pointer;
  }
  h1, h2 {
      font-weight: normal;
  }
  hr {
      background-color: transparent;
      border: none;
      display: block;
      height: inherit;
      margin: 1.5rem 0;
      border-top: dashed 1px;
  }
  li {
      display: inline-block;
      margin: 0 10px;
  }
  a {
      color: #0b99b9;
      text-decoration: underline;
  }
  .text-medium-grey {
      color: #333;
  }
  .text-light-grey {
      color: #888;
  }
  .box.formated {
      position: relative;
      padding: 0;
  }
  .box.formated .heading {
      font-size: 1rem;
      text-transform: capitalize;
      padding: .8rem 1.5rem;
      background-color: #fafafa;
  }
  .box.formated .content {
      padding: 1rem 2rem;
  }
  i.top-left {
      position: absolute;
      left: 1.5rem;
      top: 0.8rem;
  }
  .vertical-separator {
      display: flex;
      justify-content: space-around;
  }
  .vertical-separator .line {
      border-right: 1px solid #cccccc;
  }
</style>