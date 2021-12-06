/// <reference types="cypress" />

describe('this notebooks should not have any submissions', () => {
  it('should move to manual grading page', () => {
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

  it('should redirect to notebooks page with more than 0 notebooks', () => {
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

  it('should redirect to submissions page', () => {
    cy.get(`[data-cy="assignmentChaptersTable"]`).should('be.visible');
    cy.get(`[data-cy="notebookPageTableHead"]`).should('be.visible');
    cy.get('.MuiTableBody-root')
      .should('be.visible')
      .get(`.MuiTableRow-root`)
      .should('have.length.at.least', 1);
    cy.intercept('GET', '/formgrader/api/submitted_notebooks/ps1/problem1', {
      statusCode: 200,
      body: [],
    }).as('notebookSubmissions');
    cy.get(':nth-child(1) > :nth-child(1) > [data-cy=notebookClickEle] > .MuiTypography-root')
      .should('be.visible')
      .click();
    cy.wait('@notebookSubmissions');
  });

  it('should show empty submissions page', () => {
    cy.get('[data-cy="pageTitle"]').should('be.visible').contains('Manual Grading');
    cy.get(`[data-cy="emptyView"]`)
      .should('be.visible')
      .get('.MuiTypography-root')
      .should('be.visible')
      .contains('No Submissions!');
  });

  it('should move to manual grading page', () => {
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

  it('should redirect to notebooks page with more than 0 notebooks', () => {
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

  it('should redirect to submissions page', () => {
    cy.get(`[data-cy="assignmentChaptersTable"]`).should('be.visible');
    cy.get(`[data-cy="notebookPageTableHead"]`).should('be.visible');
    cy.get('.MuiTableBody-root')
      .should('be.visible')
      .get(`.MuiTableRow-root`)
      .should('have.length.at.least', 1);
    cy.intercept('GET', '/formgrader/api/submitted_notebooks/ps1/problem4', {
      fixture: 'notebookSubmissions.json',
    }).as('notebookSubmissions');
    cy.get(`[data-cy="notebookPageTableSearch"]`).should('be.visible').type('problem4');
    cy.get(':nth-child(1) > :nth-child(1) > [data-cy=notebookClickEle] > .MuiTypography-root')
      .should('be.visible')
      .click();
    cy.wait('@notebookSubmissions');
  });

  it('should display table header of chapter submissions', () => {
    cy.get(`[data-cy="chapterSubmissionsTableHeader"]`).should('be.visible');
    cy.get(`[data-cy="chapterSubmissionsTableSearch"]`).should('be.visible');
    cy.get(`[data-cy="checkForManualGradingBtn"]`).should('be.visible');
    cy.get(`[data-cy="submissionsSyncBtn"]`).should('be.visible');
  });

  it('should display table of chapter submissions', () => {
    cy.get(`.MuiTableBody-root`)
      .should('be.visible')
      .get(`.MuiTableRow-root`)
      .should('be.visible')
      .should('have.length.at.least', 1);
  });

  it('should show student name on toggling eye icon', () => {
    cy.get('.MuiTableHead-root > .MuiTableRow-root > :nth-child(1) > .MuiButtonBase-root')
      .should('be.visible')
      .click();
    cy.get(
      `.MuiTableBody-root > .MuiTableRow-root > :nth-child(2) > [data-cy="submissionNameDisplay"]`,
    )
      .should('be.visible')
      .get('.MuiTypography-root')
      .should('not.contain', 'Submission');
    cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(1) > .MuiButtonBase-root')
      .should('be.visible')
      .first()
      .click();
    cy.get(
      `.MuiTableBody-root > .MuiTableRow-root > :nth-child(2) > [data-cy="submissionNameDisplay"]`,
    )
      .should('be.visible')
      .get('.MuiTypography-root')
      .contains('Submission');
  });

  it('should search from chapter submissions and not found anything', () => {
    cy.get(`[data-cy="chapterSubmissionsTableSearch"]`).should('be.visible').type('asdjashdjsad');
    cy.get(`[data-cy="emptyView"]`)
      .should('be.visible')
      .get('.MuiTypography-root')
      .should('be.visible')
      .contains('Not Found!');
    cy.get('[data-cy="chapterSubmissionsTableSearchClearBtn"]').should('be.visible').click();
  });

  it('should show some submissions', () => {
    cy.get(`[data-cy="chapterSubmissionsTableSearch"]`).should('be.visible').type('John');
    cy.get(`.MuiTableBody-root`)
      .should('be.visible')
      .get(`.MuiTableRow-root`)
      .should('be.visible')
      .should('have.length.at.least', 1);
    cy.get('[data-cy="chapterSubmissionsTableSearchClearBtn"]').should('be.visible').click();
  });

  it('should show loading dialog while syncing', () => {
    cy.intercept('GET', '/formgrader/api/submitted_notebooks/ps1/problem4', {
      fixture: 'notebookSubmissions.json',
    }).as('notebookSubmissions');
    cy.get('[data-cy=submissionsSyncBtn]').should('be.visible').click();
    cy.wait('@notebookSubmissions');
    cy.get(`[data-cy="loadingDialog"]`).should('be.visible');
  });

  it('should turn on manual grading filter', () => {
    cy.get('[data-cy="checkForManualGradingBtn"]').should('be.visible').click();
    cy.get('.MuiButton-label > .MuiSvgIcon-root').should('be.visible');
    cy.get(`.MuiTableBody-root`)
      .should('be.visible')
      .get(`.MuiTableRow-root`)
      .should('be.visible')
      .should('have.length.at.least', 1);
    cy.get('[data-cy="checkForManualGradingBtn"]').should('be.visible').click();
  });
});
