/// <reference types="cypress" />

describe('manually grading assignment page', () => {
  it('should move to manual grading page', () => {
    cy.viewport(1440, 920);
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

  it('should redirect to manually grading assignment', () => {
    cy.intercept('GET', '/api/contents/oop/autograded/john-doe/ps1/problem4.ipynb', {
      fixture: 'submissionDetails.json',
    }).as('submissionDetails');
    cy.intercept('GET', '/formgrader/api/grades?submission_id=350a58650ee64ce39f8c5ac3a35849e5', {
      fixture: 'submissionGrades.json',
    }).as('submissionGrades');
    cy.intercept('GET', '/formgrader/api/comments?submission_id=350a58650ee64ce39f8c5ac3a35849e5', {
      fixture: 'submissionComments.json',
    }).as('submissionComments');

    cy.get('[data-cy=submissionNameDisplay] > .MuiTypography-root')
      .should('be.visible')
      .first()
      .click();

    cy.wait('@submissionDetails');
    cy.wait('@submissionGrades');
    cy.wait('@submissionComments');
  });

  it('should find the comment field and type comment', () => {
    cy.get(`[data-cy="manualGradingAssignmentComment"]`)
      .first()
      .get('.MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input')
      .first()
      .focus()
      .type('testing comment');
  });

  it('should save comment in database and show snackbar', () => {
    cy.get(`[data-cy="manualGradingAssignmentComment"]`)
      .first()
      .get('.MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input')
      .first()
      .focus()
      .clear()
      .type('testing comment');
    cy.intercept('PUT', '/formgrader/api/comment/52fecb64f95f43459ed9f75a23267648', {
      fixture: 'submissionComment.api.json',
    }).as('saveSubmissionComment');
    cy.get(`.MuiFormControl-root > .MuiInputBase-root > .MuiInputAdornment-root`).first().click();
    cy.wait('@saveSubmissionComment');
  });

  it('should find first grading controls and add one mark', () => {
    let calculatedMarks = 0;
    cy.intercept('PUT', '/formgrader/api/grade/9e6c3166f3394aaa8dde8d7684beb177', {
      fixture: 'submissionGrades.api.json',
    }).as('updatingGrades');
    cy.get(`[data-cy="manualGradingAssignmentMarkingSection"]`)
      .first()
      .find(`[data-cy="manualGradingAssignmentCalculatedMarks"]`)
      .invoke('text')
      .then(($res) => {
        calculatedMarks = +$res;
        cy.log(`CalculatedMarks = ${$res}`);
      });
    cy.get(`[data-cy="manualGradingAssignmentMarkingSection"]`)
      .first()
      .find(`[data-cy="manualGradingAssignmentAddGivenMarks"]`)
      .click();
    cy.wait('@updatingGrades');
    // cy.get(`[data-cy="manualGradingAssignmentSuccessSnackbar"]`).should('be.visible');
    cy.get(`[data-cy="manualGradingAssignmentMarkingSection"]`)
      .first()
      .find(`[data-cy="manualGradingAssignmentCalculatedMarks"]`)
      .invoke('text')
      .then(($res) => {
        cy.log(`After adding marks = ${$res}`);
        expect(+$res).to.equals(calculatedMarks + 1);
      });
  });

  it('should find first grading controls and remove one mark', () => {
    let calculatedMarks = 0;
    cy.intercept('PUT', '/formgrader/api/grade/9e6c3166f3394aaa8dde8d7684beb177', {
      fixture: 'submissionGradesOnMinusMark.api.json',
    }).as('updatingGrades');
    cy.get(`[data-cy="manualGradingAssignmentMarkingSection"]`)
      .first()
      .find(`[data-cy="manualGradingAssignmentCalculatedMarks"]`)
      .invoke('text')
      .then(($res) => {
        calculatedMarks = +$res;
        cy.log(`CalculatedMarks = ${$res}`);
      });
    cy.get(`[data-cy="manualGradingAssignmentMarkingSection"]`)
      .first()
      .find(`[data-cy="manualGradingAssignmentRemoveGivenMarks"]`)
      .click();
    cy.wait('@updatingGrades');
    // cy.get(`[data-cy="manualGradingAssignmentSuccessSnackbar"]`).should('be.visible');
    cy.get(`[data-cy="manualGradingAssignmentMarkingSection"]`)
      .first()
      .find(`[data-cy="manualGradingAssignmentCalculatedMarks"]`)
      .invoke('text')
      .then(($res) => {
        cy.log(`After adding marks = ${$res}`);
        expect(+$res).to.equals(calculatedMarks - 1);
      });
  });

  it('should show max marks by clicking on max credit button', () => {
    let totalMarks = 0;
    cy.intercept('PUT', '/formgrader/api/grade/9e6c3166f3394aaa8dde8d7684beb177', {
      fixture: 'submissionGradesOnMaxMarks.api.json',
    }).as('maxMarksUpdate');
    cy.get(`[data-cy="manualGradingAssignmentMarkingSection"]`)
      .first()
      .get(`[data-cy="manualGradingAssignmentMaxMarks"]`)
      .first()
      .click();
    cy.wait('@maxMarksUpdate');
    // cy.get(`[data-cy="manualGradingAssignmentSuccessSnackbar"]`).should('be.visible');
    cy.get(`[data-cy="manualGradingAssignmentMarkingSection"]`)
      .first()
      .find(`[data-cy="manualGradingAssignmentTotalMarks"] > span`)
      .invoke('text')
      .then(($res) => {
        totalMarks = +$res;
        cy.log(`Total Marks = ${$res}`);
      });
    cy.get(`[data-cy="manualGradingAssignmentMarkingSection"]`)
      .first()
      .find(`[data-cy="manualGradingAssignmentGivenMarks"]`)
      .invoke('text')
      .then(($res) => {
        cy.log(`After adding marks = ${$res}`);
        expect(+$res).to.equals(totalMarks);
      });
  });

  it('should show zero marks by clicking on min credit button', () => {
    cy.intercept('PUT', '/formgrader/api/grade/9e6c3166f3394aaa8dde8d7684beb177', {
      fixture: 'submissionGradesOnMinMarks.api.json',
    }).as('minMarksUpdate');
    cy.get(`[data-cy="manualGradingAssignmentMarkingSection"]`)
      .first()
      .get(`[data-cy="manualGradingAssignmentMinMarks"]`)
      .first()
      .click();
    cy.wait('@minMarksUpdate');
    // cy.get(`[data-cy="manualGradingAssignmentSuccessSnackbar"]`).should('be.visible');
    cy.get(`[data-cy="manualGradingAssignmentMarkingSection"]`)
      .first()
      .find(`[data-cy="manualGradingAssignmentGivenMarks"]`)
      .invoke('text')
      .then(($res) => {
        cy.log(`After adding marks = ${$res}`);
        expect(+$res).to.equals(0);
      });
  });

  it('should show extra marks and their controls', () => {
    let extraMarks = 0;
    cy.intercept('PUT', '/formgrader/api/grade/9e6c3166f3394aaa8dde8d7684beb177', {
      fixture: 'submissionGradesOnAddExtra.api.json',
    }).as('addExtraMarks');
    cy.get(`[data-cy="manualGradingAssignmentMarkingSection"]`)
      .first()
      .find(`[data-cy="manualGradingAssignmentExtraMarks"]`)
      .invoke('text')
      .then(($res) => {
        extraMarks = +$res;
        cy.log(`ExtraMarks = ${$res}`);
      });
    cy.get(`[data-cy="manualGradingAssignmentMarkingSection"]`)
      .first()
      .get(`[data-cy="manualGradingAssignmentAddExtraMarks"]`)
      .first()
      .click();
    cy.wait('@addExtraMarks');
    cy.intercept('PUT', '/formgrader/api/grade/9e6c3166f3394aaa8dde8d7684beb177', {
      fixture: 'submissionGradesOnMinusExtra.api.json',
    }).as('MinusExtraMarks');
    cy.get(`[data-cy="manualGradingAssignmentMarkingSection"]`)
      .first()
      .find(`[data-cy="manualGradingAssignmentExtraMarks"]`)
      .invoke('text')
      .then(($res) => {
        cy.log(`After adding marks = ${$res}`);
        expect(+$res).to.equals(extraMarks + 1);
        extraMarks += 1;
      });
    cy.get(`[data-cy="manualGradingAssignmentMarkingSection"]`)
      .first()
      .get(`[data-cy="manualGradingAssignmentMinusExtraMarks"]`)
      .first()
      .click();
    cy.wait('@MinusExtraMarks');
    cy.get(`[data-cy="manualGradingAssignmentMarkingSection"]`)
      .first()
      .find(`[data-cy="manualGradingAssignmentExtraMarks"]`)
      .invoke('text')
      .then(($res) => {
        cy.log(`After adding marks = ${$res}`);
        expect(+$res).to.equals(extraMarks - 1);
      });
  });
});
