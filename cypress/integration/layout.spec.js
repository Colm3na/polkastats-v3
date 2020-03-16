/// <reference types="cypress" />

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return result ? `rgb(${r}, ${g}, ${b})` : null;
}

context("Header", () => {
  beforeEach(() => {
    cy.server();
    cy.route("GET", "api/v2/system", "fixture:system");
    cy.visit("/");
    cy.get("[data-testid=menu]")
      .as("menu")
      .find("button")
      .click();
  });

  describe("Header Style", function() {
    it("Black background", function() {
      cy.get("[data-testid=header").should(
        "have.css",
        "background-color",
        "rgba(0, 0, 0, 0)"
      );
    });
  });

  describe("Network", function() {
    it("Network information is showed", function() {
      cy.fixture("system").then(system => {
        cy.get("[data-testid=network]")
          .as("network")
          .find("i")
          .should("have.class", "fas fa-project-diagram");

        cy.get("@network").contains(
          `${system.chain} using polkadot v${system.client_version}`
        );
      });
    });
  });

  describe("Logo", function() {
    it("Should show the logo", function() {
      cy.get("[data-testid=logo")
        .as("logo")
        .should("have.class", "navbar-brand")
        .and(
          "have.attr",
          "title",
          "PolkaStats | Polkadot Kusama CC3 network statistics"
        );

      cy.get("@logo")
        .find("img")
        .should("have.class", "logo")
        .and("have.attr", "src", "/img/PolkaStats_logo_red-white.png");
    });
  });

  describe("Menu", function() {
    it("Validators", function() {
      cy.get("[data-testid=menu-validators]")
        .contains("Validators")
        .click();

      cy.location().should(loc => {
        expect(loc.host).to.eq("localhost:3000");
        expect(loc.pathname).to.eq("/validators");
      });
    });

    it("Intentions", function() {
      cy.get("[data-testid=menu-intentions]")
        .contains("Intentions")
        .click();

      cy.location().should(loc => {
        expect(loc.host).to.eq("localhost:3000");
        expect(loc.pathname).to.eq("/intentions");
      });
    });

    it("Favorites", function() {
      cy.get("[data-testid=menu-favorites]")
        .contains("Favorites")
        .click();

      cy.location().should(loc => {
        expect(loc.host).to.eq("localhost:3000");
        expect(loc.pathname).to.eq("/favorites");
      });
    });

    it("Phragmen", function() {
      cy.get("[data-testid=menu-phragmen]")
        .contains("Phragmen")
        .click();

      cy.location().should(loc => {
        expect(loc.host).to.eq("localhost:3000");
        expect(loc.pathname).to.eq("/phragmen");
      });
    });

    it("Nominators", function() {
      cy.get("[data-testid=menu-nominators]")
        .contains("Nominators")
        .click();

      cy.location().should(loc => {
        expect(loc.host).to.eq("localhost:3000");
        expect(loc.pathname).to.eq("/nominators");
      });
    });

    it("Menu", function() {
      cy.get("[data-testid=menu-accounts]")
        .contains("Accounts")
        .click();

      cy.location().should(loc => {
        expect(loc.host).to.eq("localhost:3000");
        expect(loc.pathname).to.eq("/accounts");
      });
    });
  });
});

context("Footer", function() {
  beforeEach(() => {
    cy.server();
    cy.visit("/");
  });

  describe("Footer Style", function() {
    it("Black background", function() {
      cy.get("[data-testid=header").should(
        "have.css",
        "background-color",
        "rgba(0, 0, 0, 0)"
      );
    });
  });

  describe("Get in Contact", function() {
    it("Header", function() {
      cy.get("[data-testid=footer-getInContact] h3")
        .should("have.class", "mb-3")
        .contains("Get in contact");
    });

    it("Twitter", function() {
      cy.get("[data-testid=footer-twitter]")
        .should("have.class", "list-inline-item mr-2")
        .find("a")
        .should("have.attr", "href", "https://twitter.com/polkastats")
        .contains("@PolkaStats");
    });

    it("Pretty Goog Privacy", function() {
      cy.get("[data-testid=footer-pgp]")
        .should("have.class", "list-inline-item mr-2")
        .find("a")
        .should("have.attr", "href", "https://keybase.io/encrypt#polkastats")
        .contains("PGP: 14C5 91D0 8ABA 03B");
    });

    it("Email", function() {
      cy.get("[data-testid=footer-email]")
        .should("have.class", "list-inline-item")
        .find("a")
        .should("have.attr", "href", "mailto:polkastats@protonmail.com")
        .contains("polkastats@protonmail.com");
    });
  });

  describe("PolkaStats", function() {
    it("Header", function() {
      cy.get("[data-testid=footer-polkadot] h3")
        .should("have.class", "mb-3")
        .contains("PolkaStats");
    });

    it("About Us", function() {
      cy.get("[data-testid=aboutUs]")
        .should("have.class", "nav-link")
        .and("have.attr", "href", "/about")
        .contains("About us")
        .click();

      cy.location().should(loc => {
        expect(loc.host).to.eq("localhost:3000");
        expect(loc.pathname).to.eq("/about");
      });
    });

    it("Support Polkastats", function() {
      cy.get("[data-testid=supportPolkastats]")
        .should("have.class", "nav-link")
        .and("have.attr", "href", "/support-us")
        .contains("Support PolkaStats")
        .click();

      cy.location().should(loc => {
        expect(loc.host).to.eq("localhost:3000");
        expect(loc.pathname).to.eq("/support-us");
      });
    });

    it("HowTo Validators", function() {
      cy.get("[data-testid=howToIncludeValidators]")
        .should("have.class", "nav-link")
        .and("have.attr", "href", "/for-validators")
        .contains("How to include your validator info")
        .click();

      cy.location().should(loc => {
        expect(loc.host).to.eq("localhost:3000");
        expect(loc.pathname).to.eq("/for-validators");
      });
    });
  });

  describe("Built for", function() {
    it("Header", function() {
      cy.get("[data-testid=footer-builtFor] h3")
        .should("have.class", "mb-3")
        .contains("Built for");
    });

    it("Kusama", function() {
      cy.get("[data-testid=kusama]")
        .as("kusama")
        .should("have.attr", "title", "Built for KUSAMA")
        .and("have.attr", "href", "https://kusama.network")
        .and("have.attr", "target", "_blank");

      cy.get("@kusama")
        .find("img")
        .should("have.attr", "src", "/img/KUSAMA_logo_7.png")
        .and("have.attr", "alt", "Built for KUSAMA")
        .and("have.class", "kusama-logo")
        .and("be.visible");

      cy.contains("the wild cousin of");
    });

    it("Polkadot", function() {
      cy.get("[data-testid=polkadot]")
        .as("polkadot")
        .should("have.attr", "title", "Built for POLKADOT")
        .and("have.attr", "href", "https://polkadot.network")
        .and("have.attr", "target", "_blank");

      cy.get("@polkadot")
        .find("img")
        .should("have.attr", "src", "/img/Polkadot_Logotype_white.png")
        .and("have.attr", "alt", "Built for POLKADOT")
        .and("have.class", "polkadot-logo")
        .and("be.visible");
    });
  });

  describe("Bottom Footer", function() {
    it("Made by", function() {
      cy.get("[data-testid=footer-bottom]")
        .as("bottom")
        .contains("Made with");

      cy.get("@bottom")
        .find("i")
        .should("have.class", "far fa-heart");

      cy.get("@bottom").contains("by");

      cy.get("[data-testid=marioLink]")
        .should("have.attr", "href", "https://mariopino.es")
        .and("have.attr", "title", "Mario Pino")
        .contains("Mario Pino");

      cy.get("@bottom").contains("in");

      cy.get("[data-testid=laColmena]")
        .should("have.attr", "href", "https://colmenalabs.org")
        .and("have.attr", "title", "La Colmena")
        .and("have.attr", "target", "_blank")
        .contains("La Colmena");

      cy.get("@bottom").contains("|");

      cy.get("[data-testid=bat]")
        .as("bat")
        .should("have.attr", "href", "https://basicattentiontoken.org/")
        .and("have.attr", "target", "_blank")
        .contains("Basic Atttention Token");

      cy.get("@bat")
        .find("img")
        .should("have.attr", "src", "/img/brave/logo-full-color.png")
        .and("have.class", "img-fluid bat")
        .and("be.visible");

      cy.get("[data-testid=github]")
        .should("have.attr", "href", "https://github.com/Colm3na/polkastats-v2")
        .and("have.attr", "title", "View source code on GitHub")
        .and("have.attr", "target", "_blank")
        .contains("View source code on GitHub");
    });
  });
});
