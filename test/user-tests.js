var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../index');
//const PORT = process.env.PORT || 5000;
//server.listen(PORT, () => console.log(`Listening on ${ PORT }`));
var should = chai.should();
var expect = chai.expect;

chai.use(chaiHttp);

describe('Users', function() {
    it('should add a single user on a successful POST request and redirects and renders login page', function(done) {
        chai.request(server).post('/register').send({'name' : 'name of name', 'email': 'email' + Math.floor(Math.random() * 2001) + '@email.com', 'password' : 'supersecret', 'passwordre' : 'supersecret'})
            .end(function(error,res) {
                res.should.have.status(200);
                res.should.be.html;
                res.should.be.ok;
                var route = res.redirects[0].split("/");
                arrayLength = route.length - 1;
                expect(route[arrayLength]).to.equal('login');
                done();
            });
    });
    it('should login a registered user and take them to the game home page', function(done) {
        chai.request(server).post('/login').send({'email': 'admin@admin.com','password' : 'password'})
            .end(function(error,res) {
                res.should.have.status(200);
                res.should.be.html;
                res.should.be.ok;
                res.text.should.match(/Game Page/);
                done();
            });
    });

    it('/Register should render the user to the register page', function(done) {
        chai.request(server).get('/register').end(function(error,res) {
            res.should.have.status(200);
            res.should.be.html;
            res.should.be.ok;
            expect(res.forbidden).to.equal(false);
            expect(res.badRequest).to.equal(false);
            done();
        });
    });

    it('/Reset should render the user to the Reset page', function(done) {
        chai.request(server).get('/reset').end(function(error,res) {
            res.should.have.status(200);
            res.should.be.html;
            res.should.be.ok;
            expect(res.forbidden).to.equal(false);
            expect(res.badRequest).to.equal(false);
            done();
        });
    });

    it('/Login should render the user to the login page', function(done) {
        chai.request(server).get('/login').end(function(error,res) {
            res.should.have.status(200);
            res.should.be.html;
            res.should.be.ok;
            expect(res.forbidden).to.equal(false);
            expect(res.badRequest).to.equal(false);
            done();
        });
    });

    it('/gamehome should render the user to the game page', function(done) {
        chai.request(server).get('/gamehome').end(function(error,res) {
            res.should.have.status(200);
            res.should.be.html;
            res.should.be.ok;
            expect(res.forbidden).to.equal(false);
            expect(res.badRequest).to.equal(false);
            done();
        });
    });
    it('/logout should logout the user and render the user to the login page', function(done) {
        chai.request(server).get('/logout').end(function(error,res) {
            res.should.have.status(200);
            res.should.be.html;
            res.should.be.ok;
            expect(res.forbidden).to.equal(false);
            expect(res.badRequest).to.equal(false);
            done();
        });
    });

});

describe('Admin', function() {
    // it('should add a single public user on a successful POST request and redirects and renders the admin register page', function(done) {
    //     chai.request(server).post('/adminregister').send({'name' : 'name of name', 'email': 'email' + Math.floor(Math.random() * 2001) + '@email.com', type : 'public' ,'password' : 'supersecret', 'passwordre' : 'supersecret'})
    //         .end(function(error,res) {
    //             res.should.have.status(200);
    //             res.should.be.html;
    //             res.should.be.ok;
    //             var route = res.redirects[0].split("/");
    //             arrayLength = route.length - 1;
    //             expect(route[arrayLength]).to.equal('adminRegister');
    //             done();
    //         });
    // });
    it('should login a registered admin and take them to the admin landing page', function(done) {
        chai.request(server).post('/adminlogin').send({'email': 'admin@admin.com','password' : 'password'})
            .end(function(error,res) {
                res.should.have.status(200);
                res.should.be.html;
                res.should.be.ok;
                res.text.should.match(/admin_home/);
                done();
            });
    });
    it('should find a user with a given id that exists in the database and display it', function(done) {
        chai.request(server).get('/searchUser?id=0').end(function(error,res) {
            res.should.have.status(200);
            res.should.be.html;
            res.should.be.ok;
            expect(res.forbidden).to.equal(false);
            expect(res.badRequest).to.equal(false);
            done();
        });
    });

    it('/AdminRegister should render the user to the Admin register page', function(done) {
        chai.request(server).get('/adminregister').end(function(error,res) {
            res.should.have.status(200);
            res.should.be.html;
            res.should.be.ok;
            expect(res.forbidden).to.equal(false);
            expect(res.badRequest).to.equal(false);
            done();
        });
    });

    it('/AdminLogin should render the user to the admin login page', function(done) {
        chai.request(server).get('/adminlogin').end(function(error,res) {
            res.should.have.status(200);
            res.should.be.html;
            res.should.be.ok;
            expect(res.forbidden).to.equal(false);
            expect(res.badRequest).to.equal(false);
            done();
        });
    });

    it('/admin should render the user to the admin home page', function(done) {
        chai.request(server).get('/admin').end(function(error,res) {
            res.should.have.status(200);
            res.should.be.html;
            res.should.be.ok;
            expect(res.forbidden).to.equal(false);
            expect(res.badRequest).to.equal(false);
            done();
        });
    });

    it('/search should render the user to the searchUser page', function(done) {
        chai.request(server).get('/search').end(function(error,res) {
            res.should.have.status(200);
            res.should.be.html;
            res.should.be.ok;
            expect(res.forbidden).to.equal(false);
            expect(res.badRequest).to.equal(false);
            done();
        });
    });

    it('/gamehome should render the user to the game page', function(done) {
        chai.request(server).get('/gamehome').end(function(error,res) {
            res.should.have.status(200);
            res.should.be.html;
            res.should.be.ok;
            expect(res.forbidden).to.equal(false);
            expect(res.badRequest).to.equal(false);
            done();
        });
    });


    it('/delete should render the user to the delete page', function(done) {
        chai.request(server).get('/login').end(function(error,res) {
            res.should.have.status(200);
            res.should.be.html;
            res.should.be.ok;
            expect(res.forbidden).to.equal(false);
            expect(res.badRequest).to.equal(false);
            done();
        });
    });

    it('/log-out should logout the admin and render the admin to the admin login page', function(done) {
        chai.request(server).get('/log-out').end(function(error,res) {
            res.should.have.status(200);
            res.should.be.html;
            res.should.be.ok;
            expect(res.forbidden).to.equal(false);
            expect(res.badRequest).to.equal(false);
            done();
        });
    });
});
