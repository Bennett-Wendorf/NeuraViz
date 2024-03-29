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

### Tikz Export
- Exporting a model to Tikz should download a .tex file
- Compile the .tex file to a .pdf file and visually inspect to ensure that it's the same as the svg representation (excluding activation functions)
- Change scale variable in tex and recompile to ensure model scales appropriately.
- Ensure that the tikz export is disabled when no model exists

### SVG Export
- Exporting a model to SVG should download a .svg file
- Visually inspect to ensure that it's the same as the app's representation
- Ensure that the SVG export is disabled when no model exists