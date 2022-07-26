import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as ormconfig from './config/ormconfig';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import { join } from 'path';
import { ProductsModule } from './products/products.module';
import { ImageServiceService } from './services/image-service.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    TypeOrmModule.forRoot(ormconfig),
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService, ImageServiceService],
})
export class AppModule {
}
