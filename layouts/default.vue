<template>
  <div>
    <section id="navigation" data-testid="header">
      <div class="nav-bg-color fixed-top">
        <div class="container">
          <div id="top-bar" class="row">
            <div class="col-10 text-right pb-2 pb-sm-0 pb-md-0 pb-lg-0 pb-xl-0">
              <span class="network mr-2">
                Selected network:
              </span>
              <span v-if="network.name === 'Polkadot'">
                <i class="fa fa-check" aria-hidden="true"></i>
                Polkadot
              </span>
              <span v-if="network.name === 'Kusama'">
                <i class="fa fa-check" aria-hidden="true"></i>
                Kusama
              </span>
              <span v-if="network.name === 'Westend'">
                <i class="fa fa-check" aria-hidden="true"></i>
                Westend
              </span>
              <span
                v-if="network.coinGeckoDenom"
                class="fiat ml-2"
                data-testid="fiat"
              >
                <strong>{{ network.denom }}</strong> ${{ USDConversion }} ({{
                  USD24hChange
                }}%)
              </span>
            </div>
            <div class="col-2 pt-1 pb-2 pb-0 text-right">
              <languages />
            </div>
          </div>
          <b-navbar toggleable="xl" type="dark" class="row" data-testid="menu">
            <b-navbar-brand>
              <nuxt-link
                to="/"
                class="navbar-brand"
                :title="`PolkaStats | ${network.name} block explorer`"
                data-testid="logo"
              >
                <img class="logo" src="/img/PolkaStats_logo_red-white.png" />
              </nuxt-link>
            </b-navbar-brand>
            <b-navbar-toggle target="nav-collapse" />
            <b-collapse
              id="nav-collapse"
              is-nav
              class="flex-grow-1 text-center text-sx-right text-md-right text-lg-right"
            >
              <b-navbar-nav class="navbar-nav ml-auto flex-nowrap">
                <b-nav-item>
                  <nuxt-link
                    to="/polkastats-validator"
                    active-class="nuxt-link-exact-active"
                    class="nav-link"
                  >
                    {{ $t("layout.default.validator") }}
                  </nuxt-link>
                </b-nav-item>
                <b-nav-item>
                  <nuxt-link
                    to="/how-to-stake"
                    active-class="nuxt-link-exact-active"
                    class="nav-link"
                  >
                    {{ $t("layout.default.how_to_stake") }}
                  </nuxt-link>
                </b-nav-item>
                <b-nav-item-dropdown text="Blockchain" class="py-1">
                  <b-dropdown-item to="/blocks">
                    {{ $t("layout.default.blocks") }}
                  </b-dropdown-item>
                  <b-dropdown-item to="/extrinsics">
                    {{ $t("layout.default.extrinsics") }}
                  </b-dropdown-item>
                  <b-dropdown-item to="/transfers">
                    {{ $t("layout.default.transfers") }}
                  </b-dropdown-item>
                  <b-dropdown-item to="/events">
                    {{ $t("layout.default.events") }}
                  </b-dropdown-item>
                </b-nav-item-dropdown>
                <b-nav-item-dropdown text="Staking" class="py-1">
                  <b-dropdown-item to="/validators">
                    {{ $t("layout.default.validators") }}
                  </b-dropdown-item>
                  <b-dropdown-item to="/intentions">
                    {{ $t("layout.default.intentions") }}
                  </b-dropdown-item>
                  <b-dropdown-item to="/nominators">
                    {{ $t("layout.default.nominators") }}
                  </b-dropdown-item>
                  <b-dropdown-item to="/targets">
                    {{ $t("layout.default.targets") }}
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-if="network.phragmenEnabled"
                    to="/election-prediction"
                  >
                    {{ $t("layout.default.election-prediction") }}
                  </b-dropdown-item>
                </b-nav-item-dropdown>
                <b-nav-item>
                  <nuxt-link
                    to="/accounts"
                    active-class="nuxt-link-exact-active"
                    class="nav-link"
                  >
                    {{ $t("layout.default.account") }}
                  </nuxt-link>
                </b-nav-item>
                <b-nav-item-dropdown text="Wallet" class="py-1">
                  <b-dropdown-item to="/send">Send</b-dropdown-item>
                  <b-dropdown-item to="/stake">Stake</b-dropdown-item>
                </b-nav-item-dropdown>
                <b-nav-item-dropdown text="Network" class="py-1">
                  <b-dropdown-item href="https://polkastats.io"
                    >Polkadot</b-dropdown-item
                  >
                  <b-dropdown-item href="https://kusama.polkastats.io"
                    >Kusama</b-dropdown-item
                  >
                  <b-dropdown-item href="https://westend.polkastats.io"
                    >Westend</b-dropdown-item
                  >
                </b-nav-item-dropdown>
              </b-navbar-nav>
            </b-collapse>
          </b-navbar>
        </div>
      </div>
    </section>
    <nuxt />
    <section id="footer" data-testid="footer">
      <div class="container">
        <div class="row mt-4 pt-5">
          <div class="col-12 text-center">
            <img
              class="logo img-fluid"
              src="/img/PolkaStats_logo_red-white_500px.png"
            />
          </div>
        </div>
        <div class="row mt-4 pt-5">
          <div
            class="col-xs-12 col-sm-12 col-md-4 mt-2 mb-4 pb-4 mt-sm-2 text-center text-white"
            data-testid="footer-getInContact"
          >
            <h3 class="mb-3">
              {{ $t("layout.default.get_in_contact") }}
            </h3>
            <hr />
            <ul class="list-unstyled list-inline social text-center">
              <li class="list-inline-item mr-2" data-testid="footer-twitter">
                <a target="_blank" href="https://twitter.com/polkastats"
                  ><i class="fab fa-twitter" /> @PolkaStats</a
                >
              </li>
              <li class="list-inline-item mr-2" data-testid="footer-pgp">
                <a target="_blank" href="https://keybase.io/encrypt#polkastats"
                  ><i class="fab fa-keybase" /> PGP: 14C5 91D0 8ABA 03B7</a
                >
              </li>
              <li class="list-inline-item" data-testid="footer-email">
                <a target="_blank" href="mailto:polkastats@protonmail.com"
                  ><i class="fa fa-envelope" /> polkastats@protonmail.com</a
                >
              </li>
            </ul>
          </div>
          <div
            class="col-xs-12 col-sm-12 col-md-4 mt-2 mb-4 pb-4 mt-sm-2 text-center text-white"
            data-testid="footer-polkadot"
          >
            <h3 class="mb-3">
              PolkaStats
            </h3>
            <hr />
            <nuxt-link
              to="/team"
              active-class="nuxt-link-exact-active"
              class="nav-link"
              data-testid="aboutUs"
            >
              {{ $t("layout.default.about_us") }}
            </nuxt-link>
            <nuxt-link
              to="/support-us"
              active-class="nuxt-link-exact-active"
              class="nav-link"
              data-testid="supportPolkastats"
            >
              {{ $t("layout.default.support_polkastats") }}
            </nuxt-link>
          </div>
          <div
            class="col-xs-12 col-sm-12 col-md-4 mt-2 mb-4 pb-4 mt-sm-2 text-center text-white"
            data-testid="footer-builtFor"
          >
            <h3 class="mb-3">
              {{ $t("layout.default.built_with") }}
            </h3>
            <hr />
            <a href="https://web3.foundation/grants/" target="_blank">
              <img
                src="/img/grant_badge.png"
                class="grant-badge"
                alt="Web3 foundation grants program"
              />
            </a>
          </div>
        </div>
        <p
          class="small pt-4 text-center text-white"
          data-testid="footer-bottom"
        >
          <nuxt-link
            to="/team"
            active-class="nuxt-link-exact-active"
            class="nav-link"
            data-testid="polkastatsTeam"
          >
            {{ $t("layout.default.made_by") }}
          </nuxt-link>
          <span class="mx-2">|</span> {{ $t("layout.default.built_with") }}
          <a
            href="https://basicattentiontoken.org/"
            target="_blank"
            data-testid="bat"
            >Basic Atttention Token
            <img src="/img/brave/logo-full-color.png" class="img-fluid bat"
          /></a>
          <span class="mx-2">|</span>
          <a
            href="https://github.com/Colm3na/polkastats-v3"
            aria-label="View source on GitHub"
            title="View source code on GitHub"
            target="_blank"
            data-testid="github"
            ><i class="fab fa-github" />
            {{ $t("layout.default.view_source_code_on_github") }}</a
          >
        </p>
      </div>
    </section>
    <a
      href="https://github.com/Colm3na/polkastats-v3"
      class="github-corner"
      aria-label="View source on GitHub"
      title="View source code on GitHub"
      target="_blank"
    >
      <svg
        class="github-corner d-none d-md-none d-lg-none d-xl-block"
        width="90"
        height="90"
        viewBox="0 0 250 250"
        style="fill:#d75ea1; color:#fff; position: absolute; top: 0; border: 0; right: 0; z-index: 1100;"
        aria-hidden="true"
      >
        <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z" />
        <path
          d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
          fill="currentColor"
          style="transform-origin: 130px 106px;"
          class="octo-arm"
        ></path>
        <path
          d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
          fill="currentColor"
          class="octo-body"
        />
      </svg>
    </a>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import languages from "../components/languages";
import { network } from "../polkastats.config.js";
import "~/styles/polkastats.css";

export default {
  components: { languages },
  data: function() {
    return {
      network
    };
  },
  computed: {
    system() {
      return this.$store.state.system.info;
    },
    USDConversion: function() {
      return this.$store.state.fiat.usd;
    },
    USD24hChange: function() {
      return this.$store.state.fiat.usd_24h_change
        ? parseFloat(this.$store.state.fiat.usd_24h_change).toFixed(2)
        : 0;
    }
  },
  created: async function() {
    this.$store.dispatch("system/update");
    // Refresh fiat conversion values every minute
    if (this.network.coinGeckoDenom) {
      this.$store.dispatch("fiat/update");
      setInterval(() => {
        this.$store.dispatch("fiat/update");
      }, 60000);
    }
  },
  methods: {
    goTo(url) {
      window.location.href = url;
    }
  }
};
</script>
<style></style>
