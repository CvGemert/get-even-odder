;(function () {
  Vue.use(Vuex)

  function randomId () {
    return Math.random()
      .toString()
      .substr(2, 10)
  }

  const store = new Vuex.Store({
    state: {
      answers: [],
      newAnswer: ''
    },
    getters: {
      newAnswer: state => state.newAnswer,
      answers: state => state.answers
    },
    mutations: {
      SET_answers (state, answers) {
        state.answers = answers
      },
      SET_NEW_answer (state, answer) {
        if (answer % 2 == 0) {
          state.newAnswer = answer + ' is an even number'
        } else if (answer % 2 == 1) {
          state.newAnswer = answer + ' is an odd number'
        }
      },
      ADD_answer (state, answerObject) {
        console.log('add answer', answerObject)
        state.answers.push(answerObject)
      }
    },
    actions: {
      loadAnswers ({ commit }) {
        commit('SET_LOADING', true)
        axios
          .get('/answers')
          .then(r => r.data)
          .then(answers => {
            commit('SET_answers', answers)
            commit('SET_LOADING', false)
          })
      },
      setnewAnswer ({ commit }, answer) {
        commit('SET_NEW_answer', answer)
      },
      addAnswer ({ commit, state }) {
        if (!state.newAnswer) {
          return
        }
        const answer = {
          title: state.newAnswer,
          id: randomId()
        }
        axios.post('/answers', answer).then(_ => {
          commit('ADD_answer', answer)
        })
      },
      clearnewAnswer ({ commit }) {
        commit('CLEAR_NEW_answer')
      }
    }
  })

  // app Vue instance
  const app = new Vue({
    store,
    data: {
      file: null
    },
    el: '.wrapper',

    created () {
      this.$store.dispatch('loadAnswers')
    },
    computed: {
      newAnswer () {
        return this.$store.getters.newAnswer
      },
      answers () {
        return this.$store.getters.answers
      }
    },
    methods: {
      setnewAnswer (e) {
        this.$store.dispatch('setnewAnswer', e.target.value)
      },
      addAnswer (e) {
        e.target.value = ''
        this.$store.dispatch('addAnswer')
        this.$store.dispatch('clearnewAnswer')
      }
    }
  })
})()
