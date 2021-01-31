const baseUrl = 'http://localhost:3000'
const token = ''

describe('Server api tests', function () {
    beforeEach(() => {
        cy.authenticateSession()
    })

    it('should get all rooms', function () {
        cy.request({
            method: 'GET',
            url: `${baseUrl}/api/rooms`,
            headers: {
                'Content-Type': 'application/json',
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken)
            }
        }).then(res => {
            cy.log(res)
            expect(res.status).to.eq(200)
            expect(res.body).to.have.length(2)
            expect(res.body[0]).to.have.property('category', 'double')
        })
    })

    it('should create a reservation', function () {
        cy.request({
            method: 'POST',
            url: `${baseUrl}/api/reservation/new`,
            headers: {
                'Content-Type': 'application/json',
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken)
            },
            body: {
                bill: 1,
                client: 1,
                end: "2020-11-29",
                id: 3,
                room: 303,
                start: "2020-11-21",
            }
        }).then(res => {
            cy.log(res)
            expect(res.status).to.eq(200)
            expect(res.body).to.have.keys('bill', 'client', 'created', 'end', 'id', 'room', 'start')
        })
    })

    it('should delete a client', function () {
        // Create test user to delete
        cy.request({
            method: 'POST',
            url: `${baseUrl}/api/client/new`,
            headers: {
                'Content-Type': 'application/json',
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken)
            },
            body: {
                name: "test",
                email: "test@test.se",
                telephone: "070",
            }
        }).then(res => {
            // delete test user
            cy.request({
                method: 'DELETE',
                url: `${baseUrl}/api/client/${res.body.id}`,
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-Auth': JSON.stringify(Cypress.env().loginToken)
                }
            }).then(res => {
                cy.log(res)
                expect(res.status).to.eq(200)
            })
        })
    })

    it('should edit a bill', function () {

        cy.request({
            method: 'PUT',
            url: `${baseUrl}/api/bill/1/`,
            headers: {
                'Content-Type': 'application/json',
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken)
            },
            body: {
                id: 1,
                value: "499",
                paid: true,
            }
        }).then(res => {
            cy.log(res)
            expect(res.status).to.eq(200)
            expect(res.body).to.have.property('id', 1)
            expect(res.body).to.have.property('paid', true)
            expect(res.body).to.have.property('value', 499)
        })
    })
})