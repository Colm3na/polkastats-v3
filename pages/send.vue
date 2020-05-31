<template>
  <b-container>
    <div class="pt-4">
      <b-form class="mt-2" @submit="onSubmit" @reset="onReset">
        <b-row>
          <b-col md="12" lg="6">
            <b-form-group
              id="input-group-1"
              label="Hacer transferencia desde la dirección"
              label-for="input-1"
              class="w-100"
            >
              <b-form-select
                id="input-1"
                v-model="accountSelected"
                :options="accounts"
                required
                class="w-100"
              ></b-form-select>
              <div>
                <p
                  class="ml-2 mb-0 mt-1"
                  :style="
                    balanceEnough
                      ? 'font-size: 0.8rem;'
                      : 'font-size: 0.8rem; color: red'
                  "
                >
                  Balance: {{ accountSelectedBalance }}
                </p>
              </div>
            </b-form-group>
          </b-col>
          <b-col md="12" lg="6">
            <b-form-group
              id="input-group-3"
              label="Cantidad a enviar"
              label-for="input-3"
              class="w-100"
            >
              <b-row>
                <b-col cols="8" class="pr-1">
                  <b-form-input
                    id="input-3"
                    v-model="value"
                    required
                    placeholder="Cantidad"
                  ></b-form-input>
                </b-col>
                <b-col cols="2" class="pl-0">
                  <b-dropdown id="unities" :text="unitSelected" class="mb-0">
                    <b-dropdown-item @click="setUnit('pico')"
                      >Pico</b-dropdown-item
                    >
                    <b-dropdown-item @click="setUnit('nano')"
                      >Nano</b-dropdown-item
                    >
                    <b-dropdown-item @click="setUnit('micro')"
                      >Micro</b-dropdown-item
                    >
                    <b-dropdown-item @click="setUnit('mili')"
                      >Mili</b-dropdown-item
                    >
                    <b-dropdown-item @click="setUnit('KSM')"
                      >KSM</b-dropdown-item
                    >
                    <b-dropdown-item @click="setUnit('Kilo')"
                      >Kilo</b-dropdown-item
                    >
                    <b-dropdown-item @click="setUnit('Mega')"
                      >Mega</b-dropdown-item
                    >
                    <b-dropdown-item @click="setUnit('Giga')"
                      >Giga</b-dropdown-item
                    >
                    <b-dropdown-item @click="setUnit('Tera')"
                      >Tera</b-dropdown-item
                    >
                  </b-dropdown>
                </b-col>
              </b-row>
              <div>
                <p class="ml-2 mb-0 mt-1" style="font-size: 0.8rem">
                  Cantidad: {{ getValue() }}
                </p>
              </div>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <div class="w-100">
            <b-card no-body>
              <b-tabs card>
                <b-tab title="Transfer" active @click="isTransfer = true">
                  <b-form-group
                    id="input-group-2"
                    label="Hacia la dirección:"
                    label-for="input-2"
                    class="w-100"
                  >
                    <b-form-input
                      id="input-2"
                      v-model="accountDestiny"
                      required
                      placeholder="Address"
                      class="w-100"
                    ></b-form-input>
                  </b-form-group>
                </b-tab>
                <b-tab title="Staking" @click="isTransfer = false">
                  <b-form-group
                    id="search-group"
                    label="En Validador:"
                    label-for="input-2"
                    class="w-100"
                  >
                    <b-form-input
                      id="search"
                      v-model="searchQuery"
                      type="search"
                      placeholder="Buscar Validador por address"
                    />
                  </b-form-group>
                  <div v-if="validator">
                    <table>
                      <tr>
                        <th>Current Elected</th>
                        <th>Stakers</th>
                        <th>Commission</th>
                      </tr>
                      <tr>
                        <td>{{ validator.currentElected ? "YES" : "NO" }}</td>
                        <td>{{ validator.stakers.others.length }}</td>
                        <td>{{ validator.commission }}%</td>
                      </tr>
                    </table>

                    <div
                      v-if="validator.identity && validator.identity.display"
                      class="mt-2"
                      style="display: flex"
                    >
                      <Identicon
                        :key="validator.accountId"
                        :value="validator.accountId"
                        :size="20"
                        :theme="'polkadot'"
                      />
                      <span class="ml-2">{{ validator.identity.display }}</span>
                    </div>
                    <b-row class="mt-4">
                      <b-container>
                        <b-form-group label="Rewards destination">
                          <b-form-radio-group
                            id="radio-slots"
                            v-model="rewards"
                            :options="rewardsDestinations"
                            name="radio-rewards-destinations"
                          />
                        </b-form-group>
                      </b-container>
                    </b-row>
                  </div>
                  <div v-else>No se encuentra</div>
                </b-tab>
              </b-tabs>
            </b-card>
          </div>
        </b-row>
        <b-row>
          <div class="w-100 mt-3" style="text-align: right">
            <b-button type="submit" variant="primary" style="margin-right: 2rem"
              >Send</b-button
            >
            <b-button type="reset" variant="danger">Reset</b-button>
          </div>
        </b-row>
      </b-form>
      <b-card class="mt-3 w-100" :header="isTransfer ? 'Transfer' : 'Stake'">
        <div v-if="accounts.length !== 0">
          <ul>
            <li class="mt-0">
              Se van a {{ isTransfer ? "transferir" : "depositar" }} :
              {{ getValue() }}
            </li>
            <li class="mt-0">desde la cuenta: {{ accountSelected }}</li>

            <li v-if="isTransfer" class="mt-0">
              hacia la dirección: {{ accountDestiny }}
            </li>
            <li v-else class="mt-0">
              para Staking en el validador:
              {{
                validator && validator.identity
                  ? validator.identity.display
                  : validator && validator.accountId
                  ? validator.accountId
                  : ""
              }}
            </li>
            <br />
            <li class="mt-0">Estado de la operación: {{ state }}</li>
            <li v-if="transactionHash">Hash: {{ transactionHash }}</li>
          </ul>
          <p v-if="error">Ha habido un Error</p>
        </div>
        <div v-else>
          <p>No se ha detectado ninguna address de Polkadot</p>
        </div>
      </b-card>
    </div>
  </b-container>
</template>

<script>
import {
  web3Accounts,
  web3Enable,
  web3FromAddress,
  web3ListRpcProviders,
  web3UseRpcProvider
} from "@polkadot/extension-dapp";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { nodeURL } from "../polkastats.config";
import gql from "graphql-tag";
import * as R from "ramda";
import Identicon from "../components/identicon.vue";

export default {
  components: { Identicon },
  data() {
    return {
      accounts: [],
      accountSelected: "",
      accountSelectedBalance: 0,
      accountDestiny: null,
      api: null,
      balanceEnough: true,
      enableWeb3: false,
      error: null,
      state: "NO iniciada",
      value: 0,
      units: [
        "pico",
        "nano",
        "micro",
        "mili",
        "KSM",
        "Kilo",
        "Mega",
        "Giga",
        "Tera"
      ],
      unitSelected: "KSM",
      transactionHash: null,
      isTransfer: true,
      validators: [],
      searchQuery: "",
      validator: null,
      rewardsDestinations: ["Staked", "Stash", "Controller"],
      rewards: null
    };
  },
  computed: {
    identitiesLoaded() {
      return this.$store.state.identities.dataLoaded;
    },
    kusamaIdentitiesLoaded() {
      return this.$store.state.stakingIdentities.dataLoaded;
    }
  },
  watch: {
    accountSelected: async function() {
      this.accountSelectedBalance = await this.getBalance();
    },
    searchQuery: function() {
      this.searchValidators();
    },
    value: function() {
      this.balanceEnough = this.accountSelectedBalance >= this.getValue();
    }
  },
  created: async function() {
    this.enableWeb3 = await web3Enable("PolkaStats");

    web3Enable("PolkaStats")
      .then(() => {
        web3Accounts()
          .then(accounts => {
            const wsProvider = new WsProvider(nodeURL);

            ApiPromise.create({ provider: wsProvider }).then(api => {
              this.api = api;
              if (accounts.length > 0) {
                accounts.forEach(account =>
                  this.accounts.push(account.address)
                );
                this.accountSelected = this.accounts[0];
              }
            });
          })
          .catch(error => {
            console.log("Error: ", error);
          });
      })
      .catch(error => {
        console.log("Error: ", error);
      });
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      this.isTransfer ? this.makeTransfer() : this.makeStaking();
    },
    onReset(evt) {
      evt.preventDefault();

      this.accountSelected = null;
      this.accountSelectedBalance = 0;
      this.accountDestiny = null;
      this.enableWeb3 = false;
      this.balanceEnough = true;
      this.error = null;
      this.state = "NO iniciada";
      this.value = 0;
      this.transactionHash = null;
      this.validator = null;
      this.rewards = null;
    },
    setUnit(unit) {
      this.unitSelected = unit;
    },
    getValue() {
      switch (this.unitSelected) {
        case "pico":
          return this.value * 1;
        case "nano":
          return this.value * 1000;
        case "micro":
          return this.value * 1000000;
        case "mili":
          return this.value * 1000000000;
        case "KSM":
          return this.value * 1000000000000;
        case "Kilo":
          return this.value * 1000000000000000;
        case "Mega":
          return this.value * 1000000000000000000;
        case "Giga":
          return this.value * 1000000000000000000000;
        case "Tera":
          return this.value * 1000000000000000000000000;
      }
    },
    getIdentity(stashId) {
      let filteredArray = this.$store.state.identities.list.filter(obj => {
        return obj.accountId === stashId;
      });
      return filteredArray[0];
    },
    hasKusamaIdentity(stashId) {
      return this.$store.state.stakingIdentities.list.some(obj => {
        return obj.accountId === stashId;
      });
    },
    getKusamaIdentity(stashId) {
      let filteredArray = this.$store.state.stakingIdentities.list.filter(
        obj => {
          return obj.accountId === stashId;
        }
      );
      return filteredArray[0] ? filteredArray[0].identity : null;
    },
    async getBalance() {
      const {
        data: { free }
      } = await this.api.query.system.account(this.accountSelected);
      return free;
    },
    async makeTransfer() {
      this.state = "Iniciada";

      web3FromAddress(this.accountSelected).then(async injector => {
        this.api.setSigner(injector.signer);
        // const value = 10000000000;
        const value = this.getValue();

        const txHash = await this.api.tx.balances.transfer(
          this.accountDestiny,
          value
        );

        this.transactionHash = await txHash.signAndSend(this.accountSelected);
        this.state = "Finalizada";
      });
    },
    searchValidators: function() {
      const validator = this.validators.filter(
        validator => validator.accountId === this.searchQuery
      );
      this.validator = validator[0];
    },
    async makeStaking() {
      console.log("Desde Address: ", this.accountSelected);
      console.log("Al validador: ", this.validator);
      console.log("Cantidad: ", this.getValue());
      console.log("Destino recompensa: ", this.rewards);
    }
  },
  apollo: {
    $subscribe: {
      validators: {
        query: gql`
          subscription validator_staking {
            validator_staking(limit: 1, order_by: { timestamp: desc }) {
              json
            }
          }
        `,
        result({ data }) {
          const { validator_staking } = data;
          const validators = JSON.parse(validator_staking[0].json);

          const transformations = validator => {
            let stake = 0;

            let commission = 0;
            if (validator.validatorPrefs) {
              commission = validator.validatorPrefs.commission;
            }
            validator.commission = (commission / 10000000).toFixed(2);

            let identity = this.getIdentity(validator.accountId);
            if (identity !== [] && typeof identity !== "undefined") {
              validator.identity = identity.identity;
            } else {
              let kusamaIdentity = this.getKusamaIdentity(validator.accountId);
              if (kusamaIdentity) {
                validator.identity = kusamaIdentity;
              } else {
                validator.identity = null;
              }
            }
            validator.stakers = validator.exposure;
            validator.numStakers = validator.exposure.others.length;
          };
          R.mapObjIndexed(transformations, validators);

          this.validators = validators;
        },
        skip() {
          if (!this.identitiesLoaded) {
            this.$store.dispatch("identities/update");
            return true;
          }
          if (!this.kusamaIdentitiesLoaded) {
            this.$store.dispatch("stakingIdentities/update");
            return true;
          }
          return false;
        }
      }
    }
  }
};
</script>

<style scoped>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td,
th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}
</style>
