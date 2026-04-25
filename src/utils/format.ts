export function formatRupiah(amount: number, isPrivacyMode: boolean = false) {
  if (isPrivacyMode) {
    return '••••••';
  }
  return new Intl.NumberFormat('id-ID').format(amount);
}

export function formatCurrency(amount: number, currency: string = 'IDR', isPrivacyMode: boolean = false) {
  if (isPrivacyMode) {
    return '••••••';
  }
  
  if (currency === 'IDR') {
    return `Rp ${new Intl.NumberFormat('id-ID').format(amount)}`;
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}
