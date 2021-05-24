const chai = require("chai");
const chaiHttp = require ("chai-http");
const server = require("../app");

chai.should();

chai.use(chaiHttp);

describe('Civic points API, Events Router', () => {
    
    /**
    * Test GET events list route
    */
    describe("GET /events/eventList", ()=>{
        it("Dovrei ottenere una lista di tutti gli eventi", (done)=>{
            chai.request(server)
            .get("/events/eventList")
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('array');
                done();
            })
        })
    })
    
    
    /**
    * Test GET route non definita
    */


    describe("GET /events/eventList", ()=>{
        it("Dovrei ottenere una risposta 404", (done)=>{
            chai.request(server)
            .get("/events/aaaaaaa") //URL errata per testare 404
            .end((err, response) => {
                response.should.have.status(404);
                done();
            })
        })
    })


    /**
    * Test GET events by id route
    */
    
    
    /**
    * Test POST create event
    */
    
    
})