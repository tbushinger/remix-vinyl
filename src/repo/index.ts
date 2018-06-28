import { RepoType, Repo } from "./repo";
import FileRepo from "./implementation/file.system";
import MemoryRepo from "./implementation/memory";
import MongoDbRepo from "./implementation/mongodb";

export default function createRepo(repoType: RepoType, ...args: any[]): Repo {
    switch (repoType) {
        case RepoType.Memory:
            return new MemoryRepo();
        case RepoType.MongoDb:
            return new MongoDbRepo(args[0], args[1], args[2]);
        case RepoType.FileSystem:
        default: {
            return new FileRepo(args[0]);
        }
    }
}