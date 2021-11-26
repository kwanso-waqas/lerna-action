/// <reference types="cypress" />
import { PAGE_SIZE } from '../../src/common/constants';

describe('if no assignment found in case of manual grading page', () => {
  it('redirecting to manual grading page', () => {
    cy.intercept('GET', '/formgraders', {
      fixture: 'courses.json',
    }).as('getCourses');
    cy.intercept(
      {
        method: 'GET',
        url: '/formgrader/api/assignments',
      },
      {
        statusCode: 200,
        body: [],
      },
    ).as('getAssignments');

    cy.visit('/');
    cy.wait('@getCourses');
    cy.get(`[data-cy="manual-gradingLink"]`).should('be.visible').click();
    cy.wait('@getAssignments');
    cy.get(`[data-cy="pageTitle"]`).should('be.visible').contains('Manual Grading');
  });

  it('should display empty page', () => {
    cy.get(`[data-cy="emptyView"]`)
      .should('be.visible')
      .get('h4')
      .should('be.visible')
      .contains('No Assignment Found!');
  });

  // Test cases when all looks good
  it('should redirect to manual grading page', () => {
    cy.intercept('GET', '/formgrader/api/assignments', {
      fixture: 'assignments.api.json',
    }).as('getAssignments');
    cy.intercept('GET', '/formgraders', {
      fixture: 'courses.json',
    }).as('getCourses');
    cy.visit('/');
    cy.wait('@getCourses');
    cy.get(`[data-cy="manual-gradingLink"]`).should('be.visible').click();
    cy.wait('@getAssignments');
    cy.get(`[data-cy="pageTitle"]`).should('be.visible').contains('Manual Grading');
  });

  it('assignments table should be visible', () => {
    cy.get(`[data-cy="manualGradingTable"]`).should('be.visible');
    cy.get(`[data-cy="pageHeader"]`).should('be.visible');
    cy.get(`[data-cy="manualGradingSearch"]`).should('be.visible');
    cy.get(`[data-cy="manualGradingSyncBtn"]`).should('be.visible').contains('Sync');
    cy.get('.MuiTableBody-root')
      .should('be.visible')
      .get(`.MuiTableRow-root`)
      .then(($tableRow) => {
        if ($tableRow.length > 0) {
          console.log('Hello');
        }
        if ($tableRow.length > PAGE_SIZE) {
          cy.get(`[data-cy="pagePagination"]`).should('be.visible');
        }
      });
  });

  it('search for assignment name should result in empty state', () => {
    cy.get(`[data-cy="manualGradingSearch"]`).should('be.visible').type('asdjkaskdjasjd');
    cy.get(`[data-cy=emptyView]`)
      .should('be.visible')
      .get(`h4`)
      .should('be.visible')
      .contains('Not Found!');
    cy.get('[data-cy="manualGradingPageTableSearchClear"] > .MuiSvgIcon-root').click();
  });

  it('search for assignment name and found results', () => {
    cy.get(`[data-cy="manualGradingSearch"]`).should('be.visible').type('base');
    cy.get('.MuiTableBody-root')
      .should('be.visible')
      .get(`.MuiTableRow-root`)
      .then(($tableRow) => {
        if ($tableRow.length > 0) {
          console.log('Hello');
        }
        if ($tableRow.length > PAGE_SIZE) {
          cy.get(`[data-cy="pagePagination"]`).should('be.visible');
        }
      });
    cy.get('[data-cy="manualGradingPageTableSearchClear"] > .MuiSvgIcon-root').click();
  });

  it('should sync with server on sync button click', () => {
    cy.intercept('GET', '/formgrader/api/assignments', {
      fixture: 'assignments.api.json',
    }).as('getAssignments');
    cy.get(`[data-cy="manualGradingSyncBtn"]`).should('be.visible').click();
    cy.wait('@getAssignments');
    cy.get(`[data-cy="loadingDialog"]`).should('be.visible');
  });

  it('should redirect to notebook screen on click', () => {
    cy.get(`:nth-child(1) > :nth-child(1) > [data-cy="onClickManualGradingToAssignmentNotebooks"]`)
      .should('be.visible')
      .click();
    cy.location().should((loc) => {
      expect(loc.pathname.toString()).to.contain('/manual-grading');
    });
  });
});
