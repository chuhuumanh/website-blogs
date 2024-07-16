import { ConflictException, forwardRef, Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { RoleService } from 'src/role/role.service';
import { UserService } from 'src/user/user.service';
import { UserRegisterDto } from 'src/validation/user.register.dto';
import { UserSignInDto } from 'src/validation/user.signin.dto';
import { Repository } from 'typeorm';
import { TokenBlackList } from './token.blacklist.entity';
@Injectable()
export class AuthService {
    constructor(@Inject(forwardRef(() => UserService)) private userSerivce: UserService, private jwtService: JwtService, 
        @InjectRepository(TokenBlackList) private tokenBlackListRepository: Repository<TokenBlackList>, private roleService: RoleService){}

    async signIn(user: UserSignInDto): Promise<object>{
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
        }
    }

    async signUp(newUser: UserRegisterDto): Promise<object>{
        
        const username = {
            username: newUser.username
        }
        const email = {
            email: newUser.email
        }
        const phone = {
            phoneNum: newUser.phoneNum
        }
        const detailByUsername = await this.userSerivce.findOne(username);
        const detailByEmail = await this.userSerivce.findOne(email);
        const detailByPhoneNum = await this.userSerivce.findOne(phone);
        const isPasswordMatch = newUser.password === newUser.confirmPassword;
        if(detailByEmail)
            throw new ConflictException('Email has been used by another account !');
        if(detailByUsername)
            throw new ConflictException('Username has been taken already !');
        if(detailByPhoneNum)
            throw new ConflictException('Phone number has been used by another account !');
        if(!isPasswordMatch)
            throw new NotAcceptableException("Password and confirm password doesn't match !");
        
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

    async logout(token: string): Promise<object>{
        const expiredToken = token.split(' ')[1];
        await this.tokenBlackListRepository.save({token: expiredToken});
        return {message: "Log out"}
    }

    async findTokenBlackList(token: string): Promise<TokenBlackList>{
        return await this.tokenBlackListRepository.findOneBy({token});
    }
}
