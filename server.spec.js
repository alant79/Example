let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");
let should = chai.should();
chai.use(chaiHttp);

const zones = [
  {
    id: "1",
    type: "POLYGON",
    coords: [
      [60.071816, 30.292474],
      [60.043844, 30.472548],
      [60.005177, 30.338023],
      [60.071816, 30.292474]
    ]
  },
  {
    id: "2",
    type: "CIRCLE",
    coords: [[59.987187, 30.359123], 5000]
  },
  {
    id: "3",
    type: "CIRCLE",
    coords: [[59.987187, 30.359123], 6000]
  }
];

describe("Server REST API", () => {
  describe("/GET /", () => {
    it("it should GET a html with app-root", done => {
      chai
      .request(server)
      .get("/")
      .end((err, res) => {
        res.text.should.to.include('<app-root class="app-root"></app-root>');
        res.should.have.status(200);
        done();
      });
    });
  });
  describe("/POST linkToZone", () => {
    it("it should POST a address in POLIGON", done => {
      address = {
        id: "1",
        coords: [60.066046, 30.305192]
      };
      let addresses = [];
      addresses.push(address);
      obj = { addresses, zones };
      chai
        .request(server)
        .post("/linkToZone")
        .send(obj)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("array").that.not.is.empty;
          res.body[0].should.have.property("id").eql("1");
          res.body[0].should.have.property("zone_id").eql("1");
          done();
        });
    });
    it("it should POST a address in CIRCLE", done => {
      address = {
        id: "4",
        coords: [59.986513, 30.355693]
      };
      let addresses = [];
      addresses.push(address);
      obj = { addresses, zones };
      chai
        .request(server)
        .post("/linkToZone")
        .send(obj)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("array").that.not.is.empty;
          res.body[0].should.have.property("id").eql("4");
          res.body[0].should.have.property("zone_id").eql("2");
          done();
        });
    });
    it("it should POST a address not in zones (empty array)", done => {
      address = {
        id: "5",
        coords: [62.986513, 33.355693]
      };
      let addresses = [];
      addresses.push(address);
      obj = { addresses, zones };
      chai
        .request(server)
        .post("/linkToZone")
        .send(obj)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("array").that.is.empty;
          done();
        });
    });
  });
});
