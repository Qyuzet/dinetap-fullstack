import { ComplaintCategory } from '@/types/menu'

export const complaintCategories: {id: ComplaintCategory, label: string, description: string}[] = [
  {
    id: 'food-quality',
    label: 'Food Quality',
    description: 'Issues with food temperature, taste, freshness, or portion size'
  },
  {
    id: 'service',
    label: 'Service',
    description: 'Problems with staff attitude, wait times, or order accuracy'
  },
  {
    id: 'delivery',
    label: 'Delivery',
    description: 'Late delivery, wrong address, or issues with delivery personnel'
  },
  {
    id: 'app-issues',
    label: 'App Issues',
    description: 'Technical problems with the ordering platform or website'
  },
  {
    id: 'billing',
    label: 'Billing & Payments',
    description: 'Incorrect charges, payment issues, or refund requests'
  },
  {
    id: 'other',
    label: 'Other',
    description: 'Any other issues not covered by the categories above'
  }
]