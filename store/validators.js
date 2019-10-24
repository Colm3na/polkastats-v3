import axios from 'axios';

export const state = () => ({
  list: []
})
  
export const mutations = {
  update (state, validators) {
    state.list = validators;
  },
  getters: function() {
    list: state => state.list
  }
}

export const actions = {
  update (context) {
    var validatorsTmp;
    axios.get('https://polkastats.io:8443/validators')
    //axios.get('https://polkastats.io/json/validators.json')
      .then(function (response) {
        var validatorsTmp = response.data;
        axios.get('https://polkastats.io:8443/offline')
          .then(function (response) {
            //console.log('Getting offline events ...');
            for (let i = 0; i < validatorsTmp.length; i++) {
              var tmp = []
              for (let j = 0; j < response.data.length; j++) {
                if (validatorsTmp[i].stashId == response.data[j][0]) {
                  //console.log('Offline Event | addr: ' + validatorsTmp[i].accountId + ' block: ' + response.data[j][1] + ' number: ' + response.data[j][2]);
                  tmp.push(
                    {
                      block: response.data[j][1],
                      number: response.data[j][2]
                    }
                  );
                }
              }
              validatorsTmp[i].offline = tmp;
              // Set isOffline to true if there are offline events reported
              if (validatorsTmp[i].offline.length > 0) {
                validatorsTmp[i].isOffline = true; 
              } else {
                validatorsTmp[i].isOffline = false; 
              }
            }
            context.commit('update', validatorsTmp);
          })
      })
  }
}