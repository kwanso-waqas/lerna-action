/// <reference types="cypress" />
import moment from 'moment';

describe('checking for good and bad cases for sidebar and courses', () => {
  it('mocking assignments api for bad case', () => {
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
    cy.wait('@getAssignments');
  });

  it('should display empty screen', () => {
    cy.get(`[data-cy="emptyView"]`).should('be.visible');
    cy.get(`[data-cy="emptyView"]`).get('h4').contains('No Assignment Found!');
    cy.get(`[data-cy="emptyView"]`).get('button').should('exist').contains('Create New Assignment');
  });

  it('should be able to add assignment from empty screen', () => {
    cy.get(`[data-cy="emptyView"]`)
      .should('exist')
      .get(`button`)
      .contains('Create New Assignment')
      .click();
    cy.get(`[data-cy="assignmentAddDialog"]`).should('be.visible');
  });

  it('validation should work for assignment adding dialog', () => {
    const assignmentName = `[data-cy="assignmentName"] > .MuiInputBase-root`;
    const assignmentNameErr = `[data-cy="assignmentName"] > .MuiFormHelperText-root`;

    const assignmentDate = `[data-cy="assignmentDate"] > .MuiInputBase-root`;
    const assignmentDateErr = `[data-cy="assignmentDate"] > .MuiFormHelperText-root`;

    const assignmentTimeZone = `[data-cy="assignmentTimeZone"] > .MuiInputBase-root`;
    const assignmentTimeZoneErr = `[data-cy="assignmentTimeZone"] > .MuiFormHelperText-root`;

    const assignmentSubmitBtn = `[data-cy="assignmentSubmitBtn"]`;

    cy.get(assignmentName).should('be.visible');
    cy.get(assignmentSubmitBtn).click();
    cy.get(assignmentName).should('have.class', 'Mui-error');
    cy.get(assignmentNameErr).contains('Assignment name is necessary for assignment creation');
    cy.get(assignmentName).type('asd s');
    cy.get(assignmentNameErr).contains(
      'Provided name should not contain spaces, special characters, and uppercase letters',
    );
    cy.get(assignmentName).clear();
    cy.get(assignmentName).type('Assignment');
    cy.get(assignmentNameErr).contains(
      'Provided name should not contain spaces, special characters, and uppercase letters',
    );
    cy.get(assignmentName).clear();
    cy.get(assignmentName).type('baseassignment');

    cy.get(assignmentDate).should('be.visible');
    cy.get(assignmentSubmitBtn).click();
    cy.get(assignmentDateErr).contains('Assignment date is necessary for assignment creation');
    cy.get(assignmentDate).type(moment().format('yyyy/MM/DD hh:mm A').slice(0, -1));
    cy.get(assignmentDateErr).contains(
      'Assignment submission date should be later then current date/time',
    );
    cy.get(assignmentDate).clear();
    cy.get(assignmentDate).type(moment().add(-2, 'day').format('yyyy/MM/DD hh:mm A').slice(0, -1));
    cy.get(assignmentDateErr).contains(
      'Assignment submission date should be later then current date/time',
    );
    cy.get(assignmentDate).clear();
    cy.get(assignmentDate).type(moment().add(1, 'day').format('yyyy/MM/DD hh:mm A').slice(0, -1));

    cy.get(assignmentTimeZone).should('be.visible');
    cy.get(assignmentTimeZone).type('1233');
    cy.get(assignmentTimeZoneErr).contains('There should only be 4 digits followed by plus sign');
    cy.get(assignmentTimeZone).clear();
    cy.get(assignmentTimeZone).type('+12345');
    cy.get(assignmentTimeZoneErr).contains('There should only be 4 digits followed by plus sign');
    cy.get(assignmentTimeZone).clear();
    cy.get(assignmentTimeZone).type('+0000');

    // Adding assignment to Babckend
    cy.intercept('PUT', '/formgrader/api/assignment/baseassignment', {
      fixture: 'addAssignment.api.json',
    }).as('addAssignment');

    cy.get(assignmentSubmitBtn).click();
    cy.wait('@addAssignment');
  });

  it('adding assignments from fixtures data', () => {
    const assignmentName = `[data-cy="assignmentName"] > .MuiInputBase-root`;
    const assignmentDate = `[data-cy="assignmentDate"] > .MuiInputBase-root`;
    const assignmentTimeZone = `[data-cy="assignmentTimeZone"] > .MuiInputBase-root`;

    const assignmentSubmitBtn = `[data-cy="assignmentSubmitBtn"]`;

    cy.fixture('assignments.json').then((assignments) => {
      assignments.map((assignment, index) => {
        cy.get(`[data-cy="addNewRecordBtn"]`).click();
        cy.get(assignmentName).type(assignment.name);
        cy.get(assignmentDate).type(
          moment()
            .add(index + 1, 'day')
            .format('yyyy/MM/DD hh:mm A')
            .slice(0, -1),
        );
        cy.get(assignmentTimeZone).type(assignment.duedate_timezone);
        cy.intercept('PUT', `/formgrader/api/assignment/${assignment.name}`, {
          ...assignment,
        }).as('addAssignment');
        cy.get(assignmentSubmitBtn).click();
        cy.wait('@addAssignment');
      });
    });

    cy.get(`[data-cy="assignmentTableCont"]`)
      .should('exist')
      .get('.MuiTableBody-root > .MuiTableRow-root')
      .should('have.length.at.least', 4);
  });

  it('check if it shows no search result found', () => {
    cy.get('.MuiInputBase-root').should('be.visible');
    cy.get('#outlined-start-adornment').type('aksdjkasdj');
    cy.get('.MuiTableContainer-root > .MuiGrid-root').should('be.visible');
    cy.get('.MuiTypography-root').contains('Not Found!');
    cy.get('[data-cy="manageAssignmentsPageTableSearchClear"] > .MuiSvgIcon-root').click();
  });

  it('check if it shows the result of search', () => {
    cy.get('.MuiInputBase-root').should('be.visible');
    cy.get('#outlined-start-adornment').type('base');
    cy.get(`.MuiTableBody-root`).should('be.visible');
    cy.get(`.MuiTableBody-root`).find(`.MuiTableRow-root`).its('length').should('be.gte', 1);
    cy.get('[data-cy="manageAssignmentsPageTableSearchClear"] > .MuiSvgIcon-root').click();
  });

  it('should clear search input', () => {
    cy.get('.MuiInputBase-root').should('be.visible');
    cy.get('#outlined-start-adornment').type('aksdjkasdj');
    cy.get('[data-cy="manageAssignmentsPageTableSearchClear"] > .MuiSvgIcon-root').should(
      'be.visible',
    );
    cy.get('[data-cy="manageAssignmentsPageTableSearchClear"] > .MuiSvgIcon-root').click();
    cy.get('#outlined-start-adornment').invoke('val').should('be.empty');
  });

  it('status dropdown on selecting draft status', () => {
    cy.get(`[data-cy="selectStatusMenuBtn"]`).should('be.visible').click();
    cy.get(`[data-cy="selectStatusMenu"]`).should('be.visible');
    cy.get(`[data-cy="selectDraftStatus"]`).click();
    cy.get(`[data-cy="draftDeleteableChip"]`).should('be.visible');
    cy.get(`[data-cy="assignmentTableCont"]`).click();
    cy.get(`.MuiTableBody-root`).find(`.MuiTableRow-root`).its('length').should('be.gte', 1);
    cy.get('.MuiTable-root').contains('td', 'Draft').should('be.visible');
    cy.get(`[data-cy="draftDeleteableChip"] > .MuiSvgIcon-root`).click();
  });

  it('status dropdown on selecting released status', () => {
    cy.get(`[data-cy="selectStatusMenuBtn"]`).should('be.visible').click();
    cy.get(`[data-cy="selectStatusMenu"]`).should('be.visible');
    cy.get(`[data-cy="selectReleasedStatus"]`).click();
    cy.get(`[data-cy="releasedDeleteableChip"]`).should('be.visible');
    cy.get(`[data-cy="assignmentTableCont"]`).click();
    cy.get('.MuiTypography-root').contains('Not Found!').click();
    cy.get('[data-cy="releasedDeleteableChip"] > .MuiSvgIcon-root').click();
  });

  it('sync button click action', () => {
    cy.intercept('GET', '/formgrader/api/assignments', {
      fixture: 'assignments.api.json',
    }).as('getAssignments');

    cy.get(`[data-cy="assignmentSyncButton"]`).should('be.visible').click();
    cy.get(`[data-cy="loadingDialog"]`).should('be.visible');
    cy.wait('@getAssignments');
    cy.get(`[data-cy="pagePagination"]`).should('exist');
  });

  it('select assignment to update', () => {
    cy.get('.MuiInputBase-root').should('be.visible');
    cy.get('#outlined-start-adornment').type('baseassignment');
    cy.get(`:nth-child(1) > :nth-child(4) > [data-cy=editAssignmentBtn]`)
      .should('be.visible')
      .click();
    cy.get(`[data-cy="assignmentAddDialog"]`).should('be.visible');
  });

  it('should update assignment', () => {
    const assignmentName = `[data-cy="assignmentName"] > .MuiInputBase-root`;
    const assignmentDate = `[data-cy="assignmentDate"] > .MuiInputBase-root`;
    const assignmentSubmitBtn = `[data-cy="assignmentSubmitBtn"]`;

    cy.get(assignmentName).should('be.visible').should('have.class', 'Mui-disabled');

    cy.get(assignmentDate).should('be.visible');
    cy.get(assignmentDate).clear();
    cy.get(assignmentDate).type(moment().add(3, 'day').format('yyyy/MM/DD hh:mm A').slice(0, -1));

    // Adding assignment to Backend
    cy.intercept('PUT', '/formgrader/api/assignment/baseassignment', {
      fixture: 'addAssignment.api.json',
    }).as('addAssignment');
    cy.get(assignmentSubmitBtn).click();
    cy.wait('@addAssignment');
    cy.get('[data-cy="manageAssignmentsPageTableSearchClear"] > .MuiSvgIcon-root').click();
  });

  it('should display assignment menu and on clicking action it should show error dialog', () => {
    cy.get('.MuiInputBase-root').should('be.visible');
    cy.get('#outlined-start-adornment').type('baseassignment');
    cy.get(`:nth-child(1) > :nth-child(5) > [data-cy="assignmentEditMenuIcon"]`)
      .should('be.visible')
      .click();
    cy.get(`[data-cy="assignmentEditMenu"] > .MuiList-root`).should('be.visible');
    cy.intercept('POST', '/formgrader/api/assignment/baseassignment/assign', {
      fixture: 'assignmentAction.json',
    });
    cy.get(`[data-cy="assignmentEditMenu"] > .MuiList-root > [tabindex="0"]`)
      .should('be.visible')
      .click();
    cy.get(`[data-cy="assignmentLogDialog"]`).should('be.visible');
    cy.get(`[data-cy="assignmentLogDialogCloseBtn"]`).should('be.visible').click();
    cy.get('[data-cy="manageAssignmentsPageTableSearchClear"] > .MuiSvgIcon-root').click();
  });

  it('should open assignment instruction dialog', () => {
    cy.get(`[data-cy="openAssignmentInstructionDialog"]`).should('be.visible').click();
    cy.get(`[data-cy="assignmentInstructionDialog"]`).should('be.visible');
    cy.get(`[data-cy="closeAssignmentInstructionHeaderBtn"]`).should('be.visible').click();

    cy.get(`[data-cy="openAssignmentInstructionDialog"]`).should('be.visible').click();
    cy.get(`[data-cy="assignmentInstructionDialog"]`).should('be.visible');
    cy.get(`[data-cy="closeAssignmentInstructionFooterBtn"]`).should('be.visible').click();
  });
});
