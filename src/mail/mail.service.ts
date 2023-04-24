import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async enviarEmail(email: string, mensagem: string) {
    await this.mailerService.sendMail({
      to: 'bruna.sepulveda@omegaenergia.com.br',
      subject: 'Despesa Cadastrada',
      html: `<h3 style="color: red">${mensagem}</h3>`,
    });
  }
}
