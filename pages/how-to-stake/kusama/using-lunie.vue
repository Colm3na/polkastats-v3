<template>
  <div>
    <section>
      <b-container class="main py-5 support-us">
        <h1 class="mb-4">
          {{
            $t("pages.how_to_stake.kusama.lunie.title", {
              networkName: network.name
            })
          }}
        </h1>
        <b-breadcrumb :items="breadcrumbsItems" />
        <!-- English content -->
        <template v-if="this.$i18n.locale == 'en'">
          <b-card class="mb-4">
            <p>
              This step by step guide explains how to nominate on
              <a href="https://kusama.network/" target="_blank">Kusama</a> using
              <a href="https://lunie.io" target="_blank">Lunie</a> and
              <a href="https://bit.ly/lunie-ext" target="_blank"
                >Lunie Browser Extension</a
              >.
            </p>
            <p>
              <a href="https://kusama.network/" target="_blank">Kusama</a> is
              the "canary" network for
              <a href="https://polkadot.network/" target="_blank">Polkadot</a>.
              It is a separate network with its own native KSM token.
            </p>
            <p>
              The same principles described in this guide apply for Polkadot and
              other Substrate networks, but make sure you double-check which
              network you are performing actions on.
            </p>
            <p>
              Note that Kusama and Polkadot has different token lockup periods
              at nominating, that means the time you need to wait for unbond (7
              days for Kusama and 28 days for Polkadot).
            </p>
            <p>
              For aditional security we will also use Lunie Browser Extension to
              interact with the chain in a secure way.
            </p>
          </b-card>
          <b-card>
            <h2 class="pt-4">
              Before start
            </h2>
            <hr class="pb-2" />
            You will need:
            <ul class="pt-2">
              <li>Chrome or Brave browser.</li>
              <li>A Kusama address with some available KSM tokens.</li>
              <li>The address seed phrase.</li>
            </ul>
            <h2 class="pt-4">
              1. Install Lunie Browser Extension
            </h2>
            <hr class="pb-2" />
            <p>
              Open
              <a href="https://bit.ly/lunie-ext" target="_blank"
                >https://bit.ly/lunie-ext</a
              >
              in your browser and install it.
            </p>
            <h2 class="pt-4">
              2. Import your Kusama address in Lunie Browser Extension
            </h2>
            <hr class="pb-2" />
            <ul>
              <li>Open Lunie Browser Extension.</li>
              <li>Click on "Recover with backup code".</li>
              <li>Select network "Kusama".</li>
              <li>Enter your seed phrase and click next.</li>
              <li>Enter a descriptive account name and click next.</li>
              <li>Enter a password for the account and click next.</li>
              <li>Click on "Go to Lunie"</li>
            </ul>
            <h2 class="pt-4">
              3. Nominate to PolkaStats
            </h2>
            <hr class="pb-2" />
            <ul>
              <li>Go to "Validators".</li>
              <li>
                Search "PolkaStats" and click on it to open the validator
                profile page.
              </li>
              <li>Click on Stake button.</li>
              <li>Enter the amount you want to bond and click next.</li>
              <li>Check the fee and click next.</li>
              <li>Click on "Send"</li>
              <li>
                Open Lunie Browser Extension, enter the password and click on
                "Aprove".
              </li>
            </ul>
            <h2 class="pt-4">
              4. Wait for your nomination to be active
            </h2>
            <hr class="pb-2" />
            <p>
              Your nomination will be inactive until the next session, so please
              be patient!.
            </p>
          </b-card>
        </template>
        <!-- Spanish content -->
        <template v-if="this.$i18n.locale == 'es'">
          <b-card class="mb-4">
            <p>
              Esta guía explica paso a paso como nominar en
              <a href="https://kusama.network/" target="_blank">Kusama</a>
              usando
              <a href="https://lunie.io" target="_blank">Lunie</a> y
              <a href="https://bit.ly/lunie-ext" target="_blank"
                >Lunie Browser Extension</a
              >.
            </p>
            <p>
              <a href="https://kusama.network/" target="_blank">Kusama</a> es la
              red "Canaria" de
              <a href="https://polkadot.network/" target="_blank">Polkadot</a>.
              Es una red separada con su propio token nativo, el KSM.
            </p>
            <p>
              Los mismos principios que se describen en esta guía aplican
              también para Polkadot y otras redes basadas en Substrate,
              asegúrate de comprobar siempre la red a la que te conectas para
              evitar confusiones.
            </p>
            <p>
              Ten en cuenta que Kusama y Polkadot tienen diferentes tiempos de
              bloqueo de fondos a la hora de nominar, esto significa que para
              desvincular los fondos en Kusama se necesita esperar 7 días,
              mientras que para Polkadot necesitas esperar 28 días.
            </p>
            <p>
              Para mayor seguridad también usaremos la extensión del navegador
              de Lunie para interactuar con la cadena de bloques de la forma más
              segura.
            </p>
          </b-card>
          <b-card>
            <h2 class="pt-4">
              Antes de empezar
            </h2>
            <hr class="pb-2" />
            Necesitarás:
            <ul class="pt-2">
              <li>Navegador Chrome o Brave.</li>
              <li>Una dirección de Kusama con algunos KSM disponibles.</li>
              <li>La frase semilla con la que se creo la cuenta.</li>
            </ul>
            <h2 class="pt-4">
              1. Instalar Lunie Browser Extension
            </h2>
            <hr class="pb-2" />
            <p>
              Abre
              <a href="https://bit.ly/lunie-ext" target="_blank"
                >https://bit.ly/lunie-ext</a
              >
              en tu navegador e instala la extensión.
            </p>
            <h2 class="pt-4">
              2. Importa tu dirección Kusama en Lunie Browser Extension
            </h2>
            <hr class="pb-2" />
            <ul>
              <li>Abre Lunie Browser Extension.</li>
              <li>Haz clic en "Recover with backup code".</li>
              <li>Selecciona la red "Kusama".</li>
              <li>Introduce tu seed phrase y haz clic en next.</li>
              <li>
                Introduce un nombre descriptivo para tu cuenta y haz clic en
                next.
              </li>
              <li>
                Introduce una contraseña para tu cuenta y haz clic en next.
              </li>
              <li>Haz clic en "Go to Lunie"</li>
            </ul>
            <h2 class="pt-4">
              3. Nominar a PolkaStats
            </h2>
            <hr class="pb-2" />
            <ul>
              <li>Haz clic en "Validators".</li>
              <li>
                En la casilla de búsqueda introduce "PolkaStats" y haz clic
                sobre el.
              </li>
              <li>Haz clic en el botón Stake.</li>
              <li>
                Introduce la cantidad que deseas nominar y haz clic en next.
              </li>
              <li>Comprueba la fee y haz clic en next.</li>
              <li>Haz click en el botón "Send"</li>
              <li>
                Abre Lunie Browser Extension, introduce la clave y haz clic en
                "Aprove".
              </li>
            </ul>
            <h2 class="pt-4">
              4. Espera a que tu nominación esté activa
            </h2>
            <hr class="pb-2" />
            <p>
              Tu nominación estará inactiva hasta la siguiente sesión, por favor
              ¡se paciente!.
            </p>
          </b-card>
        </template>
      </b-container>
    </section>
  </div>
</template>
<script>
import commonMixin from "~/mixins/commonMixin.js";
import { network } from "~/polkastats.config.js";

export default {
  mixins: [commonMixin],
  data: function() {
    return {
      network,
      breadcrumbsItems: [
        {
          text: this.$t("pages.home.title"),
          href: "/"
        },
        {
          text: this.$t("pages.how_to_stake.title", {
            networkName: network.name
          }),
          href: "/how-to-stake"
        },
        {
          text: this.$t("pages.how_to_stake.kusama.title", {
            networkName: network.name
          }),
          href: "/how-to-stake/kusama"
        },
        {
          text: this.$t("pages.how_to_stake.kusama.lunie.title", {
            networkName: network.name
          }),
          href: "#"
        }
      ]
    };
  },
  head() {
    return {
      title: this.$t("pages.how_to_stake.kusama.lunie.head_title"),
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$t("pages.how_to_stake.kusama.lunie.head_content")
        }
      ]
    };
  }
};
</script>
<style></style>
