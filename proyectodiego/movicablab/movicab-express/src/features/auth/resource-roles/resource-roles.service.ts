import { EffectivePermissionDto } from "./dto";

export class ResourceRolesService {
  public async findEffectiveForUser(userId: number): Promise<EffectivePermissionDto[]> {
    return [
      { method: "GET", path: "/api/usuarios" },
      { method: "POST", path: "/api/usuarios" }
    ];
  }
}
