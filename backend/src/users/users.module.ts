import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // ← これが必要です
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity'; // ← これが必要です

@Module({
  imports: [TypeOrmModule.forFeature([User])], // ← これで登録
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // 他で使うかもしれないので一応
})
export class UsersModule {}
