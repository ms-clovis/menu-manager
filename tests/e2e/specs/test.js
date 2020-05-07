// https://docs.cypress.io/api/introduction/api.html

describe("My First Test", () => {
  it("Visits the app root url", () => {
    window.cy.visit("http://localhost:8080");
    window.cy.contains("h1", "Trum Tavern Menu");
  });
});
