import { INode, ProjectState } from "@alchemist/core";
import {EditorState} from "@/stores/modules/editor/editor-state";

export class EditorMutations
{
    public selectNode = (state: EditorState, node: INode): void =>
    { state.selectedNode = node; };

    public updateNodeErrors = (state: EditorState, nodeError: { nodeId: string, errors: any }) =>
    { state.nodeErrors[nodeError.nodeId] = nodeError.errors; };

    public selectGroup = (state: EditorState, index: number): void =>
    { state.selectedGroupIndex = index; };

    public showContextSideBar = (state: EditorState, isVisible = true): void =>
    { state.showContextSideBar = isVisible; };

    public showFolderSideBar = (state: EditorState, isVisible = true): void =>
    { state.showFolderSideBar = isVisible; };

    public updateHeaderHeight = (state: EditorState, headerHeight: number): void =>
    { state.headerHeight = headerHeight; };
}