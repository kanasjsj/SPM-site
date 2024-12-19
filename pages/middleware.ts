import { clerkMiddleware, createRouteMatcher, redirectToSignIn } from '@clerk/nextjs/server';

// Define rotas públicas que não exigem autenticação
const isPublicRoute = createRouteMatcher(['/auth/sign-in(.*)', '/auth/sign-up(.*)', '/']);

export default clerkMiddleware((req) => {
  if (isPublicRoute(req)) {
    return; // Permite acesso para rotas públicas
  }

  // Se não houver usuário autenticado, redireciona para a página de login
  const { user } = req.auth;
  if (!user) {
    return redirectToSignIn(); // Redireciona o usuário não autenticado para a página de login
  }
});

export const config = {
  matcher: ['/((?!_next|.*\\.(?:js|css|json|png|jpg|jpeg|gif|ico|woff|woff2|ttf|eot|svg)).*)', '/(api|trpc)(.*)'],
};