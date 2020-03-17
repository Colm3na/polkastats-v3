/// <reference types="cypress" />
import { isHex } from "@polkadot/util";

const formatNumber = n => {
  if (isHex(n)) {
    return parseInt(n, 16)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  } else {
    return n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }
};

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return result ? `rgb(${r}, ${g}, ${b})` : null;
}

const checkCardStyles = id => {
  return cy
    .get(id)
    .should("have.class", "card")
    .and("have.css", "background-color", hexToRgb("#ffffff"))
    .and("have.css", "border", "1px solid rgba(0, 0, 0, 0.125)");
};

context("Home", () => {
  beforeEach(() => {
    cy.server();
    cy.route("GET", "api/v2/chain", "fixture:chain");
    cy.route("GET", "api/v2/validators", "fixture:validators");
    cy.visit("/");
  });

  describe("Home page should load in /", function() {
    it("Should be Home Page", function() {
      cy.location().should(loc => {
        expect(loc.host).to.eq("localhost:3000");
        expect(loc.pathname).to.eq("/");
      });
    });
  });

  describe("Alert Information", function() {
    beforeEach(() => {
      cy.get("[data-testid=serverAlert]").as("serverAlert");
      cy.get("[data-testid=infoAlert]").as("infoAlert");
      cy.get("[data-testid=validatorsAlert]").as("validatorsAlert");
    });

    it("Dedicated Server", function() {
      cy.get("@serverAlert").contains(
        "⚡ We have a new awesome dedicated server graciously sponsored by La Colmena Labs. Thanks! ⚡"
      );
      cy.get("@serverAlert")
        .should("have.css", "background-color", hexToRgb("#cce5ff"))
        .and("have.css", "border-color", hexToRgb("#b8daff"))
        .and("have.css", "color", hexToRgb("#004085"));
    });

    it("Dedicated server info can be closed", function() {
      cy.get("@serverAlert")
        .find("[type=button]")
        .click()
        .should("not.exist");

      cy.get("@infoAlert")
        .should("exist")
        .and("be.visible");

      cy.get("@validatorsAlert")
        .should("exist")
        .and("be.visible");
    });

    it("Total Insurance", function() {
      cy.get("@infoAlert")
        .should("have.css", "background-color", hexToRgb("#d4edda"))
        .and("have.css", "border-color", hexToRgb("#c3e6cb"))
        .and("have.css", "color", hexToRgb("#155724"))
        .contains("Total issuance is");
    });

    it("Total Insurance block can be closed", function() {
      cy.get("@infoAlert")
        .find("[type=button]")
        .click()
        .should("not.exist");

      cy.get("@serverAlert")
        .should("exist")
        .and("be.visible");

      cy.get("@validatorsAlert")
        .should("exist")
        .and("be.visible");
    });

    it("Active Validators", function() {
      cy.get("@validatorsAlert")
        .should("have.css", "background-color", hexToRgb("#d4edda"))
        .and("have.css", "border-color", hexToRgb("#c3e6cb"))
        .and("have.css", "color", hexToRgb("#155724"))
        .contains("Currently there are");
    });

    it("Active Validators can be closed", function() {
      cy.get("@validatorsAlert")
        .find("[type=button]")
        .click()
        .should("not.exist");

      cy.get("@serverAlert")
        .should("exist")
        .and("be.visible");

      cy.get("@infoAlert")
        .should("exist")
        .and("be.visible");
    });
  });

  describe("Blocks Information", function() {
    it("Block data is loaded", function() {
      cy.fixture("chain").then(network => {
        cy.get("[data-testid=lastBlock]")
          .as("lastBlock")
          .contains("Last block");

        checkCardStyles("@lastBlock");

        cy.get("@lastBlock").contains(formatNumber(network.block_height));

        cy.get("[data-testid=lastFinalized]")
          .as("lastFinalized")
          .contains("Last finalized");

        checkCardStyles("@lastFinalized");

        cy.get("@lastFinalized").contains(
          formatNumber(network.block_height_finalized)
        );

        cy.get("[data-testid=currentSession]")
          .as("currentSession")
          .contains("Current session");

        checkCardStyles("@currentSession");

        cy.get("@currentSession").contains(
          formatNumber(network.session.currentIndex)
        );

        cy.get("[data-testid=epoch]")
          .as("epoch")
          .contains("Epoch");

        checkCardStyles("@epoch");

        cy.get("@epoch").contains(
          `${formatNumber(network.session.sessionProgress)}/${formatNumber(
            network.session.sessionLength
          )}`
        );

        cy.get("[data-testid=currentEra]")
          .as("currentEra")
          .contains("Current era");

        checkCardStyles("@currentEra");

        cy.get("@currentEra").contains(
          formatNumber(network.session.currentEra)
        );

        cy.get("[data-testid=era]")
          .as("era")
          .contains("Era");

        checkCardStyles("@era");

        cy.get("@era").contains(
          `${formatNumber(network.session.eraProgress)}/${formatNumber(
            network.session.eraLength
          )}`
        );
      });
    });

    it("Blocks Info can be closed", function() {
      cy.get("[data-testid=blocksInfo]").should("exist");
      cy.get("[data-testid=blocksInfoCloseButton]").click();
      cy.get("[data-testid=blocksInfo]").should("not.exist");
    });
  });

  describe("Search Bar", function() {
    it("Searh bar should exists", function() {
      cy.get("[data-testid=searchBar")
        .as("searchBar")
        .should(
          "have.attr",
          "placeholder",
          "Search validator by account, account index, identity display name or keybase name"
        );

      cy.get("@searchBar")
        .should("have.css", "background-color", hexToRgb("#ffffff"))
        .should("have.css", "border", `1px solid ${hexToRgb("#ced4da")}`);
    });

    it("Can type in Search Bar and search", function() {
      cy.fixture("validators").then(validators => {
        cy.get("[data-testid=validatorsTable]")
          .find("tbody")
          .find("tr")
          .as("rows")
          .should("have.length", 5);

        cy.get("[data-testid=searchBar").type("GZ5xCK{enter}");

        cy.get("@rows").should("have.length", 1);
      });
    });
  });

  describe("Validators Table", function() {
    it("Validators table should render", function() {
      cy.fixture("validators").then(validators => {
        cy.get("[data-testid=validatorsTable]")
          .find("tbody")
          .find("tr")
          .as("rows")
          .should("have.length", 5);

        cy.get("@rows")
          .first()
          .as("firstRow")
          .find("td")
          .should("have.length", 9);

        cy.get("@firstRow")
          .find("[data-testid=validatorLink]")
          .click();

        cy.url().should(
          "include",
          `/validator?accountId=${validators[0].accountId}`
        );
      });
    });
  });
});
