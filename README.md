# Revelio Feature

<img style="display:block; margin: 24px auto"  src="revelio-image.png" width="300" height="300" />

[Revelio Feature](https://revelio-feature.monjidev.com) is simple library to reveal/onboard new features to the users in a web or web application

## Features

- **Framework agnostic**: It can be used with any framework or simply vanilla JS.
- **Rich API**: Allows you to customize the tour to your needs\*\*: flow control methods, user
  interactivity, lifecycle hooks, CSS custom classes etc.
- **Light and no dependencies**: Revelio feature is a light library with no dependencies, it's only 4.8kb
  gzipped.
- **Typescript**: Revelio feature has Typescript support, allowing type safety and better
  developer experience.
- **Auto scrolls to elements**: Automatically scrolls to elements, even when this elements are in nested
  scollable containers.
- **Supports stacking contexts nesting**: Others feature discovery alternatives doesn't work with [stacking
  contexts](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Understanding_z-index/Stacking_context)
  nesting, Revelio feature allows you to overcome this problem with its rich
  API.
- **Free and open source**: Revelio will be always free and open source, we are open to contributions
  and feedback!

## Get started

### Install

```bash
npm install revelio-feature
```

### Implement

Create your first tour by instantiating a new Revelio object with a journey array of steps.

```js
import { Revelio } from 'revelio-feature';

const revelioTour = new Revelio({
  options: {
    // ... custom global options
  },
  journey: [
    {
      title: 'Welcome to my Amazing App!', // title of the step
      content: 'Click "Next" to get started discovering my app features.', // description of the step
      element: '#welcome-element', // CSS query selector
      options: {
        // ... custom options for this step
      },
    },
    // ... more steps
  ],
});
```

## License

This project is licensed under the [MIT License](LICENSE) - see the [LICENSE](LICENSE) file for details.
