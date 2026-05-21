"use client";

export interface ApprovedUser {
  email: string;
  phone: string;
  fullName: string;
  role: string;
  avatar: string;
}

// Global list of pre-approved secure user credentials
export const APPROVED_USERS = [
  {
    email: 'admin@docforge.com',
    phone: '+1234567890',
    password: 'admin123',
    fullName: 'Siddiq Admin',
    role: 'Administrator',
    avatar: '👤'
  },
  {
    email: 'user@docforge.com',
    phone: '+9876543210',
    password: 'user123',
    fullName: 'Guest Editor',
    role: 'Editor',
    avatar: '✍️'
  }
];

const USER_SESSION_KEY = 'docforge_active_session';

/**
 * Attempts to authenticate a user using either their Email or Phone number.
 */
export function authenticateUser(identifier: string, passwordInput: string): ApprovedUser | null {
  if (typeof window === 'undefined') return null;

  const found = APPROVED_USERS.find(
    (u) =>
      (u.email.toLowerCase() === identifier.trim().toLowerCase() || u.phone === identifier.trim()) &&
      u.password === passwordInput
  );

  if (found) {
    const sessionUser: ApprovedUser = {
      email: found.email,
      phone: found.phone,
      fullName: found.fullName,
      role: found.role,
      avatar: found.avatar
    };
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  }

  return null;
}

/**
 * Returns the currently active session user, if logged in.
 */
export function getActiveSession(): ApprovedUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const session = localStorage.getItem(USER_SESSION_KEY);
    return session ? JSON.parse(session) : null;
  } catch (e) {
    console.error('Failed to parse active user session', e);
    return null;
  }
}

/**
 * Terminates the active session and logs the user out.
 */
export function logoutUser() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_SESSION_KEY);
}

/**
 * Helper to check if a session is currently active.
 */
export function isAuthenticated(): boolean {
  return getActiveSession() !== null;
}
