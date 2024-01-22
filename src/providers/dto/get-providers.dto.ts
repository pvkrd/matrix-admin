// profile.dto.ts

export class MsaDto {

  endDate: Date;

  isPrimary: boolean;

  license: string;

  startDate: Date;

  state: string;
}


export class GetProvidersDto {
  products: string[];
  msa: MsaDto[];

}

export class GetProvidersLookupDto {
  emailAddress: string;
  staffMemberId: string;

}