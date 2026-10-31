/**
 * useSupabaseAuth — Real Supabase authentication hook for Brightloop.
 *
 * Handles:
 *  - signIn (email + password)
 *  - signUp (email + password + metadata)
 *  - signOut
 *  - password reset
 *  - session persistence / onAuthStateChange listener
 */

import { useEffect, useState, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

export type SupabaseAuthState = {
  session: Session | null;
  user: User | null;
  loading: boolean;
};

export function useSupabaseAuth() {
  const [authState, setAuthState] = useState<SupabaseAuthState>({
    session: null,
    user: null,
    loading: true,
  });

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState({ session, user: session?.user ?? null, loading: false });
    });

    // 2. Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setAuthState({ session, user: session?.user ?? null, loading: false });
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ─── Sign In ─────────────────────────────────────────────────────────────
  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }, []);

  // ─── Sign Up ─────────────────────────────────────────────────────────────
  const signUp = useCallback(async (
    email: string,
    password: string,
    metadata?: { full_name?: string; company?: string; role?: 'customer' }
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role: 'customer', ...metadata } },
    });
    if (error) throw error;
    return data;
  }, []);

  // ─── Sign Out ────────────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  // ─── Password Reset ──────────────────────────────────────────────────────
  const sendPasswordReset = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  }, []);

  // ─── Get Profile Row ──────────────────────────────────────────────────────
  const getProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  }, []);

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    sendPasswordReset,
    getProfile,
  };
}
