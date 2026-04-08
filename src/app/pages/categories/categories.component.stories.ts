import type {Meta, StoryObj} from '@storybook/angular';
import {applicationConfig} from '@storybook/angular';
import {CategoriesComponent} from './categories.component';
import {createMockStoreProviders} from '../../.storybook/mock-providers';

const meta: Meta<CategoriesComponent> = {
  title: 'Pages/Categories',
  component: CategoriesComponent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Categories listing page showing all book categories with icons and navigation to filtered book views.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<CategoriesComponent>;

export const Default: Story = {
  name: 'With Categories',
  decorators: [
    applicationConfig({
      providers: [...createMockStoreProviders()],
    }),
  ],
};

export const Loading: Story = {
  name: 'Loading State',
  decorators: [
    applicationConfig({
      providers: [...createMockStoreProviders({isLoading: true})],
    }),
  ],
};
