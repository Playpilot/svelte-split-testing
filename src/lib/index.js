import SplitTest from "./SplitTest.svelte"
import { serverGetSplitTestIdentifier, clientGetSplitTestIdentifier, getVariant, performSplitTestAction } from "./splitTesting.js"

export { SplitTest, serverGetSplitTestIdentifier, clientGetSplitTestIdentifier, getVariant, performSplitTestAction }
