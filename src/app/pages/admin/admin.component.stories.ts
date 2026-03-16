import type {Meta, StoryObj} from '@storybook/angular';
import {applicationConfig} from '@storybook/angular';
import {AdminComponent} from './admin.component';
import {createMockDataService} from '../../.storybook/mock-providers';
import {MOCK_BOOKS} from '../../.storybook/mock-data';

const meta: Meta<AdminComponent> = {
  title: 'Pages/Admin',
  component: AdminComponent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Admin dashboard with tabs for book inventory management (table with add/edit/delete) and order tracking with sales analytics.',
      },
    },
  },
  decorators: [
    applicationConfig({
      providers: [createMockDataService({books: MOCK_BOOKS})],
    }),
  ],
};

export default meta;
type Story = StoryObj<AdminComponent>;

export const Default: Story = {
  name: 'Default',
};
