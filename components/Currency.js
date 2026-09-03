const CURRENCY_FORMATTERS = {
  PHP: new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }),
  USD: new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }),
};

const formatCurrency = (value, currency = "PHP") => {
  const formatter = CURRENCY_FORMATTERS[currency] || CURRENCY_FORMATTERS.USD;
  return formatter.format(value);
};

const Currency = ({ quantity, currency }) => formatCurrency(quantity, currency);

export default Currency;