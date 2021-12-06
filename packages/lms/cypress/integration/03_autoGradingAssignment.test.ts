/// <reference types="cypress" />

describe('checking for good and bad cases of auto grading assignment page', () => {
  it('checking grading page for no submissions', () => {
    cy.intercept('GET', '/formgraders', {
      fixture: 'courses.json',
    }).as('getCourses');
    cy.intercept('GET', '/formgrader/api/submissions/nosubmissions', {
      statusCode: 200,
      data: [],
    }).as('getAssignmentSubmissions');
    cy.visit('/manage-assignments/nosubmissions');
    cy.wait('@getCourses');
    cy.wait('@getAssignmentSubmissions');
    cy.get(`[data-cy="pageTitle"]`).should('be.visible').contains('Manage Assignments');
  });

  it('should display empty notebook page', () => {
    cy.get(`[data-cy="emptyView"]`)
      .should('be.visible')
      .get('.MuiTypography-root')
      .should('be.visible')
      .contains('No Submission Found!');
  });

  it('select assignment with submissions and move to assignment autograding', () => {
    cy.intercept('GET', '/formgraders', {
      fixture: 'courses.json',
    }).as('getCourses');
    cy.intercept('GET', '/formgrader/api/assignments', {
      fixture: 'assignments.api.json',
    }).as('getAssignments');
    cy.visit('/');
    cy.wait('@getCourses');
    cy.wait('@getAssignments');
    cy.get('.MuiInputBase-root').should('be.visible');
    cy.get('#outlined-start-adornment').type('ps1');
    cy.intercept('GET', '/formgrader/api/submissions/ps1', {
      fixture: 'autogradingSubmission.api.json',
    }).as('getAssignmentSubmissions');
    cy.get(`[data-cy="autoGradingAssignmentBtn"]`).should('be.visible').click();
    cy.wait('@getAssignmentSubmissions');
  });

  it('check if it shows no search result found', () => {
    cy.get('.MuiInputBase-root').should('be.visible');
    cy.get('#outlined-start-adornment').type('aksdjkasdj');
    cy.get('.MuiTableContainer-root > .MuiGrid-root').should('be.visible');
    cy.get('.MuiTypography-root').contains('Not Found!');
    cy.get(
      '[data-cy="autoGradeAssignmentSubmissionTableHeaderSearchClear"] > .MuiSvgIcon-root',
    ).click();
  });

  it('check if it shows the result of search', () => {
    cy.get('.MuiInputBase-root').should('be.visible');
    cy.get('#outlined-start-adornment').type('john');
    cy.get(`.MuiTableBody-root`).should('be.visible');
    cy.get(`.MuiTableBody-root`).find(`.MuiTableRow-root`).its('length').should('be.gte', 1);
    cy.get(
      '[data-cy="autoGradeAssignmentSubmissionTableHeaderSearchClear"] > .MuiSvgIcon-root',
    ).click();
  });

  it('sync button click action', () => {
    cy.intercept('GET', '/formgrader/api/submissions/ps1', {
      fixture: 'autogradingSubmission.api.json',
    }).as('getAssignmentSubmissions');

    cy.get(`[data-cy="autoGradeAssignmentSubmissionTableHeaderSync"]`).should('be.visible').click();
    cy.get(`[data-cy="loadingDialog"]`).should('be.visible');
    cy.wait('@getAssignmentSubmissions');
  });

  it('select single submission', () => {
    cy.get('.MuiInputBase-root').should('be.visible');
    cy.get('#outlined-start-adornment').type('john');
    cy.get(`.MuiTableBody-root`).should('be.visible');
    cy.get(`.MuiTableBody-root`).find(`.MuiTableRow-root`).its('length').should('be.gte', 1);
  });

  it('autograde that submission', () => {
    cy.intercept('POST', '/formgrader/api/submission/ps1/john-doe/autograde', {
      fixture: 'autograde.api.json',
    }).as('autogradeAPI');
    cy.intercept('GET', '/formgrader/api/submissions/ps1', {
      fixture: 'afterAutogradingSubmission.api.json',
    }).as('getAssignmentSubmissions');
    cy.get(`:nth-child(1) > :nth-child(4) > [data-cy="autogradeAssignmentSubmissionBtn"]`)
      .should('be.visible')
      .click();
    cy.wait('@autogradeAPI');
    cy.wait('@getAssignmentSubmissions');
    cy.get('[data-cy="assignmentLogDialog"]').should('be.visible');
    cy.get(`[data-cy="assignmentLogDialogCloseBtn"]`).should('be.visible').click();
  });
});
