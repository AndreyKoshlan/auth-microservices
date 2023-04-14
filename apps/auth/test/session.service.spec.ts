import { Test } from '@nestjs/testing';
import {getRepositoryToken} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";
import * as bcrypt from 'bcrypt';
import {UnauthorizedException} from "@nestjs/common";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {SessionService} from "../src/session/session.service";
import {UserEntity} from "../src/user/user.entity";
import {UserService} from "../src/user/user.service";

const USER = async() => <UserEntity>{
    id: 1,
    email: 'email@gmail.com',
    passwordHash: await bcrypt.hash('12345678', 10),
    role: 'admin'
};

describe('SessionService', () => {
    let sessionService;
    let jwtService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: './.env',
                    isGlobal: true,
                }),
                JwtModule.register({
                    secret: process.env.PRIVATE_KEY,
                    signOptions: {
                        expiresIn: '24h'
                    }
                }),
            ],
            providers: [
                UserService,
                SessionService,
                {
                    provide: getRepositoryToken(UserEntity),
                    useValue: {
                        findOne: jest.fn()
                    }
                },
            ]
        }).compile();

        sessionService = module.get(SessionService);
        jwtService = module.get(JwtService);
    });

    describe('generateToken', () => {
        it('should have correct payload', async () => {
            jest.spyOn(jwtService, 'sign');
            let user = await USER();
            await sessionService.generateToken(user);
            expect(jwtService.sign).toBeCalledWith(
                expect.objectContaining({
                    id: user.id,
                    email: user.email,
                    role: user.role
                })
            );
        });
    });

    describe('validatePassword', () => {
        it(`should return true when password matches`,  async() => {
            let user = await USER();
            let correctPassword = '12345678';
            let result = await sessionService.validatePassword(user, correctPassword);
            expect(result).toBe(true);
        });

        it(`should throw an UnauthorizedException when the password doesn't match the user one`,  async() => {
            let user = await USER();
            let incorrectPassword = 'incorrect';
            await expect(sessionService.validatePassword(user, incorrectPassword)).rejects.toThrow(
                UnauthorizedException
            );
        });
    });
});