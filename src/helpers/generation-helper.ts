import {IGenerationManager, DefaultGenerationManager} from "@alchemist/core";
import {fileSystem} from "./filesystem-helper";

export const generationManager: IGenerationManager = new DefaultGenerationManager(fileSystem);