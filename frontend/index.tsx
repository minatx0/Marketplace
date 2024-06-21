function memoizeFunction(fn: (...args: any[]) => any) {
    const resultCache = new Map<string, any>();
    return (...args: any[]) => {
        const cacheKey = JSON.stringify(args);
        if (resultCache.has(cacheKey)) return resultCache.get(cacheKey);

        const result = fn(...args);
        resultCache.set(cacheKey, result);
        return result;
    };
}

const computeExpensively = (num: number) => {
    console.log('Performing expensive computation for', num);
    return num * 2; // Placeholder for an expensive computation
};

const memoizedComputeExpensively = memoizeFunction(computeExpensively);

console.log(memoizedComputeExpensively(5)); // Expensive computation is performed
console.log(memoizedComputeExpensively(5)); // Result is returned from cache, computation is skipped

import React, { useMemo } from 'react';

const ExpensiveComputationComponent = ({ value }) => {
    const memoizedComputationResult = useMemo(() => computeExpensively(value), [I value]);

    return <div>{memoizedComputationResult}</div>;
};