import { IFileSystem } from "@alchemist/core";
import * as fs from "fs-extra";
import { dirname } from "path";

export class DefaultFileSystem implements IFileSystem
{
  public createDirectory(location: string): Promise<void> {
    return fs.mkdir(location);
  }

  public directoryExists(location: string): Promise<boolean> {
    return fs.pathExists(location);
  }

  public ensureDirectory(location: string): Promise<void> {
    const directory = dirname(location);
    return fs.ensureDir(directory);
  }

  public fileExists(location: string): Promise<boolean> {
    return fs.pathExists(location);
  }

  public async getDirectoryContents(location: string): Promise<string[]> {
    return fs.readdir(location);
  }

  public readFile(location: string): Promise<string> {
    return fs.readFile(location, "utf8");
  }

  public removeDirectory(location: string, recursive: boolean): Promise<void> {
    return fs.remove(location);
  }

  public writeFile(location: string, content: string): Promise<void> {
    return fs.writeFile(location, content);
  }

}