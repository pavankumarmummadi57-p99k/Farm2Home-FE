// import { ApiResponse, JsonRecord } from '../models/api.models';

// export function apiData<T = unknown>(response: ApiResponse<T> | T): T {
//   if (response && typeof response === 'object' && 'data' in (response as object)) {
//     return (response as ApiResponse<T>).data;
//   }
//   return response as T;
// }

// export function asRecord(value: unknown): JsonRecord {
//   return value && typeof value === 'object' && !Array.isArray(value)
//     ? value as JsonRecord
//     : {};
// }

// export function pick<T = unknown>(obj: unknown, ...keys: string[]): T | undefined {
//   const record = asRecord(obj);
//   for (const key of keys) {
//     const value = record[key];
//     if (value !== undefined && value !== null && value !== '') {
//       return value as T;
//     }
//   }
//   return undefined;
// }

// export function pickString(obj: unknown, ...keys: string[]): string {
//   const value = pick<unknown>(obj, ...keys);
//   return value === undefined ? '' : String(value);
// }


// export function deepPick<T = unknown>(obj: unknown, ...keys: string[]): T | undefined {
//   const wanted = new Set(keys);
//   const seen = new Set<object>();

//   const visit = (value: unknown, depth: number): T | undefined => {
//     if (!value || typeof value !== 'object' || depth > 5) return undefined;
//     if (seen.has(value as object)) return undefined;
//     seen.add(value as object);

//     const record = value as Record<string, unknown>;
//     for (const key of keys) {
//       const direct = record[key];
//       if (direct !== undefined && direct !== null && direct !== '') return direct as T;
//     }
//     for (const [key, child] of Object.entries(record)) {
//       if (wanted.has(key) && child !== undefined && child !== null && child !== '') return child as T;
//       const found = visit(child, depth + 1);
//       if (found !== undefined) return found;
//     }
//     return undefined;
//   };

//   return visit(obj, 0);
// }

// export function deepPickString(obj: unknown, ...keys: string[]): string {
//   const value = deepPick<unknown>(obj, ...keys);
//   return value === undefined ? '' : String(value);
// }

// export function pickNumber(obj: unknown, ...keys: string[]): number {
//   const value = pick<unknown>(obj, ...keys);
//   const numberValue = Number(value);
//   return Number.isFinite(numberValue) ? numberValue : 0;
// }

// export function pickBoolean(obj: unknown, ...keys: string[]): boolean | undefined {
//   const value = pick<unknown>(obj, ...keys);
//   if (typeof value === 'boolean') return value;
//   if (value === 'true' || value === 1 || value === '1') return true;
//   if (value === 'false' || value === 0 || value === '0') return false;
//   return undefined;
// }

// export function listFromResponse<T = JsonRecord>(
//   response: ApiResponse<unknown> | unknown,
//   candidateKeys: string[] = []
// ): T[] {
//   const data = apiData<unknown>(response);
//   if (Array.isArray(data)) return data as T[];

//   const record = asRecord(data);
//   const keys = [
//     ...candidateKeys,
//     'content',
//     'items',
//     'results',
//     'products',
//     'categories',
//     'orders',
//     'farmers',
//     'data'
//   ];

//   for (const key of keys) {
//     if (Array.isArray(record[key])) return record[key] as T[];
//   }
//   return [];
// }

// export function recordFromResponse<T extends JsonRecord = JsonRecord>(
//   response: ApiResponse<unknown> | unknown,
//   candidateKeys: string[] = []
// ): T {
//   const data = apiData<unknown>(response);
//   if (data && typeof data === 'object' && !Array.isArray(data)) {
//     const record = data as JsonRecord;
//     for (const key of candidateKeys) {
//       const nested = record[key];
//       if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
//         return nested as T;
//       }
//     }
//     return record as T;
//   }
//   return {} as T;
// }

// export function entityId(obj: unknown): number {
//   return pickNumber(
//     obj,
//     'id',
//     'productId',
//     'categoryId',
//     'orderId',
//     'farmerId',
//     'userId'
//   );
// }

// export function statusClass(status: string): string {
//   const normalized = status.toUpperCase();
//   if (['APPROVED', 'SUCCESS', 'COMPLETED', 'DELIVERED', 'ACTIVE', 'VERIFIED'].includes(normalized)) {
//     return 'status-success';
//   }
//   if (['REJECTED', 'FAILED', 'CANCELLED', 'INACTIVE'].includes(normalized)) {
//     return 'status-danger';
//   }
//   if (['PENDING', 'PROCESSING', 'PLACED', 'SUBMITTED'].includes(normalized)) {
//     return 'status-warning';
//   }
//   return 'status-neutral';
// }

// export function errorMessage(error: unknown): string {
//   if (!error || typeof error !== 'object') return 'Something went wrong. Please try again.';
//   const err = error as Record<string, any>;
//   return err?.error?.message
//     ?? err?.error?.error
//     ?? err?.message
//     ?? 'Something went wrong. Please try again.';
// }


import { ApiResponse, JsonRecord } from '../models/api.models';

export function apiData<T = unknown>(response: ApiResponse<T> | T): T {
  if (response && typeof response === 'object' && 'data' in (response as object)) {
    return (response as ApiResponse<T>).data;
  }
  return response as T;
}

export function asRecord(value: unknown): JsonRecord {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as JsonRecord
    : {};
}

export function pick<T = unknown>(obj: unknown, ...keys: string[]): T | undefined {
  const record = asRecord(obj);
  for (const key of keys) {
    const value = record[key];
    if (value !== undefined && value !== null && value !== '') {
      return value as T;
    }
  }
  return undefined;
}

export function pickString(obj: unknown, ...keys: string[]): string {
  const value = pick<unknown>(obj, ...keys);
  return value === undefined ? '' : String(value);
}


export function deepPick<T = unknown>(obj: unknown, ...keys: string[]): T | undefined {
  const wanted = new Set(keys);
  const seen = new Set<object>();

  const visit = (value: unknown, depth: number): T | undefined => {
    if (!value || typeof value !== 'object' || depth > 5) return undefined;
    if (seen.has(value as object)) return undefined;
    seen.add(value as object);

    const record = value as Record<string, unknown>;
    for (const key of keys) {
      const direct = record[key];
      if (direct !== undefined && direct !== null && direct !== '') return direct as T;
    }
    for (const [key, child] of Object.entries(record)) {
      if (wanted.has(key) && child !== undefined && child !== null && child !== '') return child as T;
      const found = visit(child, depth + 1);
      if (found !== undefined) return found;
    }
    return undefined;
  };

  return visit(obj, 0);
}

export function deepPickString(obj: unknown, ...keys: string[]): string {
  const value = deepPick<unknown>(obj, ...keys);
  return value === undefined ? '' : String(value);
}

export function pickNumber(obj: unknown, ...keys: string[]): number {
  const value = pick<unknown>(obj, ...keys);
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

export function pickBoolean(obj: unknown, ...keys: string[]): boolean | undefined {
  const value = pick<unknown>(obj, ...keys);
  if (typeof value === 'boolean') return value;
  if (value === 'true' || value === 1 || value === '1') return true;
  if (value === 'false' || value === 0 || value === '0') return false;
  return undefined;
}

export function listFromResponse<T = JsonRecord>(
  response: ApiResponse<unknown> | unknown,
  candidateKeys: string[] = []
): T[] {
  const data = apiData<unknown>(response);
  if (Array.isArray(data)) return data as T[];

  const record = asRecord(data);
  const keys = [
    ...candidateKeys,
    'content',
    'items',
    'results',
    'products',
    'categories',
    'orders',
    'farmers',
    'data'
  ];

  for (const key of keys) {
    if (Array.isArray(record[key])) return record[key] as T[];
  }
  return [];
}

export function recordFromResponse<T extends JsonRecord = JsonRecord>(
  response: ApiResponse<unknown> | unknown,
  candidateKeys: string[] = []
): T {
  const data = apiData<unknown>(response);
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    const record = data as JsonRecord;
    for (const key of candidateKeys) {
      const nested = record[key];
      if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
        return nested as T;
      }
    }
    return record as T;
  }
  return {} as T;
}

export function entityId(obj: unknown): number {
  return pickNumber(
    obj,
    'id',
    'productId',
    'categoryId',
    'orderId',
    'farmerId',
    'userId'
  );
}

export function statusClass(status: string): string {
  const normalized = status.toUpperCase();
  if (['APPROVED', 'ACCEPTED', 'SUCCESS', 'COMPLETED', 'DELIVERED', 'ACTIVE', 'VERIFIED'].includes(normalized)) {
    return 'status-success';
  }
  if (['REJECTED', 'FAILED', 'CANCELLED', 'INACTIVE'].includes(normalized)) {
    return 'status-danger';
  }
  if (['PENDING', 'PROCESSING', 'PLACED', 'SUBMITTED'].includes(normalized)) {
    return 'status-warning';
  }
  return 'status-neutral';
}

export function errorMessage(error: unknown): string {
  if (!error || typeof error !== 'object') return 'Something went wrong. Please try again.';
  const err = error as Record<string, any>;
  return err?.error?.message
    ?? err?.error?.error
    ?? err?.message
    ?? 'Something went wrong. Please try again.';
}
