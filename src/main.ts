import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { UserService } from './users/users.service';
import { UserAdminCreateDTO } from './users/models/User';
import * as fs from 'fs';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('../ssl/server.key'),
    cert: fs.readFileSync('../ssl/server.cert'),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });

  app.use(helmet());
  app.enableCors({
    credentials: true, // Allow credentials (e.g., cookies)
    allowedHeaders: '*',
    origin: "*"
  });
  const configService = app.get(ConfigService);
  const port = configService.get('PORT')
  const config = new DocumentBuilder().build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(port);

  const userService = app.get(UserService);
  try{
    const admin = new UserAdminCreateDTO()
    admin.blocked = false;
    admin.isAdmin = true;
    admin.password = "admin"
    admin.username = "admin"

    await userService.register(admin)
  }catch(e){
    console.log(e)
  }
  
}
bootstrap();
