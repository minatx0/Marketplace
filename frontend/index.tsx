function memoize(fn: (...args: any[]) => any) {
    const cache = new Map<string, any>();
    return (...args: any[]) => {
        const key = JSON.stringify(args);
        if (cache.has(key)) return cache.get(key);

        const result = fn(...args);
        cache.set(key, result);
        return result;
    };
}

const expensiveFunction = (num: number) => {
    console.log('Expensive computation for', num);
    return num * 2; // Placeholder for an expensive computation
};

const memoizedExpensiveFunction = memoize(expensiveFunction);

console.log(memoizedExpensiveFunction(5)); // Expensive computation is performed
console.log(memoizedExpensiveFunction(5)); // Result is returned from cache, computation is skipped

import React, { useMemo } from 'react';

const ExpensiveComponent = ({ value }) => {
    const memoizedValue = useMemo(() => expensiveFunction(value), [value]);

    return <div>{memoizedValue}</div>;
};