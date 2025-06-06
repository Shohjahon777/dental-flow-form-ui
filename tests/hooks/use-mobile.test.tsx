import { renderHook } from '@testing-library/react-hooks';
import { useIsMobile } from '../../src/hooks/use-mobile';

describe('useIsMobile Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('testHookIdentifiesMobileView', () => {
    window.innerWidth = 500;
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  test('testHookIdentifiesNonMobileView', () => {
    window.innerWidth = 800;
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  test('testHookUpdatesOnResize', () => {
    window.innerWidth = 800;
    const { result, rerender } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    window.innerWidth = 500;
    window.dispatchEvent(new Event('resize'));
    rerender();
    expect(result.current).toBe(true);
  });

  test('testInitialUndefinedState', () => {
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  test('testEventListenerCleanup', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useIsMobile());
    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  test('testRapidResizeHandling', () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useIsMobile());

    window.innerWidth = 500;
    window.dispatchEvent(new Event('resize'));
    jest.advanceTimersByTime(100);
    expect(result.current).toBe(true);

    window.innerWidth = 800;
    window.dispatchEvent(new Event('resize'));
    jest.advanceTimersByTime(100);
    expect(result.current).toBe(false);

    jest.useRealTimers();
  });
});