// import { JsonRecord } from '../models/api.models';
// import { entityId, pick, pickBoolean, pickNumber, pickString } from './api.util';

// export function productId(product: unknown): number {
//   return entityId(product);
// }

// export function productName(product: unknown): string {
//   return pickString(product, 'productName', 'name', 'title') || 'Farm product';
// }

// export function productDescription(product: unknown): string {
//   return pickString(product, 'description', 'productDescription');
// }

// export function productPrice(product: unknown): number {
//   return pickNumber(product, 'price', 'unitPrice');
// }

// export function productUnit(product: unknown): string {
//   return pickString(product, 'unit', 'measurementUnit') || 'unit';
// }

// export function productAvailableQuantity(product: unknown): number {
//   return pickNumber(product, 'availableQuantity', 'quantityAvailable', 'stockQuantity', 'stock');
// }

// export function productMinimumOrder(product: unknown): number {
//   return pickNumber(product, 'minimumOrderQuantity', 'minOrderQuantity', 'minimumQuantity') || 1;
// }

// export function productAvailable(product: unknown): boolean {
//   return pickBoolean(product, 'isAvailable', 'available') ?? productAvailableQuantity(product) > 0;
// }

// export function productCategoryName(product: unknown): string {
//   const direct = pickString(product, 'categoryName');
//   if (direct) return direct;
//   const category = pick<JsonRecord>(product, 'category');
//   return category ? pickString(category, 'name', 'categoryName') : '';
// }

// export function productFarmerName(product: unknown): string {
//   const direct = pickString(product, 'farmerName', 'sellerName');
//   if (direct) return direct;
//   const farmer = pick<JsonRecord>(product, 'farmer', 'seller');
//   return farmer ? pickString(farmer, 'farmerName', 'name', 'fullName') : '';
// }

// export function productImageCandidates(product: unknown): string[] {
//   const record = product as Record<string, any>;
//   const candidates: string[] = [];
//   const singleKeys = ['imageUrl', 'imagePath', 'image', 'thumbnail', 'thumbnailUrl', 'primaryImage'];

//   for (const key of singleKeys) {
//     const value = record?.[key];
//     if (typeof value === 'string' && value.trim()) candidates.push(value);
//   }

//   const arrayKeys = ['images', 'imageUrls', 'productImages', 'photos'];
//   for (const key of arrayKeys) {
//     const value = record?.[key];
//     if (!Array.isArray(value)) continue;
//     for (const item of value) {
//       if (typeof item === 'string') {
//         candidates.push(item);
//       } else if (item && typeof item === 'object') {
//         const path = pickString(item, 'url', 'imageUrl', 'path', 'imagePath', 'fileName', 'filename');
//         if (path) candidates.push(path);
//       }
//     }
//   }
//   return [...new Set(candidates.filter(Boolean))];
// }

// export function resolveAssetUrl(path?: string): string {
//   if (!path) return '/placeholder-product.svg';
//   if (/^https?:\/\//i.test(path) || path.startsWith('data:')) return path;
//   const clean = path.replace(/\\/g, '/').replace(/^\.?\//, '');
//   if (clean.startsWith('uploads/')) return `/${clean}`;
//   if (clean.startsWith('/uploads/')) return clean;
//   if (path.startsWith('/')) return path;
//   return `/uploads/${clean}`;
// }

// export function productImage(product: unknown): string {
//   return resolveAssetUrl(productImageCandidates(product)[0]);
// }


import { JsonRecord } from '../models/api.models';
import { entityId, pick, pickBoolean, pickNumber, pickString } from './api.util';

export function productId(product: unknown): number {
  return entityId(product);
}

export function productName(product: unknown): string {
  return pickString(product, 'productName', 'name', 'title') || 'Farm product';
}

export function productDescription(product: unknown): string {
  return pickString(product, 'description', 'productDescription');
}

export function productPrice(product: unknown): number {
  return pickNumber(product, 'price', 'unitPrice');
}

export function productUnit(product: unknown): string {
  return pickString(product, 'unit', 'measurementUnit') || 'unit';
}

export function productAvailableQuantity(product: unknown): number {
  return pickNumber(product, 'availableQuantity', 'quantityAvailable', 'stockQuantity', 'stock');
}

export function productMinimumOrder(product: unknown): number {
  return pickNumber(product, 'minimumOrderQuantity', 'minOrderQuantity', 'minimumQuantity') || 1;
}

/*
 * IMPORTANT:
 * Availability is controlled only by the backend isAvailable field.
 * Do not derive it from stock quantity.
 */
export function productAvailable(product: unknown): boolean {
  return pickBoolean(product, 'isAvailable', 'available') ?? false;
}

export function productCategoryName(product: unknown): string {
  const direct = pickString(product, 'categoryName');
  if (direct) return direct;

  const category = pick<JsonRecord>(product, 'category');
  return category ? pickString(category, 'name', 'categoryName') : '';
}

export function productFarmerName(product: unknown): string {
  const direct = pickString(product, 'farmerName', 'sellerName');
  if (direct) return direct;

  const farmer = pick<JsonRecord>(product, 'farmer', 'seller');
  return farmer ? pickString(farmer, 'farmerName', 'name', 'fullName') : '';
}

export function productImageCandidates(product: unknown): string[] {
  const record = product as Record<string, any>;
  const candidates: string[] = [];

  const singleKeys = [
    'imageUrl',
    'imagePath',
    'image',
    'thumbnail',
    'thumbnailUrl',
    'primaryImage'
  ];

  for (const key of singleKeys) {
    const value = record?.[key];
    if (typeof value === 'string' && value.trim()) {
      candidates.push(value);
    }
  }

  const arrayKeys = [
    'images',
    'imageUrls',
    'productImages',
    'photos',
    'imagePaths'
  ];

  for (const key of arrayKeys) {
    const value = record?.[key];
    if (!Array.isArray(value)) continue;

    for (const item of value) {
      if (typeof item === 'string') {
        candidates.push(item);
      } else if (item && typeof item === 'object') {
        const path = pickString(
          item,
          'url',
          'imageUrl',
          'path',
          'imagePath',
          'fileName',
          'filename'
        );
        if (path) candidates.push(path);
      }
    }
  }

  return [...new Set(candidates.filter(Boolean))];
}

export function resolveAssetUrl(path?: string): string {
  if (!path) return '/placeholder-product.svg';

  if (/^https?:\/\//i.test(path) || path.startsWith('data:')) {
    return path;
  }

  const clean = path.replace(/\\/g, '/').replace(/^\.\//, '');

  if (clean.startsWith('uploads/')) return `/${clean}`;
  if (clean.startsWith('/uploads/')) return clean;
  if (path.startsWith('/')) return path;

  return `/uploads/${clean}`;
}

export function productImage(product: unknown): string {
  return resolveAssetUrl(productImageCandidates(product)[0]);
}
