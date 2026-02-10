import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { email: email },
    });
  }

  // 新規作成 (POST)
  async create(createUserDto: CreateUserDto) {
    // フロントエンドから届いた password も含めて保存します
    const newUser = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(newUser);
  }

  // 全件取得 (GET /users)
  findAll() {
    return this.usersRepository.find();
  }

  // 1件取得 (GET /users/:id)
  findOne(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  // 更新 (PATCH /users/:id)
  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  // 削除 (DELETE /users/:id)
  async remove(id: number) {
    await this.usersRepository.delete(id);
    return { deleted: true };
  }
}
