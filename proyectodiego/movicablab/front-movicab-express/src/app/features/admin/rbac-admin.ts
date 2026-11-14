import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmationService } from 'primeng/api';
import { forkJoin } from 'rxjs';

import { PageHeader } from '../../shared/ui/page-header/page-header';
import { NotificationService } from '../../core/services/notification';
import { RbacApiService } from './rbac-api.service';
import {
  User,
  Role,
  Resource,
  RoleUser,
  ResourceRole,
} from '../../core/models/rbac.model';

// ── Categorías de permisos para agrupar recursos en la matriz ──────────────
export interface PermissionCategory {
  key: string;
  label: string;
  icon: string;
  color: string;
  patterns: RegExp[];
  description: string;
}

export interface PermissionRow {
  resource: Resource;
  grant: ResourceRole | null;    // null = nunca existió
  toggling: boolean;             // micro-loading por fila
}

export const PERMISSION_CATEGORIES: PermissionCategory[] = [
  {
    key: 'trips',
    label: 'Carreras (Viajes)',
    icon: 'pi pi-compass',
    color: 'bg-indigo-50 border-indigo-200',
    patterns: [/\/carreras/],
    description: 'Gestión del ciclo de vida de los servicios de transporte solicitados',
  },
  {
    key: 'shifts',
    label: 'Turnos y Horarios',
    icon: 'pi pi-clock',
    color: 'bg-amber-50 border-amber-200',
    patterns: [/\/turnos/],
    description: 'Control de los turnos operativos de conductores y vehículos',
  },
  {
    key: 'fares',
    label: 'Tarifas y Precios',
    icon: 'pi pi-dollar',
    color: 'bg-emerald-50 border-emerald-200',
    patterns: [/\/tarifas/],
    description: 'Administración de esquemas tarifarios y reglas de cálculo',
  },
  {
    key: 'drivers',
    label: 'Conductores',
    icon: 'pi pi-id-card',
    color: 'bg-cyan-50 border-cyan-200',
    patterns: [/\/conductores/],
    description: 'Alta, consulta y administración del padrón de conductores del sistema',
  },
  {
    key: 'passengers',
    label: 'Pasajeros',
    icon: 'pi pi-user',
    color: 'bg-sky-50 border-sky-200',
    patterns: [/\/pasajeros/],
    description: 'Gestión del padrón de clientes y usuarios del servicio',
  },
  {
    key: 'vehicles',
    label: 'Vehículos y Tipos',
    icon: 'pi pi-car',
    color: 'bg-violet-50 border-violet-200',
    patterns: [/\/vehiculos/, /\/tipos-vehiculo/],
    description: 'Catálogo de unidades de transporte y clasificación por tipo',
  },
  {
    key: 'companies',
    label: 'Empresas',
    icon: 'pi pi-building',
    color: 'bg-orange-50 border-orange-200',
    patterns: [/\/empresas/],
    description: 'Administración de empresas o entidades propietarias de conductores y vehículos',
  },
  {
    key: 'payments',
    label: 'Cobros y Pagos',
    icon: 'pi pi-wallet',
    color: 'bg-teal-50 border-teal-200',
    patterns: [/\/pagos/],
    description: 'Registro, consulta y gestión de los pagos realizados por los pasajeros',
  },
  {
    key: 'settlements',
    label: 'Liquidaciones',
    icon: 'pi pi-calculator',
    color: 'bg-lime-50 border-lime-200',
    patterns: [/\/liquidaciones/],
    description: 'Cálculo y formalización de liquidaciones económicas a conductores',
  },
  {
    key: 'ratings',
    label: 'Calificaciones',
    icon: 'pi pi-star',
    color: 'bg-yellow-50 border-yellow-200',
    patterns: [/\/calificaciones/],
    description: 'Sistema de valoración y comentarios de pasajeros sobre los servicios',
  },
  {
    key: 'security',
    label: 'Seguridad y Administración',
    icon: 'pi pi-shield',
    color: 'bg-red-50 border-red-200',
    patterns: [/\/usuarios/, /\/roles/, /\/recursos/, /\/asignaciones-rol/, /\/concesiones-rol/, /\/sesion/, /\/permisos/],
    description: 'Gestión de identidades, roles, permisos y control de acceso del sistema',
  },
  {
    key: 'other',
    label: 'Otros Recursos',
    icon: 'pi pi-cog',
    color: 'bg-slate-50 border-slate-200',
    patterns: [/.*/],  // Captura todo lo que no encaja en las anteriores
    description: 'Endpoints adicionales no clasificados en módulos anteriores',
  },
];

// Tipo de sujeto en la matriz (rol o usuario)
type MatrixSubjectType = 'role' | 'user';

@Component({
  selector: 'app-rbac-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    DialogModule,
    SelectModule,
    InputTextModule,
    CheckboxModule,
    PageHeader,
  ],
  templateUrl: './rbac-admin.html',
})
export class RbacAdmin implements OnInit {
  private readonly api = inject(RbacApiService);
  private readonly notify = inject(NotificationService);
  private readonly confirm = inject(ConfirmationService);
  private readonly fb = inject(FormBuilder);

  // ── Tabs ──────────────────────────────────────────────────────────────────
  activeTab = signal<'users' | 'roles' | 'resources' | 'matrix'>('matrix');

  // ── Datos base ────────────────────────────────────────────────────────────
  users = signal<User[]>([]);
  roles = signal<Role[]>([]);
  resources = signal<Resource[]>([]);
  assignments = signal<RoleUser[]>([]);
  grants = signal<ResourceRole[]>([]);
  loading = signal(false);

  // ── Matriz de permisos ────────────────────────────────────────────────────
  matrixSubjectType = signal<MatrixSubjectType>('role');
  selectedRoleId = signal<number | null>(null);
  selectedUserId = signal<number | null>(null);
  matrixLoading = signal(false);
  expandedCategories = signal<Set<string>>(new Set(PERMISSION_CATEGORIES.map(c => c.key)));

  // Permisos efectivos del rol seleccionado (grants activos e inactivos)
  roleGrants = signal<ResourceRole[]>([]);
  // Asignaciones de roles para el usuario seleccionado
  userRoleAssignments = signal<RoleUser[]>([]);

  // ── Computed: filas de permisos por categoría ─────────────────────────────
  permissionRows = computed<PermissionRow[]>(() => {
    const res = this.resources();
    const grants = this.roleGrants();
    return res.map(resource => ({
      resource,
      grant: grants.find(g => g.resource_id === resource.id) ?? null,
      toggling: false,
    }));
  });

  categorizedRows = computed<{ category: PermissionCategory; rows: PermissionRow[] }[]>(() => {
    const rows = this.permissionRows();
    const result: { category: PermissionCategory; rows: PermissionRow[] }[] = [];
    const assigned = new Set<number>();

    for (const cat of PERMISSION_CATEGORIES) {
      if (cat.key === 'other') continue;
      const matched = rows.filter(r =>
        !assigned.has(r.resource.id) &&
        cat.patterns.some(p => p.test(r.resource.path))
      );
      matched.forEach(r => assigned.add(r.resource.id));
      if (matched.length > 0) {
        result.push({ category: cat, rows: matched });
      }
    }

    // Resto no clasificado
    const others = rows.filter(r => !assigned.has(r.resource.id));
    if (others.length > 0) {
      const otherCat = PERMISSION_CATEGORIES.find(c => c.key === 'other')!;
      result.push({ category: otherCat, rows: others });
    }

    return result;
  });

  // Roles activos del usuario seleccionado (para la matrix de asignación de roles)
  userActiveRoleIds = computed<Set<number>>(() => {
    return new Set(
      this.userRoleAssignments()
        .filter(a => a.status === 'active')
        .map(a => a.role_id)
    );
  });

  // ── Opciones para selects ─────────────────────────────────────────────────
  roleOptions = computed(() =>
    this.roles().map(r => ({ label: `${r.name}${r.description ? ' — ' + r.description : ''}`, value: r.id }))
  );
  userOptions = computed(() =>
    this.users().map(u => ({ label: `${u.username} (${u.email})`, value: u.id }))
  );

  // ── Diálogos y formularios (CRUD de usuarios/roles/recursos) ──────────────
  userDialog = signal(false);
  roleDialog = signal(false);
  resourceDialog = signal(false);

  userForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  roleForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
  });

  resourceForm = this.fb.group({
    method: ['GET', [Validators.required]],
    path: ['', [Validators.required]],
    description: [''],
  });

  httpMethods = [
    { label: 'GET', value: 'GET' },
    { label: 'POST', value: 'POST' },
    { label: 'PUT', value: 'PUT' },
    { label: 'PATCH', value: 'PATCH' },
    { label: 'DELETE', value: 'DELETE' },
  ];

  readonly CATEGORIES = PERMISSION_CATEGORIES;

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.loading.set(true);
    forkJoin({
      users: this.api.listUsers(),
      roles: this.api.listRoles(),
      resources: this.api.listResources(),
      assignments: this.api.listAssignments(),
      grants: this.api.listGrants(),
    }).subscribe({
      next: (data) => {
        this.users.set(data.users ?? []);
        this.roles.set(data.roles ?? []);
        this.resources.set(data.resources ?? []);
        this.assignments.set(data.assignments ?? []);
        this.grants.set(data.grants ?? []);
        this.loading.set(false);
        // Si ya hay un rol seleccionado, refrescamos su matriz
        if (this.selectedRoleId()) this.onRoleSelected(this.selectedRoleId()!);
        if (this.selectedUserId()) this.onUserSelected(this.selectedUserId()!);
      },
      error: () => {
        this.notify.error('Error al cargar los datos de seguridad');
        this.loading.set(false);
      },
    });
  }

  // ── Matriz: cambio de sujeto ──────────────────────────────────────────────
  setSubjectType(type: MatrixSubjectType): void {
    this.matrixSubjectType.set(type);
    this.selectedRoleId.set(null);
    this.selectedUserId.set(null);
    this.roleGrants.set([]);
    this.userRoleAssignments.set([]);
  }

  onRoleSelected(roleId: number): void {
    this.selectedRoleId.set(roleId);
    this.matrixLoading.set(true);
    this.api.listGrants(roleId).subscribe({
      next: (data) => {
        this.roleGrants.set(data ?? []);
        this.matrixLoading.set(false);
      },
      error: () => {
        this.notify.error('Error al cargar los permisos del rol');
        this.matrixLoading.set(false);
      },
    });
  }

  onUserSelected(userId: number): void {
    this.selectedUserId.set(userId);
    this.matrixLoading.set(true);
    this.api.listAssignments().subscribe({
      next: (data) => {
        this.userRoleAssignments.set(data.filter(a => a.user_id === userId));
        this.matrixLoading.set(false);
      },
      error: () => {
        this.notify.error('Error al cargar los roles del usuario');
        this.matrixLoading.set(false);
      },
    });
  }

  // ── Matriz: toggle de un permiso (check) ──────────────────────────────────
  togglePermission(row: PermissionRow): void {
    const roleId = this.selectedRoleId();
    if (!roleId) return;

    const grant = row.grant;
    row.toggling = true;

    const methodLabel = `${row.resource.method} ${row.resource.path}`;
    const desc = row.resource.description || methodLabel;

    if (!grant) {
      // Nunca existió → crear
      this.api.grantResource({ role_id: roleId, resource_id: row.resource.id }).subscribe({
        next: () => {
          this.notify.success(`Permiso concedido: "${desc}"`);
          row.toggling = false;
          this.onRoleSelected(roleId);
        },
        error: (err) => {
          this.notify.error(err?.error?.error || 'Error al conceder el permiso');
          row.toggling = false;
        },
      });
    } else if (grant.status === 'active') {
      // Existe y activo → revocar
      this.api.deactivateGrant(grant.id).subscribe({
        next: () => {
          this.notify.success(`Permiso revocado: "${desc}"`);
          row.toggling = false;
          this.onRoleSelected(roleId);
        },
        error: (err) => {
          this.notify.error(err?.error?.error || 'Error al revocar el permiso');
          row.toggling = false;
        },
      });
    } else {
      // Existe pero inactivo → reactivar
      this.api.reactivateGrant(grant.id).subscribe({
        next: () => {
          this.notify.success(`Permiso reactivado: "${desc}"`);
          row.toggling = false;
          this.onRoleSelected(roleId);
        },
        error: (err) => {
          this.notify.error(err?.error?.error || 'Error al reactivar el permiso');
          row.toggling = false;
        },
      });
    }
  }

  // Helper: ¿está activo el permiso para esta fila?
  isGranted(row: PermissionRow): boolean {
    return row.grant?.status === 'active';
  }

  // ── Matriz: toggle de rol a usuario ──────────────────────────────────────
  toggleRoleForUser(role: Role): void {
    const userId = this.selectedUserId();
    if (!userId) return;

    const existing = this.userRoleAssignments().find(a => a.role_id === role.id);

    if (!existing) {
      this.api.assignRole({ user_id: userId, role_id: role.id }).subscribe({
        next: () => {
          this.notify.success(`Rol "${role.name}" asignado al usuario`);
          this.onUserSelected(userId);
        },
        error: (err) => this.notify.error(err?.error?.error || 'Error al asignar rol'),
      });
    } else if (existing.status === 'active') {
      this.api.deactivateAssignment(existing.id).subscribe({
        next: () => {
          this.notify.success(`Rol "${role.name}" revocado del usuario`);
          this.onUserSelected(userId);
        },
        error: (err) => this.notify.error(err?.error?.error || 'Error al revocar rol'),
      });
    } else {
      this.api.reactivateAssignment(existing.id).subscribe({
        next: () => {
          this.notify.success(`Rol "${role.name}" reactivado para el usuario`);
          this.onUserSelected(userId);
        },
        error: (err) => this.notify.error(err?.error?.error || 'Error al reactivar rol'),
      });
    }
  }

  // ── Categorías: expandir / colapsar ──────────────────────────────────────
  toggleCategory(key: string): void {
    const current = new Set(this.expandedCategories());
    if (current.has(key)) {
      current.delete(key);
    } else {
      current.add(key);
    }
    this.expandedCategories.set(current);
  }

  isCategoryExpanded(key: string): boolean {
    return this.expandedCategories().has(key);
  }

  expandAll(): void {
    this.expandedCategories.set(new Set(PERMISSION_CATEGORIES.map(c => c.key)));
  }

  collapseAll(): void {
    this.expandedCategories.set(new Set());
  }

  // ── CRUD: Usuarios ────────────────────────────────────────────────────────
  openCreateUser(): void {
    this.userForm.reset();
    this.userDialog.set(true);
  }

  saveUser(): void {
    if (this.userForm.invalid) return;
    const val = this.userForm.value;
    this.api.createUser({
      username: val.username!,
      email: val.email!,
      password: val.password!,
      status: 'active',
    }).subscribe({
      next: () => {
        this.notify.success('Usuario creado exitosamente');
        this.userDialog.set(false);
        this.loadAll();
      },
      error: (err) => this.notify.error(err?.error?.error || 'Error al crear usuario'),
    });
  }

  toggleUserStatus(user: User): void {
    this.confirm.confirm({
      message: `¿Desea cambiar el estado del usuario "${user.username}"?`,
      header: 'Confirmar acción',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.api.deactivateUser(user.id).subscribe({
          next: () => {
            this.notify.success('Estado de usuario modificado');
            this.loadAll();
          },
          error: (err) => this.notify.error(err?.error?.error || 'No se pudo modificar el usuario'),
        });
      },
    });
  }

  // ── CRUD: Roles ───────────────────────────────────────────────────────────
  openCreateRole(): void {
    this.roleForm.reset();
    this.roleDialog.set(true);
  }

  saveRole(): void {
    if (this.roleForm.invalid) return;
    const val = this.roleForm.value;
    this.api.createRole({
      name: val.name!,
      description: val.description || null,
      status: 'active',
    }).subscribe({
      next: () => {
        this.notify.success('Rol creado exitosamente');
        this.roleDialog.set(false);
        this.loadAll();
      },
      error: (err) => this.notify.error(err?.error?.error || 'Error al crear rol'),
    });
  }

  // ── CRUD: Recursos ────────────────────────────────────────────────────────
  openCreateResource(): void {
    this.resourceForm.reset({ method: 'GET', path: '', description: '' });
    this.resourceDialog.set(true);
  }

  saveResource(): void {
    if (this.resourceForm.invalid) return;
    const val = this.resourceForm.value;
    this.api.createResource({
      method: val.method!,
      path: val.path!,
      description: val.description || null,
      status: 'active',
    }).subscribe({
      next: () => {
        this.notify.success('Recurso registrado exitosamente');
        this.resourceDialog.set(false);
        this.loadAll();
      },
      error: (err) => this.notify.error(err?.error?.error || 'Error al registrar recurso'),
    });
  }

  // ── Helpers de UI ─────────────────────────────────────────────────────────
  getMethodSeverity(method: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (method.toUpperCase()) {
      case 'GET': return 'success';
      case 'POST': return 'info';
      case 'PUT': return 'warn';
      case 'PATCH': return 'warn';
      case 'DELETE': return 'danger';
      default: return 'secondary';
    }
  }

  getMethodBadgeClass(method: string): string {
    switch (method.toUpperCase()) {
      case 'GET': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'POST': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'PUT': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'PATCH': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'DELETE': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  }

  getSelectedRoleName(): string {
    const id = this.selectedRoleId();
    if (!id) return '';
    return this.roles().find(r => r.id === id)?.name ?? '';
  }

  getSelectedUserName(): string {
    const id = this.selectedUserId();
    if (!id) return '';
    return this.users().find(u => u.id === id)?.username ?? '';
  }

  grantedCountForRole(): number {
    return this.roleGrants().filter(g => g.status === 'active').length;
  }

  countGranted(rows: PermissionRow[]): number {
    return rows.filter(r => this.isGranted(r)).length;
  }
}
