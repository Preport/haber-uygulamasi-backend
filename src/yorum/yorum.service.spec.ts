import { Test, TestingModule } from '@nestjs/testing';
import { YorumService } from './yorum.service';

describe('YorumService', () => {
  let service: YorumService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YorumService],
    }).compile();

    service = module.get<YorumService>(YorumService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
