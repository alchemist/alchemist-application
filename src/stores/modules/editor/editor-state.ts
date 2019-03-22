import {INode} from "@alchemist/core";

export interface NodeErrors
{
    [key: string]: any;
}

export class EditorState
{
    public selectedNode: INode = null;
    public nodeErrors: NodeErrors = {};
    public selectedGroupIndex = 0;
    public showContextSideBar = true;
    public showFolderSideBar = true;
    public headerHeight = 0;
}