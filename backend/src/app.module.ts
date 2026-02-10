import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { DocumentsModule } from './documents/documents.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres', // ← 設定したものに書き換えてください
      password: 'Taiga895', // ← 設定したものに書き換えてください
      database: 'aiproject',
      autoLoadEntities: true, // ← これを true にするのが一番重要です！
      synchronize: true,
    }),
    DocumentsModule,
    UsersModule, // ← ここに UsersModule があることを確認
  ],
})
export class AppModule {}
