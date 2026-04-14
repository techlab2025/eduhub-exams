import { vi } from 'vitest';

// ─── Dialog assets ────────────────────────────────────────────────────────────
vi.mock('@/assets/images/dialogs/success.png', () => ({ default: 'mocked-success-image.png' }));
vi.mock('@/assets/images/dialogs/error.png', () => ({ default: 'mocked-error-image.png' }));
vi.mock('@/assets/images/dialogs/warning.png', () => ({ default: 'mocked-warning-image.png' }));
vi.mock('@/assets/images/dialogs/info.png', () => ({ default: 'mocked-info-image.png' }));

// ─── FormInputs assets ────────────────────────────────────────────────────────
vi.mock('@/assets/images/pdf.png', () => ({ default: 'mocked-pdf.png' }));
vi.mock('@/assets/images/word.png', () => ({ default: 'mocked-word.png' }));
vi.mock('@/assets/images/excel.png', () => ({ default: 'mocked-excel.png' }));
vi.mock('@/assets/images/upload.png', () => ({ default: 'mocked-upload.png' }));
vi.mock('@/assets/images/user-image.png', () => ({ default: 'mocked-user-image.png' }));
vi.mock('@/assets/images/dwg-file.png', () => ({ default: 'mocked-dwg.png' }));
vi.mock('@/assets/images/rar-file.png', () => ({ default: 'mocked-rar.png' }));

// ─── Shared component assets ──────────────────────────────────────────────────
vi.mock('@/assets/images/CheckBoxImg.png', () => ({ default: 'mocked-checkbox.png' }));
vi.mock('@/assets/images/Checklist.gif', () => ({ default: 'mocked-checklist.gif' }));
vi.mock('@/assets/images/Sort.gif', () => ({ default: 'mocked-sort.gif' }));
vi.mock('@/assets/images/TextArea.gif', () => ({ default: 'mocked-textarea.gif' }));
vi.mock('@/assets/images/DataFailed.gif', () => ({ default: 'mocked-data-failed.gif' }));
vi.mock('@/assets/images/app/system-failed.png', () => ({ default: 'mocked-system-failed.png' }));
vi.mock('@/assets/images/Your-paragraph-text-1--unscreen.gif', () => ({ default: 'mocked-main-loader.gif' }));
vi.mock('@/assets/images/HeaderBack.png', () => ({ default: 'mocked-header-back.png' }));
vi.mock('@/assets/images/EmployeeBg.png', () => ({ default: 'mocked-employee-bg.png' }));
vi.mock('@/assets/images/Yellowback.png', () => ({ default: 'mocked-yellow-back.png' }));
vi.mock('@/assets/images/BgGroup.png', () => ({ default: 'mocked-bg-group.png' }));
vi.mock('@/assets/images/yelloecircle.png', () => ({ default: 'mocked-yelloecircle.png' }));

// ─── cropperjs ───────────────────────────────────────────────────────────────
// Mock cropperjs to avoid DOM canvas errors in jsdom
vi.mock('cropperjs', () => ({
    default: vi.fn().mockImplementation(() => ({
        destroy: vi.fn(),
        getCroppedCanvas: vi.fn(() => ({
            toDataURL: vi.fn(() => 'data:image/webp;base64,mocked')
        }))
    }))
}));
vi.mock('cropperjs/dist/cropper.css', () => ({}));

// ─── html2canvas ─────────────────────────────────────────────────────────────
// Mock html2canvas — requires real DOM which jsdom can't fully support
vi.mock('html2canvas', () => ({
    default: vi.fn().mockResolvedValue({
        toDataURL: () => 'data:image/png;base64,mocked',
        width: 800,
        height: 600,
    }),
}));
