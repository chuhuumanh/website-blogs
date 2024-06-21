import { BadRequestException, Injectable, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Users } from 'src/entity/users';
import { createLoginDto } from 'src/validation/account.schema';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createSignUpDto } from 'src/validation/register.schema';
@Injectable()
export class AuthService {
    constructor(@InjectRepository(Users) private userRepository: Repository<Users> ,private userSerivce: UserService, private jwtService: JwtService){}

    async SignIn(signInDto: createLoginDto): Promise<any>{
        const user = await this.userSerivce.FindOne(signInDto.username, signInDto.password);
        if(!user)
            throw new NotAcceptableException("Incorect username or passowrd !");
        const payload = {profile: JSON.stringify(user)}
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async SignUp(newUser: createSignUpDto): Promise<any>{
        const isUsernameExist = await this.userSerivce.FindOne(newUser.username, undefined)?null:false;
        const isPasswordMatch = newUser.password === newUser.confirmPassword;
        console.log(isUsernameExist);
        if(isUsernameExist)
            throw new NotAcceptableException("Username has been taken already !");
        if(!isPasswordMatch)
            throw new NotAcceptableException("Password and confirm password doesn't match !");
        try{
            await this.userRepository.save(newUser);
            return "OK";
        }
        catch(error){
            console.log(error)
            throw new BadRequestException();
        }
        
    }

}
