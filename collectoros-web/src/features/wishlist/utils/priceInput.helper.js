export function sanitizePriceInput(value = "") {
  let nextValue = String(value);

  nextValue = nextValue.replace(/,/g, "");
  nextValue = nextValue.replace(/[^\d.]/g, "");

  const firstDotIndex = nextValue.indexOf(".");

  if (firstDotIndex !== -1) {
    const integerPart = nextValue.slice(0, firstDotIndex);
    const decimalPart = nextValue
      .slice(firstDotIndex + 1)
      .replace(/\./g, "")
      .slice(0, 2);

    nextValue = `${integerPart}.${decimalPart}`;
  }

  return nextValue;
}

export function formatPriceInput(value = "") {
  if (!value) return "";

  const [integerPart, decimalPart] = String(value).split(".");

  const formattedInteger = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  );

  if (decimalPart !== undefined) {
    return `${formattedInteger}.${decimalPart}`;
  }

  return formattedInteger;
}