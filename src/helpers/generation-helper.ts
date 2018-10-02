import {IGenerationManager} from "@alchemist-editor/core";
import { DefaultGenerationManager } from "@/generators/default-generation-manager";

export const generationManager: IGenerationManager = new DefaultGenerationManager();