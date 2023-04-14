import { Test } from '@nestjs/testing';
import {getRepositoryToken } from "@nestjs/typeorm";
import { of } from 'rxjs';
import { ProfileService } from "../src/profile.service";
import {ProfileEntity} from "../src/profile.entity";

const CORRECT_EMAIL = 'test1@gmail.com';
const CORRECT_PASSWORD = '12345678';
const CORRECT_NAME = 'Abc';
const CORRECT_SURNAME = 'Abc';
const CORRECT_DATA = {
    email: CORRECT_EMAIL,
    password: CORRECT_PASSWORD,
    name: CORRECT_NAME,
    surname: CORRECT_SURNAME
};

describe('ProfileService', () => {
    let profileService;
    let profileRepository;
    let userService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                ProfileService,
                {
                    provide: getRepositoryToken(ProfileEntity),
                    useValue: {
                        save: jest.fn()
                    }
                },
                {
                    provide: 'USER_SERVICE',
                    useValue: {
                        send: jest.fn()
                    }
                }
            ]
        }).compile();

        profileService = module.get(ProfileService);
        profileRepository = module.get(getRepositoryToken(ProfileEntity));
        userService = module.get('USER_SERVICE');
    });

    describe('create', () => {
        it('should create profile with correct data',  async() => {
            jest.spyOn(userService, 'send').mockReturnValueOnce(of(4));
            await profileService.create(CORRECT_DATA);
            expect(profileRepository.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    ...CORRECT_DATA, userId: 4
                })
            );
        });

        it('should send a message to the user microservice with correct data',  async() => {
            jest.spyOn(userService, 'send').mockReturnValueOnce(of(4));
            await profileService.create(CORRECT_DATA);
            expect(userService.send).toHaveBeenCalledWith(
                'user_create',
                expect.objectContaining({
                    email: CORRECT_DATA.email,
                    password: CORRECT_DATA.password
                })
            );
        });

        it('should return correct id',  async() => {
            jest.spyOn(userService, 'send').mockReturnValueOnce(of(8));
            let result = await profileService.create(CORRECT_DATA);
            expect(result).toBe(8);
        });

    });
});