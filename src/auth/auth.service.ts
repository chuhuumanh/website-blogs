import { BadRequestException, Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { UserRegisterDto } from 'src/validation/user.register.dto';
import { UserSignInDto } from 'src/validation/user.signin.dto';
@Injectable()
export class AuthService {
    constructor(private userSerivce: UserService, private jwtService: JwtService){}

    async SignIn(user: UserSignInDto): Promise<any>{
        const userInfor = await this.userSerivce.FindOne(user.username, user.password);
        if(!userInfor)
            throw new NotAcceptableException("Incorect username or passowrd !");
        const payload = {profile: JSON.stringify(userInfor)}
        return {
            access_token: await this.jwtService.signAsync(payload)
        };
    }

    async SignUp(newUser: UserRegisterDto): Promise<any>{
        const isUsernameExist = await this.userSerivce.FindOne(newUser.username, undefined)?true:false;
        const isPasswordMatch = newUser.password === newUser.confirmPassword;
        if(typeof newUser.roleId !== 'number')
            throw new BadRequestException('roleId must be a number !');
        if(isUsernameExist)
            throw new NotAcceptableException("Username has been taken already !");
        if(!isPasswordMatch)
            throw new NotAcceptableException("Password and confirm password doesn't match !");
        try{
            await this.userSerivce.Add(newUser);
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
