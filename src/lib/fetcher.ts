export const fetcher = async (...args: Parameters<typeof fetch>) => {
  return (await fetch(...args)).json();
};
