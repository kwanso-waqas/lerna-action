/// <reference types="cypress" />

describe('testing for assignment with no notebook', () => {
  it('navigate to manual grading page', () => {
    cy.intercept('GET', '/formgraders', {
      fixture: 'courses.json',
    }).as('getCourses');
    cy.intercept('GET', '/formgrader/api/assignments', {
      fixture: 'assignments.api.json',
    }).as('getAssignments');

    cy.visit('/');
    cy.wait('@getCourses');
    cy.get(`[data-cy="manual-gradingLink"]`).should('be.visible').click();
    cy.wait('@getAssignments');
    cy.get(`[data-cy="pageTitle"]`).should('be.visible').contains('Manual Grading');
  });

  it('search for assignment with no notebook', () => {
    cy.get(`[data-cy="manualGradingTable"]`).should('be.visible');
    cy.get(`[data-cy="pageHeader"]`).should('be.visible');
    cy.get(`[data-cy="manualGradingSearch"]`).should('be.visible');
    cy.get(`[data-cy="manualGradingSearch"]`).should('be.visible').type('baseassignment');
    cy.intercept('GET', '/formgrader/api/notebooks/baseassignment', {
      statusCode: 200,
      body: [],
    }).as('getAssignmentNotebooks');
    cy.get('.MuiTableBody-root')
      .should('be.visible')
      .get(`.MuiTableRow-root`)
      .then(($tableRow) => {
        if ($tableRow.length > 0) {
          cy.get(`[data-cy="onClickManualGradingToAssignmentNotebooks"]`).click();
        }
      });
    cy.wait('@getAssignmentNotebooks');
  });

  it('should display empty notebook page', () => {
    cy.get(`[data-cy="emptyView"]`)
      .should('be.visible')
      .get('.MuiTypography-root')
      .should('be.visible')
      .contains('No Notebook Found!');
  });

  // Success test cases for notebooks
  it('navigate to manual grading page', () => {
    cy.intercept('GET', '/formgraders', {
      fixture: 'courses.json',
    }).as('getCourses');
    cy.intercept('GET', '/formgrader/api/assignments', {
      fixture: 'assignments.api.json',
    }).as('getAssignments');

    cy.visit('/');
    cy.wait('@getCourses');
    cy.get(`[data-cy="manual-gradingLink"]`).should('be.visible').click();
    cy.wait('@getAssignments');
    cy.get(`[data-cy="pageTitle"]`).should('be.visible').contains('Manual Grading');
  });

  it('search for assignment with notebooks', () => {
    cy.get(`[data-cy="manualGradingTable"]`).should('be.visible');
    cy.get(`[data-cy="pageHeader"]`).should('be.visible');
    cy.get(`[data-cy="manualGradingSearch"]`).should('be.visible');
    cy.get(`[data-cy="manualGradingSearch"]`).should('be.visible').type('ps1');
    cy.intercept('GET', '/formgrader/api/notebooks/ps1', {
      fixture: 'assignmentNotebooks.json',
    }).as('getAssignmentNotebooks');
    cy.get('.MuiTableBody-root')
      .should('be.visible')
      .get(`.MuiTableRow-root`)
      .then(($tableRow) => {
        if ($tableRow.length > 0) {
          cy.get(`[data-cy="onClickManualGradingToAssignmentNotebooks"]`).click();
        }
      });
    cy.wait('@getAssignmentNotebooks');
  });

  it('should display assignments notebook table', () => {
    cy.get(`[data-cy="assignmentChaptersTable"]`).should('be.visible');
    cy.get(`[data-cy="notebookPageTableHead"]`).should('be.visible');
    cy.get('.MuiTableBody-root')
      .should('be.visible')
      .get(`.MuiTableRow-root`)
      .should('have.length.at.least', 1);
  });

  it('should display and work on search', () => {
    cy.get(`[data-cy="notebookPageTableHead"]`).should('be.visible');
    cy.get(`[data-cy="notebookPageTableSearch"]`).should('be.visible');
    cy.get(`[data-cy="notebookPageTableSearch"]`).should('be.visible').type('aksjdkasjkd');
    cy.get('[data-cy="notebookPageTableSearchClear"] > .MuiSvgIcon-root').should('be.visible');
    cy.get('[data-cy="emptyView"]')
      .should('be.visible')
      .get('.MuiTypography-root')
      .should('be.visible');
    cy.get('[data-cy="notebookPageTableSearchClear"] > .MuiSvgIcon-root').click();
  });

  it('should display and work on search', () => {
    cy.get(`[data-cy="notebookPageTableHead"]`).should('be.visible');
    cy.get(`[data-cy="notebookPageTableSearch"]`).should('be.visible');
    cy.get(`[data-cy="notebookPageTableSearch"]`).should('be.visible').type('problem4');
    cy.get('[data-cy="notebookPageTableSearchClear"] > .MuiSvgIcon-root').should('be.visible');
    cy.get('.MuiTableBody-root')
      .should('be.visible')
      .get(`.MuiTableRow-root`)
      .should('have.length.at.least', 1);
    cy.get('[data-cy="notebookPageTableSearchClear"] > .MuiSvgIcon-root').click();
  });

  it('should display sync button', () => {
    cy.intercept('GET', '/formgrader/api/notebooks/ps1', {
      fixture: 'assignmentNotebooks.json',
    }).as('getAssignmentNotebooks');
    cy.get(`[data-cy="notebooksSyncButton"]`).should('be.visible').click();
    cy.wait('@getAssignmentNotebooks');
    cy.get(`[data-cy="loadingDialog"]`).should('be.visible');
  });
});
