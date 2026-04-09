import type {Meta, StoryObj} from '@storybook/angular';
import {applicationConfig} from '@storybook/angular';
import {CheckoutComponent} from './checkout.component';
import {createMockStoreProviders} from '../../.storybook/mock-providers';
import {MOCK_CART_ITEMS} from '../../.storybook/mock-data';

const meta: Meta<CheckoutComponent> = {
  title: 'Pages/Checkout',
  component: CheckoutComponent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Multi-step checkout wizard using mat-stepper with Shipping, Payment, and Review steps.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<CheckoutComponent>;

export const WithItems: Story = {
  name: 'With Cart Items',
  decorators: [
    applicationConfig({
      providers: [...createMockStoreProviders({cartItems: MOCK_CART_ITEMS})],
    }),
  ],
};

export const EmptyCart: Story = {
  name: 'Empty Cart',
  decorators: [
    applicationConfig({
      providers: [...createMockStoreProviders({cartItems: []})],
    }),
  ],
};
