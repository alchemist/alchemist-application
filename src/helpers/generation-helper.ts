import {IGenerationManager, DefaultGenerationManager} from "@alchemist/core";
import {DefaultFileSystem} from "../filesystem/default-file-system";

export const generationManager: IGenerationManager = new DefaultGenerationManager(new DefaultFileSystem());