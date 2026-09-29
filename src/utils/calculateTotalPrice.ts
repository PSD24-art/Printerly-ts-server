export interface PrintConfig {
  copies: number;
  colorMode: "black_white" | "color";
  pageSize: "A4" | "A3" | "Letter";
  printSide: "single" | "double";
  binding: boolean;
  lamination: boolean;
}

export interface ShopPricing {
  blackAndWhite: number;
  colorPrint: number;
  lamination: number;
  binding: number;
}
function calculatePrice(totalPages: number, config: PrintConfig, pricing: ShopPricing) {
  const printRate = config.colorMode === "color" ? pricing.colorPrint : pricing.blackAndWhite;

  const printingCost = totalPages * printRate * config.copies;

  const bindingCost = config.binding ? pricing.binding : 0;

  const laminationCost = config.lamination ? pricing.lamination : 0;
  const totalPrice = printingCost + bindingCost + laminationCost;

  return totalPrice;
}

export default calculatePrice;
