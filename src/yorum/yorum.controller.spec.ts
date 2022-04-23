import { Test, TestingModule } from '@nestjs/testing';
import { YorumController } from './yorum.controller';
import { YorumService } from './yorum.service';

describe('YorumController', () => {
  let controller: YorumController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [YorumController],
      providers: [YorumService],
    }).compile();

    controller = module.get<YorumController>(YorumController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
