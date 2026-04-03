import type { TBox, TBoxProductRow } from '../types/TBox';

/**
 * Chuẩn hóa dữ liệu gói: hỗ trợ cả `boxProducts` (cũ) và `box_details` (nhóm theo category).
 */
export function getBoxProductRows(box: TBox): TBoxProductRow[] {
  if (box.boxProducts && box.boxProducts.length > 0) {
    return box.boxProducts.map((p) => ({ ...p }));
  }

  if (!box.box_details?.length) return [];

  const rows: TBoxProductRow[] = [];
  for (const group of box.box_details) {
    for (const p of group.products) {
      rows.push({
        id: p.boxProductId,
        boxId: box.id,
        productId: p.id,
        quantity: p.quantity,
        unit: p.boxUnit,
        isOptional: p.isOptional,
        weekStartDate: p.weekStartDate,
        product: {
          id: p.id,
          name: p.name,
          slug: p.slug,
          description: p.description,
          weight: p.weight,
          unit: p.unit,
          images: p.images,
          categoryId: group.category.id,
          status: p.status,
          createdAt: '',
          updatedAt: '',
          priceAddOn: p.priceAddOn,
          isAddOn: p.isAddOn,
        },
        createdAt: '',
        updatedAt: '',
        category: group.category,
      });
    }
  }
  return rows;
}
