let chai, expect, sinon, supertest, express, cookieParser;
let app;

before(async () => {
  // Load all modules dynamically
  chai = await import('chai');
  expect = chai.default.expect;
  sinon = (await import('sinon')).default;
  supertest = (await import('supertest')).default;
  express = (await import('express')).default;
  cookieParser = (await import('cookie-parser')).default;

  const authRoutes = (await import('../../routes/authRoutes.js')).default;

  // Setup Express app
  app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use('/api', authRoutes);
});

describe('Auth Routes', () => {
  describe('POST /api/register', () => {
    it('should return 400 for invalid email', async () => {
      const res = await supertest(app)
        .post('/api/register')
        .send({ email: 'invalid', password: '123456' });

      expect(res.status).to.equal(400);
      expect(res.body.errors).to.be.an('array');
    });

    it('should return 400 for short password', async () => {
      const res = await supertest(app)
        .post('/api/register')
        .send({ email: 'test@example.com', password: '123' });

      expect(res.status).to.equal(400);
      expect(res.body.errors).to.be.an('array');
    });
  });

  describe('POST /api/login', () => {
    it('should return 400 for empty password', async () => {
      const res = await supertest(app)
        .post('/api/login')
        .send({ email: 'test@example.com', password: '' });

      expect(res.status).to.equal(400);
      expect(res.body.errors).to.be.an('array');
    });
  });

  describe('POST /api/logout', () => {
    it('should clear cookie and return logout message', async () => {
      const res = await supertest(app)
        .post('/api/logout');

      expect(res.status).to.equal(200);
      expect(res.body.msg).to.equal('Logged out successfully');
    });
  });
});
