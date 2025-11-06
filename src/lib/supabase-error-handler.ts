import { supabase } from "@/integrations/supabase/client";

/**
 * Limpia sesiones corruptas de Supabase
 * Esto previene que errores de refresh token bloqueen la app
 */
export const cleanupCorruptedSession = async () => {
  try {
    const { error } = await supabase.auth.getSession();
    
    if (error?.message?.includes('refresh_token_not_found') || 
        error?.message?.includes('Invalid Refresh Token')) {
      console.warn('Detected corrupted session, cleaning up...');
      
      // Limpiar localStorage de Supabase
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('sb-') || key.includes('supabase')) {
          localStorage.removeItem(key);
        }
      });
      
      // Forzar sign out silencioso
      await supabase.auth.signOut({ scope: 'local' });
      
      console.log('Session cleaned up successfully');
    }
  } catch (err) {
    console.error('Error during session cleanup:', err);
  }
};

/**
 * Inicializa Supabase con manejo de errores robusto
 */
export const initializeSupabase = async () => {
  try {
    await cleanupCorruptedSession();
    return true;
  } catch (err) {
    console.error('Failed to initialize Supabase:', err);
    return false;
  }
};
