const TestRenderer = require('react-test-renderer');

module.exports = {
  ...TestRenderer,
  createRoot: (container, options) => {
    let currentElement = null;
    
    return {
      render: (element) => {
        const testRenderer = require('react-test-renderer');
        return testRenderer.create(element, {
          createNodeMock: options?.createNodeMock,
        });
      },
      unmount: () => {
      },
    };
  },
};
