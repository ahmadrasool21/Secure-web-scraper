let chai, sinon, expect;

before(async () => {
  chai = await import('chai');
  sinon = await import('sinon');
  const sinonChai = await import('sinon-chai');

  chai.default.use(sinonChai.default);
  expect = chai.default.expect;
  sinon = sinon.default;
});

const authController = require('../../controllers/authController');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

describe('Auth Controller', () => {

  afterEach(() => {
    sinon.restore();
  });

  describe('register', () => {
    it('should return error if user already exists', async () => {
      const req = {
        body: { email: 'test@example.com', password: '123456' },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      sinon.stub(validationResult, 'withDefaults').returns(() => ({
        isEmpty: () => true,
      }));
      sinon.stub(User, 'findOne').resolves({ email: 'test@example.com' });

      await authController.register(req, res);

      expect(res.status).to.have.been.calledWith(400);
      expect(res.json).to.have.been.calledWithMatch({ msg: "User already exists" });
    });

    it('should create user and return success message', async () => {
      const req = {
        body: { email: 'new@example.com', password: '123456' },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      sinon.stub(validationResult, 'withDefaults').returns(() => ({
        isEmpty: () => true,
      }));
      sinon.stub(User, 'findOne').resolves(null);
      sinon.stub(bcrypt, 'hash').resolves('hashed123');
      sinon.stub(User, 'create').resolves({ email: 'new@example.com' });

      await authController.register(req, res);

      expect(res.status).to.have.been.calledWith(201);
      expect(res.json).to.have.been.calledWithMatch({ msg: "Registration successful" });
    });
  });

  describe('login', () => {
    it('should return error if user not found', async () => {
      const req = {
        body: { email: 'nope@example.com', password: 'wrong' }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      sinon.stub(validationResult, 'withDefaults').returns(() => ({
        isEmpty: () => true,
      }));
      sinon.stub(User, 'findOne').resolves(null);

      await authController.login(req, res);

      expect(res.status).to.have.been.calledWith(400);
    });

    it('should return error if password is incorrect', async () => {
      const req = {
        body: { email: 'test@example.com', password: 'wrong' }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      sinon.stub(validationResult, 'withDefaults').returns(() => ({
        isEmpty: () => true,
      }));
      sinon.stub(User, 'findOne').resolves({ email: 'test@example.com', password: 'hashed' });
      sinon.stub(bcrypt, 'compare').resolves(false);

      await authController.login(req, res);

      expect(res.status).to.have.been.calledWith(400);
    });

    it('should set token and return login success', async () => {
      const req = {
        body: { email: 'test@example.com', password: '123456' }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
        cookie: sinon.stub(),
      };

      sinon.stub(validationResult, 'withDefaults').returns(() => ({
        isEmpty: () => true,
      }));
      sinon.stub(User, 'findOne').resolves({ id: 1, email: 'test@example.com', password: 'hashed' });
      sinon.stub(bcrypt, 'compare').resolves(true);
      sinon.stub(jwt, 'sign').returns('testtoken');

      await authController.login(req, res);

      expect(res.cookie).to.have.been.calledWithMatch("token", "testtoken");
      expect(res.json).to.have.been.calledWithMatch({
        msg: "Login successful",
        user: { id: 1, email: 'test@example.com' }
      });
    });
  });
});
