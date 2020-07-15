<template>
  <b-container class="py-4">
    <b-row>
      <b-col md="12">
        <h1 class="mb-4">
          Send {{ network.denom }}s using Polkadot JS extension
        </h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="6 mb-4">
        <b-alert v-if="!detectedExtension" variant="danger" show>
          <i class="fa fa-frown-o"></i> No Polkadot JS extension found, please
          install it.
        </b-alert>
        <b-alert v-if="noAccountsFound" variant="danger" show>
          <i class="fa fa-frown-o"></i> No {{ network.name }} accounts found in
          extension.
        </b-alert>
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
            id="input-group-targetAddress"
            label="To:"
            label-for="input-targetAddress"
            class="w-100"
          >
            <b-form-input
              id="input-targetAddress"
              v-model="$v.targetAddress.$model"
              :state="validateState('targetAddress')"
              aria-describedby="targetAddress-feedback"
              placeholder="Address"
              class="w-100"
            ></b-form-input>
            <b-form-invalid-feedback id="targetAddress-feedback"
              >Please enter the destination address
            </b-form-invalid-feedback>
          </b-form-group>
          <b-alert
            v-if="!this.$v.$invalid && !extrinsicHash"
            variant="success"
            class="my-2"
            fade
            show
          >
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
          <b-alert
            v-if="extrinsicHash && !success"
            variant="success"
            class="text-center"
            fade
            show
          >
            <h4>Transaction sent!</h4>
            <p>Extrinsic hash is {{ extrinsicHash }}</p>
          </b-alert>
          <b-alert
            v-if="extrinsic && success"
            variant="success"
            class="text-center"
            fade
            show
          >
            <h4><i class="fa fa-check"></i> Succesful transaction!</h4>
            <p>
              Extrinsic with hash {{ extrinsicHash }} was included in block
              <nuxt-link
                v-b-tooltip.hover
                :to="`/block?blockNumber=${extrinsic.block_number}`"
                title="Check block information"
              >
                #{{ formatNumber(extrinsic.block_number) }}
              </nuxt-link>
            </p>
          </b-alert>
          <b-alert
            v-if="extrinsic && !success"
            variant="danger"
            class="text-center"
            fade
            show
          >
            <h4><i class="fa fa-frown-o"></i> Failed transaction!</h4>
            <p>
              Extrinsic with hash {{ extrinsicHash }} was included in block
              <nuxt-link
                v-b-tooltip.hover
                :to="`/block?blockNumber=${extrinsic.block_number}`"
                title="Check block information"
              >
                #{{ formatNumber(extrinsic.block_number) }}
              </nuxt-link>
            </p>
          </b-alert>
          <b-button
            type="submit"
            variant="primary"
            class="btn-send btn-block mt-3"
            :disabled="noAccountsFound"
          >
            <i class="fas fa-paper-plane mr-2"></i> Send
          </b-button>
        </b-form>
      </b-col>
      <b-col md="1"></b-col>
      <b-col md="5">
        <b-card>
          <h2>How to send DOTs</h2>
          <p>
            Now you can transfer DOTs using PolkaStats &
            <a href="https://github.com/polkadot-js/extension" target="_blank"
              >Polkadot JS extension</a
            >
            in a safe way.
          </p>
          <ul>
            <li>
              First of all you need a <strong>Polkadot account</strong> with
              some <strong>free balance</strong>.
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
import { checkAddress } from "@polkadot/util-crypto";
import { network } from "../polkastats.config";
import Identicon from "../components/identicon.vue";
import commonMixin from "../mixins/commonMixin.js";
import { validationMixin } from "vuelidate";
import { required, integer, minValue } from "vuelidate/lib/validators";
import { encodeAddress } from "@polkadot/keyring";
import gql from "graphql-tag";

const isValidPolkadotAddress = (address, addressPrefix) => {
  return checkAddress(address, addressPrefix)[0];
};

const isValidAddress = address => {
  const polkadotRegexp = /^(([0-9a-zA-Z]{47})|([0-9a-zA-Z]{48}))$/;
  return polkadotRegexp.test(address);
};

const isValidAmount = (amount, vm) =>
  amount > 0 && vm.getAmount() <= parseInt(vm.tranferableBalance.toString());

export default {
  components: { Identicon },
  mixins: [commonMixin, validationMixin],
  data() {
    return {
      network,
      detectedExtension: false,
      extensionAccounts: [],
      extensionAddresses: [],
      selectedAccount: null,
      selectedAddress: null,
      tranferableBalance: 0,
      targetAddress: "",
      api: null,
      enableWeb3: false,
      error: null,
      amount: 0,
      units: [
        "pico",
        "nano",
        "micro",
        "mili",
        network.denom,
        "Kilo",
        "Mega",
        "Giga",
        "Tera"
      ],
      selectedUnit: network.denom,
      extrinsicHash: null,
      extrinsic: null,
      success: null,
      noAccountsFound: false
    };
  },
  validations: {
    selectedAddress: {
      required,
      isValidAddress,
      isValidPolkadotAddress
    },
    amount: {
      required,
      integer,
      minValue: 1,
      isValidAmount
    },
    targetAddress: {
      required,
      isValidAddress
    }
  },
  watch: {
    selectedAccount: async function() {
      this.tranferableBalance = await this.getBalance();
    }
  },
  created: async function() {
    this.enableWeb3 = await web3Enable("PolkaStats");
    web3Enable("PolkaStats")
      .then(() => {
        web3Accounts()
          .then(accounts => {
            const wsProvider = new WsProvider(this.network.nodeWs);
            ApiPromise.create({ provider: wsProvider }).then(api => {
              this.api = api;
              if (accounts.length > 0) {
                this.detectedExtension = true;
                this.extensionAccounts = accounts;
                accounts
                  .filter(account =>
                    isValidPolkadotAddress(
                      account.address,
                      network.addressPrefix
                    )
                  )
                  .forEach(account =>
                    this.extensionAddresses.push(
                      encodeAddress(account.address, network.addressPrefix)
                    )
                  );
                if (
                  this.extensionAccounts.length > 0 &&
                  this.extensionAddresses.length > 0
                ) {
                  this.selectedAccount = this.extensionAccounts[0];
                  this.selectedAddress = this.extensionAddresses[0];
                } else {
                  this.noAccountsFound = true;
                }
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
        case "DOT":
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
      web3FromAddress(this.selectedAccount.address).then(async injector => {
        this.api.setSigner(injector.signer);
        const amount = this.getAmount();
        const extrinsic = await this.api.tx.balances.transfer(
          this.targetAddress,
          amount
        );
        this.extrinsicHash = await extrinsic.signAndSend(
          this.selectedAccount.address
        );
      });
    }
  },
  apollo: {
    $subscribe: {
      extrinsic: {
        query: gql`
          subscription extrinsics($hash: String!) {
            extrinsic(
              order_by: { block_number: desc }
              where: { hash: { _eq: $hash } }
              limit: 1
            ) {
              block_number
              hash
              success
            }
          }
        `,
        variables() {
          return {
            hash: this.extrinsicHash
          };
        },
        skip() {
          return !this.extrinsicHash;
        },
        result({ data }) {
          if (data.extrinsic[0]) {
            if (data.extrinsic[0].success) {
              console.log(`Sucessful tx!`);
              this.success = true;
            } else {
              console.log(`Failed tx!`);
              this.success = false;
            }
            this.extrinsic = data.extrinsic[0];
          }
        }
      }
    }
  },
  head() {
    return {
      title: this.$t("pages.send.head_title", {
        networkDenom: network.denom
      }),
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$t("pages.send.head_content", {
            networkDenom: network.denom
          })
        }
      ]
    };
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
