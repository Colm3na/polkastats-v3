<template>
  <b-container class="py-4">
    <b-row>
      <b-col md="12">
        <h1 class="mb-4">
          {{ $t("pages.send.title", { networkDenom: network.denom }) }}
        </h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="6 mb-4">
        <b-alert v-if="!detectedExtension" variant="danger" show>
          <i class="fa fa-frown-o"></i>
          {{ $t("pages.send.no_extension_found") }}
        </b-alert>
        <b-alert v-if="noAccountsFound" variant="danger" show>
          <i class="fa fa-frown-o"></i> {{ $t("pages.send.no_accounts_found") }}
        </b-alert>
        <b-form class="mt-2" @submit="onSubmit">
          <b-form-group
            id="input-group-from"
            :label="$t('pages.send.from')"
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
              @change="getBalance(selectedAddress)"
            ></b-form-select>
            <div>
              <p
                class="ml-2 mb-0 mt-1"
                :class="{ 'text-danger': !(tranferableBalance > 0) }"
              >
                {{ $t("pages.send.transferable_balance") }}:
                {{ formatAmount(tranferableBalance) }}
              </p>
            </div>
            <b-form-invalid-feedback id="selectedAddress-feedback"
              >{{ $t("pages.send.install_extension") }}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            id="input-group-amount"
            :label="$t('pages.send.amount')"
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
                  :placeholder="$t('pages.send.amount')"
                ></b-form-input>
                <b-form-invalid-feedback id="amount-feedback"
                  >{{ $t("pages.send.amount_validation") }}
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
                {{ $t("pages.send.amount") }}:
                {{ formatAmount(getAmount() || 0) }}
              </p>
            </div>
          </b-form-group>
          <b-form-group
            id="input-group-targetAddress"
            :label="$t('pages.send.to')"
            label-for="input-targetAddress"
            class="w-100"
          >
            <b-form-input
              id="input-targetAddress"
              v-model="$v.targetAddress.$model"
              :state="validateState('targetAddress')"
              aria-describedby="targetAddress-feedback"
              :placeholder="$t('pages.send.address')"
              class="w-100"
            ></b-form-input>
            <b-form-invalid-feedback id="targetAddress-feedback"
              >{{ $t("pages.send.destination") }}
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
                {{ $t("pages.send.send") }}
                <span v-if="getAmount() > 0">
                  {{ formatAmount(getAmount()) }}
                </span>
                {{ $t("pages.send.from") }}
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
            <h4>{{ $t("pages.send.tx_sent") }}</h4>
            <p>{{ $t("pages.send.extrinsic_hash") }} {{ extrinsicHash }}</p>
          </b-alert>
          <b-alert
            v-if="extrinsic && success"
            variant="success"
            class="text-center"
            fade
            show
          >
            <h4>
              <i class="fa fa-check"></i> {{ $t("pages.send.successful_tx") }}
            </h4>
            <p>
              {{ $t("pages.send.included_in_block", { extrinsicHash }) }}
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
            <h4>
              <i class="fa fa-frown-o"></i> {{ $t("pages.send.failed_tx") }}
            </h4>
            <p>
              {{ $t("pages.send.included_in_block", { extrinsicHash }) }}
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
            <i class="fas fa-paper-plane mr-2"></i> {{ $t("pages.send.send") }}
          </b-button>
        </b-form>
      </b-col>
      <b-col md="1"></b-col>
      <b-col md="5">
        <b-card>
          <h2>
            {{ $t("pages.send.guide_title", { networkDenom: network.denom }) }}
          </h2>
          <p>
            {{
              $t("pages.send.guide_subtitle_1", { networkDenom: network.denom })
            }}
            &
            <a href="https://github.com/polkadot-js/extension" target="_blank"
              >Polkadot JS extension</a
            >
            {{ $t("pages.send.guide_subtitle_2") }}
          </p>
          <ul>
            <li>
              {{ $t("pages.send.guide_1_1") }}
              <strong>{{ $t("pages.send.guide_1_2") }}</strong>
              {{ $t("pages.send.guide_1_3") }}
              <strong>{{ $t("pages.send.guide_1_4") }}</strong
              >.
            </li>
            <li>
              {{ $t("pages.send.guide_2") }}
              <a
                href="https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd?hl=es"
                target="_blank"
                >chrome web store</a
              >.
            </li>
            <li>{{ $t("pages.send.guide_3") }}</li>
            <li>{{ $t("pages.send.guide_4") }}</li>
            <li>{{ $t("pages.send.guide_5") }}</li>
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
      favorites: [],
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
      required
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
                accounts.forEach(account =>
                  this.extensionAddresses.push(
                    encodeAddress(account.address, this.network.addressPrefix)
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
    async getBalance(address) {
      const { availableBalance } = await this.api.derive.balances.all(address);
      this.tranferableBalance = availableBalance;
    },
    async send() {
      web3FromAddress(this.selectedAddress).then(async injector => {
        this.api.setSigner(injector.signer);
        const amount = this.getAmount();
        const extrinsic = await this.api.tx.balances.transfer(
          this.targetAddress,
          amount
        );
        this.extrinsicHash = await extrinsic.signAndSend(this.selectedAddress);
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
