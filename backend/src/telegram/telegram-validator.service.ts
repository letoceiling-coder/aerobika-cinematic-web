import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class TelegramValidatorService {
  constructor(private configService: ConfigService) {}

  /**
   * Validates Telegram WebApp initData
   * @param initData - Raw initData string from Telegram WebApp
   * @returns Parsed user data if valid
   * @throws UnauthorizedException if validation fails
   */
  validateInitData(initData: string): { id: number; username?: string; firstName?: string; lastName?: string } {
    if (!initData) {
      throw new UnauthorizedException('initData is required');
    }

    const botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!botToken) {
      throw new Error('TELEGRAM_BOT_TOKEN is not configured');
    }

    // Parse initData
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    
    if (!hash) {
      throw new UnauthorizedException('Hash is missing in initData');
    }

    // Remove hash from params for validation
    params.delete('hash');

    // Sort parameters alphabetically
    const dataCheckString = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // Create secret key from bot token
    // HMAC-SHA256('WebAppData', bot_token)
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    // Calculate hash
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    // Compare hashes
    if (calculatedHash !== hash) {
      throw new UnauthorizedException('Invalid initData signature');
    }

    // Check timestamp (optional - prevent replay attacks)
    const authDate = params.get('auth_date');
    if (authDate) {
      const authTimestamp = parseInt(authDate, 10);
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const timeDiff = currentTimestamp - authTimestamp;
      
      // Reject if data is older than 24 hours
      if (timeDiff > 86400) {
        throw new UnauthorizedException('initData is too old');
      }
    }

    // Extract user data
    const userStr = params.get('user');
    if (!userStr) {
      throw new UnauthorizedException('User data is missing');
    }

    try {
      const user = JSON.parse(userStr);
      if (!user.id) {
        throw new UnauthorizedException('User ID is missing');
      }

      return {
        id: user.id,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid user data format');
    }
  }
}
