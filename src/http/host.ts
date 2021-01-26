export const mainHost = () => {
  switch (process.env.NODE_ENV) {
    case 'production':
      return 'https://api.furan.xyz/time-mgt';
    default:
      return 'http://localhost:8001';
  }
};
