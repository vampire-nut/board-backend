import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, scrypt } from 'crypto';
import { promisify } from 'util';
@Injectable()
export class HashService {
  secret: string;
  constructor(private readonly configService: ConfigService) {
    const secretKey = this.configService.get<string>('ENCRYPT_SECRET_KEY');
    if (secretKey === undefined) {
      throw new Error('ENCRYPT_SECRET_KEY is not defined in configuration.');
    }
    this.secret = secretKey;
  }
  async encode(text: string) {
    const iv = this.secret.substring(0, 16);
    const key = (await promisify(scrypt)(this.secret, 'salt', 32)) as Buffer;
    const cipher = createCipheriv('aes-256-ctr', key, iv);
    const encryptedText =
      cipher.update(text, 'utf-8', 'base64') + cipher.final('base64');
    return encryptedText;
  }
  async decode(encryptedText: any) {
    const iv = this.secret.substring(0, 16);
    const key = (await promisify(scrypt)(this.secret, 'salt', 32)) as Buffer;
    const decipher = createDecipheriv('aes-256-ctr', key, iv);
    const decryptedText =
      decipher.update(encryptedText, 'base64', 'utf-8') +
      decipher.final('utf-8');
    return decryptedText;
  }
}
