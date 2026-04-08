import type {Meta, StoryObj} from '@storybook/angular';
import {applicationConfig} from '@storybook/angular';
import {CartComponent} from './cart.component';
import {createMockStoreProviders} from '../../.storybook/mock-providers';
import {MOCK_CART_ITEMS} from '../../.storybook/mock-data';

const meta: Meta<CartComponent> = {
  title: 'Pages/Cart',
  component: CartComponent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Shopping cart page with item list, quantity controls, promo code input, order summary, and checkout button.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<CartComponent>;

export const WithItems: Story = {
  name: 'With Items',
  decorators: [
    applicationConfig({
      providers: [...createMockStoreProviders({cartItems: MOCK_CART_ITEMS})],
    }),
  ],
};

export const Empty: Story = {
  name: 'Empty Cart',
  decorators: [
    applicationConfig({
      providers: [...createMockStoreProviders({cartItems: []})],
    }),
  ],
};

export const SingleItem: Story = {
  name: 'Single Item',
  decorators: [
    applicationConfig({
      providers: [...createMockStoreProviders({cartItems: [MOCK_CART_ITEMS[0]]})],
    }),
  ],
};

export const ManyItems: Story = {
  name: 'Many Items',
  decorators: [
    applicationConfig({
      providers: [
        ...createMockStoreProviders({
          cartItems: [
            ...MOCK_CART_ITEMS,
            {
              id: 'ci-3',
              bookId: '3',
              bookTitle: 'Sapiens: A Brief History of Humankind',
              bookPrice: 18.99,
              quantity: 1,
              imageUrl: 'https://picsum.photos/seed/3/200/300',
            },
            {
              id: 'ci-4',
              bookId: '5',
              bookTitle: "Harry Potter and the Philosopher's Stone",
              bookPrice: 14.99,
              quantity: 3,
              imageUrl: 'https://picsum.photos/seed/5/200/300',
            },
          ],
        }),
      ],
    }),
  ],
};
