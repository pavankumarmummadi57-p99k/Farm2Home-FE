import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page-narrow text-center">
      <div class="card form-card" style="margin-top:3rem">
        <div style="font-size:4rem">🌿</div>
        <h1>Page not found</h1>
        <p class="muted">The Farm2Home page you requested does not exist.</p>
        <a class="btn btn-primary" routerLink="/">Back home</a>
      </div>
    </section>
  `
})
export class NotFoundComponent {}
