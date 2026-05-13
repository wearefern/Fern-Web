import Link from 'next/link';

import { type Tool, formatToolPrice } from './tool-types';
import { useCart } from '../../context/cart-context';

interface ToolCardProps {
  tool: Tool;
  onPrimaryAction?: (tool: Tool) => void;
  actionLoading?: boolean;
}

export const ToolCard = ({ tool, onPrimaryAction, actionLoading = false }: ToolCardProps) => {
  const { isProductInCart } = useCart();
  const isInCart = isProductInCart(tool.id);
  
  const label =
    tool.status === 'free' ? 'Get Free' : 
    tool.status === 'coming_soon' ? 'Coming Soon' : 
    isInCart ? 'In Cart' : 'Download';
  const disabled = tool.status === 'coming_soon' || actionLoading || isInCart;

  return (
    <div className='bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors duration-200 h-full flex flex-col'>
      <Link href={`/tools/${tool.slug}`} className='block'>
        {/* Icon */}
        <div className='w-12 h-12 border border-gray-300 rounded-md flex items-center justify-center mb-4'>
          <div className='w-6 h-6 bg-gray-400 rounded-sm' />
        </div>

        {/* Content */}
        <div className='space-y-3'>
          <div className='flex items-start justify-between'>
            <h3 className='font-medium text-black text-lg'>
              {tool.name}
            </h3>
            <span className='text-black font-medium text-lg'>
              {formatToolPrice(tool)}
            </span>
          </div>
          
          <p className='text-sm text-gray-500 leading-relaxed'>
            {tool.description}
          </p>

          {/* Category Tag */}
          <div className='inline-flex items-center'>
            <span className='inline-flex items-center rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-500'>
              {tool.category ?? 'General'}
            </span>
          </div>
        </div>
      </Link>

      {/* Action Button */}
      <div className='mt-auto pt-4 border-t border-gray-100'>
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
