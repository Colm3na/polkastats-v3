<template>
  <b-container>
    <div class="pt-4">
      <b-form @submit="onSubmit" @reset="onReset">
        <b-form-group
          id="input-group-1"
          label="Hacer transferencia desde la dirección"
          label-for="input-1"
        >
          <b-form-select
            id="input-1"
            v-model="accountSelected"
            :options="accounts"
            required
          ></b-form-select>
        </b-form-group>

        <b-form-group
          id="input-group-2"
          label="Hacia la dirección:"
          label-for="input-2"
        >
          <b-form-input
            id="input-2"
            v-model="accountDestiny"
            required
            placeholder="Address"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="input-group-3"
          label="Cantidad a enviar"
          label-for="input-3"
        >
          <b-form-input
            id="input-3"
            v-model="value"
            required
            placeholder="Cantidad"
          ></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary">Submit</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>
      </b-form>
      <b-card class="mt-3" header="Form Data Result">
        <div v-if="accounts.length !== 0">
          <pre class="m-0">Se van a mandar: {{ value }}</pre>
          <pre class="m-0">
desde la cuenta:  {{ accountSelected }} con balance: {{ getBalance() }}</pre
          >
          <pre class="m-0">hacia la dirección: {{ accountDestiny }}</pre>
          <br />
          <pre class="m-0">Estado de la operación: {{ state }}</pre>
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

export default {
  data() {
    return {
      accounts: [],
      accountSelected: null,
      accountDestiny: null,
      api: null,
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
      unitSelected: "KSM"
    };
  },
  created: async function() {
    this.enableWeb3 = await web3Enable("PolkaStats");
    const allAccounts = await web3Accounts();
    if (allAccounts.length > 0) {
      allAccounts.forEach(account => this.accounts.push(account.address));
      this.accountSelected = this.accounts[0];
    }

    const wsProvider = new WsProvider(nodeURL);

    this.api = await ApiPromise.create({ provider: wsProvider });
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      this.makeTransfer();
    },
    onReset(evt) {
      evt.preventDefault();
      // Reset our form values
      this.accountSelected = this.accounts[0];
      this.accountSelectedBalance = 0;
      this.accountDestiny = null;
      this.enableWeb3 = false;
      this.error = null;
      this.state = "NO iniciada";
      this.value = 0;
    },
    getValue() {
      switch (this.unitSelected) {
        case "pico":
          return this.value * 1000000000000;
        case "nano":
          return this.value * 1000000000;
        case "micro":
          return this.value * 1000000;
        case "mili":
          return this.value * 1000;
        case "KSM":
          return this.value * 1;
        case "Kilo":
          return this.value * 0.001;
        case "Mega":
          return this.value * 0.000001;
        case "Giga":
          return this.value * 0.000000001;
        case "Tera":
          return this.value * 0.000000000001;
      }
    },
    async getBalance() {
      console.log("API: ", this.api);

      const balance = await this.api.query.system.account(this.accountSelected);
      return balance;
    },
    async makeTransfer() {
      this.state = "Iniciada";

      web3FromAddress(this.accountSelected).then(async injector => {
        console.log("Injector: ", injector);
        this.api.setSigner(injector.signer);
        const value = 10000000000;

        const txHash = await this.api.tx.balances
          .transfer(this.accountDestiny, value)
          .signAndSend(this.accountSelected)
          .subscribe(({ status }) => this.state);
      });
    }
  }
};
</script>
