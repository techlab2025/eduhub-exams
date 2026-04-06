import { vi } from 'vitest';

// Mock static assets (images, etc.)
vi.mock('@/assets/images/dialogs/success.png', () => ({
    default: 'mocked-success-image.png'
}));

vi.mock('@/assets/images/dialogs/error.png', () => ({
    default: 'mocked-error-image.png'
}));

vi.mock('@/assets/images/dialogs/warning.png', () => ({
    default: 'mocked-warning-image.png'
}));

vi.mock('@/assets/images/dialogs/info.png', () => ({
    default: 'mocked-info-image.png'
}));

// FormInputs asset mocks
vi.mock('@/assets/images/pdf.png', () => ({ default: 'mocked-pdf.png' }));
vi.mock('@/assets/images/word.png', () => ({ default: 'mocked-word.png' }));
vi.mock('@/assets/images/excel.png', () => ({ default: 'mocked-excel.png' }));
vi.mock('@/assets/images/upload.png', () => ({ default: 'mocked-upload.png' }));
vi.mock('@/assets/images/user-image.png', () => ({ default: 'mocked-user-image.png' }));
vi.mock('@/assets/images/dwg-file.png', () => ({ default: 'mocked-dwg.png' }));
vi.mock('@/assets/images/rar-file.png', () => ({ default: 'mocked-rar.png' }));

// Mock cropperjs
vi.mock('cropperjs', () => ({
    default: vi.fn().mockImplementation(() => ({
        destroy: vi.fn(),
        getCroppedCanvas: vi.fn(() => ({
            toDataURL: vi.fn(() => 'data:image/webp;base64,mocked')
        }))
    }))
}));
