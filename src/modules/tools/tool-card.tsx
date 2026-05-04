import Link from 'next/link';

import { type Tool, formatToolPrice } from './tool-types';

interface ToolCardProps {
  tool: Tool;
  onPrimaryAction?: (tool: Tool) => void;
  actionLoading?: boolean;
}

export const ToolCard = ({ tool, onPrimaryAction, actionLoading = false }: ToolCardProps) => {
  const label =
    tool.status === 'free' ? 'Get Free' : tool.status === 'coming_soon' ? 'Coming Soon' : 'Buy Tool';
  const disabled = tool.status === 'coming_soon' || actionLoading;

  return (
    <div className='bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors duration-200 h-full flex flex-col'>
      <Link href={`/tools/${tool.slug}`} className='block'>
        <div className='space-y-3'>
          <div className='flex items-start justify-between gap-4'>
            <h3 className='font-medium text-black text-lg'>{tool.name}</h3>
            <span className='text-black font-medium text-lg'>{formatToolPrice(tool)}</span>
          </div>
          <p className='text-sm text-gray-500 leading-relaxed'>{tool.description}</p>
          <div className='inline-flex items-center'>
            <span className='inline-flex items-center rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-500'>
              {tool.category ?? 'General'}
            </span>
          </div>
        </div>
      </Link>

      <div className='pt-4 border-t border-gray-100 mt-4'>
        <button
          type='button'
          onClick={() => onPrimaryAction?.(tool)}
          disabled={disabled}
          className='inline-flex h-10 w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 text-sm font-medium text-black transition-colors duration-200 ease-in-out hover:border-gray-400 disabled:opacity-60 disabled:cursor-not-allowed'
        >
          {label}
        </button>
      </div>
    </div>
  );
};
