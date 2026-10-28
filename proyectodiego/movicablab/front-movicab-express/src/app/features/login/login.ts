import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { Message } from 'primeng/message';
import { AuthService } from '../../core/auth/auth.service';

@Component({
    selector: 'app-login',
    imports: [FormsModule, ButtonModule, InputTextModule, PasswordModule, Message],
    templateUrl: './login.html',
    styleUrl: './login.css',
})
export class Login {
    private readonly auth = inject(AuthService);
    private readonly router = inject(Router);

    email = signal('');
    password = signal('');
    loading = signal(false);
    error = signal('');

    onSubmit(): void {
        this.loading.set(true);
        this.error.set('');

        this.auth.login({ email: this.email(), password: this.password() }).subscribe({
            next: () => this.router.navigate(['/']),
            error: (err) => {
                this.error.set(err?.error?.message ?? 'Credenciales incorrectas');
                this.loading.set(false);
            },
        });
    }
}
