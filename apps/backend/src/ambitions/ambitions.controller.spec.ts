import { ExecutionContext, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { SessionGuard } from 'src/auth/guards/session.guard';
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

describe('AmbitionsController routes', () => {
  const ambitionId = 'amb-123';
  const mockAmbitionsService = {
    findMovesBatch: jest.fn(),
    findAmbitionFullByUserIdAndId: jest.fn(),
    findAmbitionDetailsByUserIdAndId: jest.fn(),
    findOneAmbitionById: jest.fn(),
    toggleFavourite: jest.fn(),
    updateAmbitionById: jest.fn(),
  };

  let app: INestApplication;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AmbitionsController],
      providers: [{ provide: AmbitionsService, useValue: mockAmbitionsService }],
    })
      .overrideGuard(SessionGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.session = { userId: 'user-1' };
          return true;
        },
      })
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('routes GET /ambitions/moves to the batch handler, not :ambitionId', async () => {
    mockAmbitionsService.findMovesBatch.mockResolvedValue({ tasks: [], milestones: [] });

    await request(app.getHttpServer()).get('/ambitions/moves').expect(200);

    expect(mockAmbitionsService.findMovesBatch).toHaveBeenCalledWith('user-1', false);
    expect(mockAmbitionsService.findOneAmbitionById).not.toHaveBeenCalled();
  });

  it('routes GET /ambitions/:id/full to the composite handler, not :ambitionId', async () => {
    mockAmbitionsService.findAmbitionFullByUserIdAndId.mockResolvedValue({
      ambition: { id: ambitionId },
      tasks: [],
      milestones: [],
      notes: [],
    });

    await request(app.getHttpServer()).get(`/ambitions/${ambitionId}/full`).expect(200);

    expect(mockAmbitionsService.findAmbitionFullByUserIdAndId).toHaveBeenCalledWith('user-1', ambitionId);
    expect(mockAmbitionsService.findOneAmbitionById).not.toHaveBeenCalled();
  });

  it('routes GET /ambitions/:id/details to the details handler, not :ambitionId', async () => {
    mockAmbitionsService.findAmbitionDetailsByUserIdAndId.mockResolvedValue({ id: ambitionId });

    await request(app.getHttpServer()).get(`/ambitions/${ambitionId}/details`).expect(200);

    expect(mockAmbitionsService.findAmbitionDetailsByUserIdAndId).toHaveBeenCalledWith('user-1', ambitionId);
    expect(mockAmbitionsService.findOneAmbitionById).not.toHaveBeenCalled();
  });

  it('routes PATCH /ambitions/:id/favourite to toggleFavourite, not updateAmbitionById', async () => {
    mockAmbitionsService.toggleFavourite.mockResolvedValue({ id: ambitionId, isFavourited: true });

    await request(app.getHttpServer()).patch(`/ambitions/${ambitionId}/favourite`).expect(200);

    expect(mockAmbitionsService.toggleFavourite).toHaveBeenCalledWith('user-1', ambitionId);
    expect(mockAmbitionsService.updateAmbitionById).not.toHaveBeenCalled();
  });
});
