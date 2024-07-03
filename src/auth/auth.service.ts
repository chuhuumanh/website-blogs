import { BadRequestException, Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { UserRegisterDto } from 'src/validation/user.register.dto';
import { UserSignInDto } from 'src/validation/user.signin.dto';
import { TokenBlackList } from './token.blacklist';
import { Repository } from 'typeorm';
@Injectable()
export class AuthService {
    constructor(private userSerivce: UserService, private jwtService: JwtService, 
        @InjectRepository(TokenBlackList) private tokenBlackListRepository: Repository<TokenBlackList>){}

    async signIn(user: UserSignInDto): Promise<any>{
        const userInfor = await this.userSerivce.findOne(user.username, user.password);
        if(!userInfor)
            throw new NotAcceptableException("Incorect username or passowrd !");
        const payload = {profile: JSON.stringify(userInfor)}
        return {
            access_token: await this.jwtService.signAsync(payload)
        };
    }

    async signUp(newUser: UserRegisterDto): Promise<any>{
        const isUsernameExist = await this.userSerivce.findOne(newUser.username, undefined)?true:false;
        const isPasswordMatch = newUser.password === newUser.confirmPassword;

        if(isUsernameExist)
            throw new NotAcceptableException("Username has been taken already !");
        if(!isPasswordMatch)
            throw new NotAcceptableException("Password and confirm password doesn't match !");
        try{
            newUser['role'] = {
                id: 2,
                name: 'user'
            }
            await this.userSerivce.add(newUser);
            await this.userSerivce.findOne(newUser.username, newUser.password);
            const payload = {profile: JSON.stringify(await this.userSerivce.findOne(newUser.username, newUser.password))}
            return {
                access_token: await this.jwtService.signAsync(payload)
            };
        }
        catch(error){
            console.log(error)
            throw new BadRequestException();
        }
    }

    async logout(token: string){
        const expiredToken = token.split(' ')[1];
        await this.tokenBlackListRepository.save({token: expiredToken});
    }

    async findTokenBlackList(token: string){
        return await this.tokenBlackListRepository.findOneBy({token});
    }
}
