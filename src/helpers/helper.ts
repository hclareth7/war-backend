export const formatCurrencyNummber = (value: number) => {
    const formatted = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
    return formatted;
}