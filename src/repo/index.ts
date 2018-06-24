import { RepoType, Repo } from "./repo";
import FileRepo from "./implementation/file.system";
import MemoryRepo from "./implementation/memory";

export default function createRepo(repoType: RepoType, ...args: any[]): Repo {
    switch (repoType) {
        case RepoType.Memory:
            return new MemoryRepo();
        case RepoType.FileSystem:
        default: {
            return new FileRepo(args[0]);
        }
    }
}