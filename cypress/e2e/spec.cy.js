// import { describe } from "test"

describe('check if the protected route works (projectslist)', () => {
  it('redirects to login if not authenticated', () => {
    cy.visit('/projectslist');
    cy.url().should('include', '/login');
  })
});

describe('check if login works', () => {
  it('login the user in', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('amra@gmail.com');
    cy.get('input[name="password"]').type('123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/');
    cy.screenshot('login-successful');
  })
})

describe('check if user logout works', () => {
  it('user logout check', function () {
    cy.visit('http://localhost:5000')
    cy.get('#root a[href="/login"]').click();
    cy.get('#root [name="email"]').click();
    cy.get('#root [name="email"]').type('amra@gmail.com');
    cy.get('#root [name="password"]').type('123');
    cy.get('#root button').click();
    cy.get('#root button.btn-logout').click();

    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.be.null;
      expect(win.localStorage.getItem('name')).to.be.null;
      expect(win.localStorage.getItem('role')).to.be.null;
      cy.screenshot('logout-successful');
    });
  });
});

describe('check if add project works', () => {
  it('add project', function () {

    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('role', 'Admin');
        win.localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MWJmNGQzYjg3MmQzN2YxMzg5YTdjYyIsImVtYWlsIjoiYWRtaW5Ac2l0ZS5jb20iLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE3NjQ4MjMyNjQsImV4cCI6MTc2NTQyODA2NH0.dToWWJUmANP-RoAOVXheZgoFg5s69RtGaRmyERKimL0');
      }
    });
    cy.get('#root a[href="/projectslist"]').click();
    cy.get('#root button.create-btn').click();
    cy.get('[name="title"]').click();
    cy.get('[name="title"]').type('Project1');
    cy.get('[name="firstname"]').type('Amra');
    cy.get('[name="lastname"]').type('Saeed');
    cy.get('[name="email"]').type('amra@gmail.com');
    cy.get('[name="completion"]').click();
    cy.get('[name="completion"]').type('2024-12-31');
    cy.get('[name="description"]').click();
    cy.get('[name="description"]').type('New project added');
    cy.get('#root button.create-btn').click();
    cy.screenshot('project-added');
  });
});

describe('check if update project works', () => {
  it('update project', function () {

    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('role', 'Admin');
        win.localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MWJmNGQzYjg3MmQzN2YxMzg5YTdjYyIsImVtYWlsIjoiYWRtaW5Ac2l0ZS5jb20iLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE3NjQ4MjMyNjQsImV4cCI6MTc2NTQyODA2NH0.dToWWJUmANP-RoAOVXheZgoFg5s69RtGaRmyERKimL0');
      }
    });

    cy.get('#root a[href="/projectslist"]').click();
    cy.get('table tbody tr', { timeout: 10000 }).should('have.length.greaterThan', 0);
    cy.contains('td', 'Project1').parent('tr').find('button.btn-update').click();

    cy.get('[name="firstname"]').clear().type('Updated Amra');
    cy.get('#root button.create-btn').click();
    cy.contains('td', 'Updated Amra', { timeout: 10000 }).should('exist');
    cy.screenshot('project-updated');

  });
});

describe('check if delete project works', () => {
  it('delete project', function () {

    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('role', 'Admin');
        win.localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MWJmNGQzYjg3MmQzN2YxMzg5YTdjYyIsImVtYWlsIjoiYWRtaW5Ac2l0ZS5jb20iLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE3NjQ4MjMyNjQsImV4cCI6MTc2NTQyODA2NH0.dToWWJUmANP-RoAOVXheZgoFg5s69RtGaRmyERKimL0');
      }
    });

    cy.get('#root a[href="/projectslist"]').click();
    cy.get('table tbody tr', { timeout: 10000 }).should('have.length.greaterThan', 0);
    cy.contains('td', 'Project1').parent('tr').find('button.btn-delete').click();
    cy.contains('td', 'Project1').should('not.exist');
    cy.screenshot('project-deleted');

  });
});
