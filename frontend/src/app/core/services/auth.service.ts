import { Injectable, computed, signal } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
  onAuthStateChanged,
} from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';
import { inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly _user = signal<User | null>(null);

  // Expose user as a readonly signal
  readonly user = computed(() => this._user());

  constructor() {
    // Listen to auth state changes and update the signal
    onAuthStateChanged(this.auth, (user) => {
      this._user.set(user);
    });
  }

  /**
   * Sign in with Google using a popup
   */
  async signInWithGoogle(): Promise<User | null> {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(this.auth, provider);
    this._user.set(result.user);
    return result.user;
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<void> {
    await signOut(this.auth);
    this._user.set(null);
  }
}
