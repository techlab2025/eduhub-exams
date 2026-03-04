import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import EmailController from './email.controller';
import { EmailType } from '../../core/constants/emailType.enum';
import EmailTestFactory from '../../__tests__/email.test-factory';
import { DataSuccess, DataFailed } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import EmailParams from '../../core/params/email.params';

describe('EmailController', () => {
    let controller: EmailController;
    let mockRepository: any;

    beforeEach(() => {
        controller = EmailController.getInstance();

        // Create a mock repository
        mockRepository = {
            index: vi.fn(),
            show: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        };

        // Spy on the repository getter to return our mock
        vi.spyOn(controller as any, 'repository', 'get').mockReturnValue(mockRepository);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('singleton pattern', () => {
        it('should return the same instance', () => {
            const instance1 = EmailController.getInstance();
            const instance2 = EmailController.getInstance();

            expect(instance1).toBe(instance2);
        });
    });

    describe('configuration', () => {
        it('should have correct controller configuration', () => {
            const config = (controller as any).config;

            expect(config.showLoadingDialog).toBe(false);
            expect(config.showSuccessDialog).toBe(true);
            expect(config.showErrorDialog).toBe(true);
            expect(config.autoRetry).toBe(false);
            expect(config.maxAutoRetries).toBe(2);
        });
    });

    describe('fetchList - fetch all emails', () => {
        it('should call repository.index and return result', async () => {
            const mockEmails = EmailTestFactory.createMockEmailList(3);
            const successState = EmailTestFactory.success(mockEmails);
            mockRepository.index.mockResolvedValue(successState);

            const result = await controller.fetchList();

            expect(mockRepository.index).toHaveBeenCalledWith(undefined, undefined);
            expect(result).toBe(successState);
        });

        it('should pass params and options to repository', async () => {
            const mockParams = { filter: 'active' };
            const mockOptions = { details: { type: EmailType.WORK } };
            const successState = EmailTestFactory.success([]);
            mockRepository.index.mockResolvedValue(successState);

            await controller.fetchList(mockParams as any, mockOptions);

            expect(mockRepository.index).toHaveBeenCalledWith(mockParams, mockOptions);
        });

        it('should handle DataFailed from repository', async () => {
            const failedState = EmailTestFactory.failed('Failed to fetch emails');
            mockRepository.index.mockResolvedValue(failedState);

            const result = await controller.fetchList();

            expect(result).toBeInstanceOf(DataFailed);
        });
    });

    describe('fetchOne - fetch single email', () => {
        it('should call repository.show with params', async () => {
            const mockEmail = EmailTestFactory.createMockEmail({ id: 10 });
            const successState = EmailTestFactory.success(mockEmail);
            mockRepository.show.mockResolvedValue(successState);

            const params = new EmailParams('sd', EmailType.EMPLOYEE, 999);
            const result = await controller.fetchOne(params, { auth: true });

            expect(mockRepository.show).toHaveBeenCalledWith(params, { auth: true });
            expect(result).toBe(successState);
        });

        it('should pass options to repository', async () => {
            const mockOptions = { auth: true };
            const successState = EmailTestFactory.success(EmailTestFactory.createMockEmail());
            mockRepository.show.mockResolvedValue(successState);

            const params = new EmailParams('sd', EmailType.EMPLOYEE, 999);
            await controller.fetchOne(params, mockOptions);

            expect(mockRepository.show).toHaveBeenCalledWith(params, mockOptions);
        });

        it('should handle DataFailed when item not found', async () => {
            const failedState = EmailTestFactory.failed('Email not found');
            mockRepository.show.mockResolvedValue(failedState);

            const params = new EmailParams('sd', EmailType.EMPLOYEE, 999);
            const result = await controller.fetchOne(params, { auth: true });

            expect(result).toBeInstanceOf(DataFailed);
        });
    });

    describe('create - create new email', () => {
        it('should call repository.create with params', async () => {
            const mockEmail = EmailTestFactory.createMockEmail({
                email: 'newuser@example.com',
                type: EmailType.WORK
            });
            const successState = EmailTestFactory.success(mockEmail);
            const params = new EmailParams('newuser@example.com', EmailType.WORK);
            mockRepository.create.mockResolvedValue(successState);

            const result = await controller.create(params);

            expect(mockRepository.create).toHaveBeenCalledWith(params, undefined);
            expect(result).toBe(successState);
        });

        it('should pass options to repository', async () => {
            const params = new EmailParams('test@example.com', EmailType.EMPLOYEE);
            const mockOptions = { showLoadingDialog: true };
            const successState = EmailTestFactory.success(EmailTestFactory.createMockEmail());
            mockRepository.create.mockResolvedValue(successState);

            await controller.create(params, mockOptions);

            expect(mockRepository.create).toHaveBeenCalledWith(params, mockOptions);
        });

        it('should handle validation errors from repository', async () => {
            const failedState = EmailTestFactory.failed('Invalid email format');
            const params = new EmailParams('invalid-email', EmailType.EMPLOYEE);
            mockRepository.create.mockResolvedValue(failedState);

            const result = await controller.create(params);

            expect(result).toBeInstanceOf(DataFailed);
        });
    });

    describe('update - update existing email', () => {
        it('should call repository.update with params', async () => {
            const mockEmail = EmailTestFactory.createMockEmail({
                id: 5,
                email: 'updated@example.com',
                type: EmailType.PERSONAL
            });
            const successState = EmailTestFactory.success(mockEmail);
            const params = new EmailParams('updated@example.com', EmailType.PERSONAL, 5);
            mockRepository.update.mockResolvedValue(successState);

            const result = await controller.update(params);

            expect(mockRepository.update).toHaveBeenCalledWith(params, undefined);
            expect(result).toBe(successState);
        });

        it('should pass options to repository', async () => {
            const params = new EmailParams('update@example.com', EmailType.EMPLOYEE, 15);
            const mockOptions = { usePut: true };
            const successState = EmailTestFactory.success(EmailTestFactory.createMockEmail());
            mockRepository.update.mockResolvedValue(successState);

            await controller.update(params, mockOptions);

            expect(mockRepository.update).toHaveBeenCalledWith(params, mockOptions);
        });

        it('should handle update errors from repository', async () => {
            const failedState = EmailTestFactory.failed('Email not found');
            const params = new EmailParams('notfound@example.com', EmailType.EMPLOYEE, 999);
            mockRepository.update.mockResolvedValue(failedState);

            const result = await controller.update(params);

            expect(result).toBeInstanceOf(DataFailed);
        });
    });

    describe('delete - delete email', () => {
        it('should call repository.delete with params', async () => {
            const successState = new DataSuccess<void>({ message: 'Email deleted successfully' });
            mockRepository.delete.mockResolvedValue(successState);

            const params = { toMap: () => ({ id: 20 }), validate: () => ({ isValid: true, errors: [] }), validateOrThrow: () => {} };
            const result = await controller.delete(params as any);

            expect(mockRepository.delete).toHaveBeenCalledWith(params, undefined);
            expect(result).toBe(successState);
        });

        it('should pass options to repository', async () => {
            const mockOptions = { showLoadingDialog: true };
            const successState = new DataSuccess<void>({ message: 'Deleted' });
            mockRepository.delete.mockResolvedValue(successState);

            const params = { toMap: () => ({ id: 30 }), validate: () => ({ isValid: true, errors: [] }), validateOrThrow: () => {} };
            await controller.delete(params as any, mockOptions);

            expect(mockRepository.delete).toHaveBeenCalledWith(params, mockOptions);
        });

        it('should handle delete errors from repository', async () => {
            const failedState = EmailTestFactory.failed('Cannot delete email');
            mockRepository.delete.mockResolvedValue(failedState);

            const params = { toMap: () => ({ id: 40 }), validate: () => ({ isValid: true, errors: [] }), validateOrThrow: () => {} };
            const result = await controller.delete(params as any);

            expect(result).toBeInstanceOf(DataFailed);
        });
    });

    describe('edge cases and error scenarios', () => {
        it('should handle repository returning unexpected data', async () => {
            const unexpectedState = { data: null, statusCode: 200 } as any;
            mockRepository.index.mockResolvedValue(unexpectedState);

            const result = await controller.fetchList();

            expect(result).toBeDefined();
        });

        it('should handle concurrent requests', async () => {
            const successState1 = EmailTestFactory.success([EmailTestFactory.createMockEmail({ id: 1 })]);
            const successState2 = EmailTestFactory.success([EmailTestFactory.createMockEmail({ id: 2 })]);

            mockRepository.index
                .mockResolvedValueOnce(successState1)
                .mockResolvedValueOnce(successState2);

            const [result1, result2] = await Promise.all([
                controller.fetchList(),
                controller.fetchList()
            ]);

            expect(result1).toBe(successState1);
            expect(result2).toBe(successState2);
            expect(mockRepository.index).toHaveBeenCalledTimes(2);
        });

        it('should handle empty email list result', async () => {
            const emptyState = EmailTestFactory.success([]);
            mockRepository.index.mockResolvedValue(emptyState);

            const result = await controller.fetchList();

            expect(result).toBeInstanceOf(DataSuccess);
            if (result instanceof DataSuccess) {
                expect(result.data).toEqual([]);
            }
        });
    });
});
