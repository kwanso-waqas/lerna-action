/// <reference types="cypress" />

describe('checking for good and bad cases for sidebar and courses', () => {
  it('mocking courses api for bad case', () => {
    cy.intercept(
      {
        method: 'GET',
        url: '/formgraders',
      },
      {
        statusCode: 500,
        body: [],
      },
    ).as('getCourses');

    cy.visit('/');
    cy.wait('@getCourses');
  });

  it('check for 500 page to be displayed', () => {
    cy.get(`[data-cy="serverErrorPage"]`).should('be.visible');
    cy.get(`[data-cy="serverErrorPage"]`).contains('500');
  });

  it('mocking courses api for bad case', () => {
    cy.intercept('GET', '/formgraders', {
      fixture: 'courses.json',
    }).as('getCourses');

    cy.visit('/');
    cy.wait('@getCourses');
  });

  it('course name first character should be displayed on small screen', () => {
    cy.get(`[data-cy="sidebarControlBtn"]`).should('be.visible').click();
    cy.get('[data-cy="projIcon1"]').should('be.visible');
    cy.get('[data-cy="projIcon1"]').contains('O');
  });

  it('course full name should be displayed on bigger screen', () => {
    cy.viewport(1440, 920);
    cy.get(`[data-cy="sidebarControlBtn"]`).should('be.visible').click();
    cy.get(`[data-cy="courseDetail"]`).should('be.visible');
    cy.get(`[data-cy="courseDetail"]`).contains('Oop');
  });

  it('course dropdown should be displayed on desktop screen', () => {
    cy.get('[data-cy="courseDropdownBtn"]').should('be.visible');
    cy.get('[data-cy="courseDropdownBtn"]').click();
    cy.get('[data-cy="courseDropdown"]').should('be.visible');
    cy.get('[data-cy="courseDropdown"]').click({ force: true });
  });

  it('on mobile screen sidebar should be hidden', () => {
    cy.viewport(414, 736);
    cy.get(`[data-cy="sidebarControlBtn"]`).should('be.visible').click();
    cy.get(`[data-cy="sidebar"]`).should('be.visible');
    cy.get('[data-cy=Sidebarlogo]').should('be.visible');
    cy.get('[data-cy=courseDropdownBtn]').should('be.visible').click();
    cy.get(`[data-cy="courseDropdown"]`).should('be.visible');
    cy.get('[data-cy=Sidebarlogo]').click();
    cy.get('[data-cy=sidebarLinks]').should('be.visible');
    cy.get('[data-cy="manage-assignmentsLink"]').should('be.visible');
    cy.get('[data-cy="manual-gradingLink"]').should('be.visible');
    cy.get('[data-cy="manage-studentsLink"]').should('be.visible');

    cy.url().then((sidebarLink) => {
      cy.get(`[data-cy="${sidebarLink.split('/')[3]}Link"]`).should('have.class', 'isActive');
    });

    cy.get(`[data-cy="sidebarBackdrop"]`).click({ force: true });
  });

  it('should close sidebar on backdrop click', () => {
    cy.viewport(1440, 920);
    cy.get(`[data-cy="sidebar"]`).should('have.class', 'closeSidebar');
    cy.get(`[data-cy="sidebarControlBtn"]`).should('be.visible').click();
    cy.get(`[data-cy="sidebar"]`).should('have.class', 'openSidebar');
    cy.get(`[data-cy="sidebarControlBtn"]`).should('be.visible').click();
    cy.get(`[data-cy="sidebar"]`).should('have.class', 'closeSidebar');
  });
});
