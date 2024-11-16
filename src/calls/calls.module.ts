import { Module } from '@nestjs/common';
import { CallsGateway } from './calls.gateway';
import { UserModule } from 'src/users/users.module';
import { JwtStrategy } from 'src/users/jwtAuth/jwt.strategy';

@Module({
  providers:[CallsGateway],
  imports: [UserModule]
})
export class CallsModule {}
