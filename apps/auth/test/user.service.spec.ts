import { Test } from '@nestjs/testing';
import {getRepositoryToken} from "@nestjs/typeorm";
import {ConfigModule, ConfigService} from "@nestjs/config";
import * as bcrypt from 'bcrypt';
import {NotFoundException} from "@nestjs/common";
import {UserEntity} from "../src/user/user.entity";
import {UserService} from "../src/user/user.service";

describe('UserService', () => {
    let userService;
    let userRepository;
    let configService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: './.env',
                    isGlobal: true,
                }),
            ],
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(UserEntity),
                    useValue: {
                        save: jest.fn(),
                        findOne: jest.fn()
                    }
                },
            ]
        }).compile();

        userService = module.get(UserService);
        configService = module.get(ConfigService);
        userRepository = module.get(getRepositoryToken(UserEntity));
    });

    describe('create', () => {
        it('should hash password',  async() => {
            jest.spyOn(bcrypt, 'hash');
            await userService.create('email@gmail.com', '12345678');
            expect(bcrypt.hash).toBeCalledWith('12345678', +configService.get('POSTGRES_SALT'));
        });

        it('should create user',  async() => {
            jest.spyOn(bcrypt, 'hash').mockReturnValueOnce('12345');
            await userService.create('email@gmail.com', '12345678');
            expect(userRepository.save).toBeCalledWith(
                expect.objectContaining(
                    {email: 'email@gmail.com', passwordHash: '12345'}
                )
            );
        });
    });

    describe('findByEmail', () => {
        it('should throw NotFoundException when user not found',  async() => {
            jest.spyOn(userRepository, 'findOne').mockReturnValueOnce(undefined);
            await expect(userService.findByEmail('email@gmail.com')).rejects.toThrow(
                NotFoundException
            );
        });
    });
});