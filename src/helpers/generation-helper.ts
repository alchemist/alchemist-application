import {IGenerationManager} from "@alchemist/core";
import { DefaultGenerationManager } from "@/generators/default-generation-manager";

export const generationManager: IGenerationManager = new DefaultGenerationManager();