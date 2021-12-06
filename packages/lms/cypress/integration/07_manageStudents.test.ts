/// <reference types="cypress" />

describe('Fail screen of manage students', () => {
  it('should display empty 400 screen', () => {
    cy.intercept('GET', '/formgraders', {
      fixture: 'courses.json',
    }).as('getCourses');
    cy.intercept('GET', '/formgrader/api/students', {
      statusCode: 200,
      body: [],
    }).as('getStudents');

    cy.visit('/');
    cy.wait('@getCourses');
    cy.get(`[data-cy="manage-studentsLink"]`).should('be.visible').click();
    cy.wait('@getStudents');

    cy.get(`[data-cy="emptyView"]`).should('be.visible');
    cy.get(`[data-cy="emptyView"]`).get('h4').contains('No Student Found!');
    cy.get(`[data-cy="emptyView"]`).get('button').contains('Add New Student').click();
  });

  it('add new student on empty screen and view table', () => {
    cy.intercept('PUT', '/formgrader/api/student/walter-hill', {
      body: {
        email: 'walterhill@gmail.com',
        first_name: 'Walter',
        id: 'walter-hill',
        last_name: 'Hill',
        lms_user_id: null,
        max_score: 21,
        score: 0,
      },
    }).as('addStudentTest');
    cy.get(`[data-cy="addNewStudentDialog"]`).should('be.visible');
    cy.get(`[data-cy="addStudentStudenId"]`).should('be.visible');
    cy.get(`[data-cy="addStudentFirstName"]`).should('be.visible');
    cy.get(`[data-cy="addStudentLastName"]`).should('be.visible');
    cy.get(`[data-cy="addStudentEmailText"]`).should('be.visible');
    cy.get(`[data-cy="addStudentSubmitBtn"]`).should('be.visible');
    cy.get(`[data-cy="addStudentStudenId"]`).type('walter-hill');
    cy.get(`[data-cy="addStudentFirstName"]`).type('Walter');
    cy.get(`[data-cy="addStudentLastName"]`).type('Hill');
    cy.get(`[data-cy="addStudentEmailText"]`).type('walterhill@gmail.com');
    cy.get(`[data-cy="addStudentSubmitBtn"]`).click();
    cy.wait('@addStudentTest');
  });

  it('adding students using fixtures', () => {
    cy.fixture('students.api.json').then((studentData) => {
      studentData.map((student) => {
        cy.intercept('PUT', `/formgrader/api/student/${student.id}`, {
          body: {
            ...student,
          },
        }).as('addNewStudent');
        cy.get(`[data-cy="addNewRecordBtn"]`).should('be.visible').click();
        cy.get(`[data-cy="addNewStudentDialog"]`).should('be.visible');
        cy.get(`[data-cy="addStudentStudenId"]`).should('be.visible');
        cy.get(`[data-cy="addStudentFirstName"]`).should('be.visible');
        cy.get(`[data-cy="addStudentLastName"]`).should('be.visible');
        cy.get(`[data-cy="addStudentEmailText"]`).should('be.visible');
        cy.get(`[data-cy="addStudentSubmitBtn"]`).should('be.visible');
        cy.get(`[data-cy="addStudentStudenId"]`).type(student.id);
        cy.get(`[data-cy="addStudentFirstName"]`).type(student.first_name);
        cy.get(`[data-cy="addStudentLastName"]`).type(student.last_name);
        cy.get(`[data-cy="addStudentEmailText"]`).type(student.email);
        cy.get(`[data-cy="addStudentSubmitBtn"]`).click();
        cy.wait('@addNewStudent');
        cy.wait(2000);
      });
    });
  });

  it('should show no data found while search for student in table', () => {
    cy.get(`[data-cy="addStudentTableHeaderSearch"]`).should('be.visible').type('saldjaskjdkas');
    cy.get(`[data-cy="emptyView"]`)
      .should('be.visible')
      .get('h4')
      .should('be.visible')
      .contains('Not Found!');
  });

  it('should show no data found while search for student in table', () => {
    cy.get(`[data-cy="addStudentTableHeaderSearch"]`).should('be.visible').clear().type('Frank');
    cy.get(`[data-cy="studentDataTable"]`)
      .should('be.visible')
      .get(`.MuiTableBody-root > .MuiTableRow-root`)
      .should('have.length.at.least', 1);
  });

  it('should sync data with online repository', () => {
    cy.intercept('GET', '/formgrader/api/students', {
      fixture: 'students.api.json',
    }).as('getStudents');
    cy.get(`[data-cy="studentTableHeaderSyncBtn"]`).should('be.visible').click();
    cy.wait('@getStudents');
    cy.get(`[data-cy="loadingDialog"]`).should('be.visible');
  });
});
