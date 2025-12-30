/**
 * Mock data para dependencias
 *
 * Simula datos reales de análisis de dependencias NPM
 */

export const mockDependencies = [
  // Dependencias desactualizadas
  {
    id: 1,
    packageName: 'Extendable client for Github',
    author: '@oktoki',
    currentVersion: '7.0.5',
    latestVersion: '7.0.6',
    isOutdated: true,
  },
  {
    id: 2,
    packageName: 'React Router DOM',
    author: '@remix-run',
    currentVersion: '6.28.0',
    latestVersion: '6.29.0',
    isOutdated: true,
  },
  {
    id: 3,
    packageName: 'Material-UI Core',
    author: '@mui',
    currentVersion: '6.4.0',
    latestVersion: '6.5.0',
    isOutdated: true,
  },
  {
    id: 4,
    packageName: 'Axios HTTP Client',
    author: '@axios',
    currentVersion: '1.6.5',
    latestVersion: '1.7.0',
    isOutdated: true,
  },
  {
    id: 5,
    packageName: 'Chart.js',
    author: '@chartjs',
    currentVersion: '4.4.0',
    latestVersion: '4.5.1',
    isOutdated: true,
  },
  {
    id: 6,
    packageName: 'Lodash Utility',
    author: '@lodash',
    currentVersion: '4.17.20',
    latestVersion: '4.17.21',
    isOutdated: true,
  },
  {
    id: 7,
    packageName: 'Date-fns',
    author: '@date-fns',
    currentVersion: '3.0.0',
    latestVersion: '3.2.0',
    isOutdated: true,
  },
  {
    id: 8,
    packageName: 'Redux Toolkit',
    author: '@reduxjs',
    currentVersion: '2.0.0',
    latestVersion: '2.1.0',
    isOutdated: true,
  },
  {
    id: 9,
    packageName: 'Formik Forms',
    author: '@formium',
    currentVersion: '2.4.0',
    latestVersion: '2.4.5',
    isOutdated: true,
  },
  {
    id: 10,
    packageName: 'Yup Validation',
    author: '@jquense',
    currentVersion: '1.3.0',
    latestVersion: '1.4.0',
    isOutdated: true,
  },

  // Dependencias actualizadas
  {
    id: 11,
    packageName: 'React',
    author: '@facebook',
    currentVersion: '19.0.0',
    latestVersion: '19.0.0',
    isOutdated: false,
  },
  {
    id: 12,
    packageName: 'React DOM',
    author: '@facebook',
    currentVersion: '19.0.0',
    latestVersion: '19.0.0',
    isOutdated: false,
  },
  {
    id: 13,
    packageName: 'TypeScript',
    author: '@microsoft',
    currentVersion: '5.3.3',
    latestVersion: '5.3.3',
    isOutdated: false,
  },
  {
    id: 14,
    packageName: 'ESLint',
    author: '@eslint',
    currentVersion: '9.8.0',
    latestVersion: '9.8.0',
    isOutdated: false,
  },
  {
    id: 15,
    packageName: 'Prettier',
    author: '@prettier',
    currentVersion: '3.2.0',
    latestVersion: '3.2.0',
    isOutdated: false,
  },
  {
    id: 16,
    packageName: 'Jest',
    author: '@jestjs',
    currentVersion: '30.0.2',
    latestVersion: '30.0.2',
    isOutdated: false,
  },
  {
    id: 17,
    packageName: 'Webpack',
    author: '@webpack',
    currentVersion: '5.90.0',
    latestVersion: '5.90.0',
    isOutdated: false,
  },
  {
    id: 18,
    packageName: 'Babel Core',
    author: '@babel',
    currentVersion: '7.24.0',
    latestVersion: '7.24.0',
    isOutdated: false,
  },
  {
    id: 19,
    packageName: 'Sass',
    author: '@sass',
    currentVersion: '1.95.0',
    latestVersion: '1.95.0',
    isOutdated: false,
  },
  {
    id: 20,
    packageName: 'Nx',
    author: '@nrwl',
    currentVersion: '22.1.3',
    latestVersion: '22.1.3',
    isOutdated: false,
  },
];

/**
 * Obtener estadísticas de dependencias
 */
export const getDependenciesStats = () => {
  const outdated = mockDependencies.filter((dep) => dep.isOutdated).length;
  const updated = mockDependencies.filter((dep) => !dep.isOutdated).length;
  const total = mockDependencies.length;

  return { outdated, updated, total };
};
