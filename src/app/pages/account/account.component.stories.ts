import type {Meta, StoryObj} from '@storybook/angular';
import {applicationConfig} from '@storybook/angular';
import {AccountComponent} from './account.component';
import {createMockStoreProviders} from '../../.storybook/mock-providers';
import {MOCK_USER} from '../../.storybook/mock-data';

const meta: Meta<AccountComponent> = {
  title: 'Pages/Account',
  component: AccountComponent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'User account page with tabs for profile info, order history, and saved addresses.',
      },
    },
  },
  decorators: [
    applicationConfig({
      providers: [...createMockStoreProviders({user: MOCK_USER})],
    }),
  ],
};

export default meta;
type Story = StoryObj<AccountComponent>;

export const Default: Story = {
  name: 'Default',
};
