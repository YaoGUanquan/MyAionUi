/**
 * @license
 * Copyright 2025 AionUi (aionui.com)
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import classNames from 'classnames';
import { Compass } from '@icon-park/react';
import { Tooltip } from '@arco-design/web-react';
import type { SiderTooltipProps } from '@renderer/utils/ui/siderTooltip';

interface SiderDomainEntryProps {
  isMobile: boolean;
  isActive: boolean;
  collapsed: boolean;
  label: string;
  siderTooltipProps: SiderTooltipProps;
  onClick: () => void;
}

const SiderDomainEntry: React.FC<SiderDomainEntryProps> = ({
  isMobile,
  isActive,
  collapsed,
  label,
  siderTooltipProps,
  onClick,
}) => {
  if (collapsed) {
    return (
      <Tooltip {...siderTooltipProps} content={label} position='right'>
        <div
          className={classNames(
            'w-full h-40px flex items-center justify-center cursor-pointer transition-colors rd-8px text-t-primary',
            isActive ? 'bg-[rgba(var(--primary-6),0.12)] text-primary' : 'hover:bg-fill-3 active:bg-fill-4'
          )}
          onClick={onClick}
        >
          <Compass theme='outline' size='20' fill='currentColor' className='block leading-none shrink-0' />
        </div>
      </Tooltip>
    );
  }

  return (
    <Tooltip {...siderTooltipProps} content={label} position='right'>
      <div
        className={classNames(
          'box-border h-40px w-full flex items-center justify-start gap-8px px-10px rd-0.5rem cursor-pointer shrink-0 transition-all text-t-primary',
          isMobile && 'sider-action-btn-mobile',
          isActive ? 'bg-[rgba(var(--primary-6),0.12)] text-primary' : 'hover:bg-fill-3 active:bg-fill-4'
        )}
        onClick={onClick}
      >
        <span className='w-28px h-28px flex items-center justify-center shrink-0'>
          <Compass theme='outline' size='20' fill='currentColor' className='block leading-none' />
        </span>
        <span className='collapsed-hidden text-t-primary text-14px font-medium leading-24px'>{label}</span>
      </div>
    </Tooltip>
  );
};

export default SiderDomainEntry;
