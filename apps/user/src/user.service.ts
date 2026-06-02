import { ConflictException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '@app/common/dtos/user/CreateUser.dto';
import { instanceToPlain } from 'class-transformer';
import { VerifyUserDto } from '@app/common/dtos/user/VerifyUser.dto';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { USER_SERVICE } from '@app/common/constants';
import { USER_TOPICS } from '@app/common/constants/kafka-topics';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(USER_SERVICE) private readonly userClient: ClientKafka,
  ) {}

  async getUser(id: string) {
    return await this.userRepository.findOneBy({ id });
  }

  async createUser(body: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { username: body.username },
    });

    if (existingUser) {
      throw new RpcException('Username already taken'); // Note, the microservice needs to thro RpcException so that calling service can correctly receive it. Otherwise calling service will just get a generic message and error
    }

    const newUser = this.userRepository.create({
      ...body,
      password: await bcrypt.hash(body.password, 10),
    });
    const user = await this.userRepository.save(newUser);

    this.userClient.emit<any, any>(USER_TOPICS.CREATED, {
      userId: user.id,
      name: user.name,
      username: user.username,
    });

    // return user;
    return instanceToPlain(user); // NOTE: Quick method to hide  fields that use Exclude
  }

  async verifyUser({ username, password }: VerifyUserDto) {
    const user = await this.userRepository.findOneBy({ username });
    if (!user) {
      throw new RpcException('Credentials are not valid');
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new RpcException('Credentials are not valid');
    }
    return instanceToPlain(user);
  }
}
