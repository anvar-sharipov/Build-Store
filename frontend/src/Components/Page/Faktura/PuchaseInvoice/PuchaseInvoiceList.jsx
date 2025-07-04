import { useState } from "react";

const PuchaseInvoiceList = ({
  selectedProducts,
  setSelectedProducts,
  giftProducts,
  setGiftProducts,
  t,
  resultQuantityRefs,
  selectedPriceType,
}) => {
  const [quantityErrors, setQuantityErrors] = useState({});

  const totalPriceSum = selectedProducts.reduce((sum, p) => {
    const pricePerUnit =
      selectedPriceType === "wholesale_price"
        ? p.wholesale_price
        : p.retail_price;
    const quantity = parseFloat(p.selected_quantity) || 0;
    return sum + pricePerUnit * quantity;
  }, 0);

  const totalProfitSum = selectedProducts.reduce((sum, p) => {
    const pricePerUnit =
      selectedPriceType === "wholesale_price"
        ? p.wholesale_price
        : p.retail_price;
    const profitPerUnit = pricePerUnit - p.purchase_price;
    const quantity = parseFloat(p.selected_quantity) || 0;
    return sum + profitPerUnit * quantity;
  }, 0);

  return (
    <table className="min-w-full mt-6 text-sm border border-gray-300 rounded">
      <thead className="bg-gray-100 text-left">
        <tr>
          <th className="p-2 border">№</th>
          <th className="p-2 border">Товар</th>
          <th className="p-2 border">Ед. изм</th>
          <th className="p-2 border">Кол-во</th>
          <th className="p-2 border">В базовых ед.</th>
          <th className="p-2 border">Цена за 1</th>
          <th className="p-2 border">Цена сумма</th>
          <th className="p-2 border">Прибыль за 1</th>
          <th className="p-2 border">Прибыль сумма</th>
        </tr>
      </thead>
      <tbody>
        {selectedProducts.map((p, idx) => {
          //   console.log("p", p);

          const unitPrice =
            selectedPriceType === "wholesale_price"
              ? p.wholesale_price
              : p.retail_price;

          const priceSum = p.base_quantity * unitPrice;
          const profitPerUnit = unitPrice - p.purchase_price;
          const profitSum = p.base_quantity * (unitPrice - p.purchase_price);
          const isError = quantityErrors[idx] || false;
          return (
            <tr key={idx} className="border-t">
              <td className="p-2 border">{idx + 1}</td>
              <td className="p-2 border">{p.name}</td>
              {/* units */}
              <td className="p-2 border">
                <select
                  className="border rounded px-2 py-1 w-full"
                  value={p.selected_unit?.id || p.base_unit_obj.id} // po umolchanoyu wybiraetsya id base_unit
                  onChange={(e) => {
                    const newUnitId = parseInt(e.target.value); // esli menyaem unit berem id wybrannogo unit

                    let newUnit; // budet soderjat w sebe wybrannyy unit
                    let conversionFactor = 1; // budet soderjat w sebe коэффициент пересчёта

                    if (newUnitId === p.base_unit_obj.id) {
                      // Если выбрана базовая единица (например, литр), то коэффициент пересчёта = 1
                      newUnit = p.base_unit_obj;
                      conversionFactor = 1;
                    } else {
                      // Если выбрана дополнительная:
                      const selectedUnitInfo = p.units.find(
                        // Ищем объект информации о доп. единице по unit id.
                        (u) => u.unit === newUnitId
                      );
                      if (!selectedUnitInfo) return; // Если не нашли — ничего не делаем (return).

                      newUnit = {
                        // Создаём объект newUnit, в том же формате, как и base_unit_obj.
                        id: selectedUnitInfo.unit,
                        name: selectedUnitInfo.unit_name,
                      };
                      conversionFactor = selectedUnitInfo.conversion_factor; // Получаем conversionFactor — коэффициент (например, 1 коробка = 72 литров).
                    }

                    const newBaseQuantity =
                      (parseFloat(p.selected_quantity) || 0) * conversionFactor; // Переводим введённое количество selected_quantity в базовые единицы. Например: 4 коробки * 72 литров = 288 литров.

                    setGiftProducts((prev) =>
                      prev.map((gift) =>
                        gift.main_product_id === p.id
                          ? {
                              ...gift,
                              calculatedQuantity:
                                gift.baseUnitQuantity * newBaseQuantity,
                            }
                          : gift
                      )
                    );

                    // Обновляем товар
                    setSelectedProducts((prev) =>
                      prev.map((item, i) =>
                        i === idx
                          ? {
                              ...item,
                              selected_unit: newUnit,
                              base_quantity: newBaseQuantity,
                            }
                          : item
                      )
                    );

                    // Проверка наличия на складе
                    if (newBaseQuantity > Number(p.quantity_in_stock)) {
                      setQuantityErrors((prev) => ({
                        ...prev,
                        [idx]: true,
                      }));
                    } else {
                      setQuantityErrors((prev) => ({
                        ...prev,
                        [idx]: false,
                      }));
                    }
                  }}
                >
                  <option value={p.base_unit_obj.id}>
                    {p.base_unit_obj.name} (базовая)
                  </option>
                  {p.units
                    .filter((u) => u.unit !== p.base_unit_obj.id) // Убираем из списка ту единицу, которая уже представлена как base_unit_obj. Чтобы не было дубля
                    .map((u, unitIdx) => (
                      <option key={`${u.id}-${unitIdx}`} value={u.unit}>
                        {u.unit_name} ({u.conversion_factor}){" "}
                        {/* // Создаём <option> для каждой оставшейся единицы. */}
                      </option>
                    ))}
                </select>
              </td>
              {/* quantity */}
              <td className="p-2 border">
                <input
                  ref={(el) => (resultQuantityRefs.current[idx] = el)}
                  tabIndex={0}
                  type="number"
                  className={`w-20 px-2 py-1 border rounded ${
                    isError ? "border-red-500 bg-red-100" : "border-gray-300"
                  }`}
                  value={p.selected_quantity}
                  onChange={(e) => {
                    const newQuantity = e.target.value; // Когда пользователь вводит количество — срабатывает эта функция i priswaiwaem znachenie w newQuantity.

                    // Находим коэффициент для текущей единицы
                    const unitInfo = p.units.find(
                      (u) => u.unit === p.selected_unit?.id
                    );
                    const factor = unitInfo?.conversion_factor || 1;

                    const newBaseQuantity =
                      (parseFloat(newQuantity) || 0) * factor;

                    setGiftProducts((prev) =>
                      prev.map((gift) =>
                        gift.main_product_id === p.id
                          ? {
                              ...gift,
                              calculatedQuantity:
                                gift.baseUnitQuantity * newBaseQuantity,
                            }
                          : gift
                      )
                    );

                    // Сначала обновляем количество
                    setSelectedProducts((prev) =>
                      prev.map((item, i) =>
                        i === idx
                          ? {
                              ...item,
                              selected_quantity: newQuantity,
                              base_quantity: newBaseQuantity,
                            }
                          : item
                      )
                    );

                    // Потом проверяем, хватает ли товара
                    if (newBaseQuantity > Number(p.quantity_in_stock)) {
                      setQuantityErrors((prev) => ({
                        ...prev,
                        [idx]: true,
                      }));
                    } else {
                      setQuantityErrors((prev) => ({
                        ...prev,
                        [idx]: false,
                      }));
                    }
                  }}
                />
              </td>
              {/* base quantity disabled */}
              <td className="p-2 border">
                {/* {p.base_quantity.toFixed(2)} */}
                {p.base_quantity.toLocaleString("ru-RU", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              {/* <td className="p-2 border">{unitPrice}</td> */}
              <td className="p-2 border">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-20 px-2 py-1 border rounded"
                  value={unitPrice}
                  onChange={(e) => {
                    const newPrice = parseFloat(e.target.value);
                    if (isNaN(newPrice) || newPrice < 0) return;

                    setSelectedProducts((prev) =>
                      prev.map((item, i) =>
                        i === idx
                          ? selectedPriceType === "wholesale_price"
                            ? { ...item, wholesale_price: newPrice }
                            : { ...item, retail_price: newPrice }
                          : item
                      )
                    );
                  }}
                />
              </td>
              <td className="p-2 border">
                {/* {priceSum} */}
                {priceSum.toLocaleString("ru-RU", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td className="p-2 border">
                {/* {profitPerUnit} */}
                {profitPerUnit.toLocaleString("ru-RU", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td className="p-2 border">
                {/* {profitSum} */}
                {profitSum.toLocaleString("ru-RU", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
            </tr>
          );
        })}

        {giftProducts.length > 0 &&
          giftProducts.map((giftProduct, idx) => {
            const inStock = Number(giftProduct.gift_product_quantity_in_stock);
            const required = Number(giftProduct.calculatedQuantity || 0);
            const isNotEnough = inStock < required;

            return (
              <tr
                key={`${giftProduct.gift_product_id}-${giftProduct.main_product_id}`}
                className="bg-blue-50"
              >
                <td className="p-2 border">
                  {selectedProducts.length + idx + 1}
                </td>
                <td className="p-2 border">{giftProduct.gift_name}</td>
                <td className="p-2 border">
                  {giftProduct.gift_product_unit_name}
                </td>
                <td
                  className={`p-2 border ${
                    isNotEnough ? "bg-red-200 text-red-700 font-semibold" : ""
                  }`}
                >
                  {/* {giftProduct.calculatedQuantity} */}
                  {giftProduct.calculatedQuantity.toLocaleString("ru-RU", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td
                  className="p-2 border col-span-3 text-sm italic text-gray-600 bg-blue-100 rounded-md"
                  colSpan={5}
                >
                  🎁 Для товара:{" "}
                  <span className="font-semibold text-blue-800">
                    {giftProduct.main_product_name}
                  </span>
                </td>
              </tr>
            );
          })}
      </tbody>
      <tfoot className="bg-gray-100 font-semibold">
        <tr>
          <td className="p-2 border" colSpan={6}>
            Итого
          </td>
          <td className="p-2 border">
            {totalPriceSum.toLocaleString("ru-RU", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </td>
          <td className="p-2 border"></td>
          <td className="p-2 border">
            {totalProfitSum.toLocaleString("ru-RU", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </td>
        </tr>
      </tfoot>
    </table>
  );
};

export default PuchaseInvoiceList;
