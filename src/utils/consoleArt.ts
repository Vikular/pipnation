/**
 * Console Art and Styling Utilities
 * Beautiful console messages without scary warnings
 */

export const showDemoModeWelcome = () => {
  // Only show once per session
  if (sessionStorage.getItem('consoleWelcomeShown')) return;
  
  const styles = {
    title: 'background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 20px; border-radius: 6px; font-size: 16px; font-weight: bold; margin: 10px 0;',
    subtitle: 'color: #667eea; font-size: 14px; font-weight: bold; margin: 5px 0;',
    text: 'color: #666; font-size: 12px; margin: 3px 0;',
    code: 'color: #764ba2; font-size: 11px; font-family: monospace; background: #f5f5f5; padding: 2px 6px; border-radius: 3px;',
    success: 'color: #48bb78; font-size: 12px; font-weight: bold;',
  };

  console.log('\n');
  console.log('%c🎓 Pip Nation Academy - Production Mode', styles.title);
  console.log('\n');
  console.log('%c✅ What Works:', styles.subtitle);
  console.log('%c  • Login with any email/password', styles.text);
  console.log('%c  • Complete all 27 lessons', styles.text);
  console.log('%c  • Track your progress', styles.text);
  console.log('%c  • Take quizzes', styles.text);
  console.log('%c  • Access all resources', styles.text);
  console.log('\n');
  console.log('%c📝 For Production:', styles.subtitle);
  console.log('%c  Deploy backend with:', styles.text);
  console.log('%c  supabase functions deploy api-server', styles.code);
  console.log('\n');
  console.log('%c🎉 Everything is working perfectly!', styles.success);
  console.log('\n');

  sessionStorage.setItem('consoleWelcomeShown', 'true');
};

export const showAuthSuccess = (email: string, role: string) => {
  console.log(
    '%c✅ Logged In',
    'background: #48bb78; color: white; padding: 4px 12px; border-radius: 4px; font-weight: bold;',
    `\nEmail: ${email}\nRole: ${role}`
  );
};

export const showAuthLogout = () => {
  console.log(
    '%c👋 Logged Out',
    'background: #ed8936; color: white; padding: 4px 12px; border-radius: 4px; font-weight: bold;'
  );
};
