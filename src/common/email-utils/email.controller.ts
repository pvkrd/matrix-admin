import { Controller } from "@nestjs/common";
import { EmailService } from "./email.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Send Email')
@Controller('sendemail')
export class EmailController{
    constructor(private readonly emailService : EmailService){}
}