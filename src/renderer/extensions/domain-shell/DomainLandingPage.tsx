import React from 'react';
import { Message, Typography } from '@arco-design/web-react';
import { useNavigate, useParams } from 'react-router-dom';
import GuidPage from '@renderer/pages/guid';
import { domainRoutes } from './domain-routes';
import type { DomainKey } from './domain-menu';

const DomainLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { domainKey } = useParams<{ domainKey: DomainKey }>();
  const domainConfig = domainRoutes.find((item) => item.domain === domainKey);

  React.useEffect(() => {
    if (domainConfig) return;
    Message.warning('未识别的业务域，已返回首页对话入口。');
    void navigate('/guid', { replace: true, state: { resetAssistant: true } });
  }, [domainConfig, navigate]);

  if (!domainConfig) {
    return null;
  }

  return (
    <>
      <div className='px-20px pt-12px pb-0'>
        <div className='mx-auto max-w-960px'>
          <div className='rd-16px border border-[rgba(var(--primary-6),0.14)] bg-[rgba(var(--primary-6),0.08)] px-16px py-12px'>
            <div className='flex items-center gap-10px'>
              <span className='inline-flex rd-999px bg-[rgba(var(--primary-6),0.18)] px-10px py-4px text-12px font-semibold text-primary'>
                业务域
              </span>
              <Typography.Text className='text-14px font-medium text-[var(--color-text-1)]'>
                {domainConfig.title}
              </Typography.Text>
            </div>
            <Typography.Paragraph className='mb-0 mt-8px text-13px text-[var(--color-text-2)]'>
              {domainConfig.description}
            </Typography.Paragraph>
          </div>
        </div>
      </div>
      <GuidPage />
    </>
  );
};

export default DomainLandingPage;
