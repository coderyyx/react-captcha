import { useRef, useEffect, useCallback, DependencyList } from 'react';

/**
 * 类似 useCallback，但是返回的函数不会因为传入函数或者依赖变化而变化
 * deps 没有传入时，则默认以 callback 作为依赖
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useMemoizedFn = <T extends (...args: any[]) => any>(
    callback?: T,
    deps?: DependencyList
): T => {
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps ?? [callback]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const uniqueCallback = useCallback(((...args) => callbackRef.current?.(...args)) as T, []);

    return uniqueCallback;
};

export default useMemoizedFn;
