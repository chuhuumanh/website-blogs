import { BadRequestException, ConflictException, Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { UserRegisterDto } from 'src/validation/user.register.dto';
import { UserSignInDto } from 'src/validation/user.signin.dto';
import { TokenBlackList } from './token.blacklist.entity';
import { Repository } from 'typeorm';
import { RoleService } from 'src/role/role.service';
import * as bcrypt from 'bcrypt'
@Injectable()
export class AuthService {
    constructor(private userSerivce: UserService, private jwtService: JwtService, 
        @InjectRepository(TokenBlackList) private tokenBlackListRepository: Repository<TokenBlackList>, private roleService: RoleService){}

    async signIn(user: UserSignInDto): Promise<any>{
        const options = {
            username: user.username,
        }
        const userInfor = await this.userSerivce.findOne(options);
        if(!userInfor)
            throw new NotAcceptableException("Incorrect username!");
        const userPassword = await this.userSerivce.findPassword(user.username);
        const isUserInforMatch = await bcrypt.compare(user.password, userPassword);
        if(!isUserInforMatch)
            throw new NotAcceptableException('Incorrect password');
        const payload = {profile: JSON.stringify({id:userInfor.id, username: userInfor.username, role: userInfor.role})};
        return {
            access_token: await this.jwtService.signAsync(payload)
        };
    }

    async signUp(newUser: UserRegisterDto): Promise<any>{
        const usernameOption = {
            username: newUser.username
        }
        const emailOption = {
            email: newUser.email
        }
        const isUsernameExist = await this.userSerivce.findOne(usernameOption)?true:false;
        const isEmailExist = await this.userSerivce.findOne(emailOption)?true:false;
        const isPasswordMatch = newUser.password === newUser.confirmPassword;
        if(isEmailExist)
            throw new ConflictException('Email has been used by another account !');
        if(isUsernameExist)
            throw new ConflictException("Username has been taken already !");
        if(!isPasswordMatch)
            throw new NotAcceptableException("Password and confirm password doesn't match !");
        try{
            const role = 'user';
            const salt = await bcrypt.genSalt()
            const hashPassword = await bcrypt.hash(newUser.password, salt);
            newUser.password = hashPassword;
            newUser['role'] = await this.roleService.findOne(role);
            const user = await this.userSerivce.add(newUser);
            const payload = {profile: JSON.stringify({id: user.id, username: user.username, role: user.role.name})}
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
