import instance from './axios';

export const getCompetitors = () => {
  return instance.get('/competitors'); // Nó sẽ nối thành /api/competitors
};