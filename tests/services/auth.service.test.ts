import { AuthService } from '../../services/auth.service';
import { mock, MockProxy } from 'jest-mock-extended'

import UserService from '../../services/user.service';
import { LoggerService } from '../../services/logger.service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import HttpException from '../../exceptions/httpException';
import { User } from '../../entities/userEntities/user.entity';

jest.mock('../../services/user.service');
jest.mock('../../services/logger.service');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

let mockUserService:MockProxy<UserService>
let authService:AuthService;
let mockLogger: MockProxy<LoggerService>;


describe('AuthService', () => {
    beforeEach(() => {

        mockLogger = mock<LoggerService>({
            info: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn()
        });

       
        (LoggerService.getInstance as jest.Mock).mockReturnValue(mockLogger);

        mockUserService = mock<UserService>();
        authService = new AuthService(mockUserService);
    });

    describe('login', () => {
        const mockUser = {
            user_id: 'KV001', 
            name: 'Test User',
            email: 'test@test.com',
            password: 'hashedPassword',
            role: { role_name: 'user' },
            joined_at: new Date(), 
            experience: null,
            userSkills: [],
            managedProjects: [],
            leadProjects: [],
            projectUsers: [],
            notes: [],
            designations: []
        } as any

        it('should successfully login and return token', async () => {
            mockUserService.getUserByEmail.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (jwt.sign as jest.Mock).mockReturnValue('mockToken');

            const result = await authService.login('test@test.com', 'password');

       
            expect(result).toEqual({
                tokenType: 'Bearer',
                accessToken: 'mockToken',
                role: 'user',
                user_id: 'KV001'
            });

            
            expect(mockLogger.info).toHaveBeenCalledWith(
                expect.stringContaining('Login attempt for email: test@test.com')
            );
        });

        it('should throw error if user not found', async () => {
            mockUserService.getUserByEmail.mockResolvedValue(null);

            await expect(authService.login('test@test.com', 'password'))
                .rejects
                .toThrow(new HttpException(401, 'User not found'));
        });

        it('should throw error if password is invalid', async () => {
            mockUserService.getUserByEmail.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(authService.login('test@test.com', 'wrongpassword'))
                .rejects
                .toThrow(new HttpException(400, 'Invalid user'));
        });
    });
});