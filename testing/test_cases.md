# Front End Test Cases

### Dark Mode
- The dark mode toggle should be visible in the sidebar
- By default, the application should follow the dark theme
- Clicking the dark mode toggle should change the theme to light mode
- Clicking the dark mode toggle again should change the theme back to dark mode
- In dark mode, all elements should be themed appropriately
- In light mode, all elements should be themed appropriately

### Graph Tooltip On Hover
- Hovering a link should make the link larger
- It should be possible to hover from just outside the visible link
- Hovering an inner link should show a tooltip with the link's weight
- Hovering an input or output link should show a tooltip with "Input" or "Output" respectively

### Activation Tooltip On Hover
- Hovering an activation function icon should show a tooltip with the activation function's name

### Node Size On Hover
- Hovering a node should make the node larger
- NOTE: Other related behavior is tested automatically by Playwright

### Sessions
- Upload model and ensure session exists in db and is cached on the client