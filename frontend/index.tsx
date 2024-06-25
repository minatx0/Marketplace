function memoizeFunction<T extends (...args: any[]) => any>(fn: T): (...funcArgs: Parameters<T>) => ReturnType<T> {
  const resultCache = new Map<string, ReturnType<T>>();
  return (...args: Parameters<T>) => {
    const cacheKey = JSON.stringify(args);
    if (resultCache.has(cacheKey)) return resultCache.get(cacheKey) as ReturnType<T>;

    const result = fn(...args);
    resultCache.set(cacheKey, result);
    return result;
  };
}

const computeExpensively = (num: number): number => {
  console.log('Performing expensive computation for', num);
  return num * 2;
};

const memoizedComputeExpensively = memoizeFunction(computeExpensively);

console.log(memoizedComputeExpensively(5));  
console.log(memoizedComputeExpensively(5));  

import React, { useMemo } from 'react';

interface ExpensiveComputationComponentProps {
  value: number;
}

const ExpensiveComputationComponent: React.FC<ExpensiveComputationComponentProps> = ({ value }) => {
    const memoizedComputationResult = useMemo(() => computeExpensively(value), [value]);

    return <div>{memoizedComputationResult}</div>;
};

export default ExpensiveComputationComponent;