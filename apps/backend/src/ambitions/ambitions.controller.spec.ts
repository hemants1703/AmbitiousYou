import { Test, TestingModule } from '@nestjs/testing';
import { AmbitionsController } from './ambitions.controller';
import { AmbitionsService } from './ambitions.service';

jest.mock('src/db');

describe('AmbitionsController', () => {
  let controller: AmbitionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AmbitionsController],
      providers: [AmbitionsService],
    }).compile();

    controller = module.get<AmbitionsController>(AmbitionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
