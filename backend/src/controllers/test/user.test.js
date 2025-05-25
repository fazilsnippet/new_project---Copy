import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import httpMocks from 'node-mocks-http';
import { registerUser, loginUser } from '../user.controller.js';
import { User } from '../../models/user.model.js';
import * as tokenUtils from '../user.controller.js'; // For token mocks

vi.mock('../../models/user.model.js');

describe('User Controller', () => {
  let req, res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should return 400 if required fields are missing', async () => {
      req.method = 'POST';
      req.body = { email: '', fullName: '', userName: '', password: '' };

      await expect(registerUser(req, res)).rejects.toThrow('All fields are required');
    });

    it('should return 409 if user already exists', async () => {
      User.findOne.mockResolvedValue({ _id: '123' });

      req.body = {
        fullName: 'Test User',
        email: 'test@example.com',
        userName: 'testuser',
        password: 'Password123',
      };

      await expect(registerUser(req, res)).rejects.toThrow('User already exists');
    });

    it('should register user successfully', async () => {
      User.findOne.mockResolvedValue(null);

      const mockUser = {
        _id: '1',
        fullName: 'John Doe',
        email: 'john@example.com',
        userName: 'johnny',
        phone: '1234567890',
        toObject: () => ({
          _id: '1',
          fullName: 'John Doe',
          email: 'john@example.com',
          userName: 'johnny',
          phone: '1234567890',
        }),
      };
      User.create.mockResolvedValue(mockUser);

      req.body = {
        fullName: 'John Doe',
        email: 'john@example.com',
        userName: 'johnny',
        password: 'Password123',
        phone: '1234567890',
      };

      await registerUser(req, res);
      const data = res._getJSONData();

      expect(res.statusCode).toBe(201);
      expect(data.message).toBe('User registered Successfully');
      expect(data.data.email).toBe('john@example.com');
    });
  });

  describe('User Controller › loginUser', () => {
  let req, res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter });
    vi.clearAllMocks();
  });

  it('should return 400 if missing credentials', async () => {
    req.body = { email: '', password: '' };
    await loginUser(req, res);
    const data = res._getJSONData();

    expect(res.statusCode).toBe(400);
    expect(data.message).toBe('Please provide both email/username and password');
  });

  it('should throw 404 if user not found', async () => {
    // findOne returns null → ApiError(404)
    User.findOne.mockResolvedValue(null);

    req.body = { email: 'noone@x.com', password: 'pw' };
    await expect(loginUser(req, res)).rejects.toThrow('Username or email does not exist');
  });

  it('should throw 409 if password is invalid', async () => {
    // findOne returns a user instance with isPasswordCorrect = false
    const badUser = {
      _id: 'abc123',
      isPasswordCorrect: vi.fn().mockResolvedValue(false),
    };
    User.findOne.mockResolvedValue(badUser);

    req.body = { email: 'user@x.com', password: 'wrong' };
    await expect(loginUser(req, res)).rejects.toThrow('Invalid user password');
  });

  it('should login user and return tokens', async () => {
    // 1) findOne finds a user whose isPasswordCorrect = true
    const validUser = {
      _id: 'abc123',
      isPasswordCorrect: vi.fn().mockResolvedValue(true),
    };
    User.findOne.mockResolvedValue(validUser);

    // 2) generateAccessTokenAndRefreshToken receives validUser._id
    vi.spyOn(tokenUtils, 'generateAccessTokenAndRefreshToken')
      .mockResolvedValue({ accessToken: 'ATOK', refreshToken: 'RTOK' });

    // 3) findById().select(...) returns the sanitized user document
    User.findById.mockReturnValue({
      select: vi.fn().mockResolvedValue({
        _id: 'abc123',
        email: 'user@x.com',
        userName: 'uname',
        toObject: () => ({
          _id: 'abc123',
          email: 'user@x.com',
          userName: 'uname',
        }),
      }),
    });

    req.body = { email: 'user@x.com', password: 'correct' };
    await loginUser(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data.data).toHaveProperty('accessToken');
    expect(data.data).toHaveProperty('refreshToken');
  });
});
  });

