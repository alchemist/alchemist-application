import "core-js";
import {fileSystem} from "./helpers/filesystem-helper";
import store from "./stores/store"
import {resolve} from "path";
import {remote} from "electron";

import {
  IPlugin,
  nodeRegistry,
  nodeGeneratorRegistry,
  projectRegistry,
  PluginContext,
  codeProcessorRegistry, projectGeneratorRegistry
} from "@alchemist/core";

const paths: any = remote.getGlobal("paths");
console.log("PATHS", paths);

export const pluginContext: PluginContext = {
  codeProcessorRegistry: codeProcessorRegistry,
  nodeGeneratorRegistry: nodeGeneratorRegistry,
  nodeRegistry: nodeRegistry,
  projectGeneratorRegistry: projectGeneratorRegistry,
  projectRegistry: projectRegistry,
  store: store,
  paths: paths
};

const registerNodes = () => {
  nodeRegistry.registerAllNodes();
};

const initPlugin = async (plugin: IPlugin) =>
{
  console.log(`Loading Plugin: ${plugin.name} | ${plugin.version}`);
  await plugin.setup(pluginContext)
};

const scanForPlugins = async (): Promise<string[]> => {
  const pluginPath = `${paths.plugins}`;
  const pluginFolders = await fileSystem.getDirectoryContents(pluginPath);
  return pluginFolders.map(x => resolve(pluginPath, x, "index.js"));
};

const loadAllPluginModules = async (modules) => {
  console.log("Found Modules", modules);
  const orderedPlugins = modules
    .map(x => new x.Plugin())
    .sort((a,b) => b.order - a.order);

  await orderedPlugins.forEach(await initPlugin);
};

export const loadPlugins = async(): Promise<void> => {
  const pluginFiles = await scanForPlugins();
  console.log("plugins files located:", pluginFiles);

  const pluginModules = await Promise
    .all(pluginFiles.map(window.require));

  await loadAllPluginModules(pluginModules)
    .then(registerNodes);
};