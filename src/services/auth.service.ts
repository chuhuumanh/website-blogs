import { BadRequestException, Injectable, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { Users } from 'src/entity/users';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from 'src/validation/user.dto';
@Injectable()
export class AuthService {
    constructor(@InjectRepository(Users) private userRepository: Repository<Users> ,private userSerivce: UserService, private jwtService: JwtService){}

    async SignIn(user: UserDto): Promise<any>{
        const userInfor = await this.userSerivce.FindOne(user.username, user.password);
        if(!userInfor)
            throw new NotAcceptableException("Incorect username or passowrd !");
        const payload = {profile: JSON.stringify(userInfor)}
        return {
            access_token: await this.jwtService.signAsync(payload)
        };
    }

    async SignUp(newUser: UserDto): Promise<any>{
        const isUsernameExist = await this.userSerivce.FindOne(newUser.username, undefined)?true:false;
        const isPasswordMatch = newUser.password === newUser.confirmPassword;
        if(isUsernameExist)
            throw new NotAcceptableException("Username has been taken already !");
        if(!isPasswordMatch)
            throw new NotAcceptableException("Password and confirm password doesn't match !");
        try{
            await this.userRepository.save(newUser);
            const payload = {profile: JSON.stringify(await this.userSerivce.FindOne(newUser.username, newUser.password))}
            return {
                access_token: await this.jwtService.signAsync(payload)
            };
        }
        catch(error){
            console.log(error)
            throw new BadRequestException();
        }
    }
}
