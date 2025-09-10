//  composables/useImg.ts
export const useImg = (img: string) => {
  const baseUrl = useRuntimeConfig().public.API_BASE_URL;
  return baseUrl + '/assets/' + img;
};
