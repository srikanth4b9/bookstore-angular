import type {Preview} from '@storybook/angular';
import {applicationConfig} from '@storybook/angular';
import {provideRouter} from '@angular/router';
import {provideHttpClient} from '@angular/common/http';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';

const preview: Preview = {
  decorators: [
    applicationConfig({
      providers: [provideRouter([]), provideHttpClient(), provideAnimationsAsync()],
    }),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'fullscreen',
    docs: {
      toc: true,
    },
  },
  tags: ['autodocs'],
};

export default preview;
