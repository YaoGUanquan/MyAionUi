import type { DomainKey } from './domain-menu';

export type DomainRouteConfig = {
  domain: DomainKey;
  path: `/domains/${DomainKey}`;
  title: string;
  description: string;
};

export const domainRoutes: DomainRouteConfig[] = [
  {
    domain: 'wechat',
    path: '/domains/wechat',
    title: '公众号',
    description: '进入公众号域对话，后续通过统一协议触发文章生成、草稿推送等动作。',
  },
  {
    domain: 'trade',
    path: '/domains/trade',
    title: '外贸',
    description: '进入外贸域对话，后续通过统一协议触发商品查询、上架建议等动作。',
  },
];
