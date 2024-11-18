import {MiddlewareConsumer, Module, ValidationPipe} from '@nestjs/common';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {UserModule} from '../users/users.module';
import {getMongoConfig} from "../config/mongo.config";
import * as cookieParser from "cookie-parser";
import {APP_FILTER, APP_INTERCEPTOR, APP_PIPE} from "@nestjs/core";
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { MongooseModule } from '@nestjs/mongoose';
import { stripInterceptor } from './stripInterceptor';
import { validationSchema } from '../config/variables';
import { CallsModule } from 'src/calls/calls.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: validationSchema
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getMongoConfig
    }),
    UserModule,
    CallsModule
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe
    },
    {
      provide: APP_INTERCEPTOR,
      useValue: new stripInterceptor(['password', 'hashedPassword'])
    }
  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
        .apply(cookieParser())
        .forRoutes('*')
  }
}
