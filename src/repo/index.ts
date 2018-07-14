import { RepoType, Repo } from "./repo";
import FileRepo from "./implementation/file.system";
import MemoryRepo from "./implementation/memory";
import MongoDbRepo from "./implementation/mongodb";
import RedisRepo from "./implementation/redis";

export default function createRepo(repoType: RepoType, ...args: any[]): Repo {
    switch (repoType) {
        case RepoType.FileSystem:
            return new FileRepo(args[0]);
        case RepoType.MongoDb:
            return new MongoDbRepo(args[0], args[1], args[2]);
        case RepoType.Redis:
            return new RedisRepo(args[0], args[1]);        
        case RepoType.Memory:
        default: {
            return new MemoryRepo();
        }
    }
}