import { RepoType, Repo } from "./repo";
import FileRepo from "./implementation/file.system"

export default function createRepo(repoType: RepoType, ...args: any[]) : Repo {
    switch (repoType) {
        case RepoType.FileSystem: 
        default: { 
            return new FileRepo(args[0]); 
        } 
    } 
}