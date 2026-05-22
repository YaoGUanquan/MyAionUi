export type DomainKey = 'wechat' | 'trade';

export type DomainMenuItem = {
  key: DomainKey;
  label: string;
  route: `/domains/${DomainKey}`;
};

export const domainMenuItems: DomainMenuItem[] = [
  { key: 'wechat', label: '公众号', route: '/domains/wechat' },
  { key: 'trade', label: '外贸', route: '/domains/trade' },
];

export const isDomainRoute = (pathname: string): pathname is `/domains/${DomainKey}` =>
  pathname === '/domains/wechat' || pathname === '/domains/trade';

export const resolveDomainFromPath = (pathname: string): DomainKey | null => {
  if (pathname === '/domains/wechat') return 'wechat';
  if (pathname === '/domains/trade') return 'trade';
  return null;
};
