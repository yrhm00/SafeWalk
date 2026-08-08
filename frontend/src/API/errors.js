export function getErrorMessage(err) {
  const details = err.response?.data?.details;
  if (details?.length) {
    return details.map(d => d.message).join(' ');
  }
  return err.response?.data?.error || err.message;
}
