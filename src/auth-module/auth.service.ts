import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Provider,
  ProviderDocument,
} from 'src/providers/schemas/provider.schema';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(Provider.name) private providerModel: Model<ProviderDocument>,
  ) {}

  /**
   * Fetch AuthToken from API Request Header
   * @param headerName API Request Header Key
   * @param request API Request
   * @returns AuthToken
   */
  extractTokenFromHeader(
    headerName: string,
    request: Request,
  ): string | undefined {
    const [type, token] =
      request.headers[headerName.toLowerCase()]?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  /**
   * Decode & fetch user details from AuthToken
   * @param token AuthToken
   * @returns User Detail
   */
  async fetchUserFromToken(token: string): Promise<any> {
    const options = { json: true, complete: true };
    const decodedToken = this.jwtService.decode(token, options);
    const JSONdecodedToken = decodedToken;
    console.log('>>>>>>>>>>>>>>' + JSON.stringify(JSONdecodedToken));
    return decodedToken;
  }
  /**
   * Decode & fetch user details from AuthToken
   * @param token AuthToken
   * @returns User Detail
   */
  async fetchMemberFromToken(token: string): Promise<any> {
    return this.jwtService.decode(token);
  }
  /**
   * Validate the user/provider
   * @param userEmail User Detail (Provider)
   * @returns A boolean stating if a user/provider is valid or not
   */
  async isValidProvider(userEmail: string): Promise<boolean> {
    const user = await this.providerModel.findOne({
      'profile.contactInfo.emailAddress': {
        $regex: new RegExp(`^${userEmail}$`, 'i'),
      },
    });
    return user != null;
  }

  /**
   * Validate the user/provider
   * @param userEmail User Detail (Provider)
   * @returns A boolean stating if a user/provider is valid or not
   */
  async isValidMember(userEmail: string): Promise<boolean> {
    console.log('>>>>userEmail>>>>>>>>>>' + userEmail);

    return false;
  }
}
