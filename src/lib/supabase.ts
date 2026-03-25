import { createClient, type User } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

function getTrimmedString(value: unknown) {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function syncProfileFromUser(user: User) {
  const firstName = getTrimmedString(user.user_metadata?.first_name);
  const lastName = getTrimmedString(user.user_metadata?.last_name);
  const fallbackFullName = [firstName, lastName].filter(Boolean).join(' ').trim();
  const metadataFullName = getTrimmedString(user.user_metadata?.full_name);
  const fullName = metadataFullName ?? (fallbackFullName || null);
  const phoneNumber =
    getTrimmedString(user.phone) ??
    getTrimmedString(user.user_metadata?.phone) ??
    getTrimmedString(user.user_metadata?.phone_number);
  const city = getTrimmedString(user.user_metadata?.city);
  const state = getTrimmedString(user.user_metadata?.state);
  const email = getTrimmedString(user.email) ?? getTrimmedString(user.user_metadata?.email);

  const profilePayload: Record<string, string> = { id: user.id };

  if (email) profilePayload.email = email;
  if (fullName) profilePayload.full_name = fullName;
  if (firstName) profilePayload.first_name = firstName;
  if (lastName) profilePayload.last_name = lastName;
  if (phoneNumber) profilePayload.phone_number = phoneNumber;
  if (city) profilePayload.city = city;
  if (state) profilePayload.state = state;

  if (Object.keys(profilePayload).length === 1) {
    return;
  }

  const { error } = await supabase.from('profiles').upsert(profilePayload);

  if (error) {
    throw error;
  }
}
