<template>
  <b-container>
    <div class="pt-4">
      <b-form class="mt-2" @submit="onSubmit">
        <b-row>
          <b-col md="12" lg="6">
            <b-form-group
              id="input-group-1"
              label="From:"
              label-for="input-1"
              class="w-100"
            >
              <b-form-select
                id="input-1"
                v-model="selectedAddress"
                :options="extensionAddresses"
                required
                class="w-100"
              ></b-form-select>
              <div>
                <p
                  class="ml-2 mb-0 mt-1"
                  :style="
                    enoughBalance
                      ? 'font-size: 0.8rem;'
                      : 'font-size: 0.8rem; color: red'
                  "
                >
                  Transferable balance: {{ formatAmount(tranferableBalance) }}
                </p>
              </div>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="12" lg="6">
            <b-form-group
              id="input-group-3"
              label="Amount:"
              label-for="input-3"
              class="w-100"
            >
              <b-row>
                <b-col cols="8" class="pr-1">
                  <b-form-input
                    id="input-3"
                    v-model="amount"
                    required
                    placeholder="Amount"
                  ></b-form-input>
                </b-col>
                <b-col cols="4">
                  <b-dropdown
                    id="units"
                    :text="selectedUnit"
                    class="mb-0 btn-block"
                  >
                    <b-dropdown-item @click="setUnit('pico')"
                      >pico</b-dropdown-item
                    >
                    <b-dropdown-item @click="setUnit('nano')"
                      >nano</b-dropdown-item
                    >
                    <b-dropdown-item @click="setUnit('micro')"
                      >micro</b-dropdown-item
                    >
                    <b-dropdown-item @click="setUnit('mili')"
                      >mili</b-dropdown-item
                    >
                    <b-dropdown-item @click="setUnit('KSM')"
                      >KSM</b-dropdown-item
                    >
                    <b-dropdown-item @click="setUnit('kilo')"
                      >kilo</b-dropdown-item
                    >
                    <b-dropdown-item @click="setUnit('mega')"
                      >mega</b-dropdown-item
                    >
                    <b-dropdown-item @click="setUnit('giga')"
                      >giga</b-dropdown-item
                    >
                    <b-dropdown-item @click="setUnit('tera')"
                      >tera</b-dropdown-item
                    >
                  </b-dropdown>
                </b-col>
              </b-row>
              <div>
                <p class="ml-2 mb-0 mt-1" style="font-size: 0.8rem">
                  Amount: {{ formatAmount(getAmount()) }}
                </p>
              </div>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="12" lg="6">
            <b-form-group
              id="input-group-2"
              label="To:"
              label-for="input-2"
              class="w-100"
            >
              <b-form-input
                id="input-2"
                v-model="targetAddress"
                required
                placeholder="Address"
                class="w-100"
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="12" lg="6">
            <b-alert variant="warning" class="my-2" :show="selectedAddress">
              <p class="my-2 text-center">
                <span v-if="selectedAddress">
                  Send
                  <span v-if="getAmount() > 0">
                    {{ formatAmount(getAmount()) }}
                  </span>
                  from
                  <Identicon
                    :key="selectedAddress"
                    :value="selectedAddress"
                    :size="20"
                    :theme="'polkadot'"
                  />
                  {{ shortAddress(selectedAddress) }}
                </span>
                <span v-if="targetAddress">
                  to
                  <Identicon
                    :key="targetAddress"
                    :value="targetAddress"
                    :size="20"
                    :theme="'polkadot'"
                  />
                  {{ shortAddress(targetAddress) }}
                </span>
              </p>
            </b-alert>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="12" lg="6">
            <b-form-group
              id="input-group-3"
              label=" "
              label-for="input-3"
              class="w-100"
            >
              <b-button type="submit" variant="primary" class="btn-block"
                >Send</b-button
              >
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
      <b-alert variant="success" :show="extrinsicHash">
        <h3>Transaction successfully broadcasted!</h3>
        <h4>Extrinsic hash is {{ extrinsicHash }}</h4>
      </b-alert>
      <b-alert variant="alert" :show="error">
        <p>ERROR: {{ error }}</p>
      </b-alert>
      <b-alert variant="alert" :show="extensionAccounts.length === 0">
        <p>No address found!</p>
      </b-alert>
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
import Identicon from "../components/identicon.vue";
import commonMixin from "../mixins/commonMixin.js";

export default {
  components: { Identicon },
  mixins: [commonMixin],
  data() {
    return {
      extensionAccounts: [],
      extensionAddresses: [],
      selectedAccount: null,
      selectedAddress: null,
      tranferableBalance: 0,
      targetAddress: null,
      api: null,
      enoughBalance: true,
      enableWeb3: false,
      error: null,
      state: "Not started yet",
      amount: 0,
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
      selectedUnit: "KSM",
      extrinsicHash: null
    };
  },
  watch: {
    selectedAccount: async function() {
      this.tranferableBalance = await this.getBalance();
    },
    searchQuery: function() {
      this.searchValidators();
    },
    amount: function() {
      this.enoughBalance = this.tranferableBalance >= this.getAmount();
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
                this.extensionAccounts = accounts;
                accounts.forEach(account =>
                  this.extensionAddresses.push(account.meta.name)
                );
                this.selectedAccount = this.extensionAccounts[0];
                this.selectedAddress = this.extensionAddresses[0];
                console.log(`extensionAccounts:`, this.extensionAccounts);
                console.log(`selectedAccount:`, this.selectedAccount);
                console.log(`selectedAddress:`, this.selectedAddress);
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
      this.send();
    },
    setUnit(unit) {
      this.selectedUnit = unit;
    },
    getAmount() {
      switch (this.selectedUnit) {
        case "pico":
          return this.amount;
        case "nano":
          return this.amount * 1000;
        case "micro":
          return this.amount * 1000000;
        case "mili":
          return this.amount * 1000000000;
        case "KSM":
          return this.amount * 1000000000000;
        case "kilo":
          return this.amount * 1000000000000000;
        case "mega":
          return this.amount * 1000000000000000000;
        case "giga":
          return this.amount * 1000000000000000000000;
        case "tera":
          return this.amount * 1000000000000000000000000;
      }
    },
    async getBalance() {
      const { availableBalance } = await this.api.derive.balances.all(
        this.selectedAddress
      );
      return availableBalance;
    },
    async send() {
      this.state = "Started";

      web3FromAddress(this.selectedAccount.address).then(async injector => {
        this.api.setSigner(injector.signer);
        const amount = this.getAmount();

        const extrinsic = await this.api.tx.balances.transfer(
          this.targetAddress,
          amount
        );
        console.log(`extrinsic:`, extrinsic);
        this.extrinsicHash = await extrinsic.signAndSend(
          this.selectedAccount.address
        );
        this.state = "Finished";
      });
    }
  }
};
</script>

<style>
.identicon {
  display: inline-block;
}
</style>
