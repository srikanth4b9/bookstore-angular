import type {Meta, StoryObj} from '@storybook/angular';
import {applicationConfig} from '@storybook/angular';
import {NavbarComponent} from './navbar.component';
import {createMockDataService} from '../../.storybook/mock-providers';
import {MOCK_CART_ITEMS, MOCK_USER} from '../../.storybook/mock-data';

const meta: Meta<NavbarComponent> = {
  title: 'Components/Navbar',
  component: NavbarComponent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Primary navigation bar with links to Home, Books, Categories, Cart (with badge), and Account/Login.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<NavbarComponent>;

export const LoggedIn: Story = {
  name: 'Logged In User',
  decorators: [
    applicationConfig({
      providers: [createMockDataService({cartItems: MOCK_CART_ITEMS, user: MOCK_USER})],
    }),
  ],
};

export const LoggedOut: Story = {
  name: 'Logged Out',
  decorators: [
    applicationConfig({
      providers: [createMockDataService({cartItems: [], user: null})],
    }),
  ],
};

export const WithFullCart: Story = {
  name: 'With Full Cart (6 qty)',
  decorators: [
    applicationConfig({
      providers: [
        createMockDataService({
          cartItems: [
            ...MOCK_CART_ITEMS,
            {
              id: 'ci-3',
              bookId: '3',
              bookTitle: 'Sapiens',
              bookPrice: 18.99,
              quantity: 3,
              imageUrl: 'https://picsum.photos/seed/3/200/300',
            },
          ],
          user: MOCK_USER,
        }),
      ],
    }),
  ],
};

export const EmptyCart: Story = {
  name: 'Empty Cart',
  decorators: [
    applicationConfig({
      providers: [createMockDataService({cartItems: [], user: MOCK_USER})],
    }),
  ],
};
