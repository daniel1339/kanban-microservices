import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class IpFilterGuard implements CanActivate {
  private readonly logger = new Logger(IpFilterGuard.name);

  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const clientIp = this.getClientIp(request);
    const securityConfig = this.configService.get('security.ipControl');

    // Check blacklist first
    if (this.isIpBlacklisted(clientIp, securityConfig?.blacklist || [])) {
      this.logger.warn(`Blocked request from blacklisted IP: ${clientIp}`);
      throw new ForbiddenException('Access denied from this IP address');
    }

    // Check whitelist if configured
    if (securityConfig?.whitelist && securityConfig.whitelist.length > 0) {
      if (!this.isIpWhitelisted(clientIp, securityConfig.whitelist)) {
        this.logger.warn(`Blocked request from non-whitelisted IP: ${clientIp}`);
        throw new ForbiddenException('Access denied from this IP address');
      }
    }

    return true;
  }

  private getClientIp(request: any): string {
    return (
      request.headers['x-forwarded-for']?.split(',')[0] ||
      request.headers['x-real-ip'] ||
      request.connection?.remoteAddress ||
      request.socket?.remoteAddress ||
      request.ip ||
      'unknown'
    );
  }

  private isIpBlacklisted(clientIp: string, blacklist: string[]): boolean {
    return blacklist.some(blockedIp => this.matchesIp(clientIp, blockedIp));
  }

  private isIpWhitelisted(clientIp: string, whitelist: string[]): boolean {
    return whitelist.some(allowedIp => this.matchesIp(clientIp, allowedIp));
  }

  private matchesIp(clientIp: string, patternIp: string): boolean {
    // Exact match
    if (clientIp === patternIp) {
      return true;
    }

    // CIDR notation support (e.g., 192.168.1.0/24)
    if (patternIp.includes('/')) {
      return this.matchesCidr(clientIp, patternIp);
    }

    // Wildcard support (e.g., 192.168.*.*)
    if (patternIp.includes('*')) {
      return this.matchesWildcard(clientIp, patternIp);
    }

    return false;
  }

  private matchesCidr(clientIp: string, cidr: string): boolean {
    try {
      const [network, bits] = cidr.split('/');
      const mask = parseInt(bits, 10);
      
      const clientIpNum = this.ipToNumber(clientIp);
      const networkNum = this.ipToNumber(network);
      const maskNum = (0xFFFFFFFF << (32 - mask)) >>> 0;

      return (clientIpNum & maskNum) === (networkNum & maskNum);
    } catch (error) {
      this.logger.error(`Invalid CIDR notation: ${cidr}`, error);
      return false;
    }
  }

  private matchesWildcard(clientIp: string, wildcard: string): boolean {
    const clientParts = clientIp.split('.');
    const wildcardParts = wildcard.split('.');

    if (clientParts.length !== 4 || wildcardParts.length !== 4) {
      return false;
    }

    for (let i = 0; i < 4; i++) {
      if (wildcardParts[i] !== '*' && clientParts[i] !== wildcardParts[i]) {
        return false;
      }
    }

    return true;
  }

  private ipToNumber(ip: string): number {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
  }
} 