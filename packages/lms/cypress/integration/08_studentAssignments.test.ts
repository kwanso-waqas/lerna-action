/// <reference types="cypress" />

describe('Fail screen of manage students', () => {
  it('should redirect to manage students page', () => {
    cy.intercept('GET', '/formgraders', {
      fixture: 'courses.json',
    }).as('getCourses');
    cy.intercept('GET', '/formgrader/api/students', {
      fixture: 'students.api.json',
    }).as('getStudents');

    cy.visit('/');
    cy.wait('@getCourses');
    cy.get(`[data-cy="manage-studentsLink"]`).should('be.visible').click();
    cy.wait('@getStudents');
  });

  it('should redirect to student assignments page', () => {
    cy.intercept('GET', '/formgrader/api/student_submissions/frank-hall', {
      statusCode: 200,
      body: [],
    }).as('studentAssignment');

    // redirect to student assignments page
    cy.get(`[data-cy="addStudentTableHeaderSearch"]`).should('be.visible').clear().type('Frank');
    cy.get(`[data-cy="studentDataTable"]`)
      .should('be.visible')
      .get(`.MuiTableBody-root > .MuiTableRow-root`)
      .should('have.length.at.least', 1)
      .get(`[data-cy="studentLinkToAssignmentDetails"]`)
      .should('be.visible')
      .click();
    cy.wait('@studentAssignment');
  });

  it('should redirect to manage students page', () => {
    cy.intercept('GET', '/formgraders', {
      fixture: 'courses.json',
    }).as('getCourses');
    cy.intercept('GET', '/formgrader/api/students', {
      fixture: 'students.api.json',
    }).as('getStudents');

    cy.visit('/');
    cy.wait('@getCourses');
    cy.get(`[data-cy="manage-studentsLink"]`).should('be.visible').click();
    cy.wait('@getStudents');
  });

  it('should redirect to student assignments page with assignments', () => {
    cy.intercept('GET', '/formgrader/api/student_submissions/john-doe', {
      fixture: 'studentAssignments.json',
    }).as('studentAssignment');

    // redirect to student assignments page
    cy.get(`[data-cy="addStudentTableHeaderSearch"]`).should('be.visible').clear().type('John');
    cy.get(`[data-cy="studentDataTable"]`)
      .should('be.visible')
      .get(`.MuiTableBody-root > .MuiTableRow-root`)
      .should('have.length.at.least', 1)
      .get(`[data-cy="studentLinkToAssignmentDetails"]`)
      .should('be.visible')
      .click();
    cy.wait('@studentAssignment');
  });

  it('when no search result found', () => {
    cy.get(`[data-cy="studentAssignmentTableHeaderSearch"]`)
      .should('be.visible')
      .type('aksjdlsajdask');
    cy.get(`[data-cy="emptyView"]`)
      .should('be.visible')
      .get('h4')
      .should('be.visible')
      .contains('Not Found!');
    cy.get(`[data-cy="studentAssignmentTableHeaderSearchClear"]`).should('be.visible').click();
  });

  it('when some results are found while testing', () => {
    cy.get(`[data-cy="studentAssignmentTableHeaderSearch"]`).should('be.visible').type('ps');
    cy.get(`[data-cy="studentAssignmentTableData"]`)
      .should('be.visible')
      .get(`.MuiTableRow-root`)
      .should('be.visible')
      .should('have.length.at.least', 1);
    cy.get(`[data-cy="studentAssignmentTableHeaderSearchClear"]`).should('be.visible').click();
  });

  it('should sync with server while showing loading dialog', () => {
    cy.intercept('GET', '/formgrader/api/student_submissions/john-doe', {
      fixture: 'studentAssignments.json',
    }).as('studentAssignment');
    cy.get(`[data-cy="studentAssignmentTableHeaderSync"]`).should('be.visible').click();
    cy.wait('@studentAssignment');
    cy.get(`[data-cy="loadingDialog"]`).should('be.visible');
  });
});
