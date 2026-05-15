import instance from './axios';

export const getCompetitors = async () => {
  const response = await instance.get('/competitors');
  return response.data;
};