import { Central } from '@lionrockjs/central';

await Central.initConfig(new Map([
  ['edm', await import('./config/edm.mjs')],
]));