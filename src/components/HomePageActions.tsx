'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

type HomePageActionsProps = {
  variant: 'hero' | 'cta';
};

export default function HomePageActions({ variant }: HomePageActionsProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (user) {
    return (
      variant === 'hero' ? (
        <Link href="/dashboard" className="btn btn-primary btn-lg">
          Go to Dashboard
        </Link>
      ) : (
        <button
          onClick={() => supabase.auth.signOut()}
          className="btn btn-primary btn-lg"
        >
          Sign Out
        </button>
      )
    );
  }

  return (
    <Link href="/auth" className="btn btn-primary btn-lg">
      {variant === 'hero' ? 'Join Now' : 'Explore Opportunities'}
    </Link>
  );
}
