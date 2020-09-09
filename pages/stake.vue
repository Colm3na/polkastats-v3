<template>
  <b-container class="py-5">
    <b-row>
      <b-col md="12">
        <h1 class="mb-4">
          {{ $t("pages.stake.title", { networkDenom: network.denom }) }}
        </h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="7 mb-4">
        <b-alert v-if="!detectedExtension" variant="danger" show>
          <i class="fa fa-frown-o"></i>
          {{ $t("pages.stake.no_extension_found") }}
        </b-alert>
        <b-alert v-if="noAccountsFound" variant="danger" show>
          <i class="fa fa-frown-o"></i>
          {{ $t("pages.stake.no_accounts_found") }}
        </b-alert>
        <b-form class="mt-2" @submit="onSubmit">
          <b-form-group
            id="input-group-from"
            :label="$t('pages.stake.from')"
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
                {{ $t("pages.stake.transferable_balance") }}:
                {{ formatAmount(tranferableBalance) }}
              </p>
            </div>
            <b-form-invalid-feedback id="selectedAddress-feedback"
              >{{ $t("pages.stake.install_extension") }}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            id="input-group-amount"
            :label="$t('pages.stake.amount')"
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
                  :placeholder="$t('pages.stake.amount')"
                ></b-form-input>
                <b-form-invalid-feedback id="amount-feedback"
                  >{{ $t("pages.stake.amount_validation") }}
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
                {{ $t("pages.stake.amount") }}:
                {{ formatAmount(getAmount() || 0) }}
              </p>
            </div>
          </b-form-group>

          <b-form-group
            id="input-group-targetValidator"
            :label="$t('pages.stake.select_validator')"
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
              >{{ $t("pages.stake.validator_feedback") }}
            </b-form-invalid-feedback>
          </b-form-group>

          <!-- Filter -->
          <b-form-input
            id="filterInput"
            v-model="filter"
            type="search"
            :placeholder="$t('pages.stake.search_validator')"
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
                  <span class="sr-only">{{ $t("pages.stake.selected") }}</span>
                </template>
                <template v-else>
                  <span aria-hidden="true">&nbsp;</span>
                  <span class="sr-only">{{
                    $t("pages.stake.not_selected")
                  }}</span>
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
                {{ $t("pages.stake.stake") }}
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
            v-if="extrinsicHash && !success"
            variant="success"
            class="text-center"
            fade
            show
          >
            <h4>{{ $t("pages.stake.tx_sent") }}</h4>
            <p>{{ $t("pages.stake.extrinsic_hash") }} {{ extrinsicHash }}</p>
          </b-alert>
          <b-alert
            v-if="extrinsic && success"
            variant="success"
            class="text-center"
            fade
            show
          >
            <h4>
              <i class="fa fa-check"></i> {{ $t("pages.stake.successful_tx") }}
            </h4>
            <p>
              {{ $t("pages.stake.included_in_block", { extrinsicHash }) }}
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
              <i class="fa fa-frown-o"></i> {{ $t("pages.stake.failed_tx") }}
            </h4>
            <p>
              {{ $t("pages.stake.included_in_block", { extrinsicHash }) }}
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
            <i class="fas fa-paper-plane mr-2"></i>
            {{ $t("pages.stake.stake") }}
          </b-button>
        </b-form>
      </b-col>
      <b-col md="5">
        <b-alert variant="warning" class="mb-3" show>
          <h2>{{ $t("pages.stake.experimental_title") }}</h2>
          <p>
            {{ $t("pages.stake.experimental_content") }}
          </p>
        </b-alert>
        <b-card>
          <h2>
            {{ $t("pages.stake.guide_title", { networkDenom: network.denom }) }}
          </h2>
          <p>
            {{
              $t("pages.stake.guide_subtitle_1", {
                networkDenom: network.denom
              })
            }}
            &
            <a href="https://github.com/polkadot-js/extension" target="_blank"
              >Polkadot JS extension</a
            >
            {{ $t("pages.stake.guide_subtitle_2") }}
          </p>
          <ul>
            <li>
              {{ $t("pages.stake.guide_1_1") }}
              <strong>{{ $t("pages.stake.guide_1_2") }}</strong>
              {{ $t("pages.stake.guide_1_3") }}
              <strong>{{ $t("pages.stake.guide_1_4") }}</strong
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
            <li>{{ $t("pages.stake.guide_3") }}</li>
            <li>{{ $t("pages.stake.guide_4") }}</li>
            <li>{{ $t("pages.stake.guide_5") }}</li>
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
import { paginationOptions } from "../polkastats.config.js";
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
      currentSessionIndex: 0,
      validators: [],
      detectedExtension: false,
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
      noAccountsFound: false,
      tableOptions: paginationOptions,
      perPage: localStorage.paginationOptions
        ? parseInt(localStorage.paginationOptions)
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
          key: "rank",
          label: "Rank",
          sortable: true,
          filterByFormatted: true
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
      required
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
      return this.validators.map(validator => {
        return {
          rank: validator.rank,
          name: validator.display_name,
          accountId: validator.account_id,
          commission: (validator.commission / 10000000).toFixed(2)
        };
      });
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
  created: async function() {
    // Get favorites from cookie
    if (this.$cookies.get("favorites")) {
      this.favorites = this.$cookies.get("favorites");
    }

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
                  this.getBalance(this.selectedAddress);
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
          return network.name === `Polkadot`
            ? this.amount * 10
            : this.amount * 1000;
        case "micro":
          return network.name === `Polkadot`
            ? this.amount * 10000
            : this.amount * 1000000;
        case "mili":
          return network.name === `Polkadot`
            ? this.amount * 10000000
            : this.amount * 1000000000;
        case `${network.denom}`:
          return network.name === `Polkadot`
            ? this.amount * 10000000000
            : this.amount * 1000000000000;
        case "kilo":
          return network.name === `Polkadot`
            ? this.amount * 10000000000000
            : this.amount * 1000000000000000;
        case "mega":
          return network.name === `Polkadot`
            ? this.amount * 10000000000000000
            : this.amount * 1000000000000000000;
        case "giga":
          return network.name === `Polkadot`
            ? this.amount * 10000000000000000000
            : this.amount * 1000000000000000000000;
        case "tera":
          return network.name === `Polkadot`
            ? this.amount * 10000000000000000000000
            : this.amount * 1000000000000000000000000;
      }
    },
    async getBalance(address) {
      const { availableBalance } = await this.api.derive.balances.all(address);
      this.tranferableBalance = availableBalance;
    },
    async stake() {
      this.selectedAccount = encodeAddress(this.selectedAddress, 42);
      web3FromAddress(this.selectedAccount)
        .then(async injector => {
          this.api.setSigner(injector.signer);
          const amount = this.getAmount();
          const rewardDestination = 0;
          let transactions = [];
          transactions.push(
            await this.api.tx.staking.bond(
              this.selectedAccount,
              amount,
              rewardDestination
            )
          );
          transactions.push(
            await this.api.tx.staking.nominate([this.targetValidator])
          );
          const extrinsic = await this.api.tx.utility.batch(transactions);
          this.extrinsicHash = await extrinsic.signAndSend(
            this.selectedAccount
          );
        })
        .catch(error => {
          console.log("Error: ", error);
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
      localStorage.paginationOptions = num;
      this.perPage = parseInt(num);
    },
    getIdentity(stashId) {
      return (
        this.validators.find(identity => identity.accountId === stashId) || {}
      );
    },
    isFavorite(accountId) {
      return this.favorites.includes(accountId);
    }
  },
  apollo: {
    $subscribe: {
      validators: {
        query: gql`
          subscription validator($session_index: Int!) {
            validator(
              order_by: { rank: asc }
              where: { session_index: { _eq: $session_index } }
            ) {
              account_id
              stash_id
              commission
              next_elected
              display_name
              exposure_others
              exposure_own
              exposure_total
              produced_blocks
              rank
              stakers
            }
          }
        `,
        variables() {
          return {
            session_index: this.currentSessionIndex
          };
        },
        skip() {
          return !this.currentSessionIndex;
        },
        result({ data }) {
          this.validators = data.validator.map(validator => {
            return {
              ...validator,
              num_stakers: JSON.parse(validator.stakers).length,
              favorite: this.isFavorite(validator.account_id)
            };
          });
          this.totalRows = this.validators.length;
        }
      },
      sessionIndex: {
        query: gql`
          subscription validator {
            validator(order_by: { session_index: desc }, where: {}, limit: 1) {
              session_index
            }
          }
        `,
        result({ data }) {
          if (data.validator[0].session_index > this.currentSessionIndex) {
            this.currentSessionIndex = data.validator[0].session_index;
          }
        }
      },
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
      title: this.$t("pages.stake.head_title", {
        networkDenom: network.denom
      }),
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$t("pages.stake.head_content", {
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
