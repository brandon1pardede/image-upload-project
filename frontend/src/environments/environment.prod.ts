declare const process: {
  env: {
    [key: string]: string | undefined;
  };
};

export const environment = {
  production: true,
  apiUrl: process.env['API_URL'] || 'http://localhost:3000', // Will be replaced during build time
};
