import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) { }

  /**
   * Authenticate, Authorize & Validate a user
   * @param context Execution Context
   * @returns A boolean stating if a user is authenticated & authorized
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.authService.extractTokenFromHeader('authToken', request);
    const url = request.url;
    // Absence of Bearer Token
    if (!token) {
      throw new UnauthorizedException(
        `Unauthorized Access - Absence of Authorization Token`,
      );
    }

    try {
      let userDetails = await this.authService.fetchUserFromToken(token);
      let userEmail = " userDetails.payload['unique_name']";
      const urlIncludesMember = url.includes('/members');
      const odsSearch = url.includes('/search');
      if (urlIncludesMember) {
        userDetails = await this.authService.fetchMemberFromToken(token);
      }
      const expireTime = userDetails['exp'];
      const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds
      console.log(`${urlIncludesMember} urlIncludesMember ${url} `);
      if (expireTime <= currentTime) {
        console.log(`Token has expired   ${token}`);
        //     throw new UnauthorizedException('Token has expired');
      }
      let isValidUser = false;
      if (urlIncludesMember) {
        userEmail = userDetails['emails'][0];
        isValidUser = await this.authService.isValidMember(userEmail);
      } else if (odsSearch) {   
        userEmail = userDetails['emails'][0];
       let emailId= request.body.emailID;
       if (userEmail.toLowerCase() === emailId.toLowerCase()) {
        isValidUser = true;
      }    
      }
      else {
        userEmail = userDetails.payload['unique_name'];
        isValidUser = await this.authService.isValidProvider(userEmail);
      }
      if (!isValidUser) {
        throw new ForbiddenException(`Access Forbidden - ${userEmail}`);
      }
      request['user'] = userEmail;
      return true;
    } catch (error) {
      console.log(`Error in AuthGuard ${error}`);
      throw error instanceof ForbiddenException
        ? new ForbiddenException()
        : new UnauthorizedException();
    }
  }
}
