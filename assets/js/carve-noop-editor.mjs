/* Local stand-in for https://framer.com/edit/init.mjs — the Framer editor bar.
   Keeps a self-hosted export from phoning home to framer.com on every page load. */
export const createEditorBar = () => () => null;
export default createEditorBar;
