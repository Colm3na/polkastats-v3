<template>
  <b-container class="py-4">
    <b-row>
      <b-col md="12">
        <h1 class="mb-4">Stake KSM using Polkadot JS extension</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="7 mb-4">
        <b-form class="mt-2" @submit="onSubmit">
          <b-form-group
            id="input-group-from"
            label="From:"
            label-for="input-from"
            class="w-100"
          >
            <b-form-select
              id="input-from"
              v-model="$v.selectedAddress.$model"
              :options="extensionAddresses"
              :state="validateState('selectedAddress')"
              aria-describedby="selectedAddress-feedback"
              class="w-100"
            ></b-form-select>
            <div>
              <p class="ml-2 mb-0 mt-1">
                Transferable balance: {{ formatAmount(tranferableBalance) }}
              </p>
            </div>
            <b-form-invalid-feedback id="selectedAddress-feedback"
              >Please install extension, import an account and allow access
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            id="input-group-amount"
            label="Amount:"
            label-for="input-amount"
            class="w-100"
          >
            <b-row>
              <b-col cols="8" class="pr-1">
                <b-form-input
                  id="input-amount"
                  v-model="$v.amount.$model"
                  type="number"
                  :state="validateState('amount')"
                  aria-describedby="amount-feedback"
                  placeholder="Amount"
                ></b-form-input>
                <b-form-invalid-feedback id="amount-feedback"
                  >Please enter a positive amount, less or equal to
                  {{ formatAmount(tranferableBalance) }}
                </b-form-invalid-feedback>
              </b-col>
              <b-col cols="4">
                <b-dropdown
                  id="units"
                  :text="selectedUnit"
                  class="mb-0 btn-block"
                >
                  <b-dropdown-item
                    v-for="unit in units"
                    :key="unit"
                    @click="setUnit(unit)"
                  >
                    {{ unit }}
                  </b-dropdown-item>
                </b-dropdown>
              </b-col>
            </b-row>
            <div>
              <p class="ml-2 mb-0 mt-1" style="font-size: 0.8rem">
                Amount: {{ formatAmount(getAmount()) }}
              </p>
            </div>
          </b-form-group>

          <b-form-group
            id="input-group-targetValidator"
            label="Select your validator:"
            label-for="input-targetValidator"
            class="w-100"
          >
            <b-form-input
              id="input-targetValidator"
              v-model="$v.targetValidator.$model"
              class="d-none"
              :state="validateState('targetValidator')"
              aria-describedby="targetValidator-feedback"
              placeholder="Target validator"
            ></b-form-input>
            <b-form-invalid-feedback id="targetValidator-feedback"
              >Please select a validator
            </b-form-invalid-feedback>
          </b-form-group>

          <!-- Filter -->
          <b-form-input
            id="filterInput"
            v-model="filter"
            type="search"
            placeholder="Search validator..."
            class="mb-3"
          />
          <!-- Table with sorting and pagination-->
          <div class="table-responsive">
            <b-table
              ref="selectableTable"
              selectable
              stacked="md"
              head-variant="dark"
              :fields="fields"
              :items="filteredValidators"
              :per-page="perPage"
              :current-page="currentPage"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              :select-mode="selectMode"
              selected-variant="success"
              :filter="filter"
              :filter-included-fields="filterOn"
              @filtered="onFiltered"
              @row-selected="onRowSelected"
            >
              <template v-slot:cell(selected)="{ rowSelected }">
                <template v-if="rowSelected">
                  <span aria-hidden="true">&check;</span>
                  <span class="sr-only">Selected</span>
                </template>
                <template v-else>
                  <span aria-hidden="true">&nbsp;</span>
                  <span class="sr-only">Not selected</span>
                </template>
              </template>
              <template v-slot:cell(accountId)="data">
                <p class="mb-0">
                  <Identicon
                    :key="data.item.accountId"
                    :value="data.item.accountId"
                    :size="20"
                    :theme="'polkadot'"
                  />
                  <span v-if="data.item.name">
                    {{ data.item.name }}
                  </span>
                  <span v-else>
                    {{ shortAddress(data.item.accountId) }}
                  </span>
                </p>
              </template>
              <template v-slot:cell(commission)="data">
                <p class="text-right mb-0">{{ data.item.commission }}%</p>
              </template>
            </b-table>
          </div>
          <!-- Pagination -->
          <div style="display: flex">
            <b-pagination
              v-model="currentPage"
              :total-rows="totalRows"
              :per-page="perPage"
              aria-controls="validators-table"
            />
            <b-button-group class="mx-4">
              <b-button
                v-for="(item, index) in tableOptions"
                :key="index"
                @click="handleNumFields(item)"
              >
                {{ item }}
              </b-button>
            </b-button-group>
          </div>
          <b-alert
            v-if="!this.$v.$invalid && !extrinsicHash"
            variant="success"
            class="my-2"
            fade
            show
          >
            <p class="my-2 text-center">
              <span v-if="selectedAddress">
                Stake
                <span v-if="getAmount() > 0">
                  {{ formatAmount(getAmount()) }}
                </span>
              </span>
              <span v-if="targetValidator">
                in
                <span v-if="targetValidatorName">
                  {{ targetValidatorName }}
                </span>
                <Identicon
                  :key="targetValidator"
                  :value="targetValidator"
                  :size="20"
                  :theme="'polkadot'"
                />
                {{ shortAddress(targetValidator) }}
              </span>
            </p>
          </b-alert>
          <b-alert
            v-if="extrinsicHash"
            variant="success"
            class="text-center"
            fade
            show
          >
            <h4>Transaction sent!</h4>
            <p>Extrinsic hash is {{ extrinsicHash }}</p>
          </b-alert>
          <b-button
            type="submit"
            variant="primary"
            class="btn-send btn-block mt-3"
          >
            <i class="fas fa-paper-plane mr-2"></i> Stake
          </b-button>
        </b-form>
      </b-col>
      <b-col md="5">
        <b-alert variant="warning" class="mb-3" show>
          <h2>Warning, experimental!</h2>
          <p>
            By now staking it's only possible for addresses without any bond
            (i.e. accounts that didn't issue any staking action yet). The same
            address will be used as stash and controller.
          </p>
        </b-alert>
        <b-card>
          <h2>How to stake KSM</h2>
          <p>
            Now you can stake KSM tokens using PolkaStats &
            <a href="https://github.com/polkadot-js/extension" target="_blank"
              >Polkadot JS extension</a
            >
            in a safe way.
          </p>
          <ul>
            <li>
              First of all you need a <strong>Kusama account</strong> with some
              <strong>free balance</strong>.
            </li>
            <li>
              Install Polkadot JS extension from
              <a
                href="https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd?hl=es"
                target="_blank"
                >chrome web store</a
              >.
            </li>
            <li>Import your existings account/s or create a new one.</li>
            <li>Refresh this page and allow to access the extension.</li>
            <li>Fill the form and sign the transaction in the extension!</li>
          </ul>
        </b-card>
      </b-col>
    </b-row>
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
import { validationMixin } from "vuelidate";
import { required, integer, minValue } from "vuelidate/lib/validators";
import { numItemsTableOptions } from "../polkastats.config.js";

const isValidAddress = address => {
  return address.length === 47;
};

const isValidAmount = (amount, vm) =>
  amount > 0 && vm.getAmount() <= parseInt(vm.tranferableBalance.toString());

export default {
  components: { Identicon },
  mixins: [commonMixin, validationMixin],
  data() {
    return {
      extensionAccounts: [],
      extensionAddresses: [],
      selectedAccount: null,
      selectedAddress: null,
      tranferableBalance: 0,
      targetValidator: "",
      targetValidatorName: "",
      api: null,
      enableWeb3: false,
      error: null,
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
      extrinsicHash: null,

      tableOptions: numItemsTableOptions,
      perPage: localStorage.numItemsTableSelected
        ? parseInt(localStorage.numItemsTableSelected)
        : 10,
      currentPage: 1,
      sortBy: `favorite`,
      sortDesc: true,
      filter: null,
      filterOn: [],
      totalRows: 1,
      fields: [
        {
          key: "selected",
          label: ""
        },
        {
          key: "accountId",
          label: "Validator",
          sortable: true,
          filterByFormatted: true
        },
        {
          key: "commission",
          label: "Commission",
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`
        }
      ],
      selected: [],
      selectMode: `single`
    };
  },
  validations: {
    selectedAddress: {
      required,
      isValidAddress
    },
    amount: {
      required,
      integer,
      minValue: 1,
      isValidAmount
    },
    targetValidator: {
      required,
      isValidAddress
    }
  },
  computed: {
    filteredValidators() {
      return this.$store.state.validators.list.map(validator => {
        const { identity } = this.getIdentity(validator.accountId);
        let name = "";
        if (identity) {
          if (
            identity.displayParent &&
            identity.displayParent !== `` &&
            identity.display &&
            identity.display !== ``
          ) {
            name = `${identity.displayParent} / ${identity.display}`;
          } else {
            name = identity.display || ``;
          }
        }
        return {
          name,
          accountId: validator.accountId,
          commission: (validator.validatorPrefs.commission / 10000000).toFixed(
            2
          )
        };
      });
    },
    validators() {
      return this.$store.state.validators.list;
    },
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key };
        });
    }
  },
  watch: {
    selectedAccount: async function() {
      this.tranferableBalance = await this.getBalance();
    }
  },
  created: async function() {
    // Load validators from store if empty
    if (this.$store.state.validators.list.length == 0) {
      await this.$store.dispatch("validators/update");
    }
    this.totalRows = this.$store.state.validators.list.length;

    // Load identities from store if empty
    if (this.$store.state.identities.list.length == 0) {
      await this.$store.dispatch("identities/update");
    }

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
    validateState(name) {
      const { $dirty, $error } = this.$v[name];
      return $dirty ? !$error : null;
    },
    onSubmit(evt) {
      evt.preventDefault();
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.stake();
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
    async stake() {
      web3FromAddress(this.selectedAccount.address).then(async injector => {
        this.api.setSigner(injector.signer);
        const amount = this.getAmount();
        const rewardDestination = 0;
        let transactions = [];
        transactions.push(
          await this.api.tx.staking.bond(
            this.selectedAccount.address,
            amount,
            rewardDestination
          )
        );
        transactions.push(
          await this.api.tx.staking.nominate([this.targetValidator])
        );
        const extrinsic = await this.api.tx.utility.batch(transactions);
        this.extrinsicHash = await extrinsic.signAndSend(
          this.selectedAccount.address
        );
      });
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    onRowSelected(items) {
      this.targetValidator = items[0] ? items[0].accountId : "";
      this.targetValidatorName = items[0] ? items[0].name : "";
      this.selected = items;
    },
    handleNumFields(num) {
      localStorage.numItemsTableSelected = num;
      this.perPage = parseInt(num);
    },
    getIdentity(stashId) {
      return (
        this.$store.state.identities.list.find(
          identity => identity.accountId === stashId
        ) || {}
      );
    }
  }
};
</script>

<style>
.identicon {
  display: inline-block;
}
.btn-send {
  background-color: #c51062 !important;
  border-color: #c51062 !important;
  box-shadow: none !important;
}
.btn-send:hover,
.btn-send:active,
.btn-send:visited {
  background-color: #ef1073 !important;
  border-color: #ef1073 !important;
  box-shadow: 0 0 0 0.2rem rgba(239, 16, 115, 0.5) !important;
}
</style>